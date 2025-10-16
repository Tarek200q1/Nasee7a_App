// User Schema
import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RolesEnum } from "../../Common/enums/user.enum.js";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First Name must be at least 3 characters long"],
      maxLength: [20, "Name must be at least 3 characters long"],
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18 years old"], 
      max: [100, "Age must be at most 100 years old "],
      index: {
        name: "idx_age",
      },
    },
    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    email: {
      type: String,
      requierd: true,
      index: {
        unique: true,
        name: "idx_email_unique",
      },
    },
    password: {
      type: String,
      requierd: true,
    },
    phoneNumber: {
      type:String,
      requierd: true
    },
    otps: {
      confirmation: String,
      resetPassword: {
        code:  String,
        expiresAt: Date
      },
    },
    isConfirmed: {
      type: Boolean,
      default: false,
      confirmation : String,
      resetPassword : {
        code :  String,
        expiresAt : Date
      },
    },
    isConfirmed: {
      type : Boolean,
      default : false
    },
    role: {
      type: String,
      enum: Object.values(RolesEnum),
      default: RolesEnum.USER
    },
    provider: {
      type:String,
      enum:Object.values(ProviderEnum),
      default: ProviderEnum.LOCAL
    },
    googleSub: String,
    profilePicture:{
      secure_url:String,
      public_id:String
    },
    devices: [String]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    },
    virtuals: {
      fullName: {
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
    },
    methods: {
      getDoubleAge() {
        return this.age * 2;
      },
    },
  }
);

// Schema Level
// Compound index
userSchema.index(
  { firstName: 1, lastName: 1 },
  { name: "idx_firs_last_unique", unique: true }
);
userSchema.virtual("Messages", {
  ref:"Messages",
  localField:"_id",
  foreignField:"receiverId"
})
//User Model
const User = mongoose.model("User", userSchema);

export {User};
