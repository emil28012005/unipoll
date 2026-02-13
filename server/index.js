const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. ПРАВИЛЬНЫЙ ПУТЬ К ФРОНТЕНДУ (для Vite)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// 2. ПОДКЛЮЧЕНИЕ К БАЗЕ (Исправлено для Render)
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error("❌ ОШИБКА: Переменная MONGODB_URI не задана в настройках Render!");
}

mongoose.connect(mongoURI || 'mongodb://127.0.0.1:27017/unipoll')
  .then(() => console.log('✅ База данных подключена'))
  .catch(err => console.error('❌ Ошибка базы:', err));

// --- Твои маршруты API ---
app.get('/api/status', (req, res) => {
    res.json({ message: "Server is online!" });
});

// 3. ИСПРАВЛЕННЫЙ МАРШРУТ ДЛЯ ВСЕХ СТРАНИЦ (убрали ошибку PathError)
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));