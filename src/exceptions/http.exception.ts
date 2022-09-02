/* eslint-disable */
export enum HttpErrorType {
  UNAUTHORIZED = 'UNAUTHORIZED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export interface HttpException {
  type: HttpErrorType;
  message?: string;
}

export function HttpError(type: HttpErrorType, message?: string): HttpException {
  return {
    type,
    message,
  };
}
