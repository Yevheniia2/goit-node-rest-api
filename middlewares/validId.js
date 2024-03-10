import { isValidObjectId } from 'mongoose';
import HttpError from './../helpers/HttpError.js';

const validId = (req, res_, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(HttpError(404, `${contactId} is not valid`));
  }
  next();
};

export default validId;