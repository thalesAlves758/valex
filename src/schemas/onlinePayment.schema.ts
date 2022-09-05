import Joi from 'joi';

const SECURITY_CODE_LENGTH = 3;
const GREATER_THAN = 0;
const dateRegex = /^[0-9]{2}\/[0-9]{2}$/;
const securityCodeRegex = /^[0-9]{3}$/;
const creditCardNumberRegex = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;

const onlinePaymentSchema = Joi.object({
  number: Joi.string().regex(creditCardNumberRegex).required(),
  cardholderName: Joi.string().required(),
  expirationDate: Joi.string().regex(dateRegex).required(),
  securityCode: Joi.string()
    .regex(securityCodeRegex)
    .length(SECURITY_CODE_LENGTH)
    .required(),
  businessId: Joi.number().required(),
  amount: Joi.number().greater(GREATER_THAN).required(),
});

export default onlinePaymentSchema;
