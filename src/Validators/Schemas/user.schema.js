import Joi from "joi";
import { GenderEnum, RolesEnum } from "../../Common/enums/index.js";
import { generalRules } from "../../Utils/index.js";

 


 export const SignUpSchema = {
    body: Joi.object({
        firstName: Joi.string().alphanum().message({
            'string.base': 'First name must be a string',
            'any.required': 'First name is requierd',
            'string.alphanum': 'First name must contain only letters and number'
        }),
        lastName: Joi.string().min(3).max(20),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')),
        gender: Joi.string().valid(...Object.values(GenderEnum)).optional(),
        phoneNumber: Joi.string(),
        age: Joi.number().integer().positive().greater(18).less(100),
        role: Joi.string().valid(...Object.values(RolesEnum))
    })
    .options({presence: 'required'})
    .with('email','password')
 }


export const SignInSchema = {
     body: Joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
     })
 }


  export const ForgetPasswordSchema = {
    body: Joi.object({
        email: generalRules.email.required(),
    })
    .options({presence: 'required'})
 }


 export const ResetPasswordSchema = {
    bod : Joi.object({
        email: generalRules.email.required(),
        newPassword: generalRules.password.required(),
        confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')),
        otp: Joi.string().required()
    })
    .options({presence: 'required'})
    .with('email', 'newPassword')
 }


 export const UpdatePasswordSchema = {
    body: Joi.object({
        oldPassword: generalRules.password.required(),
        newPassword: generalRules.password.required(),
        confirmNewPassword: Joi.string().valid(Joi.ref('newPassword'))
    })
    .options({presence: 'required'})
 }