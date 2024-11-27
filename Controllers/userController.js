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

// Function to Login user 
const loginUser = async (req, res)=>{
    try{
        const { email, passwordHash } = req.body;
        // Check if the user exists
        const user = await Prisma.user.findUnique({
            where: {email}
        })
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({message: 'User not found!'})
        }

        // Check if the password is valid
        const isPasswordCorrect = await bcrypt.compare(passwordHash, user.passwordHash);
        if(!isPasswordCorrect){
            return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Invalid credentials!'})
        }
        // Generate JWT Token
        const token = await jwt.sign(
            {userId: user.userId, role: user.role},
            process.env.SECRET_KEY,
            {expiresIn: '1hr'}
        )
        res.status(StatusCodes.OK).json({message: 'Successfully logged in user!', token})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Error Logging in user!'})
    }
}

// Function to Get user Profile by userId
const getUserProfile = async (req, res)=>{
    try{
        // Get userId from the decoded JWT (Set in the validateToken middleware)
    const userId = req.user.userId;
    // Get user by userId
    const user = await Prisma.user.findUnique({
        where: {userId: parseInt(userId)}
    })
    if(!user){
        return res.status(StatusCodes.NOT_FOUND).json({message: 'User not found!'})
    }
    res.status(StatusCodes.OK).json({message: 'User successfully retrieved!', user})
    }catch(error){
        console.error(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Error retrieving user profile!'})
    }  
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
}
