const express = require('express');
const cookieParser = require('cookie-parser');

// Initialize database with error handling
let storage;
let setupAuth;
let vercelSession;

try {
  const storageModule = require('../server/storage-optimized');
  storage = storageModule.storage;
  
  const authModule = require('../server/auth-vercel');
  setupAuth = authModule.setupAuth;
  
  const sessionModule = require('../server/vercel-session');
  vercelSession = sessionModule.vercelSession;
  
  require('../server/db');
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
if (setupAuth) {
  setupAuth(app);
}

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

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Courses
app.get("/api/courses", async (req, res) => {
  if (!storage) return res.status(503).json({ message: "Database not initialized" });
  try {
    const courses = await storage.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Combined dashboard endpoint
app.get("/api/dashboard", async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.sendStatus(401);
  if (!storage) return res.status(503).json({ message: "Database not initialized" });
  
  try {
    const userId = req.user.id;
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
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Catch-all for unmatched API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

module.exports = async function handler(req, res) {
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
    app(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}