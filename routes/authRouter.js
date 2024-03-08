import express from 'express';
import validateBody from './../middlewares/validateBody.js';
import { authUserSchema } from './../schemas/userSchema.js';

import { userSignup, userLogin, userLogout, userCurrent } from './../controllers/authControllers.js';

import authenticate from './../middlewares/authToken.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(authUserSchema), userSignup);

authRouter.post('/login', validateBody(authUserSchema), userLogin);

authRouter.post('/logout', authenticate, userLogout);

authRouter.get('/current', authenticate, userCurrent);

export default authRouter;