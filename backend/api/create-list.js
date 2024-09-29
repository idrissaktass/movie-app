import dbConnect from '../utils/dbConnect';
import User from '../models/User';
import Cors from 'cors';

app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      'https://movie-app-front-three.vercel.app'
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader("Access-Control-Max-Age", 7200);
  
    next();
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
