const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/unipoll')
  .then(() => console.log('✅ База данных подключена'))
  .catch(err => console.error('❌ Ошибка базы:', err));

const QuestionSchema = new mongoose.Schema({
    text: String,
    options: [String],
    correct: Number
});

const Question = mongoose.model('Question', QuestionSchema);

// ПОЛУЧИТЬ ВСЕ ВОПРОСЫ
app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json(err);
    }
});

// СОХРАНИТЬ ВОПРОС (Теперь возвращает созданный объект с ID)
app.post('/questions', async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion); // Возвращаем вопрос с ID
    } catch (err) {
        res.status(400).json(err);
    }
});

// УДАЛИТЬ ВОПРОС ПО ID
app.delete('/questions/:id', async (req, res) => {
    try {
        const result = await Question.findByIdAndDelete(req.params.id);
        if (result) {
            res.status(200).json({ message: "Удалено" });
        } else {
            res.status(404).json({ message: "Вопрос не найден" });
        }
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера при удалении" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));