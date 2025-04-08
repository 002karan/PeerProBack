const mongoose = require("mongoose");
const Group = require("../models/Group");
const User = require("../models/User");
const {io} = require("../backend_server")
// Add user to the group's connected users without duplicates
exports.addUserToGroup = async (groupId, userId) => {
  try {
    const user = await User.findById(userId).select("name");
    console.log("groupId userId",{groupId, userId})

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

exports.removeUserFromGroup = async (req, res) => {
  console.log('Request received at /api/removeUser');
  console.log('Raw body:', req.body);

  const { groupId, userId } = req.body;

  console.log('Extracted groupId:', groupId);
  console.log('Extracted userId:', userId);

  if (!groupId || !userId) {
    console.log('Missing groupId or userId in request body');
    return res.status(400).json({ message: 'groupId and userId are required in the request body' });
  }

  try {
    console.log(`Removing user ${userId} from group ${groupId}`);

    // Validate IDs
    if (!mongoose.isValidObjectId(groupId) || !mongoose.isValidObjectId(userId)) {
      console.log("Invalid ObjectId format.");
      return res.status(400).json({ message: 'Invalid groupId or userId format' });
    }

    // Convert to ObjectId
    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check group before update
    const groupBefore = await Group.findById(groupObjectId);
    if (!groupBefore) {
      console.log('Group not found');
      return res.status(404).json({ message: 'Group not found' });
    }
    console.log('Group before update:', groupBefore);
    console.log('connectedUsers array:', groupBefore.connectedUsers);
    console.log('First connectedUser type:', groupBefore.connectedUsers.length > 0 ? typeof groupBefore.connectedUsers[0] : 'empty');

    // Determine the format of connectedUsers and adjust $pull
    let updateQuery;
    if (groupBefore.connectedUsers.length > 0) {
      const firstUser = groupBefore.connectedUsers[0];
      if (firstUser instanceof mongoose.Types.ObjectId) {
        // Array of ObjectIds
        updateQuery = { $pull: { connectedUsers: userObjectId } };
      } else if (typeof firstUser === 'string') {
        // Array of strings
        updateQuery = { $pull: { connectedUsers: userId } };
      } else if (firstUser && firstUser.userId) {
        // Array of objects with userId field
        updateQuery = { $pull: { connectedUsers: { userId: userObjectId } } };
      } else {
        console.log('Unknown connectedUsers format');
        return res.status(500).json({ message: 'Unknown connectedUsers format' });
      }
    } else {
      // Empty array, no need to pull
      updateQuery = {};
    }

    // Remove userId from Group's connectedUsers
    const updatedGroup = await Group.findByIdAndUpdate(
      groupObjectId,
      updateQuery,
      { new: true }
    );

    console.log('Group after update:', updatedGroup);

    // Check user before update
    const userBefore = await User.findById(userObjectId);
    console.log('User before update:', userBefore);

    // Remove groupId from User's profile
    const updatedUser = await User.findByIdAndUpdate(
      userObjectId,
      { $unset: { groupId: "" } },
      { new: true }
    );

    if (!updatedUser) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User after update:', updatedUser);

    // Emit Socket.IO event (if applicable)
    if (global.io) {
      global.io.emit("userRemoved", { userId, groupId });
    }

    console.log(`User ${userId} successfully removed from group ${groupId}`);
    return res.status(200).json({
      message: 'User removed from group successfully',
      group: updatedGroup,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error removing user from group:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
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
