import dbConnect from '../utils/dbConnect';
import User from '../models/User';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://www.cinescope.online',
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
  // Run CORS middleware
  await runMiddleware(req, res, cors);
  await dbConnect();

  // Handle the OPTIONS method (preflight request)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.cinescope.online');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end(); // No content for OPTIONS method
    return;
  }

  // Handle POST requests to add a movie to the watchlist
  if (req.method === 'POST') {
    const { email, movieId, movieData } = req.body;

    // Validate input data
    if (!email || !movieId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if movie is already in the watchlist
      if (user.watchlist.includes(movieId)) {
        return res.status(400).json({ message: 'Movie already in watchlist' });
      }

      // Add movie to watchlist
      user.watchlist.push(movieId);
      await user.save();

      res.status(200).json({ message: 'Movie added to watchlist' });
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      res.status(500).json({ message: 'Error adding to watchlist' });
    }
  } else {
    // Method not allowed for anything other than POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
