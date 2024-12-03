const express = require('express')
const { createProductCategory, getProductCategory } = require('../Controllers/categoryController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { categorySchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Create a new product category
router.post('/register', validateRequest(categorySchema), createProductCategory);
// Get product category by categoryId
router.get('/productCart/:categoryId', getProductCategory)

module.exports = router;