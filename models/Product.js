import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: { type: String },
  image: [{ type: String }],
  price: { type: Number },
  desc: { type: String },
  type: { type: mongoose.Schema.Types.ObjectId, ref: "Type", default: null },
  stock: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stock" }],
  created_at: { type: Date, default: Date.now },
})
productSchema.index({ name: "text" })
export const Product = mongoose.model("Product", productSchema)
