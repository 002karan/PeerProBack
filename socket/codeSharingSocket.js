function codeSharing(io) {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Join a group room
        socket.on("joinGroup", (data) => {
            const { groupId } = data;
            socket.join(groupId);
            console.log(`Socket ${socket.id} joined group: ${groupId}`);
        });

        // Leave a group room
        socket.on("leaveGroup", (data) => {
            const { groupId } = data;
            socket.leave(groupId);
            console.log(`Socket ${socket.id} left group: ${groupId}`);
        });

        // Handle code sharing
        socket.on("shareCode", (data) => {
            const { code, groupId } = data;
            console.log("Code received from", socket.id, "in group", groupId, ":", code);

            // Broadcast to all clients in the group except the sender
            socket.broadcast.to(groupId).emit("codeReceived", { code, senderId: socket.id });
            console.log("Code broadcasted to group", groupId, "excluding sender:", code);
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

module.exports = codeSharing;