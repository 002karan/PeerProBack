const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Review = require('../models/ReviewModel');

const review = async (req,res) => {
    const { name, email, review, rating } = req.body;

    // Basic validation
    if (!name || !email || !review || rating === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    try {
      // Check if email already exists
      const existingReview = await Review.findOne({ email });
      if (existingReview) {
        return res.status(400).json({ message: 'Review already exists for this email' });
      }

      // Create new review
      const newReview = new Review({
        name,
        email,
        review,
        rating,
      });

      // Save to MongoDB
      await newReview.save();

      res.status(201).json({ message: 'Review saved successfully', review: newReview });
    } catch (error) {
      console.error('Error saving review:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }

}

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find(); // Fetch all reviews from MongoDB
    res.status(200).json({ message: 'Reviews fetched successfully', reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { review , getReviews};
