import { User , Messages } from "../../../DB/Models/index.js";


export const UpdateAccountService = async(req , res)=>{
    

        const {_id} = req.loggedInUser
        const {firstName , lastName , email , age , gender} = req.body;

        // find user by userId
        const user = await User.findByIdAndUpdate(
            _id,
            {firstName , lastName , email , age , gender},
            {new:true}
        )

        if(!user) return res.status(404).json({message : "User not found"})
        
         return res.status(200).json({message : "User updated successfully" })
        

        // find user by userId (findById)

        // const user = await User.findById(userId);
        // if(!user){
        //     return res.status(404).json({message : "User not found"});
        // }
        // if(firstName) user.firstName = firstName;
        // if(lastName) user.lastName = lastName;
        // if(email){
        //      const isEmailExists = await User.findOne({email});
        //      if(isEmailExists) return res.status(409).json({message : "Email already exists"});

        //      user.email = email;
        // }
        // if(age) user.age = age;
        // if(gender) user.gender = gender;

        // await user.save()



 
        // update by (updateOne)
        
        // const updatedResult = await User.updateOne({_id:userId} ,{firstName , lastName , email , age , gender} )
        // const chek = updatedResult.modifiedCount===0;
        // if(chek) return res.status(404).json({message : "user not Found"})


        // return res.status(200).json({message : "User updated successfully" , decodedData})
   
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

    await Messages.deleteMany({ receiverId: _id }, { session });

    // commit transaction
    await session.commitTransaction();

    // end sessionnode
    session.endSession();
    console.log("The transaction is committed");

    return res.status(200).json({ message: "User deleted successfully", deletedUser });
  
};

// List users
export const ListUsersService = async (req, res) =>{
    let users = await User.find().populate("Messages").select("firstName lastName age gender email phoneNumber")

    // users = users.map((user) => {
    //     let phone = user.phoneNumber;

    //     if (phone && typeof phone === "string" && phone.includes(":")) {
    //         try {
    //             phone = asymmetricDecryption(phone);
    //         } catch (err) {
    //             console.error("Error decrypting phoneNumber:", err.message);
    //         }
    //     }

    //     return {
    //         ...user._doc,
    //         phoneNumber: phone
    //     };
    // });
    
    return res.status(200).json({ users });
};


