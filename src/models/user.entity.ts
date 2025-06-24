import mongoose, { Document, Schema } from "mongoose";
import { Role } from "../enums/role.enum";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  role: Role;
  apiKeys: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.Regular,
    },
    apiKeys: [
      {
        type: Schema.Types.ObjectId,
        ref: "ApiKey",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Index for faster email lookups
UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
