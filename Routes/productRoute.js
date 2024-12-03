const express = require('express')
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require('../Controllers/productController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { productSchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Create a product
router.post('/register', validateRequest(productSchema), createProduct);
// Get Product
router.get('/:productId', getProduct);
// Get all Products
router.get('/', getAllProducts);
// Update product by productId
router.put('/:productId', validateRequest(productSchema), updateProduct);
// Delete product by productId
router.delete('/:productId', deleteProduct);

module.exports = router;