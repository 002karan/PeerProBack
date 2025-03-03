const { addUserToGroup } = require('../controllers/groupController');
const { io } = require('../backend_server');


exports.connectUserToGroup = async (req, res) => {
  let { groupId, userId } = req.body;
console.log("groupId, userId ",groupId, userId)

  // Trim any extra spaces from IDs
  groupId = groupId.trim();
  userId = userId.trim();

  if (!groupId || !userId) {
    return res.status(400).json({ message: 'Group ID and User ID are required' });
  }

  try {
    await addUserToGroup(groupId, userId);



    res.status(200).json({ message: 'User added to group successfully' });
  } catch (error) {
    console.error('Error adding user to group:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

