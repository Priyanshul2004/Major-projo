# Smart Class Axis - Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/smart-class-axis
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── README.md               # This file
├── src/
│   ├── config/
│   │   └── database.js     # Database connection
│   ├── controllers/
│   │   └── hodController.js # HOD dashboard logic
│   ├── models/
│   │   ├── User.js         # User model
│   │   ├── Professor.js    # Professor model
│   │   ├── Student.js      # Student model
│   │   ├── Subject.js      # Subject model
│   │   ├── Attendance.js   # Attendance model
│   │   ├── ExamResult.js   # Exam results model
│   │   ├── Notice.js       # Notice model
│   │   ├── Assignment.js   # Assignment model
│   │   ├── Material.js     # Study material model
│   │   ├── Communication.js # Communication model
│   │   ├── College.js      # College model
│   │   └── index.js        # Models export
│   └── routes/
│       ├── hodRoutes.js    # HOD dashboard routes
│       └── index.js        # Main routes
└── public/
    └── uploads/            # File upload directory
```

## 🔗 API Endpoints

### HOD Dashboard APIs

#### Dashboard Statistics
- `GET /api/hod/dashboard/stats` - Get dashboard statistics
- `GET /api/hod/dashboard/overview` - Get dashboard overview data

#### Student Management
- `GET /api/hod/students` - Get all students (with pagination)

#### Professor Management
- `GET /api/hod/professors` - Get all professors (with pagination)

#### Profile Management
- `GET /api/hod/profile/:userId` - Get HOD profile
- `PUT /api/hod/profile/:userId` - Update HOD profile

#### System
- `GET /api/health` - Health check

## 📊 Database Models

### Core Models
- **User**: Central user management (HOD, Professor, Student)
- **Professor**: Professor-specific data and academic information
- **Student**: Student academic information and enrollment data
- **Subject**: Course/subject management and scheduling

### Academic Models
- **Attendance**: Attendance tracking for professors and students
- **ExamResult**: Exam results and academic performance
- **Assignment**: Assignment creation, submission, and grading
- **Material**: Study materials and resource management

### Communication Models
- **Notice**: Notice and announcement management
- **Communication**: Student-professor communication
- **College**: Institutional information and settings

## 🔧 Features

### HOD Dashboard Features
- **Statistics Overview**: Total professors, students, and subjects
- **Student Management**: View all students with academic details
- **Professor Management**: View all professors with performance data
- **Profile Management**: Update HOD profile information

### Data Features
- **Pagination**: All list endpoints support pagination
- **Filtering**: Support for status, year, and search filters
- **Relationships**: Proper model relationships with population
- **Indexing**: Optimized database indexes for performance

## 🛠️ Development

### Adding New Routes
1. Create controller in `src/controllers/`
2. Create routes in `src/routes/`
3. Import and use in `src/routes/index.js`

### Database Operations
- All models are in `src/models/`
- Use Mongoose for database operations
- Follow the established patterns for consistency

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for development

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": "Detailed error information"
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 🚀 Deployment

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### Production Considerations
- Use MongoDB Atlas for production
- Set up proper CORS configuration
- Implement rate limiting
- Add logging and monitoring

## 📞 Support

For questions or issues, please refer to the main project documentation or contact the development team.
