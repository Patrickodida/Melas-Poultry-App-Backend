const { PrismaClient } = require('@prisma/client')
const { StatusCodes } = require('http-status-codes');

const Prisma = new PrismaClient()

// Function to create a category
const createProductCategory = async (req, res)=>{
    try{
        const { name, description } = req.body;
        // Check if the category already exists
        const existingCategory = await Prisma.category.findFirst({
            where: {name}
        })
        if(existingCategory){
            return res.status(StatusCodes.CONFLICT).json({message: "Category already exists!"})
        }
        // Create a new category
        const newCategory = await Prisma.category.create({
            data: {
                name,
                description
            }
        })
        res.status(StatusCodes.OK).json({message: "Product Category created successfully!", Category: newCategory})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error creating a new category!", error: error.message})
    }
}

// Get all product categories by categoryId
const getProductCategory = async (req, res)=>{
    try{
        // Extract categoryId from the route parameters
        const {categoryId} = req.params;
        // Ensure categoryId is a valid integer
        const category = await Prisma.category.findUnique({
            where: {categoryId: parseInt(categoryId)}
        })
        if(!category){
            return res.status(StatusCodes.NOT_FOUND).json({message: "Product category not found!"})
        }
        res.status(StatusCodes.OK).json({message: "Product category successfully retrieved!", productCategory: category})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error retrieving product category!", error: error.message})
    }
}

module.exports = {
    createProductCategory,
    getProductCategory
}