import Joi from 'joi';
import getPasswordTypeValidation from '../utils/passwordTypeValidation';

const GREATER_THAN = 0;

const paymentSchema = Joi.object({
  password: getPasswordTypeValidation(),
  businessId: Joi.number().required(),
  amount: Joi.number().greater(GREATER_THAN).required(),
});

export default paymentSchema;
