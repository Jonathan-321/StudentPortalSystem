export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Simple hardcoded login
  if (username === 'test' && password === 'test123') {
    return res.status(200).json({
      id: 1,
      username: 'test',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@ur.ac.rw',
      studentId: '219000001',
      role: 'student',
      language: 'en'
    });
  }

  return res.status(401).json({ message: 'Invalid username or password' });
}