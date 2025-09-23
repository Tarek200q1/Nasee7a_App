import cron from "node-cron"
import {BlackListedTokens} from "../DB/Models/index.js"


cron.schedule("0 0 * * *" , async()=>{
    await BlackListedTokens.deleteMany({expiresAt:{$lt:new Date()}})
})