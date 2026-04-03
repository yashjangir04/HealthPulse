const express = require("express") ;
const app = express() ;
const dotenv = require("dotenv") ;

dotenv.config() ;

const db = require("./config/db-config") ;

const PORT = process.env.PORT ;

app.get("/" , (req , res) => {
    res.send("Hello World") ;
})

app.get("/health" , (req , res) => {
    res.send("Server health : 100% ✅") ;
})

app.listen(PORT , () => {
    console.log(`Server Running on PORT:${PORT} ✅`)
})