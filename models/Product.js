import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String },
  price: { type: Number },
  type: { type: mongoose.Schema.Types.ObjectId, ref: "Type", default: null },
  stock: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stock" }],
});

export const Product = mongoose.model("Product", productSchema);
