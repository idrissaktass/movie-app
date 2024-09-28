const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

const cors = require('cors');

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://movie-app-front-three.vercel.app',
    'https://movie-app-front-fxj3t8hkz-idris-aktass-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
}));



app.use(express.json()); // Parse JSON request bodies

const authRoutes = require('./routes/auth');
const actionsRoute = require('./routes/user-actions');

// Use routes
app.use('/routes/user-actions', actionsRoute);
app.use('/routes/auth', authRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
