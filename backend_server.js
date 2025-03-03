const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const routing = require("./routes/authRoutes.js");
const { Server } = require("socket.io");
// const setupSocket = require("./socket/socketHandlers.js");
const setupSocket = require("./socket/socketSetup.js");
const userJoinedScoket = require("./socket/userJoinedScoket.js");
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/user/v1", routing);
userJoinedScoket(io)
setupSocket(io);
global.io = io;



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
