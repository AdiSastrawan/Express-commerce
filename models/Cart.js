import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  quantity: { type: Number },
  size: { type: mongoose.Schema.Types.ObjectId, ref: "Size" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isSelected: { type: Boolean, default: false },
});

export const Cart = mongoose.model("Cart", cartSchema);
