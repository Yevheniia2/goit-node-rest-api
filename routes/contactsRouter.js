import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";

import validateBody from './../helpers/validateBody.js';
import { createContactSchema, updateContactSchema } from './../schemas/contactsSchemas.js';

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:contactId", getOneContact);

contactsRouter.delete("/:contactId", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:contactId", validateBody(updateContactSchema), updateContact);

export default contactsRouter;