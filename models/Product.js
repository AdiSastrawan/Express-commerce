import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String },
  size: { type: String },
  image: { type: String },
  price: { type: Number },
  type: { type: String },
  stock: { type: Number },
});

export const Product = mongoose.model("Product", productSchema);
