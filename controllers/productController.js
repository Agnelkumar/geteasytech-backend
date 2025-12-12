import Product from "../models/Product.js";

// Helper to support both spaced and camelCase fields
const getField = (body, spaced, camel) => body[spaced] ?? body[camel] ?? "";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const body = req.body;

    const productData = {
      productName: getField(body, "Product Name", "productName"),
      mainCamera: getField(body, "Main Camera", "mainCamera"),
      secondaryCamera: getField(body, "Secondary Camera", "secondaryCamera"),
      frontCamera: getField(body, "Front Camera", "frontCamera"),
      display: getField(body, "Display", "display"),
      ipRating: getField(body, "IP Rating", "ipRating"),
      additional: getField(body, "Additional", "additional"),
      performance: getField(body, "Performance", "performance"),
      battery: getField(body, "Battery", "battery"),
      fingerprint: getField(body, "Fingerprint", "fingerprint"),
      protectionGlass: getField(body, "Protection Glass", "protectionGlass"),
      variants: getField(body, "Variants", "variants"),
      price: getField(body, "Price", "price"),
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const all = await Product.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });

    res.json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const body = req.body;

    const updated = {
      productName: getField(body, "Product Name", "productName"),
      mainCamera: getField(body, "Main Camera", "mainCamera"),
      secondaryCamera: getField(body, "Secondary Camera", "secondaryCamera"),
      frontCamera: getField(body, "Front Camera", "frontCamera"),
      display: getField(body, "Display", "display"),
      ipRating: getField(body, "IP Rating", "ipRating"),
      additional: getField(body, "Additional", "additional"),
      operatingSystem: getField(body, "Operating System", "operatingSyatem"),
      performance: getField(body, "Performance", "performance"),
      battery: getField(body, "Battery", "battery"),
      fingerprint: getField(body, "Fingerprint", "fingerprint"),
      protectionGlass: getField(body, "Protection Glass", "protectionGlass"),
      variants: getField(body, "Variants", "variants"),
      price: getField(body, "Price", "price"),
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updated, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
