import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    verify: {
      type: Boolean,
    },
    password: {
      type: String,
      required: true,
    },
    authToken: {
      type: String,
    },
    refreshToken: {
      type: String,
      require: true,
    },
    recoveryToken: {
      type: String,
    },
    apiToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default UserSchema;
