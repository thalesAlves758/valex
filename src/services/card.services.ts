import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { HttpError, HttpErrorType } from '../exceptions/http.exception';
import {
  Card,
  CardInsertData,
  CardUpdateData,
  findById,
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
  update,
} from '../repositories/cardRepository';
import { findCompanyByApiKey } from './company.services';
import { findEmployeeById } from './employee.services';
import dotenv from 'dotenv';
import { PaymentWithBusinessName } from '../repositories/paymentRepository';
import { Recharge } from '../repositories/rechargeRepository';
import { getPaymentByCardId } from './payment.services';
import { getRechargeByCardId } from './recharge.services';

dotenv.config();

async function validateCompany(apiKey: string) {
  await findCompanyByApiKey(apiKey);
}

async function validateCard(employeeId: number, cardType: string) {
  const card = await findByTypeAndEmployeeId(
    cardType as TransactionTypes,
    employeeId
  );

  if (card) {
    throw HttpError(
      HttpErrorType.CONFLICT,
      `Already exists ${cardType} card for this employee`
    );
  }
}

function getCardHolderName(employeeName: string): string {
  const MINIMUM_LENGTH = 3;
  const FIRST_POSITION = 0;

  const nameParts = employeeName.split(' ');

  const firstName = nameParts.shift()?.toUpperCase();
  const lastName = nameParts.pop()?.toUpperCase();

  const initials = nameParts
    .filter((namePart) => namePart.length >= MINIMUM_LENGTH)
    .map((handlableNames) => handlableNames.toUpperCase()[FIRST_POSITION])
    .join(' ');

  return `${firstName} ${initials} ${lastName}`;
}

function getExpirationDate() {
  const YEARS_ADDED = 5;

  return dayjs().add(YEARS_ADDED, 'y').format('MM/YY');
}

function getCardCVC() {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET ?? '');

  return cryptr.encrypt(faker.finance.creditCardCVV());
}

export async function createCard(
  employeeId: number,
  cardType: string,
  companyApiKey: string
) {
  await validateCompany(companyApiKey);

  const employee = await findEmployeeById(employeeId);

  await validateCard(employeeId, cardType);

  const newCard: CardInsertData = {
    employeeId,
    number: faker.finance.creditCardNumber(),
    cardholderName: getCardHolderName(employee.fullName),
    expirationDate: getExpirationDate(),
    securityCode: getCardCVC(),
    type: cardType as TransactionTypes,
    isBlocked: false,
    isVirtual: false,
  };

  await insert(newCard);
}

async function getCardById(cardId: number): Promise<Card> {
  const card = await findById(cardId);

  if (!card) {
    throw HttpError(
      HttpErrorType.NOT_FOUND,
      `Could not find a card with id ${cardId}`
    );
  }

  return card;
}

function validateCardExpiration(expirationDate: string) {
  const ONE = 1;

  const [month, year] = expirationDate.split('/');

  const date = dayjs()
    .month(Number(month) - ONE)
    .year(Number(year));

  if (!date.isBefore(dayjs())) {
    throw HttpError(HttpErrorType.BAD_REQUEST, `Can't active an expired card`);
  }
}

function validateCardActivation(cardPassword: string | undefined) {
  if (typeof cardPassword === 'string') {
    throw HttpError(HttpErrorType.BAD_REQUEST, `Can't active an actived card`);
  }
}

function validateSecurityCode(
  cryptedSecurityCode: string,
  securityCode: string
) {
  const cryptr = new Cryptr(process.env.CRYPTR_SECRET ?? '');

  const originalSecurityCode = cryptr.decrypt(cryptedSecurityCode);

  if (securityCode !== originalSecurityCode) {
    throw HttpError(HttpErrorType.BAD_REQUEST, 'Wrong Security Code');
  }
}

function hashText(text: string): string {
  const salt = 10;

  return bcrypt.hashSync(text, salt);
}

export async function activeCard(
  cardId: number,
  securityCode: string,
  password: string
) {
  const card = await getCardById(cardId);

  validateCardExpiration(card.expirationDate);
  validateCardActivation(card.password);
  validateSecurityCode(card.securityCode, securityCode);

  const cardData: CardUpdateData = {
    password: hashText(password),
  };

  await update(cardId, cardData);
}

type cardBalance = {
  balance: number;
  transactions: PaymentWithBusinessName[];
  recharges: Recharge[];
};

function getTotalValue(
  arrayWithAmount: PaymentWithBusinessName[] | Recharge[]
) {
  const INITIAL_VALUE = 0;

  return (arrayWithAmount as []).reduce(
    (accumulator, current) => accumulator + current,
    INITIAL_VALUE
  );
}

function calculateCardBalance(
  transactions: PaymentWithBusinessName[],
  recharges: Recharge[]
): number {
  const totalTransactions = getTotalValue(transactions);
  const totalRecharges = getTotalValue(recharges);

  return totalRecharges - totalTransactions;
}

export async function getCardBalanceById(cardId: number): Promise<cardBalance> {
  await getCardById(cardId);

  const [transactions, recharges] = await Promise.all([
    getPaymentByCardId(cardId),
    getRechargeByCardId(cardId),
  ]);

  const cardBalanceData: cardBalance = {
    balance: calculateCardBalance(transactions, recharges),
    transactions,
    recharges,
  };

  return cardBalanceData;
}
