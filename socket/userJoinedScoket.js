const { addUserToGroup } = require("../controllers/groupController");
console.log("hello")
const userJoinedScoket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinGroup", async ({ groupId, userId }) => {
      try {
          socket.join(groupId);
          console.log(`User ${userId} joined group ${groupId}`);

          // Debugging: Ensure function executes correctly
          console.log("Calling addUserToGroup...");

          // Add user to group in DB and get user details


          // if (!user) {
          //     console.error(`User ${userId} not found or not added to group`);
          //     return;
          // }

          io.to(groupId).emit("userJoined",{ groupId, userId });

          // Emit event to all users in the group

          console.log(`✅ Emitted userJoined event for group ${groupId} with user:`, { groupId, userId });

      } catch (error) {
          console.error("❌ Error handling joinGroup:", error.message);
      }
  });



    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = userJoinedScoket;
