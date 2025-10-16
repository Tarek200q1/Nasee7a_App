import mongoose from "mongoose";



const blackListedTokenSchema = new mongoose.Schema({
    tokenId: {
<<<<<<< HEAD
        type: String,
        required: true,
        unique: true
=======
        type:String,
        required:true,
        unique:true
>>>>>>> master
    },
    expirationDate: {
        type:Date,
        required: true
    }
});


const BlackListedTokens = mongoose.model("BlackListedTokens", blackListedTokenSchema)
export {BlackListedTokens}