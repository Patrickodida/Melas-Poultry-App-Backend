const express = require('express')
const { createPayment, getPayment, getAllPayments, updatePayment, deletePayment } = require('../Controllers/paymentController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { paymentSchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Create payment
router.post('/register', validateRequest(paymentSchema), createPayment);
// Get payment by paymentId
router.get('/:paymentId', getPayment);
// Get all payments
router.get('/', getAllPayments);
// Update payment
router.put('/:paymentId', validateRequest(paymentSchema), updatePayment);
// Delete payment
router.delete('/:paymentId', deletePayment);

module.exports = router;