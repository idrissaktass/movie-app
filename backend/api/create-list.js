import dbConnect from '../utils/dbConnect';
import User from '../models/User';
import Cors from 'cors';

const cors = Cors({
  origin: 'https://movie-app-x.vercel.app',
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
    res.setHeader('Access-Control-Allow-Origin', 'https://movie-app-frontend-xi.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end(); // No content for OPTIONS method
    return;
  }

  // Handle POST requests
  if (req.method === 'POST') {
    const { email, listName, isPublic } = req.body;

    // Validate input data
    if (!email || !listName) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check for existing list
      const existingList = user.lists.find(list => list.name === listName);
      if (existingList) {
        return res.status(400).json({ message: 'List name already exists' });
      }

      // Create new list
      user.lists.push({ name: listName, isPublic, movieIds: [] });
      await user.save();

      res.status(201).json({ message: 'List created successfully', list: { name: listName, isPublic } });
    } catch (err) {
      console.error('Error creating list:', err);
      res.status(500).json({ message: 'Error creating list' });
    }
  } else {
    // Method not allowed for anything other than POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
