// controllers/productController.js
import Product from "../models/Product.js";

// CREATE product
export const createProduct = async (req, res) => {
  try {
    const body = req.body;

    // map incoming labels (with spaces) to database schema
    const productData = {
      productName: body["Product Name"],
      mainCamera: body["Main Camera"],
      secondaryCamera: body["Secondary Camera"],
      frontCamera: body["Front Camera"],
      display: body["Display"],
      additional: body["Additional"],
      processor: body["Processor"],
      battery: body["Battery"],
      fingerprint: body["Fingerprint"],
      protectionGlass: body["Protection Glass"],
      variants: body["Variants"],
      price: body["Price"]
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
      PproductName: body.ProductName,
      mainCamera: body.MainCamera,
      secondaryCamera: body.SecondaryCamera,
      frontCamera: body.FrontCamera,
      display: body.Display,
      additional: body.Additional,
      processor: body.Processor,
      battery: body.Battery,
      fingerprint: body.Fingerprint,
      protectionGlass: body.ProtectionGlass,
      variants: body.Variants,
      price: body.Price
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
