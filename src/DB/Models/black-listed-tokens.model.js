import mongoose from "mongoose";



const blackListedTokenSchema = new mongoose.Schema({
    tokenId : {
        type:String,
        required:true,
        unique:true
    },
    expirationDate : {
        type:Date,
        required:true
    }
});


const BlackListedTokens = mongoose.model("BlackListedTokens" , blackListedTokenSchema)
export {BlackListedTokens}