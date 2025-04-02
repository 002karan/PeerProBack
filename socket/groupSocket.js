const { Server } = require("socket.io");
const { removeUserFromGroup } = require("../controllers/groupController");
const User = require("../models/User");


function setupGroupSocket(io) {
 
  const userMap = new Map(); // Map to store socket ID -> user ID

  io.on("connection", (socket) => {
    console.log("🔗 New client connected:", socket.id);

    // User joins a room
    socket.on("joinRoom", async ({ groupId, user_id }) => {
      if (!groupId || !user_id) {
        console.log("⚠️ Invalid groupId or userId.");
        return;
      }

      socket.join(groupId);
      userMap.set(socket.id, user_id); // Store the user ID with socket ID
      console.log(`📢 User ${user_id} (Socket: ${socket.id}) joined Group ${groupId}`);
 // emit group id for get connecter users
      // Notify others in the group
      socket.to(groupId).emit("userJoined", { userId: user_id, groupId });
    });

    // Sending messages
    socket.on("sendGroupMessage", ({ groupId, message, sender, user_id }) => {
      if (!groupId || !message || !sender || !user_id) {
        console.log("⚠️ Missing message details.");
        return;
      }

      console.log("📨 Message Sent:", { groupId, message, sender });
      io.to(groupId).emit("receiveGroupMessage", { sender, message, groupId, user_id });
    });

    // Handle user disconnection
    socket.on("disconnect", async () => {
      const user_id = userMap.get(socket.id);
      userMap.delete(socket.id); // Remove from tracking

      if (!user_id) {
        console.log(`❌ Unknown User disconnected (Socket: ${socket.id})`);
        return;
      }

      // Fetch user's groupId before removing
      const user = await User.findById(user_id);
      const groupId = user?.groupId;

      console.log(`❌ User ${user_id} disconnected (Socket: ${socket.id})`);

      if (groupId) {
        await removeUserFromGroup(groupId, user_id); // Remove user from group & update DB
      }
    });
  });
}

module.exports = setupGroupSocket;
