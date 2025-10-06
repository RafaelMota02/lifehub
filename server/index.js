import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import financesRoutes from './routes/financesRoutes.js';
import moodsRoutes from './routes/moodsRoutes.js';
import tasksRoutes from './routes/tasksRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import auth from './middleware/auth.js'; // Import the auth middleware
import 'dotenv/config';

// Railway requirements
const app = express();
const PORT = process.env.PORT || 3001;

// Simple CORS that works everywhere
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://lifehub-hkpm952nj-dwayceprdc-7227s-projects.vercel.app'
];

app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true
}));

// Keep Railway's CSP headers, just ensure CORS works
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Health check for Railway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'LifeHub backend is running',
    timestamp: new Date().toISOString()
  });
});

app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/finances', auth, financesRoutes); // Add auth middleware to finances routes
app.use('/api/moods', auth, moodsRoutes); // Add auth middleware to moods routes
app.use('/api/tasks', auth, tasksRoutes); // Add auth middleware to tasks routes
app.use('/api/notes', auth, notesRoutes); // Add auth middleware to notes routes

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LifeHub Backend running on port ${PORT}`);
});
