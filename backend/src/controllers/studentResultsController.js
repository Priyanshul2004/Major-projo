const { ExamResult, Student, Professor, Subject } = require('../models');
const mongoose = require('mongoose');

// Get student's exam results
const getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { 
      subjectId = '', 
      examType = '', 
      academicYear = '', 
      semester = '',
      page = 1, 
      limit = 20 
    } = req.query;

    // Get student and their subjects
    const student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName subjectCode');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const studentSubjects = student.subjects.map(sub => sub.subjectId._id);

    // Build query
    const query = {
      subjectId: { $in: studentSubjects },
      status: 'published',
      'results.studentId': new mongoose.Types.ObjectId(studentId)
    };

    if (subjectId) {
      query.subjectId = new mongoose.Types.ObjectId(subjectId);
    }

    if (examType) {
      query.examType = examType;
    }

    if (academicYear) {
      query.academicYear = academicYear;
    }

    if (semester) {
      query.semester = parseInt(semester);
    }

    // Get exam results with pagination
    const examResults = await ExamResult.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('publishedBy', 'profile.fullName')
      .select('examId examName examType subjectId academicYear semester examDate totalMarks passingMarks results publishedAt')
      .sort({ examDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await ExamResult.countDocuments(query);

    // Format response
    const resultsData = examResults.map(exam => {
      const studentResult = exam.results.find(
        result => result.studentId.toString() === studentId
      );

      return {
        id: exam._id,
        examId: exam.examId,
        examName: exam.examName,
        examType: exam.examType,
        subject: {
          id: exam.subjectId._id,
          name: exam.subjectId.subjectName,
          code: exam.subjectId.subjectCode,
          department: exam.subjectId.department
        },
        academicYear: exam.academicYear,
        semester: exam.semester,
        examDate: exam.examDate,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        result: studentResult ? {
          marksObtained: studentResult.marksObtained,
          grade: studentResult.grade,
          status: studentResult.status,
          remarks: studentResult.remarks
        } : null,
        publishedAt: exam.publishedAt
      };
    });

    res.json({
      success: true,
      data: resultsData,
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
        message: 'Failed to fetch exam results',
        details: error.message
      }
    });
  }
};

// Get student's results by subject
const getStudentResultsBySubject = async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;
    const { 
      examType = '', 
      academicYear = '', 
      semester = '',
      page = 1, 
      limit = 20 
    } = req.query;

    // Verify student is enrolled in this subject
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const isEnrolled = student.subjects.some(
      sub => sub.subjectId.toString() === subjectId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Student is not enrolled in this subject'
        }
      });
    }

    // Build query
    const query = {
      subjectId: new mongoose.Types.ObjectId(subjectId),
      status: 'published',
      'results.studentId': new mongoose.Types.ObjectId(studentId)
    };

    if (examType) {
      query.examType = examType;
    }

    if (academicYear) {
      query.academicYear = academicYear;
    }

    if (semester) {
      query.semester = parseInt(semester);
    }

    // Get exam results
    const examResults = await ExamResult.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('publishedBy', 'profile.fullName')
      .select('examId examName examType subjectId academicYear semester examDate totalMarks passingMarks results publishedAt')
      .sort({ examDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await ExamResult.countDocuments(query);

    // Format response
    const resultsData = examResults.map(exam => {
      const studentResult = exam.results.find(
        result => result.studentId.toString() === studentId
      );

      return {
        id: exam._id,
        examId: exam.examId,
        examName: exam.examName,
        examType: exam.examType,
        subject: {
          id: exam.subjectId._id,
          name: exam.subjectId.subjectName,
          code: exam.subjectId.subjectCode,
          department: exam.subjectId.department
        },
        academicYear: exam.academicYear,
        semester: exam.semester,
        examDate: exam.examDate,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        result: studentResult ? {
          marksObtained: studentResult.marksObtained,
          grade: studentResult.grade,
          status: studentResult.status,
          remarks: studentResult.remarks
        } : null,
        publishedAt: exam.publishedAt
      };
    });

    res.json({
      success: true,
      data: resultsData,
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
        message: 'Failed to fetch results by subject',
        details: error.message
      }
    });
  }
};

// Get single exam result
const getExamResultById = async (req, res) => {
  try {
    const { examResultId, studentId } = req.params;

    // Get student and their subjects
    const student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName subjectCode');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const studentSubjects = student.subjects.map(sub => sub.subjectId._id);

    const examResult = await ExamResult.findById(examResultId)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('publishedBy', 'profile.fullName');

    if (!examResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Exam result not found'
        }
      });
    }

    // Check if student has access to this result
    if (!studentSubjects.includes(examResult.subjectId._id)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'You do not have access to this exam result'
        }
      });
    }

    const studentResult = examResult.results.find(
      result => result.studentId.toString() === studentId
    );

    if (!studentResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Your result for this exam is not available'
        }
      });
    }

    const resultData = {
      id: examResult._id,
      examId: examResult.examId,
      examName: examResult.examName,
      examType: examResult.examType,
      subject: {
        id: examResult.subjectId._id,
        name: examResult.subjectId.subjectName,
        code: examResult.subjectId.subjectCode,
        department: examResult.subjectId.department
      },
      academicYear: examResult.academicYear,
      semester: examResult.semester,
      examDate: examResult.examDate,
      totalMarks: examResult.totalMarks,
      passingMarks: examResult.passingMarks,
      result: {
        marksObtained: studentResult.marksObtained,
        grade: studentResult.grade,
        status: studentResult.status,
        remarks: studentResult.remarks
      },
      publishedAt: examResult.publishedAt,
      publishedBy: {
        id: examResult.publishedBy._id,
        name: examResult.publishedBy.profile.fullName
      }
    };

    res.json({
      success: true,
      data: resultData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch exam result',
        details: error.message
      }
    });
  }
};

// Get student's performance summary
const getStudentPerformanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName subjectCode');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const studentSubjects = student.subjects.map(sub => sub.subjectId._id);

    // Get performance summary
    const performanceSummary = await ExamResult.aggregate([
      {
        $match: {
          subjectId: { $in: studentSubjects },
          status: 'published',
          'results.studentId': new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $unwind: '$results'
      },
      {
        $match: {
          'results.studentId': new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $group: {
          _id: null,
          totalExams: { $sum: 1 },
          totalMarks: { $sum: '$totalMarks' },
          obtainedMarks: { $sum: '$results.marksObtained' },
          passedExams: {
            $sum: {
              $cond: [{ $eq: ['$results.status', 'pass'] }, 1, 0]
            }
          },
          failedExams: {
            $sum: {
              $cond: [{ $eq: ['$results.status', 'fail'] }, 1, 0]
            }
          },
          averageMarks: { $avg: '$results.marksObtained' },
          highestMarks: { $max: '$results.marksObtained' },
          lowestMarks: { $min: '$results.marksObtained' }
        }
      }
    ]);

    // Get performance by subject
    const performanceBySubject = await ExamResult.aggregate([
      {
        $match: {
          subjectId: { $in: studentSubjects },
          status: 'published',
          'results.studentId': new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $unwind: '$results'
      },
      {
        $match: {
          'results.studentId': new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $group: {
          _id: '$subjectId',
          totalExams: { $sum: 1 },
          totalMarks: { $sum: '$totalMarks' },
          obtainedMarks: { $sum: '$results.marksObtained' },
          passedExams: {
            $sum: {
              $cond: [{ $eq: ['$results.status', 'pass'] }, 1, 0]
            }
          },
          averageMarks: { $avg: '$results.marksObtained' },
          highestMarks: { $max: '$results.marksObtained' },
          lowestMarks: { $min: '$results.marksObtained' }
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
          subject: {
            id: '$subject._id',
            name: '$subject.subjectName',
            code: '$subject.subjectCode',
            department: '$subject.department'
          },
          totalExams: 1,
          totalMarks: 1,
          obtainedMarks: 1,
          passedExams: 1,
          averageMarks: { $round: ['$averageMarks', 2] },
          highestMarks: 1,
          lowestMarks: 1,
          passPercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$passedExams', '$totalExams'] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      {
        $sort: { 'subject.name': 1 }
      }
    ]);

    // Get recent results
    const recentResults = await ExamResult.find({
      subjectId: { $in: studentSubjects },
      status: 'published',
      'results.studentId': new mongoose.Types.ObjectId(studentId)
    })
      .populate('subjectId', 'subjectName subjectCode')
      .select('examId examName examType subjectId examDate totalMarks results publishedAt')
      .sort({ examDate: -1 })
      .limit(5);

    const recentResultsData = recentResults.map(exam => {
      const studentResult = exam.results.find(
        result => result.studentId.toString() === studentId
      );

      return {
        id: exam._id,
        examId: exam.examId,
        examName: exam.examName,
        examType: exam.examType,
        subject: {
          id: exam.subjectId._id,
          name: exam.subjectId.subjectName,
          code: exam.subjectId.subjectCode
        },
        examDate: exam.examDate,
        totalMarks: exam.totalMarks,
        result: studentResult ? {
          marksObtained: studentResult.marksObtained,
          grade: studentResult.grade,
          status: studentResult.status
        } : null,
        publishedAt: exam.publishedAt
      };
    });

    const summary = performanceSummary[0] ? {
      totalExams: performanceSummary[0].totalExams,
      totalMarks: performanceSummary[0].totalMarks,
      obtainedMarks: performanceSummary[0].obtainedMarks,
      passedExams: performanceSummary[0].passedExams,
      failedExams: performanceSummary[0].failedExams,
      averageMarks: Math.round(performanceSummary[0].averageMarks * 100) / 100,
      highestMarks: performanceSummary[0].highestMarks,
      lowestMarks: performanceSummary[0].lowestMarks,
      overallPercentage: performanceSummary[0].totalMarks > 0 ? 
        Math.round((performanceSummary[0].obtainedMarks / performanceSummary[0].totalMarks) * 100 * 100) / 100 : 0,
      passPercentage: performanceSummary[0].totalExams > 0 ? 
        Math.round((performanceSummary[0].passedExams / performanceSummary[0].totalExams) * 100 * 100) / 100 : 0
    } : {
      totalExams: 0,
      totalMarks: 0,
      obtainedMarks: 0,
      passedExams: 0,
      failedExams: 0,
      averageMarks: 0,
      highestMarks: 0,
      lowestMarks: 0,
      overallPercentage: 0,
      passPercentage: 0
    };

    res.json({
      success: true,
      data: {
        overall: summary,
        bySubject: performanceBySubject,
        recentResults: recentResultsData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch performance summary',
        details: error.message
      }
    });
  }
};

// Get results by exam type
const getResultsByExamType = async (req, res) => {
  try {
    const { studentId, examType } = req.params;
    const { 
      subjectId = '', 
      academicYear = '', 
      semester = '',
      page = 1, 
      limit = 20 
    } = req.query;

    // Get student and their subjects
    const student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName subjectCode');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const studentSubjects = student.subjects.map(sub => sub.subjectId._id);

    // Build query
    const query = {
      subjectId: { $in: studentSubjects },
      examType: examType,
      status: 'published',
      'results.studentId': new mongoose.Types.ObjectId(studentId)
    };

    if (subjectId) {
      query.subjectId = new mongoose.Types.ObjectId(subjectId);
    }

    if (academicYear) {
      query.academicYear = academicYear;
    }

    if (semester) {
      query.semester = parseInt(semester);
    }

    // Get exam results
    const examResults = await ExamResult.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('publishedBy', 'profile.fullName')
      .select('examId examName examType subjectId academicYear semester examDate totalMarks passingMarks results publishedAt')
      .sort({ examDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await ExamResult.countDocuments(query);

    // Format response
    const resultsData = examResults.map(exam => {
      const studentResult = exam.results.find(
        result => result.studentId.toString() === studentId
      );

      return {
        id: exam._id,
        examId: exam.examId,
        examName: exam.examName,
        examType: exam.examType,
        subject: {
          id: exam.subjectId._id,
          name: exam.subjectId.subjectName,
          code: exam.subjectId.subjectCode,
          department: exam.subjectId.department
        },
        academicYear: exam.academicYear,
        semester: exam.semester,
        examDate: exam.examDate,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        result: studentResult ? {
          marksObtained: studentResult.marksObtained,
          grade: studentResult.grade,
          status: studentResult.status,
          remarks: studentResult.remarks
        } : null,
        publishedAt: exam.publishedAt
      };
    });

    res.json({
      success: true,
      data: resultsData,
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
        message: 'Failed to fetch results by exam type',
        details: error.message
      }
    });
  }
};

// Get student results in professor API format (for card view)
const getStudentResultsCard = async (req, res) => {
  try {
    console.log('=== GET STUDENT RESULTS CARD FUNCTION CALLED ===');
    const { studentId } = req.params;
    console.log('=== GET STUDENT RESULTS CARD ===');
    console.log('Student ID (could be User ID):', studentId);

    // Try to find student by ID first, then by userId if not found
    console.log('Looking for student by ID:', studentId);
    let student = await Student.findById(studentId)
      .populate('userId', 'profile.fullName email')
      .select('userId rollNumber subjects');
    console.log('Student found by ID:', student ? 'Yes' : 'No');

    // If not found by Student ID, try to find by User ID
    if (!student) {
      console.log('Student not found by ID, trying to find by User ID...');
      console.log('Looking for student by User ID:', studentId);
      student = await Student.findOne({ userId: new mongoose.Types.ObjectId(studentId) })
        .populate('userId', 'profile.fullName email')
        .select('userId rollNumber subjects');
      console.log('Student found by User ID:', student ? 'Yes' : 'No');
    }

    if (!student) {
      console.log('Student not found');
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    console.log('Student found:', {
      id: student._id,
      name: student.userId?.profile?.fullName,
      rollNo: student.rollNumber
    });

    // Get all exam results that contain this student's data
    const examResults = await ExamResult.find({
      'results.studentId': student._id,
      status: 'published'
    })
      .populate('subjectId', 'subjectName subjectCode department')
      .sort({ examDate: -1 });

    console.log('Found exam results:', examResults.length);

    // Format response to match professor API format
    const formattedResults = examResults.map(exam => {
      // Find the student's result in this exam
      const studentResult = exam.results.find(
        result => result.studentId.toString() === student._id.toString()
      );

      return {
        id: exam._id,
        examId: exam.examId,
        examName: exam.examName,
        examType: exam.examType,
        subject: {
          id: exam.subjectId?._id,
          name: exam.subjectId?.subjectName || 'Unknown Subject',
          code: exam.subjectId?.subjectCode || 'N/A',
          department: exam.subjectId?.department || 'N/A'
        },
        academicYear: exam.academicYear,
        semester: exam.semester,
        examDate: exam.examDate,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        publishedBy: 'Professor',
        publishedAt: exam.publishedAt,
        status: exam.status,
        results: exam.results.filter(
          result => result.studentId.toString() === student._id.toString()
        )
      };
    });

    console.log('Formatted results:', formattedResults.length);

    res.json({
      success: true,
      data: formattedResults,
      pagination: {
        page: 1,
        limit: formattedResults.length,
        total: formattedResults.length,
        totalPages: 1
      }
    });

  } catch (error) {
    console.error('Error in getStudentResultsCard:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch student results card data',
        details: error.message
      }
    });
  }
};

module.exports = {
  getStudentResults,
  getStudentResultsBySubject,
  getExamResultById,
  getStudentPerformanceSummary,
  getResultsByExamType,
  getStudentResultsCard
};
