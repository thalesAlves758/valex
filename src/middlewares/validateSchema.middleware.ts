import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';
import HttpStatus from '../utils/HttpStatus';

function validateSchema(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send(
          `Validation error: ${error.details
            .map((currentError) => currentError.message)
            .join(', ')}`
        );

      return;
    }

    req.body = value;

    next();
  };
}

export default validateSchema;
