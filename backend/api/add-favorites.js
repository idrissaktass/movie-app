import dbConnect from '../utils/dbConnect'; // Import your MongoDB connection utility
import User from '../models/User'; // Import the User model
import Cors from 'cors';

const cors = Cors({
  origin: 'https://movie-app-frontend-xi.vercel.app',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// Helper function to run middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  await runMiddleware(req, res, cors); // Run the CORS middleware
  await dbConnect(); // Connect to the database

  // Handle the OPTIONS method (preflight request)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://movie-app-frontend-xi.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end(); // No content for OPTIONS method
    return;
  }

  if (req.method === 'POST') {
    const { email, movieId } = req.body;

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
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
