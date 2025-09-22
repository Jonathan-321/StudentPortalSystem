import type { VercelRequest, VercelResponse } from '@vercel/node';

module.exports = function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasSecret: !!process.env.SESSION_SECRET
    }
  });
};