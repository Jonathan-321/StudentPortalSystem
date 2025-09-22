import "dotenv/config";
import express from "express";
import { registerRoutes } from "../server/routes.js";
import { seedDatabase } from "../server/seed.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for your frontend with credentials
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Initialize database and routes
(async () => {
  try {
    // Seed database on first run
    await seedDatabase();
    console.log('Database initialized');
  } catch (error) {
    console.error('Database seed error:', error);
  }
  
  // Register routes
  await registerRoutes(app);
  console.log('Routes registered');
})();

export default app;