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

  const { email, listName, isPublic } = req.body;

  if (!email || !listName) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingList = user.lists.find(list => list.name === listName);
    if (existingList) {
      return res.status(400).json({ message: 'List name already exists' });
    }

    user.lists.push({ name: listName, isPublic, movieIds: [] });
    await user.save();

    res.status(201).json({ message: 'List created successfully', list: { name: listName, isPublic } });
  } catch (err) {
    console.error('Error creating list:', err);
    res.status(500).json({ message: 'Error creating list' });
  }
}
