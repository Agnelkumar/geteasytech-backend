// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true, unique: true },
  mainCamera: { type: String, required: true },
  secondaryCamera: { type: String, default: "NA" },
  frontCamera: { type: String, required: true },
  display: { type: String, required: true },
  additional: { type: String, default: "NA" },
  processor: { type: String, required: true },
  battery: { type: String, required: true },
  fingerprint: { type: String, default: "NA" },
  protectionGlass: { type: String, default: "NA" },
  variants: { type: String, default: "NA"},
  price: { type: String, required: true },
}, { timestamps: true});

export default mongoose.model("Product", ProductSchema);
