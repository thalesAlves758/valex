import { HttpError, HttpErrorType } from '../exceptions/http.exception';
import {
  findByCardId,
  insert,
  PaymentWithBusinessName,
} from '../repositories/paymentRepository';
import { getBusinessById } from './business.services';
import {
  getCardBalanceById,
  getCardById,
  validateCardBlock,
  validateCardExpiration,
  validateNoActivedCard,
  validatePassword,
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
