import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  quantity: { type: Number },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  size_id: { type: mongoose.Schema.Types.ObjectId, ref: "Size" },
});

export const Stock = mongoose.model("Stock", stockSchema);
