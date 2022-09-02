/* eslint-disable */
export enum HttpErrorType {
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = 'Not Found',
  CONFLICT = 'Conflict',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
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
