import mongoose from "mongoose";
import fs from 'node:fs'
import { DeleteFileFromCloudinary, UploadFileOnCloudinary } from "../../../Common/Services/cloudinary.service.js";
import { User , Messages } from "../../../DB/Models/index.js";


export const UpdateAccountService = async(req , res)=>{
    

    const {_id} = req.loggedInUser
    const {firstName , lastName , email , age , gender} = req.body;

    if(email){
        const isEmailExists = await User.findOne({email})
        if(isEmailExists) return res.status(409).json({message : "Email already exists"})
    }

    // find user by userId
    const user = await User.findByIdAndUpdate(
        _id,
        {firstName , lastName , email , age , gender},
        {new:true}
    )

    if(!user) return res.status(404).json({message : "User not found"})
    
    return res.status(200).json({message : "User updated successfully" })
        
};


export const DeleteAccountService = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start transaction

  try {
    const {
      user: { _id },
    } = req.loggedInUser;

    const deletedUser = await User.findByIdAndDelete(_id, { session });
    if (!deletedUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    if (deletedUser.profilePicture && fs.existsSync(deletedUser.profilePicture)) {
      fs.unlinkSync(deletedUser.profilePicture);
    }

    if (deletedUser.profilePicture?.public_id) {
      await DeleteFileFromCloudinary(deletedUser.profilePicture.public_id);
    }

    await Messages.deleteMany({ receiverId: _id }, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {

    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting user:", err);
    return res.status(500).json({ message: "Something broke!", err: err.message });
  }
};


export const UploadProfileService = async(req, res)=>{

    const {_id} = req.loggedInUser
    const {path} = req.file

    const {secure_url , public_id} = await UploadFileOnCloudinary(
        path,
        {
            folder: 'Nasse7a_App/Users/Profiles',
            resource_type: 'image'
        }
    )

    const user = await User.findByIdAndUpdate(_id,{profilePicture:{
        secure_url,
        public_id
    }} , {new:true})

    return res.status(200).json({message : "profile uploaded successfully" , user})
}

// List users
export const ListUsersService = async (req, res) =>{
    let users = await User.find().populate("Messages").select("firstName lastName age gender email phoneNumber")

    return res.status(200).json({ users });
};


