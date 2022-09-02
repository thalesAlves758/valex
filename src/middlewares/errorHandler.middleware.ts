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
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send(error.message ?? HttpErrorType.UNAUTHORIZED);
  }

  if (error.type === HttpErrorType.NOT_FOUND) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send(error.message ?? HttpErrorType.NOT_FOUND);
  }

  if (error.type === HttpErrorType.CONFLICT) {
    return res
      .status(httpStatus.CONFLICT)
      .send(error.message ?? HttpErrorType.CONFLICT);
  }

  if (error.type === HttpErrorType.UNPROCESSABLE_ENTITY) {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .send(error.message ?? HttpErrorType.UNPROCESSABLE_ENTITY);
  }

  return res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .send(error.message ?? 'Internal Server Error');
}

export default errorHandler;
