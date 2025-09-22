import { pool } from './db';

// Database warming for Vercel cold starts
export async function warmDatabase() {
  try {
    // Execute a simple query to establish connection
    await pool.query('SELECT 1');
    console.log('Database connection warmed');
  } catch (error) {
    console.error('Database warming failed:', error);
  }
}

// Pre-warm the database on module load
if (process.env.NODE_ENV === 'production') {
  warmDatabase();
}