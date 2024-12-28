import mongoose, { Document, Schema } from "mongoose";

// define message interface
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

// define message schema
const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// define user interface
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
  verificationCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

// define user schema
const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9]/,
      "Username must be 2-20 characters long and can only contain letters and numbers",
    ],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verificationCode: {
    type: String,
    required: [true, "Verification Code is required"],
  },
  verificationCodeExpiry: {
    type: Date,
    required: [true, "Verification Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: { type: Boolean, default: true },
  messages: [MessageSchema],
});

// create user model
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
