import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

async function testConnection() {
  // Create a direct pool with explicit SSL settings to avoid local postgres issues
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 50));
    console.log('Full DATABASE_URL:', process.env.DATABASE_URL);

    const client = await pool.connect();
    console.log('✅ Database connection successful');

    const result = await client.query('SELECT COUNT(*) FROM users');
    console.log('Users table exists and is accessible. User count:', result.rows[0].count);

    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full connection string:', process.env.DATABASE_URL);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
