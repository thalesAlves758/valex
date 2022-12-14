import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { HttpError, HttpErrorType } from '../exceptions/http.exception';
import {
  Card,
  CardInsertData,
  CardUpdateData,
  findByCardDetails,
  findById,
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
  update,
} from '../repositories/cardRepository';
import { findEmployeeById } from './employee.services';
import dotenv from 'dotenv';
import { PaymentWithBusinessName } from '../repositories/paymentRepository';
import { Recharge } from '../repositories/rechargeRepository';
import { getPaymentByCardId } from './payment.services';
import { getRechargeByCardId } from './recharge.services';
import dateStringToDayjs from '../utils/dateStringToDayjs';

dotenv.config();

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

export async function createCard(employeeId: number, cardType: string) {
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

export async function getCardById(cardId: number): Promise<Card> {
  const card = await findById(cardId);

  if (!card) {
    throw HttpError(
      HttpErrorType.NOT_FOUND,
      `Could not find a card with id ${cardId}`
    );
  }

  return card;
}

export function validateCardExpiration(expirationDate: string) {
  const date = dateStringToDayjs(expirationDate);

  if (!date.isBefore(dayjs())) {
    throw HttpError(HttpErrorType.BAD_REQUEST, `Expired card`);
  }
}

function validateCardActivation(cardPassword: string | undefined) {
  if (typeof cardPassword === 'string') {
    throw HttpError(HttpErrorType.BAD_REQUEST, `Actived card`);
  }
}

export function validateSecurityCode(
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
    (
      accumulator: number,
      current: PaymentWithBusinessName | Recharge
    ): number => accumulator + current.amount,
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

export function validateCardBlock(blocked: boolean) {
  if (blocked) {
    throw HttpError(HttpErrorType.BAD_REQUEST, `Blocked card`);
  }
}

export function validateNoActivedCard(cardPassword: string | undefined) {
  if (!cardPassword) {
    throw HttpError(HttpErrorType.BAD_REQUEST, `No actived card`);
  }
}

export function validatePassword(originalPassword: string, password: string) {
  if (!bcrypt.compareSync(password, originalPassword)) {
    throw HttpError(HttpErrorType.UNAUTHORIZED, `Wrong password`);
  }
}

export async function blockCard(cardId: number, password: string) {
  const card = await getCardById(cardId);

  validateCardExpiration(card.expirationDate);
  validateNoActivedCard(card.password);
  validateCardBlock(card.isBlocked);

  validatePassword(card.password as string, password);

  await update(cardId, { isBlocked: true });
}

function validateCardUnblock(blocked: boolean) {
  if (!blocked) {
    throw HttpError(
      HttpErrorType.BAD_REQUEST,
      `Can't block a card already unblocked`
    );
  }
}

export async function unblockCard(cardId: number, password: string) {
  const card = await getCardById(cardId);

  validateCardExpiration(card.expirationDate);
  validateNoActivedCard(card.password);
  validateCardUnblock(card.isBlocked);

  validatePassword(card.password as string, password);

  await update(cardId, { isBlocked: false });
}

export async function getCardByDetails(
  number: string,
  cardholderName: string,
  expirationDate: string
) {
  const card = await findByCardDetails(number, cardholderName, expirationDate);

  if (!card) {
    throw HttpError(
      HttpErrorType.NOT_FOUND,
      'Could not find specified credit card'
    );
  }

  return card;
}
