const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env variables
dotenv.config();

// Kiểm tra biến môi trường quan trọng
if (!process.env.PORT) {
  console.warn("⚠️  PORT chưa được cấu hình trong .env, sẽ dùng mặc định 5000.");
}

const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const imageRoutes = require('./routes/imageRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Có thể giới hạn origin để bảo mật hơn
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json({ limit: '10mb' })); // Giới hạn kích thước body tránh DoS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/history', historyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
});

// Bắt lỗi khi server gặp sự cố
server.on('error', (err) => {
  console.error("❌ Lỗi khi khởi động server:", err.message);
  process.exit(1);
});

// Xử lý tắt server an toàn
process.on('SIGINT', () => {
  console.log("\n🛑 Đang tắt server...");
  server.close(() => {
    console.log("✅ Server đã tắt.");
    process.exit(0);
  });
});
