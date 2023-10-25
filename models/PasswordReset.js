import mongoose from "mongoose"
const passResetSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  new_password: { type: String },
  code: { type: String },
  created_at: { type: Date, default: Date.now },
  expired_at: { type: Date, default: Date.now },
})
export const PasswordReset = mongoose.model("PasswordReset", passResetSchema)
