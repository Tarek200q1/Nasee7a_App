import { DeleteFileFromCloudinary, UploadFileOnCloudinary } from "../../../Common/Services/cloudinary.service.js";
import { User , Messages } from "../../../DB/Models/index.js";
import fs from 'node:fs'


export const UpdateAccountService = async(req , res)=>{
    

<<<<<<< Updated upstream
    const {_id} = req.loggedInUser
    const {firstName , lastName , email , age , gender} = req.body;

    // What if the user enter an new email and it's already exists in the database
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
=======
      const {_id} = req.loggedInUser
      const {firstName , lastName , email , age , gender} = req.body;

        // find user by userId
      const user = await User.findByIdAndUpdate(
            _id,
            {firstName , lastName , email , age , gender},
            {new:true}
        )

      if(!user) return res.status(404).json({message : "User not found"})
      
      if(email){
        const isEmailExists = await User.findOne({email})
        if(isEmailExists) return res.status(409).json({message : "Email already exists"})
      }
      return res.status(200).json({message : "User updated successfully" })
>>>>>>> Stashed changes
        
};

export const DeleteAccountService = async (req, res) => {
  // start session
  const session = await mongoose.startSession();
    const {user: { _id },} = req.loggedInUser;

    // start transaction
    session.startTransaction();

    const deletedUser = await User.findByIdAndDelete({ _id }, { session });
    if (!deletedUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    // unlink profile picture (locally)
    fs.unlinkSync(deletedUser.profilePicture)

    // delete by public id
    await DeleteFileFromCloudinary(deletedUser.profilePicture.public_id)

    // delete user messages
    await Messages.deleteMany({ receiverId: _id }, { session });

    // commit transaction
    await session.commitTransaction();

    // end sessionnode
    session.endSession();

<<<<<<< Updated upstream
    return res.status(200).json({ message: "User deleted successfully", deletedUser }); // why we return deletedUser in the response
=======
    return res.status(200).json({ message: "User deleted successfully" });
>>>>>>> Stashed changes
  
};

export const ListUsersService = async (req, res) =>{
    let users = await User.find().populate("Messages").select("firstName lastName age gender email phoneNumber")

    return res.status(200).json({ users });
};

export const UploadProfileService = async (req, res) => {
  const { _id } = req.loggedInUser;
  const { path } = req.file;

  const { secure_url, public_id } = await UploadFileOnCloudinary(path, {
    folder: "Nasse7a_App/Users/Profiles",
    resource_type: "image",
  });

  const user = await User.findByIdAndUpdate(
    _id,
    {
      profilePicture: {
        secure_url,
        public_id,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json({ message: "profile uploaded successfully", user });
};



