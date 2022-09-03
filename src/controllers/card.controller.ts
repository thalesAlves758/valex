import { Request, Response } from 'express';
import {
  createCard,
  activeCard,
  getCardBalanceById,
} from '../services/card.services';
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
