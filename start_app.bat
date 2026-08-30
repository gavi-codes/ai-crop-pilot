@echo off
echo Starting AI CropPilot...
echo =======================================

echo Starting Backend Server...
start "AI CropPilot Backend" cmd /c "cd backend && call venv\Scripts\activate.bat && python run.py"

echo Starting Frontend Server...
start "AI CropPilot Frontend" cmd /c "cd frontend && npm run dev"

echo =======================================
echo Both servers are starting up!
echo Your website will be available at: http://localhost:5173/
echo Keep the two black terminal windows open while you are using the app.
pause
