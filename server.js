const express = require('express')
const userRouter = require('./Routes/usersRoute')
const categoryRouter = require('./Routes/categoryRoute')
const productRouter = require('./Routes/productRoute')
const orderRouter = require('./Routes/ordersRoute')
const orderItemRouter = require('./Routes/orderItemsRoute')
const paymentRouter = require('./Routes/paymentsRoute')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const app = express()

// Ensure 'Logs' directory exists
const logsDir = path.join(__dirname, 'Logs')
if(!fs.existsSync(logsDir)){
    fs.mkdirSync(logsDir)
}
// Create writable stream for logging
const logFilePath = path.join(logsDir, 'text_logs.log')
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a'})
// Log request to the file
app.use(morgan('combined', { stream: accessLogStream}))
// Optional: Log request to the console for development
app.use(morgan('dev'))

app.use(express.json())

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Configure rate limiter
const limiter = rateLimit({
    windowMS: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
})

app.use('/api/v1/users', userRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/item', orderItemRouter);
app.use('/api/v1/payment', paymentRouter);

// Apply the rate limiter to all requests
app.use(limiter)

app.get('/api/v1', (req, res)=>{
    res.send(`<h1 style="color: blue">Welcome to Melas Poultry API</h1>`)
})

module.exports = app