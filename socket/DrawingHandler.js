const drawingsByRoom = {};

function drawingHandler(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinDrawRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Client ${socket.id} joined room: ${roomId}`);
      const initialDrawings = drawingsByRoom[roomId] || [];
      console.log(`Sending initial drawings for room ${roomId}:`, initialDrawings);
      socket.emit("init-drawings", initialDrawings);
    });

    socket.on("drawing-update", (pathData, roomId) => {
      console.log(`🤷‍♂️ Drawing update received in room ${roomId}:`, pathData);
      if (!drawingsByRoom[roomId]) drawingsByRoom[roomId] = [];
      drawingsByRoom[roomId].push(pathData);
      console.log(`Updated drawings for room ${roomId}:`, drawingsByRoom[roomId]);
      socket.to(roomId).emit("drawing-update", pathData);
    });

    socket.on("draw-cursor-update", (cursorData, roomId) => {
      console.log(`Cursor update received in room ${roomId}:`, cursorData);
      socket.to(roomId).emit("draw-cursor-update", cursorData);
    });

    socket.on("object-update", (objectData, roomId) => {
      console.log(`Object update received in room ${roomId}:`, objectData);
      socket.to(roomId).emit("object-update", objectData);
    });

    socket.on("erase-update", (objectData, roomId) => {
      console.log(`Erase update received in room ${roomId}:`, objectData);
      socket.to(roomId).emit("erase-update", objectData);
    });

    socket.on("undo-update", (action, roomId) => {
      console.log(`Undo update received in room ${roomId}:`, action);
      socket.to(roomId).emit("undo-update", action);
    });

    socket.on("redo-update", (action, roomId) => {
      console.log(`Redo update received in room ${roomId}:`, action);
      socket.to(roomId).emit("redo-update", action);
    });

    socket.on("clear-canvas", (roomId) => {
      console.log(`Clear canvas command received for room ${roomId}`);
      drawingsByRoom[roomId] = []; // Clear server-side drawings
      socket.to(roomId).emit("clear-canvas");
      console.log(`Room ${roomId} drawings cleared on server`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = drawingHandler;