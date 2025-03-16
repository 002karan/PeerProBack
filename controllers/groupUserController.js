const { addUserToGroup, removeUserFromGroup } = require('../controllers/groupController');
const User = require('../models/User');

exports.connectUserToGroup = async (req, res) => {
  let { groupId, userId } = req.body;
  console.log("groupId, userId:", groupId, userId);

  // Trim any extra spaces from IDs
  groupId = groupId.trim();
  userId = userId.trim();

  if (!groupId || !userId) {
    return res.status(400).json({ message: 'Group ID and User ID are required' });
  }

  try {
    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already in a group
    if (user.groupId) {
      await removeUserFromGroup(user.groupId, userId); // Remove from the previous group
    }

    // Add the user to the new group
    await addUserToGroup(groupId, userId);

    // Update the user's groupId in the database
    await User.findByIdAndUpdate(userId, { groupId });
    global.io.emit("userJoined", { userId, userName: user.name, groupId });
    

    res.status(200).json({ message: 'User added to group successfully' });
  } catch (error) {
    console.error('Error adding user to group:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
