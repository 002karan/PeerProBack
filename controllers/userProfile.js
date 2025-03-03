const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('../models/User');
require('dotenv').config(); // Load environment variables from .env

// Get user profile by token (excluding password)
exports.getUserByToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret key
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from response
    console.log("Decoded Token:", decoded);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user }); // Send profile data
  } catch (error) {
    console.error("Error fetching user by token:", error); // Log the error for debugging
    res.status(401).json({ message: 'Invalid token' });
  }
};
