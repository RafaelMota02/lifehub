import 'dotenv/config';
import pool from './pool.js';

(async () => {
  try {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    console.log('Columns in users table:', res.rows.map(row => row.column_name));
  } catch (error) {
    console.error('Error listing columns:', error);
  } finally {
    pool.end();
  }
})();
