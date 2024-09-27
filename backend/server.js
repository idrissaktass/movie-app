// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

// Configure CORS with the allowed headers
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.vercel.app'], // Replace with your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json()); // Move this line above route definitions

const authRoutes = require('./routes/auth');
const actionsRoute = require('./routes/user-actions');

app.use('/routes/user-actions', actionsRoute); // Corrected route

app.use('/routes/auth', authRoutes);

// Add a root route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://idrissaktass98:aktas0998@cluster0.yp4q1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
