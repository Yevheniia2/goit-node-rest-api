import * as contactsService from "../services/contactsServices.js";
import HttpError from './../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).json(contacts);
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
      if (!contact) {
        throw HttpError(404, 'Not Found');
      }
      res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
  };

  export const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const deletedContact = await contactsService.removeContact(contactId);
    if(!deletedContact) {
        throw HttpError(404, 'Not found');
      }
      res.status(200).json(deletedContact);
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
    res.status(201).json(newContact);
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
      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  };