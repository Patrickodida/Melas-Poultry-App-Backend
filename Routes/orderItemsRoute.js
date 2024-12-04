const express = require('express')
const { createOrderItem, getOrderItem, getAllOrderItems, updateOrderItem, deleteOrderItem } = require('../Controllers/orderItemController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { orderItemSchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Create order item
router.post('/register', validateRequest(orderItemSchema), createOrderItem);
router.get('/:orderItemId', getOrderItem);
router.get('/', getAllOrderItems);
router.put('/:orderItemId', validateRequest(orderItemSchema), updateOrderItem);
router.delete('/:orderItemId', deleteOrderItem);

module.exports = router;