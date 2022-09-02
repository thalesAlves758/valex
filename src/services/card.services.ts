import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import dayjs from 'dayjs';
import { HttpError, HttpErrorType } from '../exceptions/http.exception';
import {
  CardInsertData,
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
} from '../repositories/cardRepository';
import { findCompanyByApiKey } from './company.services';
import { findEmployeeById } from './employee.services';
import dotenv from 'dotenv';

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
