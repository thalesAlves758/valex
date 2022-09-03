import {
  findByCardId,
  insert,
  Recharge,
} from '../repositories/rechargeRepository';
import {
  getCardById,
  validateCardExpiration,
  validateNoActivedCard,
} from './card.services';

export async function getRechargeByCardId(cardId: number): Promise<Recharge[]> {
  return findByCardId(cardId);
}

export async function rechargeCardByid(cardId: number, amount: number) {
  const card = await getCardById(cardId);

  validateNoActivedCard(card.password);
  validateCardExpiration(card.expirationDate);

  await insert({ cardId, amount });
}
