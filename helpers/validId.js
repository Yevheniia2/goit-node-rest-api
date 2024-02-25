import { isValidObjectId } from 'mongoose';
import HttpError from './HttpError.js';

const validId = (req, _, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(HttpError(404, `${id} is not valid`));
  }
  next();
};

export default validId;