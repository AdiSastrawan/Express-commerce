import mongoose from "mongoose";

const typeSchema = new mongoose.Schema({
  name: { type: String },
});

export const Type = mongoose.model("Type", typeSchema);
