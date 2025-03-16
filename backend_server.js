const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const routing = require("./routes/authRoutes.js");
const { Server } = require("socket.io");
const { createMediasoupWorker } = require('./sfu/sfuServer');
const socketHandler = require('./socket/socketHandler');

// const setupSocket = require("./socket/socketHandlers.js");
const setupSocket = require("./socket/socketSetup.js");
const groupsocket = require("./socket/groupSocket.js");

createMediasoupWorker().then((worker) => {
    // Initialize Socket.IO event handlers
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      socketHandler(socket, worker);
    });
  });


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/user/v1", routing);

global.io = io;
groupsocket(io)



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// module.exports = {io,server};