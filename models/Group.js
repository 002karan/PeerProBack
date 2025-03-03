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
