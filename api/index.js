const { createClient } = require('@neondatabase/serverless');

// Simple API handler
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const { url, method } = req;
  
  try {
    // Test endpoint
    if (url === '/api' || url === '/api/') {
      return res.status(200).json({
        message: 'Student Portal API',
        version: '1.0.0',
        endpoints: ['/api/health', '/api/courses', '/api/login']
      });
    }
    
    // Health check
    if (url.includes('/api/health')) {
      return res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        env: {
          hasDatabase: !!process.env.DATABASE_URL,
          hasSecret: !!process.env.SESSION_SECRET
        }
      });
    }
    
    // Courses endpoint (no auth)
    if (url.includes('/api/courses') && method === 'GET') {
      if (!process.env.DATABASE_URL) {
        return res.status(503).json({ error: 'Database not configured' });
      }
      
      try {
        const client = createClient(process.env.DATABASE_URL);
        const { rows } = await client.query('SELECT * FROM courses');
        return res.status(200).json(rows);
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({ error: 'Database query failed', details: dbError.message });
      }
    }
    
    // Login endpoint
    if (url.includes('/api/login') && method === 'POST') {
      // For now, just return success for admin/admin123
      const { username, password } = req.body || {};
      
      if (username === 'admin' && password === 'admin123') {
        return res.status(200).json({
          id: 1,
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        });
      }
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Default 404
    return res.status(404).json({ error: 'Endpoint not found', url });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
};