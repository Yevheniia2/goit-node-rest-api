import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import HttpError from './../helpers/HttpError.js';
import User from './../models/user.js';
import dotenv from "dotenv";
import multer from 'multer';
import * as fs from "node:fs/promises";
import * as path from "path";
import gravatar from 'gravatar';
import Jimp from 'jimp';

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
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ email: normalizedEmail, password: passwordHash, subscription, token: null, avatarURL });

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
        avatarURL: newUser.avatarURL,
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

export const getAvatar = async (req, res, next) => {
  
  try {
    const user = await User.findById(req.user._id);
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(path.join(process.cwd(), 'public/avatars', user.avatarURL));
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, 'No file uploaded');
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.filename },
      { new: true }
    );

    if (user === null) {
      throw HttpError(404, 'User not found');
    }

    const sizeAvatar = await Jimp.read(req.file.path);
    sizeAvatar.resize(250, 250).write(req.file.path);

    await fs.rename(req.file.path, path.join(process.cwd(), "public/avatars", req.file.filename));

    const avatarURL = `${req.file.filename}`;

    res.status(200).json({ avatarURL });
  } catch (error) {
    console.error('Error during avatar upload:', error);
    next(error);
  }
}