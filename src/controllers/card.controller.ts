import { Request, Response } from 'express';
import {
  createCard,
  activeCard,
  getCardBalanceById,
  blockCard,
  unblockCard,
} from '../services/card.services';
import { createPayment } from '../services/payment.services';
import { rechargeCardByid } from '../services/recharge.services';
import HttpStatus from '../utils/HttpStatus';

export async function create(req: Request, res: Response) {
  const apiKey: string = req.get('x-api-key') ?? '';
  const { employeeId, cardType } = req.body;

  await createCard(employeeId, cardType, apiKey);

  res.sendStatus(HttpStatus.CREATED);
}

export async function active(req: Request, res: Response) {
  const cardId: number = Number(req.params.cardId);
  const { securityCode, password } = req.body;

  await activeCard(cardId, securityCode, password);

  res.sendStatus(HttpStatus.OK);
}

export async function getBalance(req: Request, res: Response) {
  const cardId: number = Number(req.params.cardId);

  const cardBalance = await getCardBalanceById(cardId);

  res.send(cardBalance);
}

export async function block(req: Request, res: Response) {
  const cardId: number = Number(req.params.cardId);
  const { password } = req.body;

  await blockCard(cardId, password);

  res.sendStatus(HttpStatus.NO_CONTENT);
}

export async function unblock(req: Request, res: Response) {
  const cardId: number = Number(req.params.cardId);
  const { password } = req.body;

  await unblockCard(cardId, password);

  res.sendStatus(HttpStatus.NO_CONTENT);
}

export async function recharge(req: Request, res: Response) {
  const cardId: number = Number(req.params.cardId);
  const { amount } = req.body;

  await rechargeCardByid(cardId, amount);

  res.sendStatus(HttpStatus.CREATED);
}

export async function pay(req: Request, res: Response) {
  const cardId: number = Number(req.params.cardId);
  const { password, businessId, amount } = req.body;

  await createPayment(cardId, password, businessId, amount);

  res.sendStatus(HttpStatus.CREATED);
}
