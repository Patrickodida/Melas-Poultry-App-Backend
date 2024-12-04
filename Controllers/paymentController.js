const { PrismaClient } = require('@prisma/client')
const { StatusCodes } = require('http-status-codes')

const Prisma = new PrismaClient()

// Function to create payment
const createPayment = async (req, res)=>{
    try{
        const { orderId, userId, amount, status, paymentMethod, transactionId } = req.body;
        // create payment
        const payment = await Prisma.payment.create({
            data: {
                orderId,
                userId,
                amount,
                status,
                paymentMethod,
                transactionId
            }
        })
        res.status(StatusCodes.OK).json({Message: "Successfully created a payment!", payment: payment})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({Message: "Error creating a payment!", error: error.message})
    }
}

module.exports = {
    createPayment
}