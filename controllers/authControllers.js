import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import HttpError from './../helpers/HttpError.js';
import User from './../models/user.js';

dotenv.config();

const { SECRET_JWT } = process.env;

export const userSignup = async (req, res, next) => {
  const { email, password, subscription, token } = req.body;
  const normalizedEmail = email.toLowerCase();
    try {
    const checkUser = await User.findOne({ email: normalizedEmail });

    if (checkUser!==null) {
      throw HttpError(409, 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email: normalizedEmail, password: passwordHash, subscription, token: null });

    const newToken = jwt.sign({
      id: newUser._id
    }, SECRET_JWT); 

    newUser.token = newToken;
    await newUser.save();

    if (!newUser) {
      throw HttpError(400, 'Bad request');
    }

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user===null) {
      throw HttpError(401, 'Email or password incorrect');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch===false) {
      throw HttpError(401, 'Email or password incorrect');
    }

    const payload = {
      id: user._id,
      name: user.name,
    }

    const token = jwt.sign(payload, SECRET_JWT, { expiresIn: '90d' });
    const loginUser = await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email: loginUser.email,
        subscription: loginUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userLogout = async (req, res, next) => {
  try {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const userCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};