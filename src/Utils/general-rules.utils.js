import Joi from "joi";




export const generalRules = {
     email : Joi.string().email({
                tlds:{
                    allow:['com' , 'net']
                },
                minDomainSegments:2
<<<<<<< Updated upstream
            }).required(),  /** @comment : it's better to decide if it required or not when you use it in the actual schema */
    password : Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
            .required(),/** @comment : it's better to decide if it required or not when you use it in the actual schema */

=======
            }),
            password : Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
>>>>>>> Stashed changes
}