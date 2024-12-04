const express = require('express')
const { createOrderItem, getOrderItem, getAllOrderItems, updateOrderItem, deleteOrderItem } = require('../Controllers/orderItemController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { orderItemSchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Create order item
router.post('/register', validateRequest(orderItemSchema), createOrderItem);
// Retrieve order item by orderItemId
router.get('/:orderItemId', getOrderItem);
// Retrieve all order items
router.get('/', getAllOrderItems);
// Update order item
router.put('/:orderItemId', validateRequest(orderItemSchema), updateOrderItem);
// Delete order item
router.delete('/:orderItemId', deleteOrderItem);

module.exports = router;