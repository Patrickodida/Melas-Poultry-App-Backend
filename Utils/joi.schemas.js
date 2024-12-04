const Joi = require('joi')

// user schema
const userSchema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    passwordHash: Joi.string().min(8).max(15).required()
})

// category schema
const categorySchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(500).optional()
})

// product schema
const productSchema = Joi.object({
    categoryId: Joi.number().integer().required(),
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(500).optional(),
    price: Joi.number().positive().precision(2).required(),
    availableQuantity: Joi.number().integer().min(0).required()
})

// order schema
const orderSchema = Joi.object({
    userId: Joi.number().integer().required(),
    status: Joi.string().valid('Pending', 'Shipped', 'Delivered', 'Cancelled').required(),
    totalAmount: Joi.number().positive().precision(2).required()
})

// orderItem schema
const orderItemSchema = Joi.object({
    orderId: Joi.number().integer().required(),
    productId: Joi.number().integer().required(),
    quantity: Joi.number().integer().positive().required(),
    price: Joi.number().positive().precision(2).required(),
    total: Joi.number().positive().precision(2).optional()
})

// payment schema
const paymentSchema = Joi.object({
    orderId: Joi.number().integer().required(),
    userId: Joi.number().integer().required(),
    amount: Joi.number().positive().precision(2).required(),
    status: Joi.string().valid('Pending', 'Completed', 'Failed', 'Refunded').required(),
    paymentMethod: Joi.string().valid('CreditCard', 'DebitCard', 'MobileMoney', 'Cash').required(),
    transactionId: Joi.string().required()
})

module.exports = {
    userSchema,
    categorySchema,
    productSchema,
    orderSchema,
    orderItemSchema,
    paymentSchema
}
