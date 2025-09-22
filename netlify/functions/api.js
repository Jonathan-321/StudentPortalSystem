// This wraps your Express app for Netlify Functions
import serverless from 'serverless-http';
import express from 'express';
import { registerRoutes } from '../../server/routes.js';

const app = express();
app.use(express.json());

// Register all your routes
registerRoutes(app).then(() => {
  console.log('Routes registered');
});

// Export handler for Netlify
export const handler = serverless(app);