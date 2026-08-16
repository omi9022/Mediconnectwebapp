#!/bin/bash

# MediConnect - Start Both Servers
# Mac/Linux startup script

echo "🚀 Starting MediConnect Platform..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo "✅ Node found: $(node --version)"
echo ""

# Install backend dependencies if needed
if [ ! -d "backend/venv" ]; then
    echo "📦 Setting up Python virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    echo "✅ Backend dependencies installed"
    echo ""
fi

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
    echo ""
fi

# Start backend in background
echo "🔧 Starting Python Backend Server..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend running on http://localhost:8000"
    echo "📚 API Docs: http://localhost:8000/docs"
else
    echo "❌ Backend failed to start"
    exit 1
fi

echo ""

# Start frontend
echo "🔧 Starting Frontend Server..."
echo "✅ Frontend will start on http://localhost:5173"
echo ""
echo "================================================"
echo "🎉 MediConnect Platform is starting!"
echo "================================================"
echo ""
echo "Backend API: http://localhost:8000"
echo "Frontend:    http://localhost:5173"
echo "API Docs:    http://localhost:8000/docs"
echo ""
echo "Login Credentials:"
echo "  Customer: customer / customer123"
echo "  Hospital: cityhospital / hospital123"
echo "  Support:  admin / admin123"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "================================================"
echo ""

# Start frontend (this will keep running in foreground)
npm run dev

# When frontend is stopped, kill backend too
kill $BACKEND_PID
echo ""
echo "👋 Servers stopped. Goodbye!"
