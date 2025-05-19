const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Add product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get product by name
router.get('/:name', async (req, res) => {
  const product = await Product.findOne({ name: req.params.name });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

module.exports = router;
