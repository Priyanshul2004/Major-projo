const { User, Professor, Student, Subject, Material, Communication, Attendance, ExamResult } = require('../models');
const mongoose = require('mongoose');

// Dashboard functions
const getStudentDashboardStats = async (req, res) => {
  try {
    console.log('=== getStudentDashboardStats CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      // Return sample data if student not found
      return res.json({
        success: true,
        data: {
          totalAssignments: 0,
          pendingAssignments: 0,
          averageAttendance: 0,
          recentResults: 0
        }
      });
    }

    // Assignment stats (set to 0 since assignments are removed)
    const totalAssignments = 0;
    const pendingAssignments = 0;

    // Get attendance stats
    let totalAttendance = 0;
    let attendanceCount = 0;
    if (student.subjects && student.subjects.length > 0) {
      student.subjects.forEach(subject => {
        if (subject.attendance && subject.attendance.totalClasses > 0) {
          totalAttendance += subject.attendance.percentage;
          attendanceCount++;
        }
      });
    }
    const averageAttendance = attendanceCount > 0 ? totalAttendance / attendanceCount : 0;

    // Get recent results count
    const recentResults = await ExamResult.countDocuments({
      studentId: student._id,
      examDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    res.json({
      success: true,
      data: {
        totalAssignments,
        pendingAssignments,
        averageAttendance: Math.round(averageAttendance * 100) / 100,
        recentResults
      }
    });
  } catch (error) {
    console.error('Error in getStudentDashboardStats:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch dashboard stats',
        details: error.message
      }
    });
  }
};

const getStudentRecentActivity = async (req, res) => {
  try {
    console.log('=== getStudentRecentActivity CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      // Return sample data if student not found
      return res.json({
        success: true,
        data: [
          {
            id: 'act1',
            type: 'assignment',
            title: 'Math Assignment Submitted',
            description: 'You submitted your math assignment',
            timestamp: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: 'act2',
            type: 'result',
            title: 'Physics Quiz Result',
            description: 'You scored 85% in Physics quiz',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed'
          }
        ]
      });
    }

    // Get recent activities (results, communications) - assignments removed
    const recentAssignments = [];

    const recentResults = await ExamResult.find({
      studentId: student._id
    })
    .populate('subjectId', 'subjectName')
    .sort({ examDate: -1 })
    .limit(5);

    const recentCommunications = await Communication.find({
      studentId: student._id
    })
    .populate('subjectId', 'subjectName')
    .sort({ createdAt: -1 })
    .limit(5);

    // Format activities
    const activities = [];
    
    recentAssignments.forEach(assignment => {
      activities.push({
        id: assignment._id,
        type: 'assignment',
        title: `${assignment.title} - ${assignment.subjectId.subjectName}`,
        description: `Due: ${assignment.dueDate.toDateString()}`,
        timestamp: assignment.createdAt,
        status: assignment.submissions.some(sub => sub.studentId.toString() === student._id.toString()) ? 'completed' : 'pending'
      });
    });

    recentResults.forEach(result => {
      activities.push({
        id: result._id,
        type: 'result',
        title: `${result.examType} - ${result.subjectId.subjectName}`,
        description: `Score: ${result.marksObtained}/${result.totalMarks}`,
        timestamp: result.examDate,
        status: 'completed'
      });
    });

    recentCommunications.forEach(comm => {
      activities.push({
        id: comm._id,
        type: 'communication',
        title: comm.subject,
        description: comm.message.substring(0, 100) + '...',
        timestamp: comm.createdAt,
        status: comm.status
      });
    });

    // Sort by timestamp and limit to 10
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    activities.splice(10);

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error in getStudentRecentActivity:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch recent activity',
        details: error.message
      }
    });
  }
};

// Assignment functions
const getMyAssignments = async (req, res) => {
  try {
    console.log('=== getMyAssignments CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { page = 1, limit = 20, search = '', status = '', subject = '' } = req.query;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      // Return empty data if student not found
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      });
    }

    // Build query for assignments
    const assignmentQuery = {
      'assignedTo.studentId': student._id
    };

    // Filter by status
    if (status === 'pending') {
      assignmentQuery['submissions.studentId'] = { $ne: student._id };
    } else if (status === 'submitted') {
      assignmentQuery['submissions.studentId'] = student._id;
    }

    // Search by title or description
    if (search) {
      assignmentQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by subject
    if (subject) {
      assignmentQuery.subjectId = new mongoose.Types.ObjectId(subject);
    }

    // Get assignments
    const assignments = await Assignment.find(assignmentQuery)
      .populate('subjectId', 'subjectName subjectCode')
      .populate('createdBy', 'profile.fullName')
      .select('title description dueDate totalMarks assignedTo submissions')
      .sort({ dueDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Assignment.countDocuments(assignmentQuery);

    // Format response
    const assignmentsData = assignments.map(assignment => {
      const submission = assignment.submissions.find(sub => sub.studentId.toString() === student._id.toString());
      const isSubmitted = !!submission;
      
      return {
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subjectId.subjectName,
        subjectCode: assignment.subjectId.subjectCode,
        dueDate: assignment.dueDate,
        totalMarks: assignment.totalMarks,
        status: isSubmitted ? 'submitted' : 'pending',
        submittedDate: submission?.submittedDate || null,
        marksObtained: submission?.marksObtained || null,
        createdBy: assignment.createdBy.profile.fullName
      };
    });

    res.json({
      success: true,
      data: assignmentsData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getMyAssignments:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch assignments',
        details: error.message
      }
    });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    console.log('=== getAssignmentById CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { assignmentId } = req.params;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { message: 'Student not found' }
      });
    }

    // Get assignment
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      'assignedTo.studentId': student._id
    })
    .populate('subjectId', 'subjectName subjectCode')
    .populate('createdBy', 'profile.fullName');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Assignment not found' }
      });
    }

    const submission = assignment.submissions.find(sub => sub.studentId.toString() === student._id.toString());
    const isSubmitted = !!submission;

    res.json({
      success: true,
      data: {
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subjectId.subjectName,
        subjectCode: assignment.subjectId.subjectCode,
        dueDate: assignment.dueDate,
        totalMarks: assignment.totalMarks,
        status: isSubmitted ? 'submitted' : 'pending',
        submittedDate: submission?.submittedDate || null,
        marksObtained: submission?.marksObtained || null,
        feedback: submission?.feedback || null,
        createdBy: assignment.createdBy.profile.fullName,
        createdAt: assignment.createdAt
      }
    });
  } catch (error) {
    console.error('Error in getAssignmentById:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch assignment',
        details: error.message
      }
    });
  }
};

const submitAssignment = async (req, res) => {
  try {
    console.log('=== submitAssignment CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { assignmentId } = req.params;
    const { submissionText, fileUrl } = req.body;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { message: 'Student not found' }
      });
    }

    // Get assignment
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      'assignedTo.studentId': student._id
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Assignment not found' }
      });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(sub => sub.studentId.toString() === student._id.toString());
    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        error: { message: 'Assignment already submitted' }
      });
    }

    // Add submission
    assignment.submissions.push({
      studentId: student._id,
      submissionText: submissionText || '',
      fileUrl: fileUrl || '',
      submittedDate: new Date(),
      status: 'submitted'
    });

    await assignment.save();

    res.json({
      success: true,
      data: {
        id: assignment._id,
        status: 'submitted',
        submittedDate: new Date()
      },
      message: 'Assignment submitted successfully'
    });
  } catch (error) {
    console.error('Error in submitAssignment:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to submit assignment',
        details: error.message
      }
    });
  }
};

const getAssignmentStats = async (req, res) => {
  try {
    console.log('=== getAssignmentStats CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      // Return sample data if student not found
      return res.json({
        success: true,
        data: {
          totalAssignments: 0,
          submittedAssignments: 0,
          pendingAssignments: 0,
          averageMarks: 0
        }
      });
    }

    // Get assignment stats
    const totalAssignments = await Assignment.countDocuments({
      'assignedTo.studentId': student._id
    });
    
    const submittedAssignments = await Assignment.countDocuments({
      'assignedTo.studentId': student._id,
      'submissions.studentId': student._id
    });

    const pendingAssignments = totalAssignments - submittedAssignments;

    // Get average marks
    const assignmentsWithMarks = await Assignment.find({
      'assignedTo.studentId': student._id,
      'submissions.studentId': student._id,
      'submissions.marksObtained': { $exists: true, $ne: null }
    });

    let totalMarks = 0;
    let marksCount = 0;
    assignmentsWithMarks.forEach(assignment => {
      const submission = assignment.submissions.find(sub => sub.studentId.toString() === student._id.toString());
      if (submission && submission.marksObtained !== null) {
        totalMarks += submission.marksObtained;
        marksCount++;
      }
    });

    const averageMarks = marksCount > 0 ? totalMarks / marksCount : 0;

    res.json({
      success: true,
      data: {
        totalAssignments,
        submittedAssignments,
        pendingAssignments,
        averageMarks: Math.round(averageMarks * 100) / 100
      }
    });
  } catch (error) {
    console.error('Error in getAssignmentStats:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch assignment stats',
        details: error.message
      }
    });
  }
};

// Import additional functions from the second file
const {
  getMyAttendance,
  getAttendanceSummary,
  getAttendanceBySubject,
  getMyMaterials,
  getMaterialById,
  downloadMaterial
} = require('./studentDashboardController2');

// Results functions
const getMyResults = async (req, res) => {
  try {
    console.log('=== getMyResults CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { page = 1, limit = 20, search = '', subject = '', examType = '' } = req.query;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      // Return empty data if student not found
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      });
    }

    console.log('Student found:', student.rollNumber);

    // Build query for exam results that contain this student
    const resultQuery = {
      'results.studentId': student._id
    };

    // Filter by exam type
    if (examType) {
      resultQuery.examType = examType;
    }

    // Filter by subject
    if (subject) {
      resultQuery.subjectId = new mongoose.Types.ObjectId(subject);
    }

    // Search by exam name
    if (search) {
      resultQuery.examName = { $regex: search, $options: 'i' };
    }

    // Get exam results that contain this student
    const examResults = await ExamResult.find(resultQuery)
      .populate('subjectId', 'subjectName subjectCode')
      .select('examId examName examType subjectId academicYear semester examDate totalMarks passingMarks results')
      .sort({ examDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await ExamResult.countDocuments(resultQuery);

    // Format response - group results by subject
    const subjectResultsMap = new Map();
    
    for (const exam of examResults) {
      // Find this student's result in this exam
      const studentResult = exam.results.find(result => 
        result.studentId.toString() === student._id.toString()
      );
      
      if (studentResult) {
        const subjectKey = exam.subjectId._id.toString();
        
        if (!subjectResultsMap.has(subjectKey)) {
          subjectResultsMap.set(subjectKey, {
            id: exam.subjectId._id,
            subject: exam.subjectId.subjectName,
            subjectCode: exam.subjectId.subjectCode,
            exams: [],
            midTerm: null,
            finalExam: null,
            quiz: null,
            total: 0,
            grade: 'F',
            status: 'Fail',
            examCount: 0
          });
        }
        
        const subjectResult = subjectResultsMap.get(subjectKey);
        
        // Add exam details
        subjectResult.exams.push({
          id: exam._id,
          examName: exam.examName,
          examType: exam.examType,
          examDate: exam.examDate,
          marksObtained: studentResult.marksObtained,
          totalMarks: exam.totalMarks,
          grade: studentResult.grade,
          status: studentResult.status
        });
        
        // Assign marks based on exam type
        if (exam.examType === 'midterm') {
          subjectResult.midTerm = studentResult.marksObtained;
        } else if (exam.examType === 'final') {
          subjectResult.finalExam = studentResult.marksObtained;
        } else if (exam.examType === 'quiz') {
          subjectResult.quiz = studentResult.marksObtained;
        }
        
        subjectResult.examCount++;
        
        // Calculate total average (only if we have both midterm and final)
        if (subjectResult.midTerm !== null && subjectResult.finalExam !== null) {
          subjectResult.total = Math.round((subjectResult.midTerm + subjectResult.finalExam) / 2);
          
          // Determine overall grade and status
          if (subjectResult.total >= 90) {
            subjectResult.grade = 'A+';
          } else if (subjectResult.total >= 80) {
            subjectResult.grade = 'A';
          } else if (subjectResult.total >= 70) {
            subjectResult.grade = 'B+';
          } else if (subjectResult.total >= 60) {
            subjectResult.grade = 'B';
          } else if (subjectResult.total >= 50) {
            subjectResult.grade = 'C';
          } else if (subjectResult.total >= 40) {
            subjectResult.grade = 'D';
          } else {
            subjectResult.grade = 'F';
          }
          
          subjectResult.status = subjectResult.total >= 50 ? 'Pass' : 'Fail';
        }
      }
    }

    const resultsData = Array.from(subjectResultsMap.values());

    res.json({
      success: true,
      data: resultsData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: resultsData.length,
        totalPages: Math.ceil(resultsData.length / limit)
      }
    });
  } catch (error) {
    console.error('Error in getMyResults:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch results',
        details: error.message
      }
    });
  }
};

const getResultById = async (req, res) => {
  try {
    console.log('=== getResultById CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { resultId } = req.params;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { message: 'Student not found' }
      });
    }

    // Get result
    const result = await ExamResult.findOne({
      _id: resultId,
      studentId: student._id
    })
    .populate('subjectId', 'subjectName subjectCode');

    if (!result) {
      return res.status(404).json({
        success: false,
        error: { message: 'Result not found' }
      });
    }

    res.json({
      success: true,
      data: {
        id: result._id,
        examName: result.examName,
        examType: result.examType,
        examDate: result.examDate,
        marksObtained: result.marksObtained,
        totalMarks: result.totalMarks,
        grade: result.grade,
        subject: result.subjectId.subjectName,
        subjectCode: result.subjectId.subjectCode,
        percentage: result.totalMarks > 0 ? Math.round((result.marksObtained / result.totalMarks) * 100) : 0,
        remarks: result.remarks || ''
      }
    });
  } catch (error) {
    console.error('Error in getResultById:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch result',
        details: error.message
      }
    });
  }
};

const getPerformanceSummary = async (req, res) => {
  try {
    console.log('=== getPerformanceSummary CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      // Return sample data if student not found
      return res.json({
        success: true,
        data: {
          totalExams: 0,
          averagePercentage: 0,
          highestMarks: 0,
          subjects: []
        }
      });
    }

    // Get all results
    const results = await ExamResult.find({ studentId: student._id })
      .populate('subjectId', 'subjectName subjectCode');

    // Calculate summary
    const totalExams = results.length;
    let totalMarks = 0;
    let totalMaxMarks = 0;
    let highestMarks = 0;
    const subjectMap = new Map();

    results.forEach(result => {
      const percentage = result.totalMarks > 0 ? (result.marksObtained / result.totalMarks) * 100 : 0;
      totalMarks += result.marksObtained;
      totalMaxMarks += result.totalMarks;
      highestMarks = Math.max(highestMarks, result.marksObtained);

      const subjectId = result.subjectId._id.toString();
      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, {
          id: result.subjectId._id,
          name: result.subjectId.subjectName,
          code: result.subjectId.subjectCode,
          exams: 0,
          totalMarks: 0,
          totalMaxMarks: 0,
          averagePercentage: 0
        });
      }
      
      const subject = subjectMap.get(subjectId);
      subject.exams++;
      subject.totalMarks += result.marksObtained;
      subject.totalMaxMarks += result.totalMarks;
    });

    const averagePercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

    // Calculate subject averages
    const subjects = Array.from(subjectMap.values()).map(subject => ({
      ...subject,
      averagePercentage: subject.totalMaxMarks > 0 ? Math.round((subject.totalMarks / subject.totalMaxMarks) * 100) : 0
    }));

    res.json({
      success: true,
      data: {
        totalExams,
        averagePercentage: Math.round(averagePercentage * 100) / 100,
        highestMarks,
        subjects
      }
    });
  } catch (error) {
    console.error('Error in getPerformanceSummary:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch performance summary',
        details: error.message
      }
    });
  }
};

// Communication functions
const getMyCommunications = async (req, res) => {
  try {
    console.log('=== getMyCommunications CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { page = 1, limit = 20, search = '', subject = '', status = '' } = req.query;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      // Return empty data if student not found
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      });
    }

    // Build query for communications
    const communicationQuery = {
      studentId: student._id
    };

    // Filter by status
    if (status) {
      communicationQuery.status = status;
    }

    // Filter by subject
    if (subject) {
      communicationQuery.subject = { $regex: subject, $options: 'i' };
    }

    // Search by subject or question
    if (search) {
      communicationQuery.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { question: { $regex: search, $options: 'i' } }
      ];
    }

    // Get communications
    const communications = await Communication.find(communicationQuery)
      .select('subject question status priority askedDate reply')
      .sort({ askedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Communication.countDocuments(communicationQuery);

    // Format response
    const communicationsData = communications.map(comm => ({
      id: comm._id,
      subject: comm.subject,
      question: comm.question,
      status: comm.status,
      priority: comm.priority,
      askedDate: comm.askedDate,
      reply: comm.reply || null
    }));

    res.json({
      success: true,
      data: communicationsData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getMyCommunications:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch communications',
        details: error.message
      }
    });
  }
};

const askDoubt = async (req, res) => {
  try {
    console.log('=== askDoubt CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { subject, message, subjectId } = req.body;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId })
      .populate('userId', 'profile.fullName');
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { message: 'Student not found' }
      });
    }

    // Create communication
    const communication = new Communication({
      studentId: student._id,
      studentName: student.userId.profile.fullName || 'Unknown Student',
      rollNumber: student.rollNumber || 'N/A',
      subject: subject || 'General Doubt',
      question: message || '',
      status: 'pending',
      priority: 'medium'
    });

    await communication.save();

    res.json({
      success: true,
      data: {
        id: communication._id,
        subject: communication.subject,
        question: communication.question,
        status: communication.status,
        priority: communication.priority,
        askedDate: communication.askedDate
      },
      message: 'Doubt submitted successfully'
    });
  } catch (error) {
    console.error('Error in askDoubt:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to submit doubt',
        details: error.message
      }
    });
  }
};

const getCommunicationById = async (req, res) => {
  try {
    console.log('=== getCommunicationById CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { communicationId } = req.params;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { message: 'Student not found' }
      });
    }

    // Get communication
    const communication = await Communication.findOne({
      _id: communicationId,
      studentId: student._id
    })
    .populate('subjectId', 'subjectName subjectCode')
    .populate('professorId', 'userId')
    .populate('professorId.userId', 'profile.fullName');

    if (!communication) {
      return res.status(404).json({
        success: false,
        error: { message: 'Communication not found' }
      });
    }

    res.json({
      success: true,
      data: {
        id: communication._id,
        subject: communication.subject,
        message: communication.message,
        status: communication.status,
        subjectName: communication.subjectId?.subjectName || 'General',
        subjectCode: communication.subjectId?.subjectCode || '',
        professor: communication.professorId?.userId?.profile?.fullName || 'Unknown',
        response: communication.response || '',
        createdAt: communication.createdAt,
        updatedAt: communication.updatedAt
      }
    });
  } catch (error) {
    console.error('Error in getCommunicationById:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch communication',
        details: error.message
      }
    });
  }
};

const getCommunicationStats = async (req, res) => {
  try {
    console.log('=== getCommunicationStats CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      // Return sample data if student not found
      return res.json({
        success: true,
        data: {
          totalCommunications: 0,
          pendingCommunications: 0,
          resolvedCommunications: 0,
          averageResponseTime: 0
        }
      });
    }

    // Get communication stats
    const totalCommunications = await Communication.countDocuments({
      studentId: student._id
    });
    
    const pendingCommunications = await Communication.countDocuments({
      studentId: student._id,
      status: 'pending'
    });

    const resolvedCommunications = await Communication.countDocuments({
      studentId: student._id,
      status: 'resolved'
    });

    res.json({
      success: true,
      data: {
        totalCommunications,
        pendingCommunications,
        resolvedCommunications,
        averageResponseTime: 0 // Would need to calculate based on response times
      }
    });
  } catch (error) {
    console.error('Error in getCommunicationStats:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch communication stats',
        details: error.message
      }
    });
  }
};

module.exports = {
  getStudentDashboardStats,
  getStudentRecentActivity,
  getMyAttendance,
  getAttendanceSummary,
  getAttendanceBySubject,
  getMyMaterials,
  getMaterialById,
  downloadMaterial,
  getMyResults,
  getResultById,
  getPerformanceSummary,
  getMyCommunications,
  askDoubt,
  getCommunicationById,
  getCommunicationStats
};
