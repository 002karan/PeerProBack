const Y = require("yjs");
const docs = new Map();

function codeEditorHandler(io) {
  io.on("connection", (socket) => {
    console.log("New WebSocket connection from collab:", socket.id);

    socket.on("joinroom", (roomId) => {
      console.log("💕New room created:", roomId);

      if (!roomId || typeof roomId !== "string") {
        socket.emit("error", "Invalid room ID");
        return;
      }

      if (!docs.has(roomId)) {
        docs.set(roomId, new Y.Doc());
      }
      const ydoc = docs.get(roomId);

      // Sync Yjs data to the new client
      socket.emit("init-doc", Y.encodeStateAsUpdate(ydoc));

      socket.on("update-doc", ({ update, userName }) => {
        Y.applyUpdate(ydoc, update);
        console.log("Received update-doc from socket:", socket.id, "by user:", userName);
        socket.broadcast.to(roomId).emit("update-doc", { update, userName });
      });

      socket.on("cursor-update", ({ clientId, userName, color, position }) => {
        console.log("Received cursor-update from socket:", socket.id, "clientId:", clientId);
        socket.broadcast.to(roomId).emit("cursor-update", { clientId, userName, color, position });
      });

      socket.on("awareness-update", ({ clientId, state }) => {
        console.log("Received awareness-update from socket:", socket.id, "clientId:", clientId);
        socket.broadcast.to(roomId).emit("awareness-update", { clientId, state });
      });

      socket.join(roomId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = codeEditorHandler;