import { Router } from 'express';
import * as cardController from '../controllers/card.controller';
import validateApiKey from '../middlewares/validateApiKey.middleware';
import validateSchema from '../middlewares/validateSchema.middleware';
import cardSchema from '../schemas/card.schema';

const cardsRouter = Router();

cardsRouter.post(
  '/cards',
  validateApiKey,
  validateSchema(cardSchema),
  cardController.create
);

export default cardsRouter;
