export default async function handler(req, res) {
  const { Client } = await import('pg');
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    
    // Get endpoint from query parameter
    const { endpoint } = req.query;
    
    let data;
    switch(endpoint) {
      case 'courses':
        const courses = await client.query('SELECT * FROM courses ORDER BY code');
        data = { success: true, courses: courses.rows };
        break;
        
      case 'users':
        const users = await client.query('SELECT id, username, first_name, last_name, email, role FROM users');
        data = { success: true, users: users.rows };
        break;
        
      case 'announcements':
        const announcements = await client.query('SELECT * FROM announcements ORDER BY posted_at DESC LIMIT 10');
        data = { success: true, announcements: announcements.rows };
        break;
        
      default:
        // Return database info
        const info = await client.query('SELECT NOW() as time, COUNT(*) as user_count FROM users');
        const courseCount = await client.query('SELECT COUNT(*) as count FROM courses');
        data = {
          success: true,
          database: 'connected',
          time: info.rows[0].time,
          counts: {
            users: info.rows[0].user_count,
            courses: courseCount.rows[0].count
          }
        };
    }
    
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    await client.end();
  }
}