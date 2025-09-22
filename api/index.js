import express from "express";
import { registerRoutes } from "../server/routes.js";
import "../server/db.js"; // Initialize database

const app = express();
app.use(express.json());

// Enable CORS for your frontend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Register all routes
registerRoutes(app).then(() => {
  console.log('Routes registered');
}).catch(err => {
  console.error('Failed to register routes:', err);
});

export default app;