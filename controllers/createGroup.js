const express = require("express");
const Group = require("../models/Group");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt"); // Import bcrypt
const router = express.Router();

const createGroup = async (req, res) => {
  try {
    const { Topic, Language, GroupType, NumberOfMembers, Password } = req.body; // Changed SecretKey to Password

    // Basic validation
    if (!Topic || !Language || !GroupType) {
      return res.status(400).json({ error: "Topic, Language, and GroupType are required" });
    }

    // Validate based on GroupType
    if (GroupType === "public") {
      if (!NumberOfMembers) {
        return res.status(400).json({ error: "NumberOfMembers is required for public groups" });
      }
      const parsedNumberOfMembers = parseInt(NumberOfMembers);
      if (isNaN(parsedNumberOfMembers) || parsedNumberOfMembers < 1) {
        return res.status(400).json({ error: "NumberOfMembers must be a positive integer" });
      }
    } else if (GroupType === "private") {
      if (!Password) {
        return res.status(400).json({ error: "Password is required for private groups" });
      }
    } else {
      return res.status(400).json({ error: "GroupType must be either 'public' or 'private'" });
    }

    // Hash the Password for private groups
    let hashedPassword;
    if (GroupType === "private") {
      const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
      hashedPassword = await bcrypt.hash(Password, salt); // Hash the password
    }

    // Create new group object
    const newGroup = new Group({
      Topic,
      Language,
      GroupType,
      ...(GroupType === "public" && { NumberOfMembers: parseInt(NumberOfMembers) }),
      ...(GroupType === "private" && { Password: hashedPassword }), // Store hashed password
    });

    await newGroup.save();

    global.io.emit("newGroup", newGroup);

    res.status(201).json(newGroup);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to create group" });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().select("-Password"); // Exclude Password from response for security
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

const joinPrivateGroup = async (req, res) => {
  try {
    const { groupId, password } = req.body;

    if (!groupId || !password) {
      return res.status(400).json({ error: "Group ID and password are required" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.GroupType !== "private") {
      return res.status(400).json({ error: "This is not a private group" });
    }

    const isPasswordValid = await bcrypt.compare(password, group.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Return group details (excluding Password for security)
    res.status(200).json({
      _id: group._id,
      Topic: group.Topic,
      Language: group.Language,
      GroupType: group.GroupType,
      createdAt: group.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to join group" });
  }
};

module.exports = { createGroup, getGroups,joinPrivateGroup };