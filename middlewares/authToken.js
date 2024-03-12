import jwt from 'jsonwebtoken';
import HttpError from './../helpers/HttpError.js';
import User from './../models/user.js';

const { SECRET_JWT } = process.env;

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw HttpError(401, 'Not authorized');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decode = jwt.verify(token, SECRET_JWT);
    const user = await User.findById( decode.id );
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401));
    }

    req.user = user;
    console.log(user);

    next();
  } catch {
    next(HttpError(401));
  }
};
export default authenticate;