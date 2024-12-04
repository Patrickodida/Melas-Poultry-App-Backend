const { PrismaClient } = require('@prisma/client')
const { StatusCodes } = require('http-status-codes')

const Prisma = new PrismaClient()

// Function to create orderItem
const createOrderItem = async (req, res)=>{
    try{
        const { orderId, productId, quantity, price, total } = req.body;
        // Create new order 
        const newOrderItem = await Prisma.orderItem.create({
            data: {
                orderId,
                productId,
                quantity,
                price,
                total
            }
        })
        res.status(StatusCodes.OK).json({message: "Successfully created order item!", orderItem: newOrderItem})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error creating order item!", error: error.message})
    }
}

module.exports = {
    createOrderItem
}