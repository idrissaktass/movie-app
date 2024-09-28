const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

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
app.options('*', cors()); // Preflight handling
app.use('/manifest.json', express.static('public/manifest.json'));

// Use routes
app.use('/auth', authRoutes); // Correctly setup routes
app.use('/user-actions', actionsRoute);

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
