const { User, Professor, Student, Subject, Notice, Attendance, ExamResult } = require('../models');

// Get HOD Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total professors
    const totalProfessors = await Professor.countDocuments({ status: 'active' });
    
    // Get total students
    const totalStudents = await Student.countDocuments({ status: 'active' });
    
    // Get total subjects
    const totalSubjects = await Subject.countDocuments({ status: 'active' });
    
    res.json({
      success: true,
      data: {
        totalProfessors,
        totalStudents,
        totalSubjects
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch dashboard statistics',
        details: error.message
      }
    });
  }
};

// Get HOD Dashboard Overview
const getDashboardOverview = async (req, res) => {
  try {
    // Get recent notices
    const recentNotices = await Notice.find({ status: 'published' })
      .sort({ publishDate: -1 })
      .limit(5)
      .select('title content publishDate author priority category');

    // Get all students with basic info
    const allStudents = await Student.find({ status: 'active' })
      .populate('userId', 'profile.fullName profile.avatar')
      .select('rollNumber academicInfo.currentYear academicInfo.specialization status')
      .limit(10);

    // Get all professors with basic info
    const allProfessors = await Professor.find({ status: 'active' })
      .populate('userId', 'profile.fullName profile.avatar')
      .select('employeeId subjects performance.rating status')
      .limit(10);

    // Format students data
    const studentsData = allStudents.map(student => ({
      id: student._id,
      name: student.userId.profile.fullName,
      course: student.academicInfo.specialization,
      year: student.academicInfo.currentYear,
      status: student.status,
      avatar: student.userId.profile.avatar || '',
      rollNo: student.rollNumber
    }));

    // Format professors data
    const professorsData = allProfessors.map(professor => ({
      id: professor._id,
      name: professor.userId.profile.fullName,
      subject: professor.subjects.length > 0 ? professor.subjects[0].subjectName : 'Not Assigned',
      status: professor.status,
      avatar: professor.userId.profile.avatar || '',
      rating: professor.performance.rating
    }));

    res.json({
      success: true,
      data: {
        recentNotices,
        allStudents: studentsData,
        allProfessors: professorsData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch dashboard overview',
        details: error.message
      }
    });
  }
};

// Get All Students for HOD Dashboard
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', year = '', status = 'active' } = req.query;
    
    // Build query
    const query = { status };
    
    if (year) {
      query['academicInfo.currentYear'] = parseInt(year);
    }

    // Get students with pagination
    const students = await Student.find(query)
      .populate('userId', 'profile.fullName profile.avatar profile.phone email')
      .select('rollNumber enrollmentNumber academicInfo subjects attendance status')
      .sort({ rollNumber: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Student.countDocuments(query);

    // Format response
    const studentsData = students.map(student => ({
      id: student._id,
      rollNumber: student.rollNumber,
      enrollmentNumber: student.enrollmentNumber,
      name: student.userId.profile.fullName,
      email: student.userId.email,
      phone: student.userId.profile.phone,
      avatar: student.userId.profile.avatar || '',
      year: student.academicInfo.currentYear,
      semester: student.academicInfo.semester,
      program: student.academicInfo.program,
      specialization: student.academicInfo.specialization,
      attendancePercentage: student.attendance.percentage,
      totalSubjects: student.subjects.length,
      status: student.status,
      joinDate: student.createdAt
    }));

    res.json({
      success: true,
      data: studentsData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch students',
        details: error.message
      }
    });
  }
};

// Get All Professors for HOD Dashboard
const getAllProfessors = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = 'active' } = req.query;
    
    // Build query
    const query = { status };

    // Get professors with pagination
    const professors = await Professor.find(query)
      .populate('userId', 'profile.fullName profile.avatar profile.phone email')
      .select('employeeId subjects experience qualifications performance status')
      .sort({ employeeId: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Professor.countDocuments(query);

    // Format response
    const professorsData = professors.map(professor => ({
      id: professor._id,
      employeeId: professor.employeeId,
      name: professor.userId.profile.fullName,
      email: professor.userId.email,
      phone: professor.userId.profile.phone,
      avatar: professor.userId.profile.avatar || '',
      subjects: professor.subjects.map(sub => ({
        name: sub.subjectName,
        code: sub.subjectCode,
        isPrimary: sub.isPrimary
      })),
      primarySubject: professor.subjects.find(sub => sub.isPrimary)?.subjectName || 'Not Assigned',
      experience: professor.experience.totalYears,
      qualifications: professor.qualifications,
      rating: professor.performance.rating,
      attendancePercentage: professor.performance.attendancePercentage,
      totalClasses: professor.performance.totalClasses,
      status: professor.status,
      joinDate: professor.createdAt
    }));

    res.json({
      success: true,
      data: professorsData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch professors',
        details: error.message
      }
    });
  }
};

// Get HOD Profile
const getHODProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'HOD not found'
        }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch HOD profile',
        details: error.message
      }
    });
  }
};

// Update HOD Profile
const updateHODProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profile, college } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        profile: { ...profile },
        college: { ...college }
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'HOD not found'
        }
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update HOD profile',
        details: error.message
      }
    });
  }
};

// Get Student Attendance for HOD (using same logic as professor)
const getStudentAttendanceForHOD = async (req, res) => {
  try {
    console.log('=== HOD CONTROLLER - getStudentAttendanceForHOD ===');
    console.log('Request params:', req.params);
    console.log('Request query:', req.query);
    
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    // Get all students with attendance data
    const students = await Student.find({ status: 'active' })
      .populate('userId', 'profile.fullName profile.avatar')
      .populate('subjects.subjectId', 'subjectName subjectCode')
      .populate('subjects.professorId', 'userId')
      .select('rollNumber userId subjects dailyAttendance')
      .skip(skip)
      .limit(parseInt(limit));
    
    console.log('Found students:', students.length);
    
    // Transform the data to match the expected format
    const studentsData = students.map(student => {
      const totalClasses = 100; // Fixed value as in professor section
      const attendedDays = student.dailyAttendance?.attendedDays || 0;
      const attendancePercentage = totalClasses > 0 ? (attendedDays / totalClasses) * 100 : 0;
      
      return {
        id: student._id.toString(),
        name: student.userId?.profile?.fullName || 'Unknown Student',
        rollNo: student.rollNumber || 'N/A',
        totalClasses: totalClasses,
        attended: attendedDays,
        percentage: Math.round(attendancePercentage * 10) / 10 // Round to 1 decimal place
      };
    });
    
    // Get total count for pagination
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const totalPages = Math.ceil(totalStudents / limit);
    
    console.log('Transformed students data:', studentsData.length);
    console.log('Total students:', totalStudents);
    console.log('Total pages:', totalPages);
    
    res.json({
      success: true,
      data: studentsData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalStudents,
        totalPages: totalPages
      }
    });
    
  } catch (error) {
    console.error('Error in getStudentAttendanceForHOD:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch student attendance data',
        details: error.message
      }
    });
  }
};

// Get Exam Results for HOD (reusing professor results logic)
const getExamResultsForHOD = async (req, res) => {
  try {
    console.log('=== HOD CONTROLLER - getExamResultsForHOD ===');
    console.log('Request params:', req.params);
    console.log('Request query:', req.query);
    
    const { 
      page = 1, 
      limit = 20, 
      subjectId = '', 
      examType = '', 
      academicYear = '', 
      semester = '',
      status = '',
      search = ''
    } = req.query;

    // Get all exam results (not filtered by professor)
    let query = { status: 'published' };
    
    // Apply filters
    if (subjectId) {
      query.subjectId = subjectId;
    }
    if (examType) {
      query.examType = examType;
    }
    if (academicYear) {
      query.academicYear = academicYear;
    }
    if (semester) {
      query.semester = semester;
    }
    if (search) {
      query.$or = [
        { examName: { $regex: search, $options: 'i' } },
        { 'results.rollNumber': { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Query:', query);

    // Get exam results with pagination
    const skip = (page - 1) * limit;
    const examResults = await ExamResult.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('publishedBy', 'profile.fullName')
      .sort({ examDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log('Found exam results:', examResults.length);

    // Transform the data to match the expected format
    const transformedResults = examResults.map(exam => ({
      id: exam._id.toString(),
      examId: exam.examId,
      examName: exam.examName,
      examType: exam.examType,
      subject: {
        id: exam.subjectId?._id?.toString() || '',
        name: exam.subjectId?.subjectName || 'Unknown Subject',
        code: exam.subjectId?.subjectCode || 'N/A',
        department: exam.subjectId?.department || 'General'
      },
      academicYear: exam.academicYear,
      semester: exam.semester,
      examDate: exam.examDate,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      publishedBy: exam.publishedBy?.profile?.fullName || 'Unknown Professor',
      publishedAt: exam.publishedAt,
      status: exam.status,
      results: exam.results.map(result => ({
        studentId: result.studentId,
        rollNumber: result.rollNumber,
        marksObtained: result.marksObtained,
        grade: result.grade,
        status: result.status,
        remarks: result.remarks,
        _id: result._id
      }))
    }));

    // Get total count for pagination
    const totalResults = await ExamResult.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    console.log('Transformed results:', transformedResults.length);
    console.log('Total results:', totalResults);
    console.log('Total pages:', totalPages);

    res.json({
      success: true,
      data: transformedResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalResults,
        totalPages: totalPages
      }
    });

  } catch (error) {
    console.error('Error in getExamResultsForHOD:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch exam results data',
        details: error.message
      }
    });
  }
};

module.exports = {
  getDashboardStats,
  getDashboardOverview,
  getAllStudents,
  getAllProfessors,
  getHODProfile,
  updateHODProfile,
  getStudentAttendanceForHOD,
  getExamResultsForHOD
};
