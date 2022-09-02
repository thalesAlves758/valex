import { Router } from 'express';
import * as cardController from '../controllers/card.controller';
import validateApiKey from '../middlewares/validateApiKey.middleware';

const cardsRouter = Router();

cardsRouter.post('/cards', validateApiKey, cardController.create);

export default cardsRouter;
