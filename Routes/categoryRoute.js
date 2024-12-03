const express = require('express')
const { createProductCategory, getProductCategory, getAllCategories, updateproductCategory } = require('../Controllers/categoryController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { categorySchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Create a new product category
router.post('/register', validateRequest(categorySchema), createProductCategory);
// Get product category by categoryId
router.get('/productCart/:categoryId', getProductCategory);
// Get All product categories
router.get('/', getAllCategories);
// Update product category
router.put('/:categoryId', updateproductCategory);

module.exports = router;