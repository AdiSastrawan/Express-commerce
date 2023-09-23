import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String },
});

export const Role = mongoose.model("Role", roleSchema);
