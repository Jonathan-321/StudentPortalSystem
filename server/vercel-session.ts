import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';

const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key';

export interface SessionData {
  userId?: number;
  user?: User;
}

export const vercelSession: RequestHandler = (req, res, next) => {
  // Get token from cookie or authorization header
  const token = req.cookies?.['session-token'] || 
                req.headers.authorization?.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, SESSION_SECRET) as SessionData;
      req.user = decoded.user;
    } catch (err) {
      // Invalid token, continue without user
    }
  }

  // Override isAuthenticated
  req.isAuthenticated = () => !!req.user;

  // Override login
  req.login = (user: any, done?: any) => {
    const token = jwt.sign({ user }, SESSION_SECRET, { expiresIn: '7d' });
    res.cookie('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    req.user = user;
    if (done) done(null);
  };

  // Override logout
  req.logout = (done?: any) => {
    res.clearCookie('session-token');
    req.user = undefined;
    if (done) done(null);
  };

  next();
};