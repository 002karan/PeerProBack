const express = require("express");
const Group = require("../models/Group");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const router = express.Router();

const createGroup = async (req, res) => {

    try {
        const { Topic, Language } = req.body;
        const newGroup = new Group({ Topic, Language });
        await newGroup.save();

        global.io.emit("newGroup", newGroup);

        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: "Failed to create group" });
    }


}
const getGroups = async (req, res) => {
    try {
      const groups = await Group.find(); // Fetch all groups from MongoDB
      res.status(200).json(groups); // Send groups as JSON response
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch groups" });
    }
  };
module.exports = { createGroup,getGroups };

