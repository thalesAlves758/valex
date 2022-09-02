import { NextFunction, Request, Response } from 'express';
import { HttpErrorType } from '../exceptions/http.exception';
import httpStatus from '../utils/HttpStatus';

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.type === HttpErrorType.UNAUTHORIZED) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
}

export default errorHandler;
