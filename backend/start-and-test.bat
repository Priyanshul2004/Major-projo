@echo off
echo Starting Smart Class Axis Backend Server...
echo.

REM Start the server in background
start /B node server.js

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo.
echo Testing APIs...
echo.

REM Test Health Check
echo 1. Testing Health Check...
curl -X GET http://localhost:5000/api/health
echo.
echo.

REM Test Student Signup
echo 2. Testing Student Signup...
curl -X POST http://localhost:5000/api/auth/student/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"rollNumber\":\"STU001\",\"email\":\"student@test.com\",\"password\":\"Test123!\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"phone\":\"1234567890\",\"dateOfBirth\":\"2000-01-01\",\"address\":\"123 Test Street\",\"academicYear\":\"2nd Year\",\"semester\":3,\"specialization\":\"Computer Science\"}"
echo.
echo.

REM Test Login
echo 3. Testing Login...
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"student@test.com\",\"password\":\"Test123!\"}"
echo.
echo.

echo API Testing Complete!
echo.
echo To stop the server, press Ctrl+C or close this window.
pause
