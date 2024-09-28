"backend/models/User.js"
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: {
    type: [String], // Assuming movieId is a string, adjust accordingly
    default: [],
  },
  lists: [{
    name: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    movieIds: [{ type: String }]
  }],
  watchlist: { type: [Object], default: [] }  // Array to hold movie objects or IDs
});
module.exports = mongoose.model('User', UserSchema);
