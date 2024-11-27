const express = require('express')
const { registerUser } = require('../Controllers/userController')
const validateToken = require('../Utils/validateToken')
const validateRequest = require('../Utils/joi.validator')
const { userSchema } = require('../Utils/joi.schemas')

const router = express.Router()

// Register new User
router.post('/register', validateRequest(userSchema), registerUser);

module.exports = router