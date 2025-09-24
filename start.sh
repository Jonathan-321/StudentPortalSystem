#!/bin/bash

echo "🚀 Starting production build..."

# Check if dist exists, if not build it
if [ ! -d "dist" ]; then
  echo "📦 Building application..."
  npm run build:all
fi

echo "✅ Starting server..."
node dist/index.js