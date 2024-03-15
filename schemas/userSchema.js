import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  subscription: Joi.string(),
  token: Joi.string(),
});

export const loginUserSchema = new Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});