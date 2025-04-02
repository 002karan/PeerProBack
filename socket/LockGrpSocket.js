
function lockGroup(io) {
    let lockedGroups = {};
    io.on("connection", (socket) => {
        console.log("🔒User connected from lock:", socket.id);

        

        socket.on("toggleLock", ({ groupId, newLockState }) => {

            lockedGroups[groupId] = newLockState; // Store state per group
            io.emit("toggleLock", { groupId, lockState: newLockState });
        });

        socket.on("disconnect", () => {
            console.log(" 🔒User disconnected:", socket.id);
        });

    });
}
module.exports = lockGroup;