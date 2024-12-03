const { PrismaClient} = require('@prisma/client')
const { StatusCodes } = require('http-status-codes')

const Prisma = new PrismaClient()

// Function to create an order
const createOrder = async (req, res)=>{
    try{
        const { userId, status, totalAmount } = req.body;
        // create new order
        const newOrder = await Prisma.order.create({
            data: {
                userId,
                status,
                totalAmount
            }
        })
        res.status(StatusCodes.OK).json({message: "Successfully created an order!", order: newOrder})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error creating an order!", error: error.message})
    }
}

// Get order by orderId
const getOrder = async (req, res)=>{
    try{
        const { orderId } = req.params;
        // Ensure orderId is a valid integer
        const order = await Prisma.order.findUnique({
            where: {orderId: parseInt(orderId)}
        })
        if(!order){
            return res.status(StatusCodes.NOT_FOUND).json({message: "Order not found!"})
        }
        res.status(StatusCodes.OK).json({message: "Successfully retrieved an order!", order: order})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error retrieving an order!", error: error.message})
    }
}

// Get all orders
const getAllOrders = async (req, res)=>{
    try{
        // Check if the 'results' query parameter exists and its a valid number
        const limit = req.query.results ? parseInt(req.query.results) : undefined;
        const order = await Prisma.order.findMany({
            // Apply limit if its defined
            take: limit
        })
        res.status(StatusCodes.OK).json({message: "Successfully retrieved all orders!", order: order})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error retrieving all orders!", error: error.message})
    }
}

// Update order
const updateOrder = async (req, res)=>{
    try{
        const { orderId } = req.params;
        const { userId, status, totalAmount } = req.body;
        // update order
        const order = await Prisma.order.update({
            where: {orderId: parseInt(orderId)},
            data: {
                userId,
                status,
                totalAmount
            }
        })
        res.status(StatusCodes.OK).json({message: "Successfully updated order!", order:order})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error updating order!", error: error.message})
    }
}

// Delete order 
const deleteOrder = async (req, res)=>{
    try{
        const { orderId } = req.params;
        const order = await Prisma.order.delete({
            where: {orderId: parseInt(orderId)}
        })
        res.status(StatusCodes.OK).json({message: "Successfully deleted an order!", order:order})
    }catch(error){
        console.error(error)
        if(error.code === "P2025"){
            res.status(StatusCodes.NOT_FOUND).json({message: "Order not found!"})
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error deleting an order!", error: error.message})
    }
}

module.exports = {
    createOrder,
    getOrder,
    getAllOrders,
    updateOrder,
    deleteOrder
}