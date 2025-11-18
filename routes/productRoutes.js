const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProducts
} = require("../controllers/productController");

const router = express.Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProductById);
router.get("/", getProducts);

module.exports = router;  // ✅ Correct export
