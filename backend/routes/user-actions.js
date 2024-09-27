// routes/user-actions.js

const express = require('express');
const actionsRoute = express.Router();
const mongoose = require('mongoose'); 
const User = require('../models/User'); // Import the User model

// Add to favorites route
actionsRoute.post('/add-favorite', async (req, res) => {
  console.log('Request body:', req.body); // Log request body

  const { email, movieId } = req.body; // Expecting email along with movieId
  console.log("Received Email:", email);
  console.log("Received Movie ID:", movieId);

  if (!email || !movieId) {
    return res.status(400).json({ message: 'Invalid request data' });
  }
  const user = await User.findOne({ email }); // Change this line to find user by email
  console.log("use",user)
  try {
    // Find the user by email
    const user = await User.findOne({ email }); // Change this line to find user by email
    console.log("use",user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if movieId is already in favorites to prevent duplicates
    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }

    // Add the movieId to the user's favorites array
    user.favorites.push(movieId); // Add the movieId to the favorites array
    await user.save(); // Save the updated user document

    res.status(200).json({ message: 'Movie added to favorites' });
  } catch (err) {
    console.error('Error adding to favorites:', err);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
});

// Add to watchlist route
actionsRoute.post('/add-watchlist', async (req, res) => {
  console.log('Request body:', req.body); // Log request body

  const { email, movieId, movieData } = req.body; // Expecting email along with movieId and movieData
  console.log("Received Email:", email);
  console.log("Received Movie ID:", movieId);
  console.log("Received Movie Data:", movieData);

  if (!email || !movieId) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log("User found:", user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if movieId is already in watchlist to prevent duplicates
    if (user.watchlist?.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    // Add the movieId and associated data to the user's watchlist
    user.watchlist.push(movieId); // Assuming movieData includes details like title, release date, etc.
    await user.save(); // Save the updated user document

    res.status(200).json({ message: 'Movie added to watchlist' });
  } catch (err) {
    console.error('Error adding to watchlist:', err);
    res.status(500).json({ message: 'Error adding to watchlist' });
  }
});
// Remove from favorites route
actionsRoute.post('/remove-favorite', async (req, res) => {
  console.log('Request body:', req.body); // Log request body

  const { email, movieId } = req.body; // Expecting email along with movieId
  console.log("Received Email:", email);
  console.log("Received Movie ID:", movieId);
  
  if (!email || !movieId) {
      return res.status(400).json({ message: 'Invalid request data' });
  }
  
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Ensure movieId is a string for comparison
      user.favorites = user.favorites.filter(id => id !== String(movieId));
      
      // Save user and check for errors
      const savedUser = await user.save();
      if (!savedUser) {
          return res.status(500).json({ message: 'Failed to update favorites' });
      }

      console.log("Updated favorites:", user.favorites); // Log updated favorites
      res.status(200).json({ message: 'Movie removed from favorites' });
  } catch (err) {
      console.error('Error removing from favorites:', err);
      res.status(500).json({ message: 'Error removing from favorites' });
  }
});

// Remove from watchlist route
actionsRoute.post('/remove-watchlist', async (req, res) => {
  const { email, movieId } = req.body;
  console.log("xd",movieId,email)

  if (!email || !movieId) {
      return res.status(400).json({ message: 'Invalid request data' });
  }
  
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Remove the movieId from the user's watchlist array
      user.watchlist = user.watchlist.filter(id => id !== movieId);
      await user.save();

      res.status(200).json({ message: 'Movie removed from watchlist' });
  } catch (err) {
      console.error('Error removing from watchlist:', err);
      res.status(500).json({ message: 'Error removing from watchlist' });
  }
});
// routes.js (or wherever your routes are defined)

actionsRoute.post('/favorites', async (req, res) => {
  console.log('Request body:', req.body); // Log request body

  const { email } = req.body; // Expecting email along with movieId
  console.log("Received Email:", email);
  
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ favorites: user.favorites }); // Send the favorites array
  } catch (err) {
      console.error('Error fetching favorites:', err);
      res.status(500).json({ message: 'Error fetching favorites' });
  }
});

actionsRoute.post('/watchlist', async (req, res) => {
  console.log('Request body2222:', req.body); // Log request body

  const { email } = req.body; // Expecting email along with movieId
  console.log("Received Email2222:", email);
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ watchlist: user.watchlist }); // Send the watchlist array
      console.log("user.watchlist:", user.watchlist);

  } catch (err) {
      console.error('Error fetching watchlist:', err);
      res.status(500).json({ message: 'Error fetching watchlist' });
  }
});
// routes/user-actions.js

// Create a new list route
actionsRoute.post('/create-list', async (req, res) => {
  const { email, listName, isPublic } = req.body;

  if (!email || !listName) {
      return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if the list name already exists
      const existingList = user.lists.find(list => list.name === listName);
      if (existingList) {
          return res.status(400).json({ message: 'List name already exists' });
      }

      // Create and add the new list
      user.lists.push({ name: listName, isPublic, movieIds: [] });
      await user.save();

      res.status(201).json({ message: 'List created successfully', list: { name: listName, isPublic } });
  } catch (err) {
      console.error('Error creating list:', err);
      res.status(500).json({ message: 'Error creating list' });
  }
});

// Add a movie to a specific list
actionsRoute.post('/add-to-list', async (req, res) => {
  const { email, listName, movieId } = req.body;

  if (!email || !listName || !movieId) {
      return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Find the specified list
      const list = user.lists.find(list => list.name === listName);
      if (!list) {
          return res.status(404).json({ message: 'List not found' });
      }

      // Check if movieId is already in the list to prevent duplicates
      if (list.movieIds.includes(movieId)) {
          return res.status(400).json({ message: 'Movie already in the list' });
      }

      // Add the movieId to the list's movieIds array
      list.movieIds.push(movieId);
      await user.save(); // Save the updated user document

      res.status(200).json({ message: 'Movie added to list', list });
  } catch (err) {
      console.error('Error adding to list:', err);
      res.status(500).json({ message: 'Error adding to list' });
  }
});

// Get all lists of a user
actionsRoute.post('/get-lists', async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ lists: user.lists }); // Send the lists array
  } catch (err) {
      console.error('Error fetching lists:', err);
      res.status(500).json({ message: 'Error fetching lists' });
  }
});


module.exports = actionsRoute; // Ensure you are exporting the router correctly
