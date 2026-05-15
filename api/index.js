import dotenv from 'dotenv';
dotenv.config();

import express        from 'express';
import cors           from 'cors';
import connectDB      from './config/db.js';
import authRoutes     from './routes/authRoutes.js';
import bmiRoutes      from './routes/bmiRoutes.js';
import waterRoutes    from './routes/waterRoutes.js';
import caloriesRoutes from './routes/caloriesRoutes.js';
import workoutRoutes  from './routes/workoutRoutes.js';
import aiRoutes       from './routes/aiRoutes.js'; // ← ADD

const app = express();
connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: '🏋️ FitLife AI Backend is Running!', status: 'success' });
});

app.use('/api/auth',     authRoutes);
app.use('/api/bmi',      bmiRoutes);
app.use('/api/water',    waterRoutes);
app.use('/api/calories', caloriesRoutes);
app.use('/api/workout',  workoutRoutes);
app.use('/api/ai',       aiRoutes); // ← ADD

app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Export the app for Vercel
export default app;