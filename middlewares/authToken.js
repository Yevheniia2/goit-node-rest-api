import jwt from 'jsonwebtoken';
import HttpError from './../helpers/HttpError.js';
import User from './../models/user.js';

const { SECRET_JWT } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    next(HttpError(401));
  }

  try {
    const { _id } = jwt.verify(token, SECRET_JWT);
    const user = await User.findById( _id );

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401));
    }

    // req.user = {
    //   _id: user.id,
    //   email: user.email,
    //   token: user.token
    // };
    req.user = user;

    next();
  } catch {
    next(HttpError(401));
  }
};
export default authenticate;