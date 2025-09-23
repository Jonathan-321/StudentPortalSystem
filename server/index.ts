import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { pool } from "./db";
import { initializeDatabase } from "./init-db";

const app = express();

// Configure CORS for Vercel frontend
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    'https://student-portal-system-theta.vercel.app', // Vercel deployment
    /^https:\/\/student-portal-.*\.vercel\.app$/ // All Vercel preview deployments
  ],
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Pre-warm the database connection
  try {
    await pool.query('SELECT 1');
    log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }

  // Initialize database schema
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }

  // Seed the database with initial data
  try {
    await seedDatabase();
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use PORT from environment or default to 3000
  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen(port, '0.0.0.0', () => {
    log(`serving on port ${port}`);
  });
})();
