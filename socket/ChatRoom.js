module.exports = (io, socket) => {
    // Join room event
    socket.on("joinRoom", (roomName) => {

      const room = io.sockets.adapter.rooms.get(roomName);
      const numberOfClientsBefore = room ? room.size : 0;
      console.log(`Before joining, users in room ${roomName}: ${numberOfClientsBefore}`);

      socket.join(roomName);
      console.log(`User ${socket.id} joined room: ${roomName}`);
     

      const updatedRoom = io.sockets.adapter.rooms.get(roomName);
      const numberOfClientsAfter = updatedRoom ? updatedRoom.size : 0;
      // console.log(`After joining, users in room ${roomName}: ${numberOfClientsAfter}`);
    });


// socket.emit("msg", "Delayed message from server");


    // Send message event
    socket.on("sendMessage", ({ room, message, sender }) => {
      socket.broadcast.to(room).emit("message", { text: message, sender });
      console.log(`Message sent to room ${room}: ${message}`);
    });
  };