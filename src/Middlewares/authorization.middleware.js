



export const authorizationMiddleware = (allowdRoles)=>{
    return (req , res , next)=>{
        const {user:{role}} = req.loggedInUser;
        
        if(allowdRoles.includes(role)){
            return next()
        }
        res.status(401).json({message : "Unauthorized"})
    }
}