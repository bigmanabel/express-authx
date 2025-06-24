import mongoose, { Document, Schema } from 'mongoose';

export interface IPasswordResetToken extends Document {
  _id: string;
  token: string;
  email: string;
  user: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    token: {
      type: String,
      required: [true, 'Token is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better performance
PasswordResetTokenSchema.index({ email: 1, used: 1 });
PasswordResetTokenSchema.index({ user: 1, used: 1 });
PasswordResetTokenSchema.index({ expiresAt: 1 });

export const PasswordResetToken = mongoose.model<IPasswordResetToken>(
  'PasswordResetToken',
  PasswordResetTokenSchema
);
