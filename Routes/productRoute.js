const express = require('express')
const { createProduct, getProduct, getAllProducts } = require('../Controllers/productController')
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

module.exports = router;