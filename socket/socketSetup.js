const socketHandlers = require("./ChatRoom");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Handle events
    socketHandlers(io, socket);

    // Disconnect handling
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      // Get rooms the client was connected to
      const rooms = Array.from(socket.rooms);

      rooms.forEach((roomName) => {
        if (roomName !== socket.id) {
          const room = io.sockets.adapter.rooms.get(roomName);
          const numberOfClients = room ? room.size : 0;
          console.log(`Number of users in room ${roomName} after disconnect: ${numberOfClients}`);
        }
      });
    });
  });
};
