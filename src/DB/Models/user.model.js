// User Schema
import mongoose from "mongoose";
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
      minLength: [3, "First Name must be at least 3 characters long"],
      maxLength: [20, "Name must be at least 3 characters long"],
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Age must be at least 18 years old"],
      max: [100, "Age must be at most 100 years old "],
      index: {
        name: "idx_age",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
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


      //Setters
      // set(value) {
      //   const randomValue = Math.random();
      //   return `${value}____${randomValue}`;
      // },
    },
    phoneNumber : {
      type:String,
      requierd : true
    },
    otps : {
      confirmation : String,
      resetPassword : String
    },
    isConfirmed : {
      type : Boolean,
      default : false
    }
  },
  {
    timestamps: true,
    toJSON : {
      virtuals: true
    },
    virtuals: {
      fullName: {
        // Getters
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
userSchema.virtual("Messages" , {
  ref:"Messages",
  localField:"_id",
  foreignField:"receiverId"
})
//User Model
const User = mongoose.model("User", userSchema);

export default User;
