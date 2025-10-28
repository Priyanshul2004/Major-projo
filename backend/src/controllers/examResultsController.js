const { User, Professor, Student, ExamResult, Subject } = require('../models');
const mongoose = require('mongoose');

// Get Exam Results by Subject
const getExamResultsBySubject = async (req, res) => {
  try {
    const { examType = 'all', year = '', semester = '' } = req.query;
    
    // Build query for exam results
    const examQuery = {};
    
    if (examType !== 'all') {
      examQuery.examType = examType;
    }

    if (year) {
      examQuery.academicYear = year;
    }

    if (semester) {
      examQuery.semester = semester;
    }

    // Get all exam results with populated data
    const examResults = await ExamResult.find(examQuery)
      .populate('studentId', 'rollNumber')
      .populate('studentId', 'userId')
      .populate('subjectId', 'subjectName subjectCode')
      .populate('professorId', 'userId')
      .sort({ subjectId: 1, marksObtained: -1 });

    // Group results by subject
    const subjectResults = {};
    
    examResults.forEach(result => {
      const subjectName = result.subjectId.subjectName;
      
      if (!subjectResults[subjectName]) {
        subjectResults[subjectName] = {
          subject: subjectName,
          totalStudents: 0,
          passed: 0,
          failed: 0,
          passPercentage: 0,
          students: []
        };
      }

      // Add student to the subject
      subjectResults[subjectName].students.push({
        name: result.studentId.userId.profile.fullName,
        rollNo: result.studentId.rollNumber,
        marks: result.marksObtained,
        grade: result.grade,
        status: result.status
      });

      // Update counters
      subjectResults[subjectName].totalStudents++;
      if (result.status === 'Pass') {
        subjectResults[subjectName].passed++;
      } else {
        subjectResults[subjectName].failed++;
      }
    });

    // Calculate pass percentages and format response
    const formattedResults = Object.values(subjectResults).map(subject => {
      subject.passPercentage = subject.totalStudents > 0 
        ? Math.round((subject.passed / subject.totalStudents) * 100 * 10) / 10 
        : 0;
      
      // Sort students by marks (descending)
      subject.students.sort((a, b) => b.marks - a.marks);
      
      return subject;
    });

    // Sort subjects by pass percentage (descending)
    formattedResults.sort((a, b) => b.passPercentage - a.passPercentage);

    res.json({
      success: true,
      data: formattedResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch exam results by subject',
        details: error.message
      }
    });
  }
};

// Get Exam Results Summary
const getExamResultsSummary = async (req, res) => {
  try {
    const { examType = 'all', year = '', semester = '' } = req.query;
    
    // Build query
    const examQuery = {};
    
    if (examType !== 'all') {
      examQuery.examType = examType;
    }

    if (year) {
      examQuery.academicYear = year;
    }

    if (semester) {
      examQuery.semester = semester;
    }

    // Get aggregated statistics
    const stats = await ExamResult.aggregate([
      { $match: examQuery },
      {
        $group: {
          _id: null,
          totalStudents: { $addToSet: '$studentId' },
          totalExams: { $sum: 1 },
          totalPassed: {
            $sum: { $cond: [{ $eq: ['$status', 'Pass'] }, 1, 0] }
          },
          totalFailed: {
            $sum: { $cond: [{ $eq: ['$status', 'Fail'] }, 1, 0] }
          },
          averageMarks: { $avg: '$marksObtained' },
          highestMarks: { $max: '$marksObtained' },
          lowestMarks: { $min: '$marksObtained' }
        }
      },
      {
        $project: {
          totalStudents: { $size: '$totalStudents' },
          totalExams: 1,
          totalPassed: 1,
          totalFailed: 1,
          overallPassPercentage: {
            $round: [
              { $multiply: [{ $divide: ['$totalPassed', '$totalExams'] }, 100] },
              1
            ]
          },
          averageMarks: { $round: ['$averageMarks', 1] },
          highestMarks: 1,
          lowestMarks: 1
        }
      }
    ]);

    const summary = stats.length > 0 ? stats[0] : {
      totalStudents: 0,
      totalExams: 0,
      totalPassed: 0,
      totalFailed: 0,
      overallPassPercentage: 0,
      averageMarks: 0,
      highestMarks: 0,
      lowestMarks: 0
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch exam results summary',
        details: error.message
      }
    });
  }
};

// Get Student Performance by Subject
const getStudentPerformanceBySubject = async (req, res) => {
  try {
    const { studentId, examType = 'all' } = req.query;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Student ID is required'
        }
      });
    }

    // Build query
    const examQuery = { studentId: new mongoose.Types.ObjectId(studentId) };
    
    if (examType !== 'all') {
      examQuery.examType = examType;
    }

    // Get student's exam results
    const studentResults = await ExamResult.find(examQuery)
      .populate('subjectId', 'subjectName subjectCode')
      .populate('professorId', 'userId')
      .sort({ examDate: -1 });

    // Format response
    const performance = studentResults.map(result => ({
      id: result._id,
      subject: result.subjectId.subjectName,
      subjectCode: result.subjectId.subjectCode,
      examType: result.examType,
      examDate: result.examDate,
      marksObtained: result.marksObtained,
      totalMarks: result.totalMarks,
      grade: result.grade,
      status: result.status,
      professor: result.professorId.userId.profile.fullName
    }));

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch student performance',
        details: error.message
      }
    });
  }
};

// Get Top Performers
const getTopPerformers = async (req, res) => {
  try {
    const { limit = 10, examType = 'all', subject = '' } = req.query;
    
    // Build query
    const examQuery = {};
    
    if (examType !== 'all') {
      examQuery.examType = examType;
    }

    if (subject) {
      examQuery['subjectId.subjectName'] = { $regex: subject, $options: 'i' };
    }

    // Get top performers
    const topPerformers = await ExamResult.find(examQuery)
      .populate('studentId', 'rollNumber userId')
      .populate('subjectId', 'subjectName')
      .sort({ marksObtained: -1 })
      .limit(parseInt(limit));

    // Format response
    const performers = topPerformers.map(result => ({
      id: result._id,
      studentName: result.studentId.userId.profile.fullName,
      rollNo: result.studentId.rollNumber,
      subject: result.subjectId.subjectName,
      marks: result.marksObtained,
      totalMarks: result.totalMarks,
      grade: result.grade,
      examType: result.examType,
      examDate: result.examDate
    }));

    res.json({
      success: true,
      data: performers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch top performers',
        details: error.message
      }
    });
  }
};

// Get Subject-wise Statistics
const getSubjectWiseStatistics = async (req, res) => {
  try {
    const { examType = 'all', year = '' } = req.query;
    
    // Build query
    const examQuery = {};
    
    if (examType !== 'all') {
      examQuery.examType = examType;
    }

    if (year) {
      examQuery.academicYear = year;
    }

    // Get subject-wise statistics
    const subjectStats = await ExamResult.aggregate([
      { $match: examQuery },
      {
        $group: {
          _id: '$subjectId',
          totalStudents: { $addToSet: '$studentId' },
          totalExams: { $sum: 1 },
          passed: { $sum: { $cond: [{ $eq: ['$status', 'Pass'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'Fail'] }, 1, 0] } },
          averageMarks: { $avg: '$marksObtained' },
          highestMarks: { $max: '$marksObtained' },
          lowestMarks: { $min: '$marksObtained' }
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      {
        $unwind: '$subject'
      },
      {
        $project: {
          subjectName: '$subject.subjectName',
          subjectCode: '$subject.subjectCode',
          totalStudents: { $size: '$totalStudents' },
          totalExams: 1,
          passed: 1,
          failed: 1,
          passPercentage: {
            $round: [
              { $multiply: [{ $divide: ['$passed', '$totalExams'] }, 100] },
              1
            ]
          },
          averageMarks: { $round: ['$averageMarks', 1] },
          highestMarks: 1,
          lowestMarks: 1
        }
      },
      { $sort: { passPercentage: -1 } }
    ]);

    res.json({
      success: true,
      data: subjectStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch subject-wise statistics',
        details: error.message
      }
    });
  }
};

module.exports = {
  getExamResultsBySubject,
  getExamResultsSummary,
  getStudentPerformanceBySubject,
  getTopPerformers,
  getSubjectWiseStatistics
};
