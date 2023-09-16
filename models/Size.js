import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
  name: { type: String },
});

export const Size = mongoose.model("Size", sizeSchema);
