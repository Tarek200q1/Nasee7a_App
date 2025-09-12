import { Router } from "express";
import * as userServices from "./Services/user.service.js"
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorization.middleware.js";
import { RolesEnum } from "../../Common/enums/user.enum.js";
const router = Router();


//Authentication Routes 
router.post('/register' ,userServices.SignUpService);
router.post('/signin' , userServices.SignInService);
router.put('/confirm' , userServices.ConfirmEmailService);
router.post('/logout' , authenticationMiddleware ,  userServices.LogoutService);

router.post('/refresh-token' , userServices.RefreshTokensService);
router.post('/forget-password' , userServices.ForgetPasswordService);
router.post('/reset-password' , userServices.ResetPasswordService);
router.put('/update-password' , authenticationMiddleware , userServices.UpdatePasswordService);

// Account Routes
router.put('/update' , authenticationMiddleware , userServices.UpdateAccountService);
router.delete('/delete' , authenticationMiddleware , userServices.DeleteAccountService);

// Admin Routes
router.get('/list' ,authenticationMiddleware , authorizationMiddleware([RolesEnum.SUPER_ADMIN , RolesEnum.ADMIN]) , userServices.ListUsersService);





export default router;