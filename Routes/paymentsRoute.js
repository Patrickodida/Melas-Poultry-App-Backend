const express = require('express')
const { createPayment } = require('../Controllers/paymentController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { paymentSchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Create payment
router.post('/register', validateRequest(paymentSchema), createPayment);

module.exports = router;