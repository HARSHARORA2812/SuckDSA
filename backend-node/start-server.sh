#!/bin/bash

echo "🚀 Starting SuckDSA Node.js Backend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🔥 Starting savage DSA teacher..."
npm run dev
