import dbConnect from '../utils/dbConnect'; // Import your MongoDB connection utility
import User from '../models/User'; // Import the User model
import Cors from 'cors';

const allowedOrigins = [
    'https://movie-app-front-three.vercel.app', // Production URL
    'http://localhost:5000', // Local development URL
  ];
  
  const cors = Cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  });
  
  
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
