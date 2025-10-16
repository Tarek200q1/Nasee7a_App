import { Router } from "express";
import * as services from './Services/message.service.js'
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
const messageRouter = Router();


messageRouter.post('/send/:receiverId', services.sendMessageService)
messageRouter.get('/get-messages-one-user', authenticationMiddleware , services.getMessagesService)
messageRouter.get("/getAll-message", services.getAllPublicMessageService);



export {messageRouter};