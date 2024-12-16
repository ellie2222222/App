import mongoose, { Schema, Model } from "mongoose";
import baseModelSchema from "./BaseModel";
import { IUser } from "./interfaces/User/IUser";

const userModelSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    default: "",
  },
  role: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
    default: "",
  },
  googleId: {
    type: String,
    default: null,
    unique: true,
  },
  appleUser: {
    type: Boolean,
    default: false,
  },
  ipAddress: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
    unique: true,
  },
  phoneNumber: {
    type: String,
    default: null,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verifyToken: {
    type: String,
    default: "",
  },
  passwordResetToken: {
    type: String,
    default: "",
  },
  ...baseModelSchema.obj,
}, { timestamps: true });

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userModelSchema);

export default UserModel;
