import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string().allow(' '),
    email: Joi.string().email(),
    phone: Joi.string(),
}).min(1)
  .message("Body must have at least one field");

export const patchContactSchema = Joi.object({
    favorite: Joi.boolean().required(),
  });