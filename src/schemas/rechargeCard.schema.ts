import Joi from 'joi';

const GREATER_THAN = 0;

const rechargeSchema = Joi.object({
  amount: Joi.number().greater(GREATER_THAN).required(),
});

export default rechargeSchema;
