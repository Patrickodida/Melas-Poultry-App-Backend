const { PrismaClient } = require('@prisma/client')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const Prisma = new PrismaClient()

// Function to register new user
const registerUser = async (req, res)=>{
    try{
        const { username, email, passwordHash } = req.body;
        console.log('requestBody:', req.body)
        // Check if the user already exists
        const existingUser = await Prisma.user.findUnique({
            where: {email}
        })
        if(existingUser){
            res.status(StatusCodes.CONFLICT).json({message: 'User already exists!'})
        }
        // Hash users password
        const hashedPassword = await bcrypt.hash(passwordHash, 10);
        console.log('hashedPassword:', hashedPassword)
        // Register new user
        const newUser = await Prisma.user.create({
            data: {
                username,
                email,
                passwordHash: hashedPassword
            }
        })
        res.status(StatusCodes.CREATED).json({message: 'User registered successfully!', user: newUser})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Error regsitering new user!'})
    }
}

module.exports = {
    registerUser
}
