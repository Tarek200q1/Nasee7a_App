import { Router } from "express";
import * as userServices from "./Services/user.service.js"
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
const router = Router();

router.post('/register' ,userServices.SignUpService);
router.post('/signin' , userServices.SignInService);
router.put('/confirm' , userServices.ConfirmEmailService);
router.post('/logout' , authenticationMiddleware ,  userServices.LogoutService);
router.post('/refresh-token' , userServices.RefreshTokensService);

router.put('/update' , authenticationMiddleware , userServices.UpdateAccountService);
router.delete('/delete' , authenticationMiddleware , userServices.DeleteAccountService);
router.get('/list' , userServices.ListUsersService);





export default router;