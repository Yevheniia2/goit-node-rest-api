import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import HttpError from './../helpers/HttpError.js';
import User from './../models/user.js';
import * as fs from "node:fs/promises";
import * as path from "path";
import gravatar from 'gravatar';
import Jimp from 'jimp';
import nodemailer from "nodemailer";
import crypto from "node:crypto";

dotenv.config();

const { SECRET_JWT, BASE_URL } = process.env;

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const verificationToken = crypto.randomUUID();

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

    await transport.sendMail({
      to: email,
      from: "Veintq2291244@gmail.com",
      subject: "Verify email",
      html: `To confirm you registration please click on the <a href="${BASE_URL}/api/users/verify/${verificationToken}">Link</a>`,
      text: `To confirm you registration please open the link ${BASE_URL}/api/users/verify/${verificationToken}`,
    });

    const newUser = await User.create({ 
      email: normalizedEmail, 
      password: passwordHash, 
      subscription, 
      token: null, 
      avatarURL, 
      verificationToken });

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

    if (user.verify === false) {
      throw HttpError(401, "Your account is not verified");
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
    const {_id} = req.user;
    const user = await User.findById(_id);
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    res.sendFile(path.join(process.cwd(), 'public', user.avatarURL));
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;

    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }
    
    const filename = `${_id}_${originalname}`;

    const sizeAvatar = await Jimp.read(tempUpload);
    sizeAvatar.resize(250, 250).write(tempUpload);

    await fs.rename(tempUpload, path.join(process.cwd(), "public/avatars", filename));

    const avatarURL = path.join('/avatars', filename);

    const user = await User.findByIdAndUpdate(
      _id,
      { avatarURL },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
      return res.status(500).send({ message: "Error processing file upload" });
  }
  next(error);
}

export const verify = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: '',
    });

    res.send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

export const resendVerEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      throw HttpError(401, "Missing required field email");
    }

    if (user.verify) {
      throw HttpError(401, "Verification has already been passed");
    }

    await transport.sendMail({
      to: email,
      from: "Veintq2291244@gmail.com",
      subject: "Welcome to PhoneBook",
      html: `<h1>To confirm you registration please click on the <a href="${BASE_URL}/api/users/verify/${verificationToken}">Link</a><h1>`,
      text: `To confirm you registration please open the link ${BASE_URL}/api/users/verify/${verificationToken}`,
    });

    res.send({ message: "Verification email has been sent" });
  } catch (error) {
    next(error);
  }
}