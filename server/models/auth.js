import mongoose, { Schema } from "mongoose";

const authSchema = new Schema(
  {
    employmentNumber: String,
    workEmail: String,
    authString: String,
    createdAt: {
      type: Date,
      expires: 600,
      default: Date.now,
    },
  },
  {
    autoIndex: true,
  }
);

// authSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const Auth = mongoose.model("auth", authSchema, "auth");

// In honor of Andre
export { Auth };
