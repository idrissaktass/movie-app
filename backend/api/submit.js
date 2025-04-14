import dbConnect from '../utils/dbConnect';
import Cors from 'cors';

// CORS ayarları
const cors = Cors({
  origin: 'https://www.cinescope.online',
  methods: ['POST'],
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
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
    return;
  }

  await dbConnect();

  if (req.method === 'POST') {
    const { userAnswers, score } = req.body;
    try {
      console.log('Kullanıcı Cevapları:', userAnswers, 'Puan:', score);
      res.status(200).json({ message: 'Cevaplar başarıyla kaydedildi', score });
    } catch (err) {
      console.error('Error submitting answers:', err);
      res.status(500).json({ message: 'Error submitting answers' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
