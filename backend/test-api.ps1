# Smart Class Axis API Testing Script
# This script demonstrates the login and signup APIs

$baseUrl = "http://localhost:5000/api"

Write-Host "🚀 Testing Smart Class Axis APIs..." -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health Check: $($healthResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Student Signup
Write-Host "2. Testing Student Signup..." -ForegroundColor Yellow
$studentData = @{
    rollNumber = "STU001"
    email = "student@test.com"
    password = "Test123!"
    firstName = "John"
    lastName = "Doe"
    phone = "1234567890"
    dateOfBirth = "2000-01-01"
    address = "123 Test Street, Test City, Test State"
    academicYear = "2nd Year"
    semester = 3
    specialization = "Computer Science"
} | ConvertTo-Json

try {
    $studentResponse = Invoke-RestMethod -Uri "$baseUrl/auth/student/signup" -Method POST -Body $studentData -ContentType "application/json"
    Write-Host "✅ Student Signup Success: $($studentResponse.message)" -ForegroundColor Green
    Write-Host "   User ID: $($studentResponse.data.user.id)" -ForegroundColor Cyan
    Write-Host "   Student ID: $($studentResponse.data.student.id)" -ForegroundColor Cyan
    Write-Host "   Token: Generated" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Student Signup Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Details: $errorBody" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Professor Signup
Write-Host "3. Testing Professor Signup..." -ForegroundColor Yellow
$professorData = @{
    employeeId = "PROF001"
    email = "professor@test.com"
    password = "Test123!"
    firstName = "Jane"
    lastName = "Smith"
    phone = "1234567891"
    dateOfBirth = "1985-05-15"
    address = "456 Professor Lane, Test City, Test State"
    qualification = "PhD in Computer Science"
    experience = 10
    department = "Computer Science"
} | ConvertTo-Json

try {
    $professorResponse = Invoke-RestMethod -Uri "$baseUrl/auth/professor/signup" -Method POST -Body $professorData -ContentType "application/json"
    Write-Host "✅ Professor Signup Success: $($professorResponse.message)" -ForegroundColor Green
    Write-Host "   User ID: $($professorResponse.data.user.id)" -ForegroundColor Cyan
    Write-Host "   Professor ID: $($professorResponse.data.professor.id)" -ForegroundColor Cyan
    Write-Host "   Token: Generated" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Professor Signup Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Details: $errorBody" -ForegroundColor Red
    }
}
Write-Host ""

# Test 4: HOD Signup
Write-Host "4. Testing HOD Signup..." -ForegroundColor Yellow
$hodData = @{
    employeeId = "HOD001"
    email = "hod@test.com"
    password = "Test123!"
    firstName = "Dr. Robert"
    lastName = "Johnson"
    phone = "1234567892"
    dateOfBirth = "1975-03-20"
    address = "789 HOD Avenue, Test City, Test State"
    qualification = "PhD in Computer Science"
    experience = 15
    department = "Computer Science"
} | ConvertTo-Json

try {
    $hodResponse = Invoke-RestMethod -Uri "$baseUrl/auth/hod/signup" -Method POST -Body $hodData -ContentType "application/json"
    Write-Host "✅ HOD Signup Success: $($hodResponse.message)" -ForegroundColor Green
    Write-Host "   User ID: $($hodResponse.data.user.id)" -ForegroundColor Cyan
    Write-Host "   HOD ID: $($hodResponse.data.hod.id)" -ForegroundColor Cyan
    Write-Host "   Token: Generated" -ForegroundColor Cyan
} catch {
    Write-Host "❌ HOD Signup Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Details: $errorBody" -ForegroundColor Red
    }
}
Write-Host ""

# Test 5: Login
Write-Host "5. Testing Login..." -ForegroundColor Yellow
$loginData = @{
    email = "student@test.com"
    password = "Test123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login Success: $($loginResponse.message)" -ForegroundColor Green
    Write-Host "   User Role: $($loginResponse.data.user.role)" -ForegroundColor Cyan
    Write-Host "   User ID: $($loginResponse.data.user.id)" -ForegroundColor Cyan
    Write-Host "   Token: Generated" -ForegroundColor Cyan
    
    # Store token for protected route test
    $token = $loginResponse.data.token
    
    # Test 6: Get Current User (Protected Route)
    Write-Host "6. Testing Get Current User (Protected Route)..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $currentUserResponse = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers $headers
        Write-Host "✅ Get Current User Success" -ForegroundColor Green
        Write-Host "   User Role: $($currentUserResponse.data.user.role)" -ForegroundColor Cyan
        Write-Host "   User Name: $($currentUserResponse.data.user.profile.firstName) $($currentUserResponse.data.user.profile.lastName)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Get Current User Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Login Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Details: $errorBody" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "🎉 API Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 API Endpoints Summary:" -ForegroundColor Yellow
Write-Host "   POST /api/auth/student/signup - Student Registration" -ForegroundColor White
Write-Host "   POST /api/auth/professor/signup - Professor Registration" -ForegroundColor White
Write-Host "   POST /api/auth/hod/signup - HOD Registration" -ForegroundColor White
Write-Host "   POST /api/auth/login - User Login" -ForegroundColor White
Write-Host "   GET /api/auth/me - Get Current User (Protected)" -ForegroundColor White
Write-Host "   GET /api/health - Health Check" -ForegroundColor White
