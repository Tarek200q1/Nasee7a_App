import {BlackListedTokens , User} from "../DB/Models/index.js";
import { verifyToken } from "../Utils/tokens.utils.js";





export const authenticationMiddleware = async (req , res , next) => {


    const {accesstoken} = req.headers
    if(!accesstoken) return res.status(400).json({message : "Please provide an access token"});


    // check if token startWith Bearer
    if(!accesstoken.startsWith(process.env.JWT_PREFIX)) return res.status(400).json({message : "Invalid token"})
    const token = accesstoken.split(' ')[1]


    // verify the token
    const decodedData = verifyToken(token , process.env.JWT_ACCESS_SECRET)
    if(!decodedData.jti) return res.status(401).json({message : "Invalid token"});
    

    // check if token in black lissted
    const blackListedToken  = await BlackListedTokens.findOne({tokenId:decodedData.jti})
    if(blackListedToken) return res.status(401).json({message : "Token is blacklisted"});


    // get user data from db
    const user = await User.findById(decodedData?._id)
    if(!user) return res.status(404).json({message : "User not found"});


    req.loggedInUser = {_id:user._id , user , token:{tokenId:decodedData.jti ,  expirationDate:decodedData.exp}}


    next()
}