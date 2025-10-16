import { Router } from "express";
import * as userServices from "../Services/user.service.js"
import { authenticationMiddleware , authorizationMiddleware, hostUpload, resizeImageMiddleware } from "../../../Middlewares/index.js";
import { RolesEnum } from "../../../Common/enums/index.js";
const userRouter = Router();



// Account Routes ----- User apis
userRouter.put('/update' , authenticationMiddleware , userServices.UpdateAccountService);
userRouter.delete('/delete' , authenticationMiddleware , userServices.DeleteAccountService);
userRouter.post('/upload-profile-host', authenticationMiddleware, hostUpload({}).single('profile'), resizeImageMiddleware, userServices.UploadProfileService)


// Admin Routes
userRouter.get('/list', authenticationMiddleware, authorizationMiddleware([RolesEnum.SUPER_ADMIN, RolesEnum.ADMIN]) , userServices.ListUsersService);





export {userRouter};