import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Connect to database
    const sql = neon(process.env.DATABASE_URL);
    
    // Fetch all announcements, newest first
    const announcements = await sql`
      SELECT * FROM announcements 
      ORDER BY posted_at DESC
      LIMIT 20
    `;
    
    res.status(200).json({
      success: true,
      data: announcements,
      count: announcements.length
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch announcements',
      message: error.message 
    });
  }
}