@echo off
REM MediConnect - Start Both Servers
REM Windows startup script

echo.
echo ========================================
echo  MediConnect Platform - Starting
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed
    echo Please install Python 3.8+ first
    pause
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js 18+ first
    pause
    exit /b 1
)

echo Python found
echo Node found
echo.

REM Install backend dependencies if needed
if not exist "backend\venv" (
    echo Installing Python dependencies...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    echo Backend dependencies installed
    echo.
)

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    echo Frontend dependencies installed
    echo.
)

echo.
echo ========================================
echo  Starting Servers
echo ========================================
echo.

REM Start backend in new window
echo Starting Python Backend...
start "MediConnect Backend" cmd /k "cd backend && python main.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

echo Starting Frontend...
echo.
echo ========================================
echo  Servers Starting!
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo Frontend:    http://localhost:5173
echo API Docs:    http://localhost:8000/docs
echo.
echo Login Credentials:
echo   Customer: customer / customer123
echo   Hospital: cityhospital / hospital123
echo   Support:  admin / admin123
echo.
echo Close this window to stop frontend
echo ========================================
echo.

REM Start frontend (this window)
npm run dev

echo.
echo Servers stopped
pause
