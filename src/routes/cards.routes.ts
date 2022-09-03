import { Router } from 'express';
import * as cardController from '../controllers/card.controller';
import validateApiKey from '../middlewares/validateApiKey.middleware';
import validateSchema from '../middlewares/validateSchema.middleware';
import activeCardSchema from '../schemas/activeCard.schema';
import blockCardSchema from '../schemas/blockCard.schema';
import cardSchema from '../schemas/card.schema';

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

export default cardsRouter;
