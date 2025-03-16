const { addUserToGroup } = require("../controllers/groupController");
const User = require("../models/User");

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");

    // Listen for user joining a group
    socket.on("joinGroup", async ({ groupId, userId }) => {
      socket.join(groupId);
      console.log(`User ${userId} joined group ${groupId}`);

      // Add user to group in DB
      await addUserToGroup(groupId, userId);

      // Fetch user's name
      const user = await User.findById(userId).select("name");

      // Notify other users in the group
      socket.to(groupId).emit("userJoined", { userId, name: user.name });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = setupSocket;
