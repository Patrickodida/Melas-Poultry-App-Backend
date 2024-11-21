const app = require('./server');

// Set the server to listen on PORT 7500
const PORT = 7500
app.listen(PORT, ()=>{
    console.log(`Server is listening on http://localhost:${PORT}`)
})