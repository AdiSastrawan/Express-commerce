import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  refresh_token: { type: String, required: false },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: false },
});

export const User = mongoose.model("User", userSchema);
