# Smart Class Axis API Documentation

## 🚀 Authentication APIs

### Base URL
```
http://localhost:5000/api
```

---

## 📝 Signup APIs

### 1. Student Signup
**Endpoint:** `POST /api/auth/student/signup`

**Request Body:**
```json
{
  "rollNumber": "STU001",
  "email": "student@test.com",
  "password": "Test123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "dateOfBirth": "2000-01-01",
  "address": "123 Test Street, Test City, Test State",
  "academicYear": "2nd Year",
  "semester": 3,
  "specialization": "Computer Science"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "student@test.com",
      "role": "student",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "1234567890",
        "dateOfBirth": "2000-01-01T00:00:00.000Z",
        "address": "123 Test Street, Test City, Test State"
      }
    },
    "student": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "rollNumber": "STU001",
      "academicInfo": {
        "currentYear": "2nd Year",
        "semester": 3,
        "specialization": "Computer Science"
      }
    }
  },
  "message": "Student registered successfully"
}
```

### 2. Professor Signup
**Endpoint:** `POST /api/auth/professor/signup`

**Request Body:**
```json
{
  "employeeId": "PROF001",
  "email": "professor@test.com",
  "password": "Test123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "1234567891",
  "dateOfBirth": "1985-05-15",
  "address": "456 Professor Lane, Test City, Test State",
  "qualification": "PhD in Computer Science",
  "experience": 10,
  "department": "Computer Science"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "email": "professor@test.com",
      "role": "professor",
      "profile": {
        "firstName": "Jane",
        "lastName": "Smith",
        "phone": "1234567891",
        "dateOfBirth": "1985-05-15T00:00:00.000Z",
        "address": "456 Professor Lane, Test City, Test State"
      }
    },
    "professor": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "employeeId": "PROF001",
      "qualification": "PhD in Computer Science",
      "experience": 10,
      "department": "Computer Science"
    }
  },
  "message": "Professor registered successfully"
}
```

### 3. HOD Signup
**Endpoint:** `POST /api/auth/hod/signup`

**Request Body:**
```json
{
  "employeeId": "HOD001",
  "email": "hod@test.com",
  "password": "Test123!",
  "firstName": "Dr. Robert",
  "lastName": "Johnson",
  "phone": "1234567892",
  "dateOfBirth": "1975-03-20",
  "address": "789 HOD Avenue, Test City, Test State",
  "qualification": "PhD in Computer Science",
  "experience": 15,
  "department": "Computer Science"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "email": "hod@test.com",
      "role": "hod",
      "profile": {
        "firstName": "Dr. Robert",
        "lastName": "Johnson",
        "phone": "1234567892",
        "dateOfBirth": "1975-03-20T00:00:00.000Z",
        "address": "789 HOD Avenue, Test City, Test State"
      }
    },
    "hod": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d5",
      "employeeId": "HOD001",
      "qualification": "PhD in Computer Science",
      "experience": 15,
      "department": "Computer Science"
    }
  },
  "message": "HOD registered successfully"
}
```

---

## 🔐 Login API

### User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "student@test.com",
  "password": "Test123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "student@test.com",
      "role": "student",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "1234567890",
        "dateOfBirth": "2000-01-01T00:00:00.000Z",
        "address": "123 Test Street, Test City, Test State"
      }
    },
    "student": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "rollNumber": "STU001",
      "academicInfo": {
        "currentYear": "2nd Year",
        "semester": 3,
        "specialization": "Computer Science"
      },
      "subjects": []
    }
  },
  "message": "Login successful"
}
```

---

## 🔒 Protected Routes

### Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "student@test.com",
      "role": "student",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "1234567890",
        "dateOfBirth": "2000-01-01T00:00:00.000Z",
        "address": "123 Test Street, Test City, Test State"
      }
    },
    "student": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "rollNumber": "STU001",
      "academicInfo": {
        "currentYear": "2nd Year",
        "semester": 3,
        "specialization": "Computer Science"
      },
      "subjects": []
    }
  }
}
```

### Change Password
**Endpoint:** `POST /api/auth/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "Test123!",
  "newPassword": "NewTest123!",
  "confirmPassword": "NewTest123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Logout
**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🏥 Health Check

### API Health Check
**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📋 Testing Instructions

### 1. Start the Server
```bash
cd smart-class-axis/backend
npm install
npm start
```

### 2. Test with cURL

**Health Check:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Student Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/student/signup \
  -H "Content-Type: application/json" \
  -d '{
    "rollNumber": "STU001",
    "email": "student@test.com",
    "password": "Test123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "dateOfBirth": "2000-01-01",
    "address": "123 Test Street",
    "academicYear": "2nd Year",
    "semester": 3,
    "specialization": "Computer Science"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "Test123!"
  }'
```

**Get Current User (with token):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Test with Postman

1. Import the collection or create new requests
2. Set base URL to `http://localhost:5000/api`
3. For protected routes, add `Authorization: Bearer <token>` header
4. Test all endpoints in sequence

---

## ⚠️ Error Responses

### Validation Error
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      }
    ]
  }
}
```

### Authentication Error
```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password"
  }
}
```

### Authorization Error
```json
{
  "success": false,
  "error": {
    "message": "Insufficient permissions"
  }
}
```

---

## 🔧 Environment Setup

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-class-axis
JWT_SECRET=your-super-secret-jwt-key
```

---

## 📊 API Status

✅ **All Authentication APIs are Complete and Ready!**

- ✅ Student Signup
- ✅ Professor Signup  
- ✅ HOD Signup
- ✅ User Login
- ✅ Get Current User
- ✅ Change Password
- ✅ Logout
- ✅ Health Check
- ✅ JWT Authentication
- ✅ Role-based Authorization
- ✅ Input Validation
- ✅ Error Handling
