// server.js (or any filename you prefer)

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User'); // Import the User model
const bcrypt = require('bcrypt'); // CommonJS
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://movie-app-front-three.vercel.app',
    'https://movie-app-front-fxj3t8hkz-idris-aktass-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json()); // Parse JSON request bodies

// User actions routes
app.post('/user-actions/add-favorite', async (req, res) => {
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

    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }

    user.favorites.push(movieId);
    await user.save();

    res.status(200).json({ message: 'Movie added to favorites' });
  } catch (err) {
    console.error('Error adding to favorites:', err);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
});

app.post('/user-actions/add-watchlist', async (req, res) => {
  console.log('Request body:', req.body); // Log request body

  const { email, movieId, movieData } = req.body; // Expecting email along with movieId and movieData
  console.log("Received Email:", email);
  console.log("Received Movie ID:", movieId);
  console.log("Received Movie Data:", movieData);

  if (!email || !movieId) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.watchlist?.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    user.watchlist.push(movieId); 
    await user.save();

    res.status(200).json({ message: 'Movie added to watchlist' });
  } catch (err) {
    console.error('Error adding to watchlist:', err);
    res.status(500).json({ message: 'Error adding to watchlist' });
  }
});

app.post('/user-actions/remove-favorite', async (req, res) => {
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

      user.favorites = user.favorites.filter(id => id !== String(movieId));
      
      const savedUser = await user.save();
      if (!savedUser) {
          return res.status(500).json({ message: 'Failed to update favorites' });
      }

      console.log("Updated favorites:", user.favorites);
      res.status(200).json({ message: 'Movie removed from favorites' });
  } catch (err) {
      console.error('Error removing from favorites:', err);
      res.status(500).json({ message: 'Error removing from favorites' });
  }
});

app.post('/user-actions/remove-watchlist', async (req, res) => {
  const { email, movieId } = req.body;
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

      user.watchlist = user.watchlist.filter(id => id !== movieId);
      await user.save();

      res.status(200).json({ message: 'Movie removed from watchlist' });
  } catch (err) {
      console.error('Error removing from watchlist:', err);
      res.status(500).json({ message: 'Error removing from watchlist' });
  }
});

// Get favorites route
app.post('/user-actions/favorites', async (req, res) => {
    console.log('Request body:', req.body); // Log request body
  
    const { email } = req.body; // Expecting email
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
  
// Get watchlist route
app.post('/user-actions/watchlist', async (req, res) => {
console.log('Request body:', req.body); // Log request body

const { email } = req.body; // Expecting email
console.log("Received Email:", email);

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

// Create a new list route
app.post('/user-actions/create-list', async (req, res) => {
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
app.post('/user-actions/add-to-list', async (req, res) => {
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
app.post('/user-actions/get-lists', async (req, res) => {
const { email } = req.body;

if (!email) {
    return res.status(400).json({ message: 'Invalid request data' });
}

try {
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ lists: user.lists }); // Return user's lists
} catch (err) {
    console.error('Error fetching lists:', err);
    res.status(500).json({ message: 'Error fetching lists' });
}
});

app.post('/auth/register', async (req, res) => {
const { username, email, password } = req.body;
console.log("xd",req.body)
try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate a token after successful signup
    const token = jwt.sign({ userId: newUser._id }, "867452886f9520fdb7ba8721bf6d46ebc6b000123fb2bef4cb64d32407d86986", {
    expiresIn: '1h', // Set token expiration as needed
    });

    res.status(201).json({ message: 'User created successfully', token });
} catch (err) {
    res.status(500).json({ error: err.message });
}
});


app.post('/auth/login', async (req, res) => {
const { email, password } = req.body;
console.log("Login attempt:", email);
try {
    const user = await User.findOne({ email });
    if (!user) {
    console.log("User not found");
    return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    console.log("Password does not match");
    return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, "867452886f9520fdb7ba8721bf6d46ebc6b000123fb2bef4cb64d32407d86986", { expiresIn: '1h' });
    console.log("user attempt:", user);
    res.json({ token, userId: user._id }); // Return user ID with the token
} catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://idrissaktass98:aktas0998@cluster0.yp4q1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
