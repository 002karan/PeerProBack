const Group = require("../models/Group");
const User = require("../models/User");

// Add user to the group's connected users without duplicates
exports.addUserToGroup = async (groupId, userId) => {
  try {
    const user = await User.findById(userId).select("name");

    if (!user) {
      throw new Error("User not found");
    }

    // Fetch the group to check if the user is already connected
    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    // Check if the user already exists in connectedUsers
    const userExists = group.connectedUsers.some(
      (connectedUser) => connectedUser.userId.toString() === userId
    );

    if (userExists) {
      console.log("User already connected to the group");
      return; // User already exists, do not add again
    }

    // Add user ID and name to the group
    await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          connectedUsers: {
            userId: user._id,
            name: user.name,
          },
        },
      },
      { new: true }
    );

    console.log("User successfully added to the group");
  } catch (error) {
    console.error("Error adding user to group:", error);
  }
};

// Fetch connected users from a group
exports.getConnectedUsers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group.connectedUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
