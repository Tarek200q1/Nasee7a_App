import { Messages , User } from "../../../DB/Models/index.js";

export const sendMessageService = async (req , res)=>{
    const {content} = req.body;
    const {receiverId} = req.params

    const user = await User.findById(receiverId);
    if(!user) return res.status(404).json({message : "User not found"});

    const message = new Messages({
        content,
        receiverId
    })
    await message.save()
    return res.status(200).json({message : "Message sent successfully" , message})
}


export const getMessageService = async (req , res)=>{
    const messages = await Messages.find().populate([
        {
            path:"receiverId",
            select:"firstName lastName"
        }
    ]);
    return res.status(200).json({messages})
}