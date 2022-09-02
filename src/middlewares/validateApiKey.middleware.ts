import { NextFunction, Request, Response } from 'express';
import httpStatus from '../utils/HttpStatus';

async function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey: string | undefined = req.get('x-api-key');

  if (!apiKey) {
    res.sendStatus(httpStatus.UNAUTHORIZED);
    return;
  }

  next();
}

export default validateApiKey;
