export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    env: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasSecret: !!process.env.SESSION_SECRET,
      nodeVersion: process.version
    }
  });
}