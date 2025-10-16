import { Router } from "express";
import * as userServices from "../Services/auth.service.js"

import { ForgetPasswordSchema, ResetPasswordSchema, SignInSchema, SignUpSchema, UpdatePasswordSchema } from "../../../Validators/Schemas/user.schema.js";
import { validationMiddleware, authenticationMiddleware } from "../../../Middlewares/index.js";
const authRouter = Router();


//Authentication Routes 
authRouter.post('/register', validationMiddleware(SignUpSchema), userServices.SignUpService);
authRouter.post('/signin', validationMiddleware(SignInSchema), userServices.SignInService);
authRouter.put('/confirm', userServices.ConfirmEmailService);
authRouter.post('/logout', authenticationMiddleware,  userServices.LogoutService);
authRouter.post('/auth-gmail', userServices.AuthServiceWithGmail)


authRouter.post('/refresh-token', userServices.RefreshTokensService);
authRouter.post('/forget-password', validationMiddleware(ForgetPasswordSchema), userServices.ForgetPasswordService);
authRouter.post('/reset-password', validationMiddleware(ResetPasswordSchema), userServices.ResetPasswordService);
authRouter.put('/update-password', validationMiddleware(UpdatePasswordSchema), authenticationMiddleware, userServices.UpdatePasswordService);






export {authRouter};