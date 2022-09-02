import Joi from 'joi';

const cardSchema = Joi.object({
  employeeId: Joi.number().required(),
  cardType: Joi.string()
    .valid('groceries', 'restaurant', 'transport', 'education', 'health')
    .required(),
});

export default cardSchema;
