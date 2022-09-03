import { Router } from 'express';
import * as cardController from '../controllers/card.controller';
import validateApiKey from '../middlewares/validateApiKey.middleware';
import validateSchema from '../middlewares/validateSchema.middleware';
import activeCardSchema from '../schemas/activeCard.schema';
import blockCardSchema from '../schemas/blockCard.schema';
import cardSchema from '../schemas/card.schema';
import paymentSchema from '../schemas/payment.schema';
import rechargeSchema from '../schemas/rechargeCard.schema';

const cardsRouter = Router();

cardsRouter.post(
  '/cards',
  validateApiKey,
  validateSchema(cardSchema),
  cardController.create
);
cardsRouter.post(
  '/cards/:cardId/active',
  validateSchema(activeCardSchema),
  cardController.active
);
cardsRouter.get('/cards/:cardId/balance', cardController.getBalance);
cardsRouter.post(
  '/cards/:cardId/block',
  validateSchema(blockCardSchema),
  cardController.block
);
cardsRouter.post(
  '/cards/:cardId/unblock',
  validateSchema(blockCardSchema),
  cardController.unblock
);
cardsRouter.post(
  '/cards/:cardId/recharge',
  validateApiKey,
  validateSchema(rechargeSchema),
  cardController.recharge
);
cardsRouter.post(
  '/cards/:cardId/payment',
  validateSchema(paymentSchema),
  cardController.pay
);

export default cardsRouter;
