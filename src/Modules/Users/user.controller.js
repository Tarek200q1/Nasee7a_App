import { Router } from "express";
import * as userServices from "./Services/user.service.js"
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorization.middleware.js";
import { RolesEnum } from "../../Common/enums/user.enum.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import { ForgetPasswordSchema, ResetPasswordSchema, SignInSchema, SignUpSchema, UpdatePasswordSchema } from "../../Validators/Schemas/user.schema.js";
const router = Router();


//Authentication Routes 
router.post('/register' , validationMiddleware(SignUpSchema) ,userServices.SignUpService);
router.post('/signin' , validationMiddleware(SignInSchema) , userServices.SignInService);
router.put('/confirm' , userServices.ConfirmEmailService);
router.post('/logout' , authenticationMiddleware ,  userServices.LogoutService);
router.post('/auth-gmail' , userServices.AuthServiceWithGmail)

router.post('/refresh-token' , userServices.RefreshTokensService);
router.post('/forget-password' , validationMiddleware(ForgetPasswordSchema) , userServices.ForgetPasswordService);
router.post('/reset-password' , validationMiddleware(ResetPasswordSchema) , userServices.ResetPasswordService);
router.put('/update-password' , validationMiddleware(UpdatePasswordSchema) , authenticationMiddleware , userServices.UpdatePasswordService);

// Account Routes
router.put('/update' , authenticationMiddleware , userServices.UpdateAccountService);
router.delete('/delete' , authenticationMiddleware , userServices.DeleteAccountService);

// Admin Routes
router.get('/list' ,authenticationMiddleware , authorizationMiddleware([RolesEnum.SUPER_ADMIN , RolesEnum.ADMIN]) , userServices.ListUsersService);





export default router;