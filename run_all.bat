@echo off
echo =========================================================================
echo  Launching AquaVision – SIH26001 AI Landslide Early Warning Web Platform
echo =========================================================================
echo.
echo 1. Launching FastAPI Backend on http://localhost:8000 ...
start "AquaVision Backend (FastAPI)" cmd /k "cd backend && python main.py"

timeout /t 2 /nobreak >nul

echo 2. Launching Next.js Frontend on http://localhost:3000 ...
start "AquaVision Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo.
echo Services successfully started in background windows!
echo - Frontend: http://localhost:3000
echo - Backend API & Docs: http://localhost:8000/docs
echo.
pause
