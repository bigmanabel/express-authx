import mongoose, { Document, Schema } from "mongoose";

export interface IApiKey extends Document {
  _id: string;
  key: string;
  uuid: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    key: {
      type: String,
      required: [true, "API key is required"],
    },
    uuid: {
      type: String,
      required: [true, "UUID is required"],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
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

// Index for faster lookups
ApiKeySchema.index({ user: 1 });
ApiKeySchema.index({ uuid: 1 });

export const ApiKey = mongoose.model<IApiKey>("ApiKey", ApiKeySchema);
