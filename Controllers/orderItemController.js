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

// Function to get orderItem by orderItemId
const getOrderItem = async (req, res)=>{
    try{
        const { orderItemId } = req.params;
        // Ensure orderItemId is a valid integer
        const orderItem = await Prisma.orderItem.findUnique({
            where: {orderItemId: parseInt(orderItemId)}
        })
        if(!orderItem){
            return res.status(StatusCodes.NOT_FOUND).json({message: "Order item not found!"})
        }
        res.status(StatusCodes.OK).json({message: "Successfully retrieved order item!", orderItem: orderItem})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error retrieving order item!", error: error.message})
    }
}

// Get all order items
const getAllOrderItems = async (req, res)=>{
    try{
        // Check if the 'results' query parameter exists and is a valid number
        const limit = req.query.results ? parseInt(req.query.results) : undefined;
        const orderItem = await Prisma.orderItem.findMany({
            // Apply limit if its defined
            take: limit
        })
        res.status(StatusCodes.OK).json({message: "Successfully retrieved all order items!", orderItems: orderItem})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error retrieving all order items!", error: error.message})
    }
}

// Update order item
const updateOrderItem = async (req, res)=>{
    try{
        const { orderItemId } = req.params;
        const { orderId, productId, quantity, price, total } = req.body;
        // Update order item
        const orderItem = await Prisma.orderItem.update({
            where: {orderItemId: parseInt(orderItemId)},
            data: {
                orderId,
                productId,
                quantity,
                price,
                total
            }
        })
        res.status(StatusCodes.OK).json({message: "Successfully updated order item!", updateOrderItem: orderItem})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error updating order item!", error: error.message})
    }
}

// Delete order item
const deleteOrderItem = async (req, res)=>{
    try{
        const { orderItemId } = req.params;
        const orderItem = await Prisma.orderItem.delete({
            where: {orderItemId: parseInt(orderItemId)}
        })
        res.status(StatusCodes.OK).json({message: "Successfully deleted order item!", orderItem: orderItem})
    }catch(error){
        conseole.error(error)
        if(error.code === "P2025"){
            res.status(StatusCodes.NOT_FOUND).json({message: "Order item not found!"})
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error deleting order item!", error: error.message})
    }
}

module.exports = {
    createOrderItem,
    getOrderItem,
    getAllOrderItems,
    updateOrderItem,
    deleteOrderItem
}