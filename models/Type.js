import mongoose from "mongoose";

const typeSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String, default: null },
});

export const Type = mongoose.model("Type", typeSchema);
