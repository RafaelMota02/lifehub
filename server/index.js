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

// Configure CORS dynamically using environment variables
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000',  // Alternative dev port
  // Allow requests with no origin (like mobile apps, Postman)
];

// Add production frontend URL if specified
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Add hardcoded Vercel URL for now (backup)
if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push('https://lifehub-hkpm952nj-dwayceprdc-7227s-projects.vercel.app');
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Override Railway's strict CSP with API-friendly headers
app.use((req, res, next) => {
  // Override Railway's default-src 'none' CSP
  res.removeHeader('Content-Security-Policy');
  res.setHeader("Content-Security-Policy", "default-src 'self' https: data:; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; font-src 'self' https:; connect-src 'self' https:;");
  // Ensure CORS headers
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Serve a simple favicon to avoid CSP errors
app.get('/favicon.ico', (req, res) => {
  res.send(''); // Send empty favicon
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
