// controllers/productController.js
import Product from "../models/Product.js";

// helper to read either spaced or camelCase fields
const getField = (body, spaced, camel) => {
  return body[spaced] ?? body[camel] ?? "";
};

// CREATE product
export const createProduct = async (req, res) => {
  try {
    const body = req.body;

    const productData = {
      productName: getField(body, "Product Name", "productName"),
      mainCamera: getField(body, "Main Camera", "mainCamera"),
      secondaryCamera: getField(body, "Secondary Camera", "secondaryCamera"),
      frontCamera: getField(body, "Front Camera", "frontCamera"),
      display: getField(body, "Display", "display"),
      additional: getField(body, "Additional", "additional"),
      processor: getField(body, "Processor", "processor"),
      battery: getField(body, "Battery", "battery"),
      fingerprint: getField(body, "Fingerprint", "fingerprint"),
      protectionGlass: getField(body, "Protection Glass", "protectionGlass"),
      variants: getField(body, "Variants", "variants"),
      price: getField(body, "Price", "price")
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// GET all products
export const getProducts = async (req, res) => {
  try {
    const all = await Product.find();
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const body = req.body;

    const updated = {
      productName: getField(body, "Product Name", "productName"),
      mainCamera: getField(body, "Main Camera", "mainCamera"),
      secondaryCamera: getField(body, "Secondary Camera", "secondaryCamera"),
      frontCamera: getField(body, "Front Camera", "frontCamera"),
      display: getField(body, "Display", "display"),
      additional: getField(body, "Additional", "additional"),
      processor: getField(body, "Processor", "processor"),
      battery: getField(body, "Battery", "battery"),
      fingerprint: getField(body, "Fingerprint", "fingerprint"),
      protectionGlass: getField(body, "Protection Glass", "protectionGlass"),
      variants: getField(body, "Variants", "variants"),
      price: getField(body, "Price", "price")
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updated,
      { new: true }
    );

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
