import * as contactsService from "../services/contactsServices.js";
import HttpError from './../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).json({ data: contacts });
       if (!contacts) {
        throw HttpError(401, 'Bad request');
       }
    }
    catch(error) {
        next (error);
    }
    
};

export const getOneContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await contactsService.getContactById(contactId);
        // const contact = contacts.find(item => item.id === id);
      if (!contact) {
        throw HttpError(404, 'Not Found');
      }
      res.status(200).json({ data: contact });
    } catch (error) {
        next(error);
    }
  };

  export const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const deletedContact = await contactsService.removeContact(contactId);
    if(deletedContact===-1) {
        throw HttpError(404, `Contact with ID:${contactId} not found`);
      }
      res.status(200).json({ message: "Contact deleted" });
    } catch (error) {
      next(error);
    }
  };


  export const createContact = async (req, res, next) => {
    const { name, email, phone } = req.body;
  
    try {
        const newContact = await contactsService.addContact({ name, email, phone });
        if (!newContact) {
        throw HttpError(400, 'Not Found');
    }
    res.status(201).json({ data: newContact });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  export const updateContact = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const updatedContact = await contactsService.updateContactById(contactId, req.body);
      if (!updatedContact) {
        throw HttpError(404, `Contact with ID:${contactId} not found`);
      }
      res.status(200).json({ data: updatedContact });
    } catch (error) {
      next(error);
    }
  };