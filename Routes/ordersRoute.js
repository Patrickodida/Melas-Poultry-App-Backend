const express = require('express')
const { createOrder, getOrder, getAllOrders, updateOrder, deleteOrder } =require('../Controllers/orderController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { orderSchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Create an order
router.post('/place', validateRequest(orderSchema), createOrder);
// Get order by orderId
router.get('/:orderId', getOrder);
// Get all orders
router.get('/', getAllOrders);
//Update order
router.put('/:orderId', validateRequest(orderSchema), updateOrder);
// Delete an order
router.delete('/:orderId', deleteOrder)

module.exports = router;