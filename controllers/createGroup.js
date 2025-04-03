const express = require("express");
const Group = require("../models/Group");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const router = express.Router();

const createGroup = async (req, res) => {
  try {
    const { Topic, Language, NumberOfMembers } = req.body;

    // Basic validation
    if (!Topic || !Language || !NumberOfMembers) {
      return res.status(400).json({ error: "Topic, Language, and NumberOfMembers are required" });
    }

    // Ensure NumberOfMembers is a valid number
    const parsedNumberOfMembers = parseInt(NumberOfMembers);
    if (isNaN(parsedNumberOfMembers) || parsedNumberOfMembers < 1) {
      return res.status(400).json({ error: "NumberOfMembers must be a positive integer" });
    }

    const newGroup = new Group({
      Topic,
      Language,
      NumberOfMembers: parsedNumberOfMembers,
    });
    await newGroup.save();

    global.io.emit("newGroup", newGroup);

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find(); // Fetch all groups, including NumberOfMembers
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

module.exports = { createGroup, getGroups };