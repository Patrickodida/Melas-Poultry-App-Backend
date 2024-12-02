const express = require('express')
const { registerUser, getUserProfile, loginUser, updateUserProfile, deleteUserProfile } = require('../Controllers/userController')
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
// Update user profile
router.put('/profile/:userId', validateToken, updateUserProfile);
// Delete user profile
router.delete('/profile/:userId', validateToken, deleteUserProfile)

module.exports = router