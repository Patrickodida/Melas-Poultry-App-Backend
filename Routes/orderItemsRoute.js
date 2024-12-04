const express = require('express')
const { createOrderItem } = require('../Controllers/orderItemController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { orderItemSchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Create order item
router.post('/register', validateRequest(orderItemSchema), createOrderItem);

module.exports = router;