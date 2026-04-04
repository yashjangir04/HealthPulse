const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const { createServer } = require("http");
const { Server } = require("socket.io");

const socketHandler = require("./socket/socketHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const server = createServer(app);

const db = require("./config/db-config");
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin : "http://localhost:5173" ,
    credentials : true
})) ;

const io = new Server(server,
    {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    }
);

const authRouter = require("./routes/authRouter");
const communicationRouter = require("./routes/communicationRouter");
const patientRouter = require("./routes/patientRouter");
const appointmentRouter = require("./routes/appointmentRouter") ;
const medicationRouter = require("./routes/medicationRouter") ;
const orderRouter = require("./routes/orderRouter") ;
const authMiddleware = require("./middlewares/authMiddleware");
// const reportRouter = require("./routes/reportRouter");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

socketHandler(io) ;

// Routes
app.use("/api/auth", authRouter);
app.use("/api/communicate" , communicationRouter) ;
app.use("/api/patient" , patientRouter) ;
app.use("/api/appointments" , appointmentRouter) ;
app.use("/api/medications" , medicationRouter) ;
app.use("/api/orders" , orderRouter) ;
// app.use('/api/reports', reportRouter);

// Health Route
app.get("/health", (req, res) => {
    res.send("Server health : 100% ✅");
})

server.listen(PORT, () => {
    console.log(`Server Running on PORT:${PORT} ✅`) ;
})