const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket/socketHandler");

const server = createServer(app);

dotenv.config();

const db = require("./config/db-config");

const PORT = process.env.PORT;

const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");

const io = new Server(server,
    {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

socketHandler(io) ;

// Routes
app.use("/api/auth", authRouter)

// Health Route
app.get("/health", (req, res) => {
    res.send("Server health : 100% ✅");
})

server.listen(PORT, () => {
    console.log(`Server Running on PORT:${PORT} ✅`)
})