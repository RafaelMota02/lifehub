import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Explicitly set allowed parameters
  allowExitOnIdle: true,
  connectionTimeoutMillis: 30000,
});

export default pool;
