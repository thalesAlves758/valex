import Joi, { StringSchema } from 'joi';

export default function getPasswordTypeValidation(): StringSchema {
  const PASSWORD_LENGTH = 4;
  const PASSWORD_REGEX = /[0-9]{4}/;

  return Joi.string().regex(PASSWORD_REGEX).length(PASSWORD_LENGTH).required();
}
