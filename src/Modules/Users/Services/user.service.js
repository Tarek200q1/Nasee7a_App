import { compareSync, hashSync } from "bcrypt";
import User from "../../../DB/Models/user.model.js";
import { asymmetricDecryption, asymmetricEncryption, decrypt, encrypt } from "../../../Utils/encryption.utils.js";
import { emitter, sendEmail } from "../../../Utils/send-email.utils.js";
import { v4 as uuidv4 } from "uuid";
import { customAlphabet } from "nanoid";
import { generateToken, verifyToken } from "../../../Utils/tokens.utils.js";
import BlackListedTokens from "../../../DB/Models/black-listed-tokens.model.js";
const uniqueString = customAlphabet('jsdgfbugihskdn' , 5)


export const SignUpService = async (req , res)=>{
    
        const {firstName , lastName , email , password , age , gender , phoneNumber} = req.body;
 
        const isEmailExists = await User.findOne({email});
        if(isEmailExists) return res.status(409).json({message : "Email already exists"});

        const isfullNameExists = await User.findOne({firstName , lastName});
        if(isfullNameExists) return res.status(409).json({message : "fullName already exists"});


        // Encrypt phone

        // const encryptPhoneNumber = encrypt(phoneNumber)
        const encryptPhoneNumber = asymmetricEncryption(phoneNumber)


        // hash for password
        const hashedPassword = hashSync(password , +process.env.SALT_ROUNDS);
       
        const otp = uniqueString().toUpperCase()

        const user = await User.create({
            firstName , 
            lastName , 
            email , 
            password:hashedPassword , 
            age , 
            gender , 
            phoneNumber:encryptPhoneNumber , 
            otps:{confirmation: hashSync(otp , +process.env.SALT_ROUNDS)}
        });

        // Send Email for registered user
        // await sendEmail({
        //     to : email,
        //     subject : 'Confirmation Email',
        //     content : 
        //     `
        //         Your confirmation OTP is ${otp}
        //     `,
           
        // })


        emitter.emit('sendEmail' , {
            to : email,
            subject : 'Confirmation Email',
            content : 
            `
                Your confirmation OTP is ${otp}
            `,
           
        })
        return res.status(201).json({message : "User created successfully" , user})
 
};


export const ConfirmEmailService  = async(req , res)=>{
    const {email , otp} = req.body;

    const user = await User.findOne({email , isConfirmed:false});
    const userOtp  = user.otps?.confirmation
    if(!user) return res.status(400).json({message : 'User Not found or already Exites'});

    const isOtpMatched = compareSync(otp , userOtp);
    if(!isOtpMatched) return res.status(400).json({message : "Invalid OTP"});

    user.isConfirmed = true
    user.otps.confirmation = undefined

    await user.save()
    res.status(200).json({message : "Confirmed"})

};


export const SignInService = async (req , res)=>{
    
        const {email , password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message : "Invalid email or password"})
        }

        const hashPassword = user.password
        const isPasswordMatch = compareSync(password , hashPassword);

        if(!isPasswordMatch){
             return res.status(404).json({message : "Invalid email or password"})
        }

        // Generate token for the loggedIn User
        const accesstoken = generateToken(
             {_id:user._id , email:user.email},
            process.env.JWT_ACCESS_SECRET,
            {
                // issuer : "http://localhost:3000",
                // audience : "http://localhost:4000",
                expiresIn : process.env.JWT_ACCESS_EXPIRES_IN, // will use it to revoke the token
                jwtid : uuidv4()
            }
        );


        // Refresh token
        const refreshtoken = generateToken(
             {_id:user._id , email:user.email},
            process.env.JWT_REFRESH_SECRET,
            {
                
                expiresIn : process.env.JWT_REFRESH_EXPIRES_IN, // will use it to revoke the token
                jwtid : uuidv4()
            }
        )

        return res.status(200).json({message : "User signed in successfully" , accesstoken , refreshtoken})
    
};


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


export const DeleteAccountService = async (req , res)=>{
   
        const {_id} = req.loggedInUser;
        
        const deletedUser = await User.findByIdAndDelete({_id});
        if(!deletedUser){
            return res.status(404).json({message : "User not found"});
        }

        return res.status(200).json({message : "User deleted successfully" , deletedUser})

   
};


export const ListUsersService = async (req, res) =>{
    let users = await User.find().populate("Messages")

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


export const LogoutService = async (req , res)=>{
   
    const {token:{tokenId , expirationDate} , user:{_id}} = req.loggedInUser



    await BlackListedTokens.create({
        tokenId,
        expirationDate: new Date(expirationDate * 1000),
        userId:_id
    })

    return res.status(200).json({message : "User Logged out successfully"})
}


export const RefreshTokensService = async (req , res)=>{
    const {refreshtoken} = req.headers

    const decodedData = verifyToken(refreshtoken , process.env.JWT_REFRESH_SECRET)


     const accesstoken = generateToken(
             {_id:decodedData._id , email:decodedData.email},
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn : process.env.JWT_ACCESS_EXPIRES_IN, 
                jwtid : uuidv4() // will use it to revoke the token
            }
        );

        return res.status(200).json({message : "User token if refreshed successfully" , accesstoken})
}