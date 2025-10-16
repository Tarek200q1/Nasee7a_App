import { compareSync, hashSync } from "bcrypt";
import { customAlphabet } from "nanoid";
import { v4 as uuidv4 } from "uuid";
import { OAuth2Client } from "google-auth-library";

import { emitter, asymmetricEncryption , generateToken, verifyToken  } from "../../../Utils/index.js";
import { ProviderEnum } from "../../../Common/enums/index.js";
import { User  , BlackListedTokens} from "../../../DB/Models/index.js";

const uniqueString = customAlphabet('jsdgfbugihskdn' , 5)


export const SignUpService = async (req , res)=>{
    
        const {firstName , lastName , email , password , age , gender , phoneNumber , role} = req.body;
 
        const isEmailExists = await User.findOne({email});
        if(isEmailExists) return res.status(409).json({message : "Email already exists"});

        const isfullNameExists = await User.findOne({firstName , lastName});
        if(isfullNameExists) return res.status(409).json({message : "fullName already exists"});


        // Encrypt phone
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
            otps:{confirmation: hashSync(otp , +process.env.SALT_ROUNDS)},
            role
        });

        emitter.emit("sendEmail", {
        to: email,
        subject: "✨ Confirmation Email",
        content: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
                  <div style="max-width: 500px; margin: auto; background-color: #fff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); padding: 30px; text-align: center;">
                    <h2 style="color: #4A90E2; margin-bottom: 20px;">Confirm Your Email</h2>
                    <p style="color: #333; font-size: 16px; margin-bottom: 25px;">
                      Hello 👋, please use the following OTP to confirm your email address:
                    </p>
                    <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #4A90E2; background: #f0f8ff; display: inline-block; padding: 10px 20px; border-radius: 8px;">
                      ${otp}
                    </div>
                    <p style="color: #666; font-size: 14px; margin-top: 25px;">
                      ⚠️ This code will expire in <strong>1 hour</strong>.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
                    <p style="font-size: 13px; color: #999;">
                      Thank you for using <strong>Nasee7a App</strong> ❤️<br>
                      If you didn’t request this, please ignore this email.
                    </p>
                  </div>
                </div>
                 `
});

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

        const device = req.headers["user-agent"]; 
        if (!user.devices) user.devices = [];
        if (!user.devices.includes(device)) {
            if (user.devices.length >= 2) {
                return res.status(403).json({ message: "You can login from 2 devices only" });
            }
            user.devices.push(device);
            await user.save();
        }

        // Generate token for the loggedIn User
        const accesstoken = generateToken(
            {_id:user._id , email:user.email},
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn : process.env.JWT_ACCESS_EXPIRES_IN, 
                jwtid : uuidv4()
            }
        );


        // Refresh token
        const refreshtoken = generateToken(
            {_id:user._id , email:user.email},
            process.env.JWT_REFRESH_SECRET,
            {
                
                expiresIn : process.env.JWT_REFRESH_EXPIRES_IN, 
                jwtid : uuidv4()
            }
        )

        return res.status(200).json({message : "User signed in successfully" , accesstoken , refreshtoken})
    
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
                jwtid : uuidv4() 
            }
        );

        return res.status(200).json({message : "User token if refreshed successfully" , accesstoken})
}


export const ForgetPasswordService = async (req , res)=>{
    const {email}  = req.body;

    const user = await User.findOne({email , provider:ProviderEnum.LOCAL})
    
    if(!user) return res.status(404).json({message : "User Not Foun"})

    const otp = uniqueString();

    const otpExpired = Date.now() + 60 * 60 * 1000; 

    user.otps.resetPassword = {
        code : hashSync(otp , +process.env.SALT_ROUNDS),
        expiresAt : otpExpired
    }
    await user.save()

emitter.emit("sendEmail", {
  to: user.email,
  subject: "Reset Your Password",
  content: `
    <div style="
      font-family: Arial, sans-serif; 
      background-color: #f9f9f9; 
      padding: 20px; 
      border-radius: 10px; 
      max-width: 500px; 
      margin: auto;
      border: 1px solid #ddd;
    ">
      <h2 style="color: #333; text-align: center;">🔐 Password Reset Request</h2>
      <p style="color: #555; font-size: 16px;">
        Hello <strong>${user.firstName || "User"}</strong>,
      </p>
      <p style="color: #555; font-size: 16px;">
        We received a request to reset your password. Please use the OTP below to complete the process:
      </p>

      <div style="
        background-color: #007bff; 
        color: #fff; 
        font-size: 22px; 
        text-align: center; 
        padding: 10px; 
        border-radius: 8px; 
        margin: 20px 0;
      ">
        <strong>${otp}</strong>
      </div>

      <p style="color: #777; font-size: 14px; text-align: center;">
        ⚠️ This OTP will expire in 1 hour for your security.
      </p>

      <p style="color: #555; font-size: 16px; text-align: center;">
        If you didn’t request a password reset, please ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 13px; text-align: center;">
        © ${new Date().getFullYear()} Nasee7a App — All rights reserved.
      </p>
    </div>
  `,
});

    
    res.status(200).json({message : "Reset Password OTP IS sent successfully to your Email"})
}


export const ResetPasswordService = async (req , res)=>{
    const {email , otp , newPassword }  = req.body; 

    const user = await User.findOne({email , provider:ProviderEnum.LOCAL})
    if(!user) return res.status(404).json({message : "User Not Foun"})

    if(!user.otps?.resetPassword?.code)  return res.status(400).json({message : "OTP Not Foun"})

    if(Date.now() > user.otps.resetPassword.expiresAt) return res.status(404).json({message : "OTP Expired"})
    
    const isOtpMatched = compareSync(otp , user.otps?.resetPassword.code)
    if(!isOtpMatched) return res.status(404).json({message : "Invalid OTP"})

    const hashPassword = hashSync(newPassword , +process.env.SALT_ROUNDS)

    user.password = hashPassword

    user.otps.resetPassword = {}

    await user.save()

    return res.status(200).json({message : "Password updated successfully to your Email"})
}


export const UpdatePasswordService = async (req, res) => {
  const {
    token: { tokenId: accessId, expirationDate: accessExp },
    _id: userId,
  } = req.loggedInUser;

  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  if (oldPassword === newPassword)
    return res
      .status(400)
      .json({ message: "New password cannot be the same as the old one" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isPasswordMatched = compareSync(oldPassword, user.password);
  if (!isPasswordMatched)
    return res.status(400).json({ message: "Invalid old password" });

  const hashedPassword = hashSync(newPassword, +process.env.SALT_ROUNDS);
  user.password = hashedPassword;
  await user.save();

  await BlackListedTokens.create({
    tokenId: accessId,
    expirationDate: new Date(accessExp * 1000),
  });

  return res.status(200).json({
    message:
      "Password updated successfully. Please log in again to continue securely.",
  });
};


export const AuthServiceWithGmail = async (req , res)=>{

    const {idToken} = req.body;
    const client = new OAuth2Client();
    const ticket = await client.verifyToken({
        idToken,
        audience: process.env.WEB_CLIENT_ID
    });

    const {email , given_name , family_name , email_verified , sub} = ticket.getPayload()
    if(!email_verified) return res.status(400).json({message : "Email is not verified"})

    const isUserExist = await User.findOne({googleSub:sub , provider:ProviderEnum.GOOGLE});
    let newUser ;
    if(!isUserExist){
        newUser = await User.create({
            firstName:given_name,
            lastName:family_name || ' ',
            email,
            provider:ProviderEnum.GOOGLE,
            isConfirmed:true,
            password:hashSync(uniqueString() , +process.env.SALT_ROUNDS),
            googleSub:sub
        })
    }else{
        newUser = isUserExist
        isUserExist.email = email
        isUserExist.firstName = given_name
        isUserExist.lastName = family_name || ' '
        await isUserExist.save()
    }
    // Generate token for the loggedIn User
        const accesstoken = generateToken(
            {_id:newUser._id , email:newUser.email},
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn : process.env.JWT_ACCESS_EXPIRES_IN, 
                jwtid : uuidv4()
            }
        );

        // Refresh token
        const refreshtoken = generateToken(
            {_id:newUser._id , email:newUser.email},
            process.env.JWT_REFRESH_SECRET,
            {
                
                expiresIn : process.env.JWT_REFRESH_EXPIRES_IN, 
                jwtid : uuidv4()
            }
        )
    res.status(200).json({message : "User signed up successfully" , tokens:{accesstoken , refreshtoken}})
}   





