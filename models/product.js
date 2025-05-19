const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  MainCamera: String,
  SecondaryCamera: String,
  FrontCamera: String,
  Display: String,
  Additional: String,
  Processor: String,
  Battery: String,
  Fingerprint: String,
  ProtectionGlass: String,
  Price: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
