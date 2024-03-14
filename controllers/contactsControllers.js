import HttpError from './../helpers/HttpError.js';
import Contact from './../models/contact.js';
// import dotenv from 'dotenv';
// dotenv.config();


export const getAllContacts = async (req, res, next) => {
  const { page=1, limit=2 } = req.query;
  const { _id:owner } = req.user._id;
  const skip = (page - 1) * limit;

  try {
    const contacts = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit});
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw HttpError(404, 'Not Found');
    }
    if (contact.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404, 'Not Found');
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) {
      throw HttpError(404, `Not found`);
    }

    if (deletedContact.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404, `Not found`);
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
   try {
    const {_id: owner} = req.user;
    const newContact = await Contact.create({...req.body, owner });

    if (!newContact) {
      throw HttpError(400, 'Not Found');
    }

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone, favorite } = req.body;
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { name, email, phone, favorite },
      { new: true });

    if (!updatedContact) {
      throw HttpError(404, 'Not found');
    }

    if (updatedContact.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404, 'Not found');
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const updatedFavoriteContact = await Contact.findByIdAndUpdate(
      contactId, 
      { favorite }, 
      { new: true });

    if (!updatedFavoriteContact) {
      throw HttpError(404, 'Not found');
    }

    if (updatedFavoriteContact.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404, 'Not found');
    }

    res.status(200).json(updatedFavoriteContact);
  } catch (error) {
    next(error);
  }
};