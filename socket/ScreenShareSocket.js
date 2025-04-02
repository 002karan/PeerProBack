
function screenShare(io)
{
    io.on("connection", (socket) => {
        console.log("💻User connected:", socket.id);

        socket.on("screen-offer", ({ offer, groupId }) => {
            console.log("📺Screen offer received:", offer, groupId);
            socket.broadcast.emit("screen-offer", { offer, senderId: socket.id, groupId });
        });

        socket.on("screen-answer", ({ answer, senderId }) => {
            io.to(senderId).emit("screen-answer", { answer });
        });

        socket.on("screen-ice-candidate", ({ candidate, groupId }) => {
            socket.broadcast.emit("screen-ice-candidate", { candidate, groupId });
        });

        socket.on("screen-stop-share", ({ groupId }) => {
            socket.broadcast.emit("screen-stop-share", { groupId });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

module.exports = screenShare;