import dbConnect from '../utils/dbConnect';
import User from '../models/User';
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
  await runMiddleware(req, res, cors);
  await dbConnect();

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

      user.favorites = user.favorites.filter(id => id !== String(movieId));
      await user.save();

      res.status(200).json({ message: 'Movie removed from favorites' });
    } catch (err) {
      console.error('Error removing from favorites:', err);
      res.status(500).json({ message: 'Error removing from favorites' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
