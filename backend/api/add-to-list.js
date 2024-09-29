import dbConnect from '../utils/dbConnect';
import User from '../models/User';
import Cors from 'cors';
const cors = Cors({
    origin: 'https://movie-app-front-three.vercel.app',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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

  const { email, listName, movieId } = req.body;

  if (!email || !listName || !movieId) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const list = user.lists.find(list => list.name === listName);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    if (list.movieIds.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in the list' });
    }

    list.movieIds.push(movieId);
    await user.save();

    res.status(200).json({ message: 'Movie added to list', list });
  } catch (err) {
    console.error('Error adding to list:', err);
    res.status(500).json({ message: 'Error adding to list' });
  }
}
