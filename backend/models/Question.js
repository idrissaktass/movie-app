import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: String,
  choices: [String],
  correctAnswer: String,
  imageUrl: String,
});

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
