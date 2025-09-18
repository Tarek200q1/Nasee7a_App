import { Router } from "express";
import * as services from './Services/message.service.js'
const messageRouter = Router();


messageRouter.post('/send/:receiverId' , services.sendMessageService)
messageRouter.get('/get-messages' , services.getMessageService)


export {messageRouter};