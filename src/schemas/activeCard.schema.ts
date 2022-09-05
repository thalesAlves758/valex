import Joi from 'joi';
import getPasswordTypeValidation from '../utils/passwordTypeValidation';

const SECURITY_CODE_LENGTH = 3;
const securityCodeRegex = /^[0-9]{3}$/;

const activeCardSchema = Joi.object({
  securityCode: Joi.string()
    .regex(securityCodeRegex)
    .length(SECURITY_CODE_LENGTH)
    .required(),
  password: getPasswordTypeValidation(),
});

export default activeCardSchema;
