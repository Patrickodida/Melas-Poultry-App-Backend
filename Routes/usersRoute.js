const express = require('express')
const { registerUser, getUserProfile, loginUser } = require('../Controllers/userController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { userSchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Register new User
router.post('/register', validateRequest(userSchema), registerUser);
// Log in the user 
router.post('/login', loginUser);
// Retrieve user Profile by userId
router.get('/profile', validateToken, getUserProfile);

module.exports = router