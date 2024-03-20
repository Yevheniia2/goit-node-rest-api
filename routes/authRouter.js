import express from 'express';
import validateBody from './../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema, emailUserSchema } from './../schemas/userSchema.js';
import { userSignup, userLogin, userLogout, userCurrent, getAvatar, uploadAvatar, verify, resendVerEmail } from './../controllers/authControllers.js';
import authenticate from './../middlewares/authToken.js';
import { upload } from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerUserSchema), userSignup);

authRouter.post('/login', validateBody(loginUserSchema), userLogin);

authRouter.post('/logout', authenticate, userLogout);

authRouter.get('/current', authenticate, userCurrent);

authRouter.get('/avatars', authenticate, getAvatar);

authRouter.patch('/avatars', authenticate, upload.single('avatar'), uploadAvatar);

authRouter.get("/verify/:verificationToken", verify);

authRouter.post("/verify", validateBody(emailUserSchema), resendVerEmail);


export default authRouter;