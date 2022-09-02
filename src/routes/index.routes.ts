import { Router } from 'express';
import cardsRouter from './cards.routes';

const router = Router();

router.use(cardsRouter);

export default router;
