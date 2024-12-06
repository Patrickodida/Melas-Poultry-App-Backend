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
        res.status(StatusCodes.OK).json({message: "Successfully created a payment!", payment})
    }catch(error){
        if(error.code === 'P2002'){
            return res.status(StatusCodes.BAD_REQUEST).json({message: "Duplicate value for unique field"})
        }
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error creating a payment!", error: error.message})
    }
}

// Get payment by paymentId
const getPayment = async (req, res)=>{
    try{
        const { paymentId } = req.params;
        // Ensure that paymentId is a valid integer
        const payment = await Prisma.payment.findUnique({
            where: {paymentId: parseInt(paymentId)}
        })
        if(!payment){
            return res.status(StatusCodes.NOT_FOUND).json({message: "Payment not found!"})
        }
        res.status(StatusCodes.OK).json({message: "Successfully retrieved payment!", payment:payment})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error retrieving payment!", error: error.message})
    }
}

// Get all payments
const getAllPayments = async (req, res)=>{
    try{
        // Check if the 'results' query parameter exists and its a validd number
        const limit = req.query.results ? parseInt(req.query.results) : undefined;
        const payment = await Prisma.payment.findMany({
            // Apply limit if its defined
            take: limit
        })
        res.status(StatusCodes.OK).json({message: "Successfully retrieved all payments!", payment:payment})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error retrieving all payments!", error: error.message})
    }
}

// Update payment
const updatePayment = async (req, res)=>{
    try{
        const { paymentId } = req.params;
        const { orderId, userId, amount, status, paymentMethod, transactionId } = req.body;
        // update payment
        const payment = await Prisma.payment.update({
            where: {paymentId: parseInt(paymentId)},
            data: {
                orderId,
                userId,
                amount,
                status,
                paymentMethod,
                transactionId
            }
        })
        res.status(StatusCodes.OK).json({message: "Successfully updated payment!", payment:payment})
    }catch(error){
        //console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error updating payment!", error: error.message})
    }
}

// Delete payment
const deletePayment = async (req, res)=>{
    try{
        const { paymentId } = req.params;
        const payment = await Prisma.payment.delete({
            where: {paymentId: parseInt(paymentId)}
        })
        res.status(StatusCodes.OK).json({message: "Successfully deleted payment!", payment: payment})
    }catch(error){
        console.error(error)
        if(error.code === "P2025"){
            res.status(StatusCodes.NOT_FOUND).json({message: "Payment not found!"})
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error deleting payment!", error: error.message})
    }
}

module.exports = {
    createPayment,
    getPayment,
    getAllPayments,
    updatePayment,
    deletePayment
}