const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Нужно для фронтенда

const app = express();
app.use(cors());
app.use(express.json());

// 1. ПОДКЛЮЧЕНИЕ СТАТИКИ (Чтобы твой сайт открывался по ссылке)
app.use(express.static(path.join(__dirname, '../')));

// 2. ПОДКЛЮЧЕНИЕ К БАЗЕ
// На Render используем переменную окружения, локально - твою строку
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/unipoll';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ База данных подключена'))
  .catch(err => console.error('❌ Ошибка базы:', err));

const QuestionSchema = new mongoose.Schema({
    text: String,
    options: [String],
    correct: Number
});

const Question = mongoose.model('Question', QuestionSchema);

// 3. ТВОИ МАРШРУТЫ API
app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/questions', async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (err) {
        res.status(400).json(err);
    }
});

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

// Добавим проверочный путь, который ты открывал
app.get('/api/status', (req, res) => {
    res.json({ message: "Server is online!" });
});

// 4. ГЛАВНЫЙ МАРШРУТ (Отдает твой index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// 5. ПОРТ (Render сам назначает порт, поэтому используем process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));