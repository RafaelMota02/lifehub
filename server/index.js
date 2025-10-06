import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import financesRoutes from './routes/financesRoutes.js';
import moodsRoutes from './routes/moodsRoutes.js';
import tasksRoutes from './routes/tasksRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import auth from './middleware/auth.js'; // Import the auth middleware
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS based on environment
// TEMPORARILY ALLOWING ALL ORIGINS FOR DEBUGGING
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? true // Allow all origins for testing
  : ['http://localhost:5173', 'http://localhost:3000'];

// Enable CORS for all routes
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/finances', auth, financesRoutes); // Add auth middleware to finances routes
app.use('/api/moods', auth, moodsRoutes); // Add auth middleware to moods routes
app.use('/api/tasks', auth, tasksRoutes); // Add auth middleware to tasks routes
app.use('/api/notes', auth, notesRoutes); // Add auth middleware to notes routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
