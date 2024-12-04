const express = require('express')
const { createOrderItem, getOrderItem, getAllOrderItems } = require('../Controllers/orderItemController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { orderItemSchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Create order item
router.post('/register', validateRequest(orderItemSchema), createOrderItem);
router.get('/:orderItemId', getOrderItem);
router.get('/', getAllOrderItems);

module.exports = router;