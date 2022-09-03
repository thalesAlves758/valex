import Joi from 'joi';
import getPasswordTypeValidation from '../utils/passwordTypeValidation';

const blockCardSchema = Joi.object({
  password: getPasswordTypeValidation(),
});

export default blockCardSchema;
