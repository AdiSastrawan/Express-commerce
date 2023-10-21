import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  refresh_token: { type: String, required: false },
  verified: { type: Boolean, default: false },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: false },
  created_at: { type: Date, default: Date.now },
  verified_at: { type: Date, default: null },
})

export const User = mongoose.model("User", userSchema)
