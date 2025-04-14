const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(
  "mongodb+srv://idrissaktass98:aktas0998@cluster0.yp4q1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Soru şeması ve modeli
const questionSchema = new mongoose.Schema({
  question: String,
  choices: [String],
  correctAnswer: String,
  imageUrl: String,
});

const Question = mongoose.model('Question', questionSchema);

// Routes
// Soruları getir
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 5 } }]); // 5 random soru
    res.json(questions);
  } catch (err) {
    console.error('Sorular getirilirken bir hata oluştu:', err);
    res.status(500).send('Sorular alınamadı');
  }
});

// Cevapları kaydet (şu an veritabanına kaydetmiyor, logluyor)
app.post('/api/submit', async (req, res) => {
  const { userAnswers, score } = req.body;
  try {
    console.log('Kullanıcı Cevapları:', userAnswers, 'Puan:', score);
    res.json({ message: 'Cevaplar başarıyla kaydedildi', score });
  } catch (err) {
    console.error('Cevap kaydedilirken bir hata oluştu:', err);
    res.status(500).send('Cevaplar kaydedilemedi');
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
