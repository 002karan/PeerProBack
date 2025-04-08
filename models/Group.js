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
  GroupType: {
    type: String,
    enum: ["public", "private"], // Restrict to "public" or "private"
    required: true,
  },
  NumberOfMembers: {
    type: Number,
    required: function () {
      return this.GroupType === "public"; // Required only for public groups
    },
    min: 1, // Ensures the number of members is at least 1
  },
  Password: {
    type: String,
    required: function () {
      return this.GroupType === "private"; // Required only for private groups
    },
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
