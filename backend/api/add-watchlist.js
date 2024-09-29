import dbConnect from '../utils/dbConnect';
import User from '../models/User';
import Cors from 'cors';

const allowedOrigins = [
    'https://movie-app-front-three.vercel.app', // Production URL
    'http://localhost:3000', // Local development URL
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
  await runMiddleware(req, res, cors);
  await dbConnect();

  if (req.method === 'POST') {
    const { email, movieId, movieData } = req.body;

    if (!email || !movieId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.watchlist.includes(movieId)) {
        return res.status(400).json({ message: 'Movie already in watchlist' });
      }

      user.watchlist.push(movieId);
      await user.save();

      res.status(200).json({ message: 'Movie added to watchlist' });
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      res.status(500).json({ message: 'Error adding to watchlist' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
