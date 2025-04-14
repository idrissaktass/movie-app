import dbConnect from '../utils/dbConnect';
import Question from '../models/Question';
import Cors from 'cors';

// CORS ayarları
const cors = Cors({
  origin: 'https://www.cinescope.online',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// Helper function
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

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.cinescope.online');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
    return;
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const questions = await Question.aggregate([{ $sample: { size: 5 } }]);
      res.status(200).json(questions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ message: 'Error fetching questions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
