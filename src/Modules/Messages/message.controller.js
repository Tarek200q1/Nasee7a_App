import { Router } from "express";
import * as services from './Services/message.service.js'
const router = Router();


router.post('/send/:receiverId' , services.sendMessageService)
router.get('/get-messages' , services.getMessageService)


export default router;