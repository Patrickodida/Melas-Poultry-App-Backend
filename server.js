const express = require('express')
const userRouter = require('./Routes/usersRoute')
const categoryRouter = require('./Routes/categoryRoute')

const app = express()

app.use(express.json())

app.use('/api/v1/users', userRouter);
app.use('/api/v1/category', categoryRouter);

app.get('/api/v1', (req, res)=>{
    res.send(`<h1 style="color: blue">Welcome to Melas Poultry API</h1>`)
})

module.exports = app