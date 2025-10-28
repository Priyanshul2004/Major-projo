# Simple API Test Script
$baseUrl = "http://localhost:5000/api"

Write-Host "Testing Smart Class Axis APIs..." -ForegroundColor Green

# Test Health Check
Write-Host "1. Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "SUCCESS: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Student Signup
Write-Host "2. Student Signup..." -ForegroundColor Yellow
$studentData = @{
    rollNumber = "STU001"
    email = "student@test.com"
    password = "Test123!"
    firstName = "John"
    lastName = "Doe"
    phone = "1234567890"
    dateOfBirth = "2000-01-01"
    address = "123 Test Street"
    academicYear = "2nd Year"
    semester = 3
    specialization = "Computer Science"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/student/signup" -Method POST -Body $studentData -ContentType "application/json"
    Write-Host "SUCCESS: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Login
Write-Host "3. Login..." -ForegroundColor Yellow
$loginData = @{
    email = "student@test.com"
    password = "Test123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "SUCCESS: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Test Complete!" -ForegroundColor Green
