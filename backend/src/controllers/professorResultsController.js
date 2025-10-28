const { ExamResult, Professor, Student, Subject, User } = require('../models');
const mongoose = require('mongoose');

// Get all exam results for a professor
const getProfessorExamResults = async (req, res) => {
  try {
    const { professorId } = req.params;
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

    console.log('=== PROFESSOR EXAM RESULTS API CALLED ===');
    console.log('Professor ID:', professorId);
    console.log('Query params:', { page, limit, subjectId, examType, academicYear, semester, status, search });

    // First, ensure the professor document exists
    let professor = await Professor.findById(professorId)
      .populate('subjects.subjectId', 'subjectName subjectCode');
    
    if (!professor) {
      console.log('Professor not found by direct ID, trying by userId...');
      const user = await User.findById(professorId);
      if (user && user.role === 'professor') {
        console.log('Found user with professor role, looking for professor document...');
        professor = await Professor.findOne({ userId: user._id })
          .populate('subjects.subjectId', 'subjectName subjectCode');
        
        if (!professor) {
          console.log('Professor document not found, creating one...');
          // Create professor document if missing
          const professorCount = await Professor.countDocuments();
          const employeeId = `PROF${String(professorCount + 1).padStart(3, '0')}`;

          // Skip subject creation to avoid validation issues
          console.log('Skipping subject creation to avoid validation issues');

          professor = new Professor({
            userId: user._id,
            employeeId: employeeId,
            subjects: [],
            experience: { totalYears: 0, previousInstitutions: [] },
            qualifications: [],
            schedule: {
              workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              workingHours: { start: '09:00', end: '17:00' }
            },
            performance: {
              rating: 0,
              totalClasses: 0,
              attendancePercentage: 0,
              studentFeedback: 0
            }
          });

          await professor.save();
          console.log('Professor document created successfully with ID:', professor._id);
        }
      } else {
        return res.status(404).json({
          success: false,
          error: { message: 'Professor not found' }
        });
      }
    }

    const professorSubjects = professor.subjects
      .filter(sub => sub.subjectId && sub.subjectId._id) // Filter out null/undefined subjects
      .map(sub => sub.subjectId._id);

    // Build query - show ALL exam results from ALL professors (same as materials API)
    let query = {};

    // If specific subject is requested, filter by that subject
    if (subjectId) {
      const subjectObjectId = new mongoose.Types.ObjectId(subjectId);
      query.subjectId = subjectObjectId;
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

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { examName: { $regex: search, $options: 'i' } },
        { examId: { $regex: search, $options: 'i' } }
      ];
    }

    // Get exam results with pagination
    const examResults = await ExamResult.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('publishedBy', 'profile.fullName')
      .select('examId examName examType subjectId academicYear semester examDate totalMarks passingMarks results statistics publishedBy publishedAt status createdAt updatedAt')
      .sort({ examDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Format response - show individual exam results with subject information
    const allResults = [];
    
    for (const exam of examResults) {
      // Populate student results for this exam
      const populatedResults = await Promise.all(
        exam.results.map(async (result) => {
          const student = await Student.findById(result.studentId).populate('userId', 'profile.fullName');
          return {
            id: `${exam._id}_${result.studentId}`,
            studentId: result.studentId,
            rollNo: result.rollNumber,
            name: student?.userId?.profile?.fullName || 'Unknown',
            examType: exam.examType,
            marks: result.marksObtained,
            grade: result.grade,
            status: result.status === 'pass' ? 'Pass' : 'Fail',
            examDate: exam.examDate,
            subject: {
              id: exam.subjectId?._id,
              name: exam.subjectId?.subjectName || 'Unknown Subject',
              code: exam.subjectId?.subjectCode || 'N/A',
              department: exam.subjectId?.department || 'N/A'
            },
            examName: exam.examName,
            totalMarks: exam.totalMarks,
            publishedBy: exam.publishedBy?.profile?.fullName || 'Unknown'
          };
        })
      );
      
      allResults.push(...populatedResults);
    }
    
    // Sort results by exam date (newest first)
    allResults.sort((a, b) => new Date(b.examDate) - new Date(a.examDate));

    // Get total count of all results
    const totalResults = allResults.length;

    res.json({
      success: true,
      data: allResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalResults,
        totalPages: Math.ceil(totalResults / limit)
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

// Get single exam result
const getExamResultById = async (req, res) => {
  try {
    const { id } = req.params;

    const examResult = await ExamResult.findById(id)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('publishedBy', 'profile.fullName')
      .populate('results.studentId', 'rollNumber userId')
      .populate('results.studentId.userId', 'profile.fullName email');

    if (!examResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Exam result not found'
        }
      });
    }

    const resultsData = {
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
      publishedBy: examResult.publishedBy ? {
        id: examResult.publishedBy._id,
        name: examResult.publishedBy.profile.fullName
      } : null,
      publishedAt: examResult.publishedAt,
      status: examResult.status,
      statistics: examResult.statistics,
      results: examResult.results.map(result => ({
        id: result._id,
        student: {
          id: result.studentId._id,
          rollNumber: result.studentId.rollNumber,
          name: result.studentId.userId.profile.fullName,
          email: result.studentId.userId.email
        },
        marksObtained: result.marksObtained,
        grade: result.grade,
        status: result.status,
        remarks: result.remarks
      })),
      createdAt: examResult.createdAt,
      updatedAt: examResult.updatedAt
    };

    res.json({
      success: true,
      data: resultsData
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

// Create simple student result (direct)
const createStudentResult = async (req, res) => {
  try {
    const { professorId } = req.params;
    const { student, examType, marks, subjectName } = req.body;

    console.log('=== CREATE STUDENT RESULT ===');
    console.log('Professor ID:', professorId);
    console.log('Request body:', { student, examType, marks, subjectName });

    // Validate required fields
    if (!student || !examType || marks === undefined || marks === null || !subjectName) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Student, exam type, marks, and subject name are required'
        }
      });
    }

    // First, ensure the professor document exists
    let professor = await Professor.findById(professorId);
    
    if (!professor) {
      console.log('Professor not found by direct ID, trying by userId...');
      const user = await User.findById(professorId);
      if (user && user.role === 'professor') {
        console.log('Found user with professor role, looking for professor document...');
        professor = await Professor.findOne({ userId: user._id });
        
        if (!professor) {
          console.log('Professor document not found, creating one...');
          const professorCount = await Professor.countDocuments();
          const employeeId = `PROF${String(professorCount + 1).padStart(3, '0')}`;

          professor = new Professor({
            userId: user._id,
            employeeId: employeeId,
            subjects: [],
            experience: { totalYears: 0, previousInstitutions: [] },
            qualifications: [],
            schedule: {
              workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              workingHours: { start: '09:00', end: '17:00' }
            },
            performance: {
              rating: 0,
              totalClasses: 0,
              attendancePercentage: 0,
              studentFeedback: 0
            }
          });

          await professor.save();
          console.log('Professor document created successfully with ID:', professor._id);
        }
      } else {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Professor not found'
          }
        });
      }
    }

    // Find student by roll number and populate userId
    const studentDoc = await Student.findOne({ rollNumber: student }).populate('userId', 'profile.fullName name');
    if (!studentDoc) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    // Find or create subject based on subject name
    let subject = await Subject.findOne({ subjectName: subjectName });
    if (!subject) {
      // Create new subject if it doesn't exist
      const subjectCode = subjectName.toUpperCase().replace(/\s+/g, '').substring(0, 6) + '001';
      subject = new Subject({
        subjectName: subjectName,
        subjectCode: subjectCode,
        description: `${subjectName} subject`,
        credits: 3,
        department: 'General'
      });
      await subject.save();
      console.log('Created new subject:', subject.subjectName, 'with ID:', subject._id);
    }
    const actualSubjectId = subject._id;

    // Generate unique exam ID
    const examId = `EXAM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create a simple exam result entry
    const examResult = new ExamResult({
      examId: examId,
      examName: `${examType.charAt(0).toUpperCase() + examType.slice(1)} Exam`,
      examType: examType,
      subjectId: actualSubjectId,
      academicYear: new Date().getFullYear().toString(),
      semester: 1,
      examDate: new Date(),
      totalMarks: 100,
      passingMarks: 40,
      publishedBy: professor.userId,
      results: [{
        studentId: studentDoc._id,
        rollNumber: studentDoc.rollNumber,
        marksObtained: parseInt(marks),
        grade: marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B+' : marks >= 60 ? 'B' : marks >= 50 ? 'C' : marks >= 40 ? 'D' : 'F',
        status: marks >= 40 ? 'pass' : 'fail',
        remarks: marks >= 40 ? 'Pass' : 'Fail'
      }],
      status: 'published'
    });

    const savedResult = await examResult.save();

    res.status(201).json({
      success: true,
      data: {
        id: savedResult._id,
        examName: savedResult.examName,
        examType: savedResult.examType,
        student: {
          id: studentDoc._id,
          name: studentDoc.userId?.profile?.fullName || 'Unknown',
          rollNo: studentDoc.rollNumber
        },
        marks: parseInt(marks),
        grade: marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B+' : marks >= 60 ? 'B' : marks >= 50 ? 'C' : marks >= 40 ? 'D' : 'F',
        status: marks >= 40 ? 'Pass' : 'Fail'
      },
      message: 'Student result created successfully'
    });
  } catch (error) {
    console.error('Error creating student result:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create student result',
        details: error.message
      }
    });
  }
};

// Create new exam result
const createExamResult = async (req, res) => {
  try {
    const { professorId } = req.params;
    const { 
      examName, 
      examType, 
      subjectId, 
      academicYear, 
      semester, 
      examDate, 
      totalMarks, 
      passingMarks 
    } = req.body;

    // Validate required fields
    if (!examName || !examType || !subjectId || !academicYear || !semester || !examDate || !totalMarks || !passingMarks) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'All fields are required'
        }
      });
    }

    // Validate professor exists
    const professor = await Professor.findById(professorId);
    if (!professor) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Professor not found'
        }
      });
    }

    // Validate subject exists and professor teaches it
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Subject not found'
        }
      });
    }

    const professorSubject = professor.subjects.find(
      sub => sub.subjectId.toString() === subjectId
    );
    if (!professorSubject) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Professor does not teach this subject'
        }
      });
    }

    // Generate unique exam ID
    const examCount = await ExamResult.countDocuments({ subjectId });
    const examId = `${subject.subjectCode}-${examType.toUpperCase()}-${academicYear.split('-')[0]}-${String(examCount + 1).padStart(3, '0')}`;

    // Get enrolled students for this subject
    const enrolledStudents = await Student.find({
      'subjects.subjectId': subjectId,
      status: 'active'
    }).populate('userId', 'profile.fullName email');

    // Create exam result
    const examResult = new ExamResult({
      examId,
      examName,
      examType,
      subjectId,
      academicYear,
      semester: parseInt(semester),
      examDate: new Date(examDate),
      totalMarks: parseInt(totalMarks),
      passingMarks: parseInt(passingMarks),
      results: [], // Initialize empty results
      statistics: {
        totalStudents: enrolledStudents.length,
        passedStudents: 0,
        failedStudents: 0,
        passPercentage: 0,
        averageMarks: 0,
        highestMarks: 0,
        lowestMarks: 0
      },
      publishedBy: professorId,
      status: 'draft'
    });

    const savedExamResult = await examResult.save();

    // Populate the response
    const examResultData = await ExamResult.findById(savedExamResult._id)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('publishedBy', 'profile.fullName');

    res.status(201).json({
      success: true,
      data: {
        id: examResultData._id,
        examId: examResultData.examId,
        examName: examResultData.examName,
        examType: examResultData.examType,
        subject: {
          id: examResultData.subjectId._id,
          name: examResultData.subjectId.subjectName,
          code: examResultData.subjectId.subjectCode,
          department: examResultData.subjectId.department
        },
        academicYear: examResultData.academicYear,
        semester: examResultData.semester,
        examDate: examResultData.examDate,
        totalMarks: examResultData.totalMarks,
        passingMarks: examResultData.passingMarks,
        totalStudents: examResultData.results.length,
        status: examResultData.status,
        statistics: examResultData.statistics,
        createdAt: examResultData.createdAt
      },
      message: 'Exam result created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create exam result',
        details: error.message
      }
    });
  }
};

// Update exam result
const updateExamResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      examName, 
      examType, 
      academicYear, 
      semester, 
      examDate, 
      totalMarks, 
      passingMarks 
    } = req.body;

    const examResult = await ExamResult.findById(id);
    if (!examResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Exam result not found'
        }
      });
    }

    // Update fields
    const updateData = {};
    if (examName) updateData.examName = examName;
    if (examType) updateData.examType = examType;
    if (academicYear) updateData.academicYear = academicYear;
    if (semester) updateData.semester = parseInt(semester);
    if (examDate) updateData.examDate = new Date(examDate);
    if (totalMarks) updateData.totalMarks = parseInt(totalMarks);
    if (passingMarks) updateData.passingMarks = parseInt(passingMarks);

    const updatedExamResult = await ExamResult.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('subjectId', 'subjectName subjectCode department')
     .populate('publishedBy', 'profile.fullName');

    res.json({
      success: true,
      data: {
        id: updatedExamResult._id,
        examId: updatedExamResult.examId,
        examName: updatedExamResult.examName,
        examType: updatedExamResult.examType,
        subject: {
          id: updatedExamResult.subjectId._id,
          name: updatedExamResult.subjectId.subjectName,
          code: updatedExamResult.subjectId.subjectCode,
          department: updatedExamResult.subjectId.department
        },
        academicYear: updatedExamResult.academicYear,
        semester: updatedExamResult.semester,
        examDate: updatedExamResult.examDate,
        totalMarks: updatedExamResult.totalMarks,
        passingMarks: updatedExamResult.passingMarks,
        totalStudents: updatedExamResult.results.length,
        status: updatedExamResult.status,
        statistics: updatedExamResult.statistics,
        updatedAt: updatedExamResult.updatedAt
      },
      message: 'Exam result updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update exam result',
        details: error.message
      }
    });
  }
};

// Delete exam result
const deleteExamResult = async (req, res) => {
  try {
    const { id } = req.params;

    const examResult = await ExamResult.findById(id);
    if (!examResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Exam result not found'
        }
      });
    }

    // Check if exam result is published
    if (examResult.status === 'published') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot delete published exam result'
        }
      });
    }

    await ExamResult.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Exam result deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete exam result',
        details: error.message
      }
    });
  }
};

// Add student result
const addStudentResult = async (req, res) => {
  try {
    const { examResultId } = req.params;
    const { studentId, marksObtained, remarks } = req.body;

    if (!studentId || marksObtained === undefined || marksObtained === null) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Student ID and marks are required'
        }
      });
    }

    const examResult = await ExamResult.findById(examResultId);
    if (!examResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Exam result not found'
        }
      });
    }

    // Check if student result already exists
    const existingResult = examResult.results.find(
      result => result.studentId.toString() === studentId
    );

    if (existingResult) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Student result already exists'
        }
      });
    }

    // Validate marks
    if (marksObtained < 0 || marksObtained > examResult.totalMarks) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Marks must be between 0 and ${examResult.totalMarks}`
        }
      });
    }

    // Calculate grade and status
    const grade = calculateGrade(marksObtained, examResult.totalMarks);
    const status = marksObtained >= examResult.passingMarks ? 'pass' : 'fail';

    // Add student result
    const studentResult = {
      studentId: new mongoose.Types.ObjectId(studentId),
      marksObtained: parseInt(marksObtained),
      grade,
      status,
      remarks: remarks || ''
    };

    examResult.results.push(studentResult);

    // Update statistics
    await updateExamStatistics(examResult);

    await examResult.save();

    res.status(201).json({
      success: true,
      data: {
        id: studentResult._id,
        studentId: studentResult.studentId,
        marksObtained: studentResult.marksObtained,
        grade: studentResult.grade,
        status: studentResult.status,
        remarks: studentResult.remarks
      },
      message: 'Student result added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to add student result',
        details: error.message
      }
    });
  }
};

// Update student result
const updateStudentResult = async (req, res) => {
  try {
    const { examResultId, resultId } = req.params;
    const { marksObtained, remarks } = req.body;

    if (marksObtained === undefined || marksObtained === null) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Marks are required'
        }
      });
    }

    const examResult = await ExamResult.findById(examResultId);
    if (!examResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Exam result not found'
        }
      });
    }

    const studentResult = examResult.results.id(resultId);
    if (!studentResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student result not found'
        }
      });
    }

    // Validate marks
    if (marksObtained < 0 || marksObtained > examResult.totalMarks) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Marks must be between 0 and ${examResult.totalMarks}`
        }
      });
    }

    // Update student result
    studentResult.marksObtained = parseInt(marksObtained);
    studentResult.grade = calculateGrade(marksObtained, examResult.totalMarks);
    studentResult.status = marksObtained >= examResult.passingMarks ? 'pass' : 'fail';
    if (remarks !== undefined) studentResult.remarks = remarks;

    // Update statistics
    await updateExamStatistics(examResult);

    await examResult.save();

    res.json({
      success: true,
      data: {
        id: studentResult._id,
        studentId: studentResult.studentId,
        marksObtained: studentResult.marksObtained,
        grade: studentResult.grade,
        status: studentResult.status,
        remarks: studentResult.remarks
      },
      message: 'Student result updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update student result',
        details: error.message
      }
    });
  }
};

// Delete student result
const deleteStudentResult = async (req, res) => {
  try {
    const { examResultId, resultId } = req.params;

    const examResult = await ExamResult.findById(examResultId);
    if (!examResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Exam result not found'
        }
      });
    }

    const studentResult = examResult.results.id(resultId);
    if (!studentResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student result not found'
        }
      });
    }

    // Remove student result
    examResult.results.pull(resultId);

    // Update statistics
    await updateExamStatistics(examResult);

    await examResult.save();

    res.json({
      success: true,
      message: 'Student result deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete student result',
        details: error.message
      }
    });
  }
};

// Publish exam results
const publishExamResults = async (req, res) => {
  try {
    const { id } = req.params;

    const examResult = await ExamResult.findById(id);
    if (!examResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Exam result not found'
        }
      });
    }

    if (examResult.status === 'published') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Exam results are already published'
        }
      });
    }

    // Update status and publish date
    examResult.status = 'published';
    examResult.publishedAt = new Date();

    await examResult.save();

    res.json({
      success: true,
      data: {
        id: examResult._id,
        status: examResult.status,
        publishedAt: examResult.publishedAt
      },
      message: 'Exam results published successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to publish exam results',
        details: error.message
      }
    });
  }
};

// Bulk upload results
const bulkUploadResults = async (req, res) => {
  try {
    const { examResultId } = req.params;
    const { results } = req.body; // Array of { studentId, marksObtained, remarks }

    if (!results || !Array.isArray(results)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Results array is required'
        }
      });
    }

    const examResult = await ExamResult.findById(examResultId);
    if (!examResult) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Exam result not found'
        }
      });
    }

    const addedResults = [];
    const errors = [];

    for (const result of results) {
      try {
        const { studentId, marksObtained, remarks } = result;

        if (!studentId || marksObtained === undefined || marksObtained === null) {
          errors.push({
            studentId: studentId || 'unknown',
            error: 'Student ID and marks are required'
          });
          continue;
        }

        // Check if student result already exists
        const existingResult = examResult.results.find(
          r => r.studentId.toString() === studentId
        );

        if (existingResult) {
          errors.push({
            studentId,
            error: 'Student result already exists'
          });
          continue;
        }

        // Validate marks
        if (marksObtained < 0 || marksObtained > examResult.totalMarks) {
          errors.push({
            studentId,
            error: `Marks must be between 0 and ${examResult.totalMarks}`
          });
          continue;
        }

        // Calculate grade and status
        const grade = calculateGrade(marksObtained, examResult.totalMarks);
        const status = marksObtained >= examResult.passingMarks ? 'pass' : 'fail';

        // Add student result
        const studentResult = {
          studentId: new mongoose.Types.ObjectId(studentId),
          marksObtained: parseInt(marksObtained),
          grade,
          status,
          remarks: remarks || ''
        };

        examResult.results.push(studentResult);
        addedResults.push({
          studentId,
          marksObtained: studentResult.marksObtained,
          grade: studentResult.grade,
          status: studentResult.status
        });
      } catch (error) {
        errors.push({
          studentId: result.studentId || 'unknown',
          error: error.message
        });
      }
    }

    // Update statistics
    await updateExamStatistics(examResult);

    await examResult.save();

    res.json({
      success: true,
      data: {
        addedResults,
        errors,
        totalAdded: addedResults.length,
        totalErrors: errors.length
      },
      message: `Bulk upload completed. ${addedResults.length} results added, ${errors.length} errors.`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to bulk upload results',
        details: error.message
      }
    });
  }
};

// Helper function to calculate grade
const calculateGrade = (marksObtained, totalMarks) => {
  const percentage = (marksObtained / totalMarks) * 100;
  
  if (percentage >= 95) return 'A+';
  if (percentage >= 90) return 'A';
  if (percentage >= 85) return 'B+';
  if (percentage >= 80) return 'B';
  if (percentage >= 75) return 'C+';
  if (percentage >= 70) return 'C';
  if (percentage >= 65) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
};

// Helper function to update exam statistics
const updateExamStatistics = async (examResult) => {
  const results = examResult.results;
  
  if (results.length === 0) {
    examResult.statistics = {
      totalStudents: 0,
      passedStudents: 0,
      failedStudents: 0,
      passPercentage: 0,
      averageMarks: 0,
      highestMarks: 0,
      lowestMarks: 0
    };
    return;
  }

  const totalStudents = results.length;
  const passedStudents = results.filter(r => r.status === 'pass').length;
  const failedStudents = totalStudents - passedStudents;
  const passPercentage = (passedStudents / totalStudents) * 100;
  const averageMarks = results.reduce((sum, r) => sum + r.marksObtained, 0) / totalStudents;
  const highestMarks = Math.max(...results.map(r => r.marksObtained));
  const lowestMarks = Math.min(...results.map(r => r.marksObtained));

  examResult.statistics = {
    totalStudents,
    passedStudents,
    failedStudents,
    passPercentage: Math.round(passPercentage * 100) / 100,
    averageMarks: Math.round(averageMarks * 100) / 100,
    highestMarks,
    lowestMarks
  };
};

module.exports = {
  getProfessorExamResults,
  getExamResultById,
  createStudentResult,
  createExamResult,
  updateExamResult,
  deleteExamResult,
  addStudentResult,
  updateStudentResult,
  deleteStudentResult,
  publishExamResults,
  bulkUploadResults
};
