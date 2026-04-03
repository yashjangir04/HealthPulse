const express = require("express") ;
const app = express() ;
const dotenv = require("dotenv") ;

dotenv.config() ;

const db = require("./config/db-config") ;

const PORT = process.env.PORT ;

const authRouter = require("./routes/authRouter") ;

app.use(express.json()) ;
app.use(express.urlencoded({ extended : true })) ;

// Routes
app.use("/api/auth" , authRouter)

// Health Route
app.get("/health" , (req , res) => {
    res.send("Server health : 100% ✅") ;
})

app.listen(PORT , () => {
    console.log(`Server Running on PORT:${PORT} ✅`)
})