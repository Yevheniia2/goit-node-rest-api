import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "./../controllers/contactsControllers.js";
import validId from "./../middlewares/validId.js";
import validateBody from "./../middlewares/validateBody.js";
import { 
  createContactSchema, 
  updateContactSchema,
  patchContactSchema,
} from './../schemas/contactsSchemas.js';
import authenticate from './../middlewares/authToken.js';

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:contactId", authenticate, validId, getOneContact);

contactsRouter.delete("/:contactId", authenticate, validId, deleteContact);

contactsRouter.post("/", authenticate, validateBody(createContactSchema), createContact);

contactsRouter.put("/:contactId", authenticate, validId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch('/:contactId/favorite', authenticate, validId, validateBody(patchContactSchema), updateStatusContact);

export default contactsRouter;