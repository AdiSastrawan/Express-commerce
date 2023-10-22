import mongoose from "mongoose"
const otpSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  code: { type: String },
  created_at: { type: Date, default: Date.now },
  expired_at: { type: Date, default: Date.now },
})
export const OTPVerification = mongoose.model("OTPVerification", otpSchema)
