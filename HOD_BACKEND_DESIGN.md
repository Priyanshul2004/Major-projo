# HOD Dashboard - Backend Design & MongoDB Atlas Schema

## 📊 **DEEP ANALYSIS - HOD DASHBOARD COMPONENTS**

### **Common Elements Identified Across HOD Components:**

#### **1. User Management**
- **HOD Profile**: Name, email, avatar, role-based access
- **Professor Management**: CRUD operations, subject assignment, experience tracking
- **Student Overview**: Display-only with status tracking

#### **2. Data Display Patterns**
- **Statistics Cards**: Count-based metrics (Total Professors, Students, Subjects)
- **List Views**: Tabular data with actions (View, Delete, Edit)
- **Status Tracking**: Active/Inactive states, attendance percentages
- **Real-time Updates**: Attendance marking, form submissions

#### **3. Form Operations**
- **Professor Creation**: Name, email, subject, experience, password
- **Notice Management**: Title, content, priority, category, author
- **Attendance Tracking**: Date-based, checkbox-based marking

#### **4. Data Relationships**
- **HOD → Professors**: One-to-many (HOD manages multiple professors)
- **Professors → Subjects**: One-to-many (Professor can teach multiple subjects)
- **Students → Subjects**: Many-to-many (Students enrolled in multiple subjects)
- **Attendance → Users**: Many-to-one (Multiple attendance records per user)

---

## 🗄️ **MONGODB ATLAS DATABASE SCHEMA**

### **Database: `smart_class_axis`**

#### **Collection 1: `users`**
```javascript
{
  _id: ObjectId("..."),
  email: "hod@university.edu",
  password: "$2b$10$...", // bcrypt hashed
  role: "hod", // "hod" | "professor" | "student"
  profile: {
    firstName: "John",
    lastName: "Smith",
    fullName: "Dr. John Smith",
    avatar: "https://...",
    phone: "+1234567890",
    address: {
      street: "123 University Ave",
      city: "Education City",
      state: "Academic State",
      zipCode: "12345"
    }
  },
  college: {
    code: "UNI001",
    name: "University of Technology",
    department: "Computer Science"
  },
  status: "active", // "active" | "inactive" | "suspended"
  lastLogin: ISODate("2024-03-15T10:30:00Z"),
  createdAt: ISODate("2024-01-15T08:00:00Z"),
  updatedAt: ISODate("2024-03-15T10:30:00Z")
}
```

#### **Collection 2: `professors`**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."), // Reference to users collection
  employeeId: "PROF001",
  subjects: [
    {
      subjectId: ObjectId("..."),
      subjectName: "Computer Science",
      subjectCode: "CS101",
      isPrimary: true
    }
  ],
  experience: {
    totalYears: 8,
    previousInstitutions: [
      {
        name: "Tech University",
        position: "Assistant Professor",
        duration: "2016-2020"
      }
    ]
  },
  qualifications: [
    {
      degree: "Ph.D.",
      field: "Computer Science",
      institution: "MIT",
      year: 2015
    }
  ],
  schedule: {
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: {
      start: "09:00",
      end: "17:00"
    }
  },
  performance: {
    rating: 4.5,
    totalClasses: 150,
    attendancePercentage: 96.0,
    studentFeedback: 4.2
  },
  status: "active",
  createdAt: ISODate("2024-01-15T08:00:00Z"),
  updatedAt: ISODate("2024-03-15T10:30:00Z")
}
```

#### **Collection 3: `students`**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."), // Reference to users collection
  rollNumber: "CS001",
  enrollmentNumber: "ENR2024001",
  academicInfo: {
    currentYear: 3,
    semester: 6,
    program: "Bachelor of Technology",
    specialization: "Computer Science",
    admissionDate: ISODate("2022-08-15T00:00:00Z"),
    expectedGraduation: ISODate("2025-06-30T00:00:00Z")
  },
  subjects: [
    {
      subjectId: ObjectId("..."),
      subjectName: "Data Structures",
      subjectCode: "CS201",
      professorId: ObjectId("..."),
      enrollmentDate: ISODate("2024-01-15T00:00:00Z"),
      status: "enrolled" // "enrolled" | "completed" | "dropped"
    }
  ],
  attendance: {
    totalClasses: 45,
    attendedClasses: 42,
    percentage: 93.3,
    lastUpdated: ISODate("2024-03-15T00:00:00Z")
  },
  academicPerformance: {
    cgpa: 8.5,
    currentSemesterGPA: 8.8,
    totalCredits: 120,
    completedCredits: 90
  },
  status: "active",
  createdAt: ISODate("2022-08-15T08:00:00Z"),
  updatedAt: ISODate("2024-03-15T10:30:00Z")
}
```

#### **Collection 4: `subjects`**
```javascript
{
  _id: ObjectId("..."),
  subjectCode: "CS101",
  subjectName: "Computer Science Fundamentals",
  description: "Introduction to computer science concepts",
  credits: 4,
  department: "Computer Science",
  prerequisites: ["MATH101"],
  professorId: ObjectId("..."), // Primary professor
  coProfessors: [ObjectId("...")], // Additional professors
  schedule: {
    days: ["Monday", "Wednesday", "Friday"],
    time: "10:00-11:00",
    room: "CS-101",
    building: "Computer Science Building"
  },
  academicYear: "2024-2025",
  semester: 1,
  maxStudents: 60,
  enrolledStudents: 45,
  status: "active", // "active" | "inactive" | "completed"
  createdAt: ISODate("2024-01-15T08:00:00Z"),
  updatedAt: ISODate("2024-03-15T10:30:00Z")
}
```

#### **Collection 5: `attendance`**
```javascript
{
  _id: ObjectId("..."),
  date: ISODate("2024-03-15T00:00:00Z"),
  type: "professor", // "professor" | "student"
  records: [
    {
      userId: ObjectId("..."),
      userType: "professor", // "professor" | "student"
      status: "present", // "present" | "absent" | "late"
      markedBy: ObjectId("..."), // HOD who marked attendance
      markedAt: ISODate("2024-03-15T09:00:00Z"),
      remarks: "On time"
    }
  ],
  subjectId: ObjectId("..."), // For student attendance
  classType: "regular", // "regular" | "lab" | "tutorial"
  totalExpected: 6,
  totalPresent: 5,
  totalAbsent: 1,
  attendancePercentage: 83.3,
  createdAt: ISODate("2024-03-15T09:00:00Z"),
  updatedAt: ISODate("2024-03-15T09:00:00Z")
}
```

#### **Collection 6: `exam_results`**
```javascript
{
  _id: ObjectId("..."),
  examId: "EXAM2024001",
  examName: "Mid-Term Examination",
  examType: "midterm", // "midterm" | "final" | "quiz" | "assignment"
  subjectId: ObjectId("..."),
  academicYear: "2024-2025",
  semester: 1,
  examDate: ISODate("2024-03-10T00:00:00Z"),
  totalMarks: 100,
  passingMarks: 40,
  results: [
    {
      studentId: ObjectId("..."),
      rollNumber: "CS001",
      marksObtained: 85,
      grade: "A",
      status: "pass", // "pass" | "fail"
      remarks: "Excellent performance"
    }
  ],
  statistics: {
    totalStudents: 45,
    passedStudents: 38,
    failedStudents: 7,
    passPercentage: 84.4,
    averageMarks: 72.5,
    highestMarks: 95,
    lowestMarks: 25
  },
  publishedBy: ObjectId("..."), // Professor who published results
  publishedAt: ISODate("2024-03-12T14:30:00Z"),
  status: "published", // "draft" | "published" | "archived"
  createdAt: ISODate("2024-03-10T00:00:00Z"),
  updatedAt: ISODate("2024-03-12T14:30:00Z")
}
```

#### **Collection 7: `notices`**
```javascript
{
  _id: ObjectId("..."),
  title: "Mid-Term Examinations Schedule",
  content: "Mid-term examinations will be conducted from March 15-22, 2024...",
  category: "academic", // "academic" | "general" | "event" | "health"
  priority: "high", // "high" | "medium" | "low"
  targetAudience: ["all"], // ["all"] | ["students"] | ["professors"] | ["hod"]
  attachments: [
    {
      filename: "exam_schedule.pdf",
      url: "https://...",
      size: 1024000,
      type: "application/pdf"
    }
  ],
  author: {
    userId: ObjectId("..."),
    name: "Dr. John Smith",
    role: "hod"
  },
  publishDate: ISODate("2024-03-01T00:00:00Z"),
  expiryDate: ISODate("2024-03-22T23:59:59Z"),
  status: "published", // "draft" | "published" | "archived"
  views: 245,
  tags: ["examination", "schedule", "academic"],
  createdAt: ISODate("2024-03-01T08:00:00Z"),
  updatedAt: ISODate("2024-03-01T08:00:00Z")
}
```

#### **Collection 8: `colleges`**
```javascript
{
  _id: ObjectId("..."),
  code: "UNI001",
  name: "University of Technology",
  type: "university", // "university" | "college" | "institute"
  address: {
    street: "123 Education Street",
    city: "Academic City",
    state: "Education State",
    country: "India",
    zipCode: "12345"
  },
  contact: {
    phone: "+91-1234567890",
    email: "info@university.edu",
    website: "https://university.edu"
  },
  departments: [
    {
      name: "Computer Science",
      code: "CS",
      hodId: ObjectId("..."),
      establishedYear: 2010
    }
  ],
  academicYear: {
    current: "2024-2025",
    startDate: ISODate("2024-08-01T00:00:00Z"),
    endDate: ISODate("2025-06-30T23:59:59Z")
  },
  settings: {
    attendanceThreshold: 75,
    maxStudentsPerClass: 60,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workingHours: {
      start: "09:00",
      end: "17:00"
    }
  },
  status: "active",
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-03-15T10:30:00Z")
}
```

---

## 🏗️ **BACKEND API ARCHITECTURE**

### **Technology Stack:**
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT with bcrypt
- **Validation**: Joi or Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with Supertest
- **Deployment**: AWS/DigitalOcean with PM2

### **API Endpoints Structure:**

#### **Authentication & Authorization**
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/profile
PUT  /api/auth/profile
```

#### **HOD Dashboard APIs**
```
GET  /api/hod/dashboard/stats
GET  /api/hod/dashboard/overview
GET  /api/hod/students
GET  /api/hod/professors
```

#### **Professor Management APIs**
```
GET    /api/professors
POST   /api/professors
GET    /api/professors/:id
PUT    /api/professors/:id
DELETE /api/professors/:id
GET    /api/professors/:id/subjects
POST   /api/professors/:id/subjects
```

#### **Student Management APIs**
```
GET    /api/students
GET    /api/students/:id
GET    /api/students/:id/attendance
GET    /api/students/:id/results
```

#### **Attendance Management APIs**
```
GET    /api/attendance
POST   /api/attendance
GET    /api/attendance/students
GET    /api/attendance/professors
POST   /api/attendance/professors/mark
GET    /api/attendance/reports
```

#### **Exam Results APIs**
```
GET    /api/results
GET    /api/results/subjects
GET    /api/results/students/:id
GET    /api/results/statistics
```

#### **Notice Management APIs**
```
GET    /api/notices
POST   /api/notices
GET    /api/notices/:id
PUT    /api/notices/:id
DELETE /api/notices/:id
GET    /api/notices/categories
```

#### **Subject Management APIs**
```
GET    /api/subjects
POST   /api/subjects
GET    /api/subjects/:id
PUT    /api/subjects/:id
DELETE /api/subjects/:id
```

---

## 🔐 **SECURITY & AUTHENTICATION**

### **JWT Token Structure:**
```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "ObjectId",
    "email": "hod@university.edu",
    "role": "hod",
    "collegeId": "ObjectId",
    "permissions": ["read:professors", "write:professors", "read:students"],
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

### **Role-Based Access Control (RBAC):**
```javascript
const permissions = {
  hod: [
    "read:professors", "write:professors", "delete:professors",
    "read:students", "read:attendance", "write:attendance",
    "read:results", "write:notices", "read:notices",
    "read:dashboard", "read:reports"
  ],
  professor: [
    "read:students", "write:attendance", "read:attendance",
    "write:results", "read:results", "read:notices"
  ],
  student: [
    "read:attendance", "read:results", "read:notices",
    "read:profile", "write:profile"
  ]
}
```

---

## 📊 **DATA AGGREGATION & ANALYTICS**

### **Dashboard Statistics Aggregation:**
```javascript
// MongoDB Aggregation Pipeline for Dashboard Stats
db.users.aggregate([
  {
    $match: { 
      role: { $in: ["professor", "student"] },
      status: "active"
    }
  },
  {
    $group: {
      _id: "$role",
      count: { $sum: 1 }
    }
  }
])

// Attendance Statistics
db.attendance.aggregate([
  {
    $match: {
      date: { $gte: new Date("2024-03-01") }
    }
  },
  {
    $group: {
      _id: "$type",
      totalRecords: { $sum: 1 },
      averageAttendance: { $avg: "$attendancePercentage" }
    }
  }
])
```

### **Real-time Data Updates:**
- **WebSocket Integration**: For real-time attendance updates
- **MongoDB Change Streams**: For database change notifications
- **Redis Caching**: For frequently accessed dashboard data

---

## 🚀 **DEPLOYMENT & SCALING**

### **MongoDB Atlas Configuration:**
- **Cluster Tier**: M10 (2GB RAM, 10GB Storage) for development
- **Cluster Tier**: M30 (8GB RAM, 40GB Storage) for production
- **Backup**: Automated daily backups with point-in-time recovery
- **Security**: Network access restrictions, database user authentication
- **Monitoring**: Atlas monitoring and alerting

### **Indexing Strategy:**
```javascript
// Performance Indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1, "status": 1 })
db.attendance.createIndex({ "date": 1, "type": 1 })
db.attendance.createIndex({ "userId": 1, "date": 1 })
db.exam_results.createIndex({ "subjectId": 1, "examDate": 1 })
db.notices.createIndex({ "publishDate": -1, "status": 1 })
```

### **API Rate Limiting:**
```javascript
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP"
}
```

---

## 📈 **MONITORING & LOGGING**

### **Application Monitoring:**
- **Health Checks**: `/api/health` endpoint
- **Performance Metrics**: Response times, error rates
- **Database Monitoring**: Query performance, connection pools
- **User Activity**: Login attempts, API usage patterns

### **Logging Strategy:**
```javascript
const logLevels = {
  error: "Critical errors requiring immediate attention",
  warn: "Warning conditions that should be investigated",
  info: "General information about application flow",
  debug: "Detailed information for debugging"
}
```

---

## 🔄 **DATA MIGRATION & BACKUP**

### **Backup Strategy:**
- **Daily Automated Backups**: MongoDB Atlas automated backups
- **Weekly Full Database Export**: JSON/BSON format
- **Monthly Archive**: Long-term storage for compliance

### **Data Migration Plan:**
1. **Phase 1**: User authentication and basic profiles
2. **Phase 2**: Professor and student management
3. **Phase 3**: Attendance and results tracking
4. **Phase 4**: Notices and communication features

---

This comprehensive backend design provides a robust foundation for the HOD dashboard with MongoDB Atlas, ensuring scalability, security, and maintainability for the Smart Class Axis system.