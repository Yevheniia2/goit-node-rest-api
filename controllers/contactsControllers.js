import HttpError from './../helpers/HttpError.js';
import Contact from '../models/contact.js';

export const getAllContacts = async (req, res, next) => {
  const { page, limit, favorite } = req.query;
  const ownerSelect = {owner: req.user._id};
  const skip = (page - 1) * limit;

  if (favorite !== undefined) {
    ownerSelect.favorite = favorite;
  }

  try {
    const contacts = await Contact.find({ownerSelect, favorite}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "name email");
    res.status(200).json(contacts);
    if (!contacts) {
      throw HttpError(401, 'Bad Request');
    }
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
    if (contact.owner.toString() !== req.user.contactId) {
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
    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await Contact.create({...req.body, ownerId: req.user.id });

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

    res.status(200).json(updatedFavoriteContact);
  } catch (error) {
    next(error);
  }
};