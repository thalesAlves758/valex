import { NextFunction, Request, Response } from 'express';
import { findCompanyByApiKey } from '../services/company.services';
import httpStatus from '../utils/HttpStatus';

async function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey: string | undefined = req.get('x-api-key');

  if (!apiKey) {
    res.sendStatus(httpStatus.UNAUTHORIZED);
    return;
  }

  const company = await findCompanyByApiKey(apiKey);

  res.locals = { company };

  next();
}

export default validateApiKey;
