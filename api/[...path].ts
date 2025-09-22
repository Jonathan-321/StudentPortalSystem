import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cookieParser from 'cookie-parser';
import { setupAuth } from '../server/auth-vercel';
import { vercelSession } from '../server/vercel-session';
// Initialize database with error handling
let storage: any;
let setupApiRoutes: any;

try {
  const storageModule = await import('../server/storage');
  storage = storageModule.storage;
  
  const apiRoutesModule = await import('../server/api-routes');
  setupApiRoutes = apiRoutesModule.setupApiRoutes;
  
  await import('../server/db'); // Initialize database connection
  await import('../server/db-init'); // Warm database connection
} catch (error) {
  console.error('Database initialization error:', error);
}

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(vercelSession);

// Setup authentication routes
setupAuth(app);

// Test endpoint (no auth required)
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working",
    timestamp: new Date().toISOString(),
    env: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasSecret: !!process.env.SESSION_SECRET
    }
  });
});

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Combined dashboard endpoint
app.get("/api/dashboard", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  if (!storage) {
    return res.status(503).json({ message: "Database not initialized" });
  }
  
  try {
    const userId = req.user!.id;
    const [enrollments, announcements, tasks, academics, finances] = await Promise.all([
      storage.getUserEnrollments(userId),
      storage.getAllAnnouncements(),
      storage.getUserTasks(userId),
      storage.getUserAcademics(userId),
      storage.getUserFinances(userId)
    ]);
    
    res.json({
      user: req.user,
      enrollments,
      announcements,
      tasks,
      academics,
      finances
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Combined academics page endpoint
app.get("/api/academics-page", async (req, res) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  
  if (!storage) {
    return res.status(503).json({ message: "Database not initialized" });
  }
  
  try {
    const userId = req.user!.id;
    const [enrollments, academics, courses] = await Promise.all([
      storage.getUserEnrollments(userId),
      storage.getUserAcademics(userId),
      storage.getAllCourses()
    ]);
    
    res.json({
      user: req.user,
      enrollments,
      academics,
      courses
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add all other API routes
if (setupApiRoutes) {
  setupApiRoutes(app);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Forward to Express
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}