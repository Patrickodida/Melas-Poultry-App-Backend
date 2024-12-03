const { PrismaClient } = require('@prisma/client')
const { StatusCodes } = require('http-status-codes')

const Prisma = new PrismaClient()

// Function to create a product
const createProduct = async (req, res)=>{
    try{
        const { categoryId, name, description, price, availableQuantity } = req.body;
        // Check if the product already exists
        const existingProduct = await Prisma.product.findFirst({
            where: {name}
        })
        if(existingProduct){
            return res.status(StatusCodes.CONFLICT).json({message: "Product already exists!"})
        }
        // Create a new product
        const newProduct = await Prisma.product.create({
            data: {
                categoryId,
                name,
                description,
                price,
                availableQuantity
            }
        })
        res.status(StatusCodes.OK).json({message: "Successfully created a new product!", product: newProduct})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error creating a product!", error: error.message})
    }
}

// Get product by productId
const getProduct = async (req, res)=>{
    try{
        const { productId } = req.params;
        // Ensure productId is a valid integer
        const product = await Prisma.product.findUnique({
            where: {productId: parseInt(productId)}
        })
        if(!product){
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product not found!"})
        }
        res.status(StatusCodes.OK).json({message: "Product successfully retrieved!", product: product})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error retrieving product!", error: error.message})
    }
}

// Get all products
const getAllProducts = async (req, res)=>{
    try{
        // Check if the 'results' query parameter exists and its a valid number
        const limit = req.query.results ? parseInt(req.query.results) : undefined;
        const products = await Prisma.product.findMany({
            // Apply limits if its defined
            take: limit
        })
        res.status(StatusCodes.OK).json({message: "Successfully retrieved all products!", product: products})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error retrieving products!", error: error.message})
    }
}

// Update product by productId
const updateProduct = async (req, res)=>{
    try{
        const { productId } = req.params;
        const { categoryId, name, description, price, availableQuantity } = req.body;
        // Update product
        const updateProduct = await Prisma.product.update({
            where: {productId: parseInt(productId)},
            data: {
                categoryId,
                name,
                description,
                price,
                availableQuantity
            }
        })
        res.status(StatusCodes.OK).json({message: "Successfully updated product!", product: updateProduct})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error updating product!", error: error.message})
    }
}

// Delete product by productId
const deleteProduct = async (req, res)=>{
    try{
        const { productId } = req.params;
        const product = await Prisma.product.delete({
            where: {productId: parseInt(productId)}
        })
        res.status(StatusCodes.OK).json({message: "Successfully deleted product!", product: product})
    }catch(error){
        console.error(error)
        if(error.code === "P2025"){
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product not found!"})
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error deleting product", error: error.message})
    }
}

module.exports = {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
}