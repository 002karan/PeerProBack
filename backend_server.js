const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const routing = require("./routes/authRoutes.js");
const { Server } = require("socket.io");
const { createMediasoupWorker } = require('./sfu/sfuServer');
const socketHandler = require('./socket/socketHandler');
const WebSocket = require("ws");
const Y = require("yjs");
const { WebsocketProvider } = require("y-websocket");
const groupsocket = require("./socket/groupSocket.js");
const codeHandler = require("./socket/collabCodeHandler.js");
const drawingHandler = require("./socket/DrawingHandler.js");
// const lockGroup = require("./socket/LockGrpSocket.js");
const screenShare = require("./socket/ScreenShareSocket.js");
const codeSharing = require("./socket/codeSharingSocket.js");


// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const server = http.createServer(app);


// Initialize Socket.IO before using it
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://peer-pro-fro.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true
    },

});

// Use CORS middleware
app.use(cors());
app.use(express.json());
app.use("/user/v1", routing);

// Make `io` globally accessible
global.io = io;

// Initialize group socket handlers

groupsocket(io);
codeHandler(io);
drawingHandler(io);
screenShare(io);
codeSharing(io);
// lockGroup(io);

// Initialize Mediasoup worker & attach socket handlers
createMediasoupWorker().then((worker) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
        socketHandler(socket, worker);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
