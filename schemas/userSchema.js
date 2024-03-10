import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const loginUserSchema = new Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});