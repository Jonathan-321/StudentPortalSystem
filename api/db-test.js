import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', '*');

  try {
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ 
        success: false, 
        error: 'DATABASE_URL not configured' 
      });
    }

    // Connect to database
    const sql = neon(process.env.DATABASE_URL);
    
    // Test connection with a simple query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    
    // Get table counts
    const tables = await sql`
      SELECT 
        'users' as table_name, COUNT(*) as count FROM users
      UNION ALL
        SELECT 'courses', COUNT(*) FROM courses
      UNION ALL
        SELECT 'announcements', COUNT(*) FROM announcements
      UNION ALL
        SELECT 'enrollments', COUNT(*) FROM enrollments
    `;
    
    res.status(200).json({
      success: true,
      database: {
        connected: true,
        time: result[0].current_time,
        version: result[0].pg_version
      },
      tables: tables.reduce((acc, row) => {
        acc[row.table_name] = parseInt(row.count);
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      message: error.message,
      details: error.toString()
    });
  }
}