import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    message: 'Hello from Vercel!',
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}