const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  Topic: {
    type: String,
    required: true,
  },
  Language: {
    type: String,
    required: true,

  },
  NumberOfMembers: {
    type: Number,
    required: true,
    min: 1, // Ensures the number of members is at least 1
  },
  connectedUsers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Group", GroupSchema);
