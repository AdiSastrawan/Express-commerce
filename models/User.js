import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 5, maxlength: 40, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, maxlength: 100 },
  refresh_token: { type: String, required: false },
  verified: { type: Boolean, default: false },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: false },
  created_at: { type: Date, default: Date.now },
  verified_at: { type: Date, default: null },
})

export const User = mongoose.model("User", userSchema)
