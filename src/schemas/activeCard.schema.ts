import Joi from 'joi';

const SECURITY_CODE_LENGTH = 3;
const PASSWORD_LENGTH = 4;
const PASSWORD_REGEX = /[0-9]{4}/;

const activeCardSchema = Joi.object({
  securityCode: Joi.string().length(SECURITY_CODE_LENGTH).required(),
  password: Joi.string()
    .regex(PASSWORD_REGEX)
    .length(PASSWORD_LENGTH)
    .required(),
});

export default activeCardSchema;
