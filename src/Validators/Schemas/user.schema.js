import Joi from "joi";
import { GenderEnum, RolesEnum } from "../../Common/enums/index.js";
import { generalRules } from "../../Utils/index.js";


<<<<<<< Updated upstream
export const SignUpSchema = {
    body : Joi.object({
        firstName : Joi.string().alphanum().message({
=======

 export const SignUpSchema = {
    body: Joi.object({
        firstName: Joi.string().alphanum().message({
>>>>>>> Stashed changes
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


<<<<<<< Updated upstream
export const SignInSchema = {
    body : Joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
    })
}


export const ForgetPasswordSchema = {
    body : Joi.object({
        email : generalRules.email.required(),
=======
 export const SignInSchema = {
     body: Joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
     })
 }


export const ForgetPasswordSchema = {
    body: Joi.object({
        email: generalRules.email.required(),
>>>>>>> Stashed changes
    })
    .options({presence: 'required'})
}


<<<<<<< Updated upstream
export const ResetPasswordSchema = {
    body : Joi.object({
        email : generalRules.email.required(),
=======
 export const ResetPasswordSchema = {
    body: Joi.object({
        email: generalRules.email.required(),
>>>>>>> Stashed changes
        newPassword :generalRules.password.required(),
        confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')),
        otp: Joi.string().required()
    })
    .options({presence: 'required'})
    .with('email' , 'newPassword')
}


<<<<<<< Updated upstream
export const UpdatePasswordSchema = {
    body : Joi.object({
=======
 export const UpdatePasswordSchema = {
    body: Joi.object({
>>>>>>> Stashed changes
        oldPassword: generalRules.password.required(),
        newPassword: generalRules.password.required(),
        confirmNewPassword: Joi.string().valid(Joi.ref('newPassword'))
    })
    .options({presence : 'required'})
}