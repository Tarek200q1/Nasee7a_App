import Joi from "joi";




export const generalRules = {
     email : Joi.string().email({
                tlds:{
                    allow:['com' , 'net']
                },
                minDomainSegments:2
            }), 
            password : Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
}