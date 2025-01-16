import mongoose, { model, Schema } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

export const UserModel = mongoose.model("User", UserSchema);
