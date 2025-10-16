import Joi from "joi";
import { GenderEnum, RolesEnum } from "../../Common/enums/index.js";
import { generalRules } from "../../Utils/index.js";

// Sign Up Schema
export const SignUpSchema = {
  body: Joi.object({
    firstName: Joi.string().alphanum().messages({
      "string.base": "First name must be a string",
      "any.required": "First name is required",
      "string.alphanum": "First name must contain only letters and numbers"
    }),
    lastName: Joi.string().min(3).max(20),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")),
    gender: Joi.string().valid(...Object.values(GenderEnum)).optional(),
    phoneNumber: Joi.string(),
    age: Joi.number().integer().positive().greater(18).less(100),
    role: Joi.string().valid(...Object.values(RolesEnum))
  })
    .options({ presence: "required" })
    .with("email", "password")
};

// Sign In Schema
export const SignInSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required()
  })
};

// Forget Password Schema
export const ForgetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required()
  }).options({ presence: "required" })
};

// Reset Password Schema
export const ResetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    newPassword: generalRules.password.required(),
    confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")),
    otp: Joi.string().required()
  })
    .options({ presence: "required" })
    .with("email", "newPassword")
};

// Update Password Schema
export const UpdatePasswordSchema = {
  body: Joi.object({
    oldPassword: generalRules.password.required(),
    newPassword: generalRules.password.required(),
    confirmNewPassword: Joi.string().valid(Joi.ref("newPassword"))
  }).options({ presence: "required" })
};
