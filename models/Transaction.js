import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  products: [{ name: { type: String }, price: { type: Number }, quantity: { type: Number }, size: { type: String } }],
  user_name: { type: String },
  user_email: { type: String },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
