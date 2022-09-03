import { findByCardId, Recharge } from '../repositories/rechargeRepository';

export async function getRechargeByCardId(cardId: number): Promise<Recharge[]> {
  return findByCardId(cardId);
}
