import mongoose from "mongoose";



const messagesSchema = new mongoose.Schema({
    content : {
        type:String,
        required:true
    },
    receiverId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{
    timestamps:true
});


const Messages = mongoose.model("Messages" , messagesSchema);
export {Messages}