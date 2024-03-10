import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import HttpError from './../helpers/HttpError.js';
import User from './../models/user.js';

dotenv.config();

const { SECRET_JWT } = process.env;

export const userSignup = async (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
    try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user!==null) {
      throw HttpError(409, 'Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email: normalizedEmail, password: passwordHash });

    if (!newUser) {
      throw HttpError(400, 'Not Found');
    }

    res.status(201).json({
      user: {
        subscription: newUser.subscription,
        email: newUser.email,
      },
    }).send({ message: "Registration successfully" });
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

    const token = jwt.sign({ _id: user._id }, SECRET_JWT, { expiresIn: '90d' });
    const newUser = await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userLogout = async (req, res, next) => {
  try {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const userCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};