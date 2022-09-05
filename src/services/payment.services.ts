import { HttpError, HttpErrorType } from '../exceptions/http.exception';
import {
  findByCardId,
  insert,
  PaymentWithBusinessName,
} from '../repositories/paymentRepository';
import dateStringToDayjs from '../utils/dateStringToDayjs';
import { getBusinessById } from './business.services';
import {
  getCardBalanceById,
  getCardByDetails,
  getCardById,
  validateCardBlock,
  validateCardExpiration,
  validateNoActivedCard,
  validatePassword,
  validateSecurityCode,
} from './card.services';

export async function getPaymentByCardId(
  cardId: number
): Promise<PaymentWithBusinessName[]> {
  return findByCardId(cardId);
}

function validateTransactionType(cardType: string, businessType: string) {
  if (cardType !== businessType) {
    throw HttpError(
      HttpErrorType.UNAUTHORIZED,
      `This card can't make this type of transaction`
    );
  }
}

async function validateCardBalance(paymentAmount: number, cardId: number) {
  const cardBalance = await getCardBalanceById(cardId);

  if (paymentAmount > cardBalance.balance) {
    throw HttpError(HttpErrorType.BAD_REQUEST, `Insufficient balance`);
  }
}

export async function createPayment(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  const card = await getCardById(cardId);

  validateNoActivedCard(card.password);
  validateCardExpiration(card.expirationDate);
  validateCardBlock(card.isBlocked);
  validatePassword(card.password as string, password);

  const business = await getBusinessById(businessId);

  validateTransactionType(card.type, business.type);
  await validateCardBalance(amount, cardId);

  await insert({ cardId, businessId, amount });
}

function validateExpirationDate(expirationDate: string) {
  const date = dateStringToDayjs(expirationDate);

  if (!date.isValid()) {
    throw HttpError(HttpErrorType.BAD_REQUEST, `Invalid expiration date`);
  }
}

export async function createOnlinePayment(
  cardNumber: string,
  cardholderName: string,
  expirationDate: string,
  securityCode: string,
  businessId: number,
  amount: number
) {
  validateExpirationDate(expirationDate);

  const [card, business] = await Promise.all([
    getCardByDetails(cardNumber, cardholderName, expirationDate),
    getBusinessById(businessId),
  ]);

  validateSecurityCode(card.securityCode, securityCode);
  validateCardExpiration(card.expirationDate);
  validateCardBlock(card.isBlocked);

  validateTransactionType(card.type, business.type);
  await validateCardBalance(amount, card.id);

  await insert({ cardId: card.id, businessId, amount });
}
