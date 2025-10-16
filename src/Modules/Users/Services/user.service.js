import fs from "node:fs";
import mongoose from "mongoose";
import { DeleteFileFromCloudinary, UploadFileOnCloudinary } from "../../../Common/Services/cloudinary.service.js";
import { User, Messages } from "../../../DB/Models/index.js";

// Update user account info
export const UpdateAccountService = async (req, res) => {
  const { _id } = req.loggedInUser;
  const { firstName, lastName, email, age, gender } = req.body;

  if (email) {
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) return res.status(409).json({ message: "Email already exists" });
  }

  const user = await User.findByIdAndUpdate(
    _id,
    { firstName, lastName, email, age, gender },
    { new: true }
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({ message: "User updated successfully" });
};

// Delete user account
export const DeleteAccountService = async (req, res) => {
  const session = await mongoose.startSession();
  const {
    user: { _id },
  } = req.loggedInUser;

  session.startTransaction();

  const deletedUser = await User.findByIdAndDelete(_id, { session });
  if (!deletedUser) {
    await session.abortTransaction();
    session.endSession();
    return res.status(404).json({ message: "User not found" });
  }

  // Remove profile picture locally
  if (deletedUser.profilePicture?.secure_url) {
    fs.unlinkSync(deletedUser.profilePicture.secure_url);
    await DeleteFileFromCloudinary(deletedUser.profilePicture.public_id);
  }

  // Delete user messages
  await Messages.deleteMany({ receiverId: _id }, { session });

  await session.commitTransaction();
  session.endSession();

  return res.status(200).json({ message: "User deleted successfully" });
};

// Upload profile picture
export const UploadProfileService = async (req, res) => {
  const { _id } = req.loggedInUser;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { path } = req.file;

  const { secure_url, public_id } = await UploadFileOnCloudinary(path, {
    folder: "Nasse7a_App/Users/Profiles",
    resource_type: "image",
  });

  const user = await User.findByIdAndUpdate(
    _id,
    { profilePicture: { secure_url, public_id } },
    { new: true }
  );

  return res.status(200).json({ message: "Profile uploaded successfully", user });
};

// List all users
export const ListUsersService = async (req, res) => {
  const users = await User.find()
    .populate("Messages")
    .select("firstName lastName age gender email phoneNumber");

  return res.status(200).json({ users });
};
