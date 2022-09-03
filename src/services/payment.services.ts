import {
  findByCardId,
  PaymentWithBusinessName,
} from '../repositories/paymentRepository';

export async function getPaymentByCardId(
  cardId: number
): Promise<PaymentWithBusinessName[]> {
  return findByCardId(cardId);
}
