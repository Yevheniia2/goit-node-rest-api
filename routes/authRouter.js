import express from 'express';
import validateBody from './../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from './../schemas/userSchema.js';
import { userSignup, userLogin, userLogout, userCurrent } from './../controllers/authControllers.js';
import authenticate from './../middlewares/authToken.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerUserSchema), userSignup);

authRouter.post('/login', validateBody(loginUserSchema), userLogin);

authRouter.post('/logout', authenticate, userLogout);

authRouter.get('/current', authenticate, userCurrent);

export default authRouter;