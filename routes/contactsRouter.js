import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "./../controllers/contactsControllers.js";
import validId from "./../helpers/validId.js";
import validateBody from './../helpers/validateBody.js';
import { 
  createContactSchema, 
  updateContactSchema,
  patchContactSchema,
} from './../schemas/contactsSchemas.js';

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:contactId", validId, getOneContact);

contactsRouter.delete("/:contactId", validId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:contactId", validId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch('/:contactId/favorite', validId, validateBody(patchContactSchema), updateStatusContact);

export default contactsRouter;