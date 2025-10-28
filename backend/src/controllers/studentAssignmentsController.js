const { Assignment, Student, Professor, Subject } = require('../models');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Get student's assignments
const getStudentAssignments = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status = '', subject = '', page = 1, limit = 20 } = req.query;

    // Get student and their subjects
    const student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName subjectCode')
      .populate('subjects.professorId', 'employeeId')
      .populate('subjects.professorId.userId', 'profile.fullName');

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
      status: { $in: ['active', 'completed'] }
    };

    if (status) {
      // For student view, we need to check submission status
      if (status === 'pending') {
        query['submissions.studentId'] = { $ne: studentId };
      } else if (status === 'submitted') {
        query['submissions.studentId'] = studentId;
        query['submissions.status'] = 'submitted';
      } else if (status === 'graded') {
        query['submissions.studentId'] = studentId;
        query['submissions.status'] = 'graded';
      }
    }

    if (subject) {
      query.subjectId = new mongoose.Types.ObjectId(subject);
    }

    // Get assignments with pagination
    const assignments = await Assignment.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName')
      .select('title description subjectId professorId dueDate maxMarks submissions totalStudents status attachments createdAt')
      .sort({ dueDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Assignment.countDocuments(query);

    // Format response with student-specific data
    const assignmentsData = assignments.map(assignment => {
      const studentSubmission = assignment.submissions.find(
        sub => sub.studentId.toString() === studentId
      );

      const isOverdue = new Date(assignment.dueDate) < new Date() && !studentSubmission;
      const daysRemaining = Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

      let assignmentStatus = 'pending';
      if (studentSubmission) {
        assignmentStatus = studentSubmission.status;
      } else if (isOverdue) {
        assignmentStatus = 'overdue';
      }

      return {
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        subject: {
          id: assignment.subjectId._id,
          name: assignment.subjectId.subjectName,
          code: assignment.subjectId.subjectCode,
          department: assignment.subjectId.department
        },
        professor: {
          id: assignment.professorId._id,
          employeeId: assignment.professorId.employeeId,
          name: assignment.professorId.userId.profile.fullName
        },
        dueDate: assignment.dueDate,
        assignedDate: assignment.createdAt,
        maxMarks: assignment.maxMarks,
        status: assignmentStatus,
        submitted: !!studentSubmission,
        submissionDate: studentSubmission?.submittedDate || null,
        marks: studentSubmission?.marks || null,
        feedback: studentSubmission?.feedback || null,
        attachments: assignment.attachments || [],
        daysRemaining: daysRemaining,
        isOverdue: isOverdue
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
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch assignments',
        details: error.message
      }
    });
  }
};

// Get single assignment details
const getAssignmentById = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;

    const assignment = await Assignment.findById(assignmentId)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Assignment not found'
        }
      });
    }

    const studentSubmission = assignment.submissions.find(
      sub => sub.studentId.toString() === studentId
    );

    const isOverdue = new Date(assignment.dueDate) < new Date() && !studentSubmission;
    const daysRemaining = Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

    let assignmentStatus = 'pending';
    if (studentSubmission) {
      assignmentStatus = studentSubmission.status;
    } else if (isOverdue) {
      assignmentStatus = 'overdue';
    }

    const assignmentData = {
      id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      subject: {
        id: assignment.subjectId._id,
        name: assignment.subjectId.subjectName,
        code: assignment.subjectId.subjectCode,
        department: assignment.subjectId.department
      },
      professor: {
        id: assignment.professorId._id,
        employeeId: assignment.professorId.employeeId,
        name: assignment.professorId.userId.profile.fullName
      },
      dueDate: assignment.dueDate,
      assignedDate: assignment.createdAt,
      maxMarks: assignment.maxMarks,
      status: assignmentStatus,
      submitted: !!studentSubmission,
      submissionDate: studentSubmission?.submittedDate || null,
      marks: studentSubmission?.marks || null,
      feedback: studentSubmission?.feedback || null,
      comments: studentSubmission?.comments || null,
      fileUrl: studentSubmission?.fileUrl || null,
      attachments: assignment.attachments || [],
      daysRemaining: daysRemaining,
      isOverdue: isOverdue
    };

    res.json({
      success: true,
      data: assignmentData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch assignment details',
        details: error.message
      }
    });
  }
};

// Submit assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { comments } = req.body;

    // Validate required fields
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Assignment file is required'
        }
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Assignment not found'
        }
      });
    }

    // Check if assignment is still active
    if (assignment.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Assignment is no longer accepting submissions'
        }
      });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.studentId.toString() === studentId
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Assignment has already been submitted'
        }
      });
    }

    // Check if due date has passed
    if (new Date(assignment.dueDate) < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Assignment due date has passed'
        }
      });
    }

    // Add submission
    const submission = {
      studentId: new mongoose.Types.ObjectId(studentId),
      submittedDate: new Date(),
      status: 'submitted',
      fileUrl: req.file.path,
      filename: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      comments: comments || ''
    };

    assignment.submissions.push(submission);
    await assignment.save();

    res.status(201).json({
      success: true,
      data: {
        id: assignment._id,
        submissionId: submission._id,
        submittedDate: submission.submittedDate,
        status: submission.status,
        filename: submission.filename,
        fileSize: submission.fileSize
      },
      message: 'Assignment submitted successfully'
    });
  } catch (error) {
    // Clean up uploaded file if database operation fails
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to submit assignment',
        details: error.message
      }
    });
  }
};

// Update assignment submission
const updateAssignmentSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { comments } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Assignment not found'
        }
      });
    }

    const submission = assignment.submissions.find(
      sub => sub.studentId.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Submission not found'
        }
      });
    }

    // Check if already graded
    if (submission.status === 'graded') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot update graded submission'
        }
      });
    }

    // Update submission
    if (req.file) {
      // Delete old file
      if (submission.fileUrl && fs.existsSync(submission.fileUrl)) {
        try {
          fs.unlinkSync(submission.fileUrl);
        } catch (unlinkError) {
          console.error('Failed to delete old file:', unlinkError);
        }
      }

      submission.fileUrl = req.file.path;
      submission.filename = req.file.originalname;
      submission.fileSize = req.file.size;
      submission.fileType = req.file.mimetype;
    }

    if (comments !== undefined) {
      submission.comments = comments;
    }

    submission.submittedDate = new Date();

    await assignment.save();

    res.json({
      success: true,
      data: {
        id: assignment._id,
        submissionId: submission._id,
        submittedDate: submission.submittedDate,
        status: submission.status,
        filename: submission.filename,
        fileSize: submission.fileSize
      },
      message: 'Submission updated successfully'
    });
  } catch (error) {
    // Clean up uploaded file if database operation fails
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update submission',
        details: error.message
      }
    });
  }
};

// Download assignment file
const downloadAssignmentFile = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Assignment not found'
        }
      });
    }

    const submission = assignment.submissions.find(
      sub => sub.studentId.toString() === studentId
    );

    if (!submission || !submission.fileUrl) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Submission file not found'
        }
      });
    }

    // Check if file exists
    if (!fs.existsSync(submission.fileUrl)) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'File not found on server'
        }
      });
    }

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${submission.filename}"`);
    res.setHeader('Content-Type', submission.fileType);

    // Stream the file
    const fileStream = fs.createReadStream(submission.fileUrl);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to download file',
        details: error.message
      }
    });
  }
};

// Get student's assignment statistics
const getStudentAssignmentStats = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate('subjects.subjectId', 'subjectName');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const studentSubjects = student.subjects.map(sub => sub.subjectId._id);

    // Get assignment statistics
    const stats = await Assignment.aggregate([
      {
        $match: {
          subjectId: { $in: studentSubjects },
          status: { $in: ['active', 'completed'] }
        }
      },
      {
        $project: {
          totalAssignments: 1,
          submittedAssignments: {
            $size: {
              $filter: {
                input: '$submissions',
                cond: { $eq: ['$$this.studentId', new mongoose.Types.ObjectId(studentId)] }
              }
            }
          },
          gradedAssignments: {
            $size: {
              $filter: {
                input: '$submissions',
                cond: {
                  $and: [
                    { $eq: ['$$this.studentId', new mongoose.Types.ObjectId(studentId)] },
                    { $eq: ['$$this.status', 'graded'] }
                  ]
                }
              }
            }
          },
          pendingAssignments: {
            $cond: [
              {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$submissions',
                        cond: { $eq: ['$$this.studentId', new mongoose.Types.ObjectId(studentId)] }
                      }
                    }
                  },
                  0
                ]
              },
              0,
              1
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAssignments: { $sum: '$totalAssignments' },
          submittedAssignments: { $sum: '$submittedAssignments' },
          gradedAssignments: { $sum: '$gradedAssignments' },
          pendingAssignments: { $sum: '$pendingAssignments' }
        }
      }
    ]);

    // Get recent assignments
    const recentAssignments = await Assignment.find({
      subjectId: { $in: studentSubjects },
      status: { $in: ['active', 'completed'] }
    })
      .populate('subjectId', 'subjectName subjectCode')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName')
      .select('title subjectId professorId dueDate maxMarks submissions status')
      .sort({ dueDate: 1 })
      .limit(5);

    const recentAssignmentsData = recentAssignments.map(assignment => {
      const studentSubmission = assignment.submissions.find(
        sub => sub.studentId.toString() === studentId
      );

      const isOverdue = new Date(assignment.dueDate) < new Date() && !studentSubmission;
      const daysRemaining = Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

      let assignmentStatus = 'pending';
      if (studentSubmission) {
        assignmentStatus = studentSubmission.status;
      } else if (isOverdue) {
        assignmentStatus = 'overdue';
      }

      return {
        id: assignment._id,
        title: assignment.title,
        subject: {
          id: assignment.subjectId._id,
          name: assignment.subjectId.subjectName,
          code: assignment.subjectId.subjectCode
        },
        professor: {
          id: assignment.professorId._id,
          name: assignment.professorId.userId.profile.fullName
        },
        dueDate: assignment.dueDate,
        maxMarks: assignment.maxMarks,
        status: assignmentStatus,
        submitted: !!studentSubmission,
        marks: studentSubmission?.marks || null,
        daysRemaining: daysRemaining,
        isOverdue: isOverdue
      };
    });

    const statistics = {
      totalAssignments: stats[0]?.totalAssignments || 0,
      submittedAssignments: stats[0]?.submittedAssignments || 0,
      gradedAssignments: stats[0]?.gradedAssignments || 0,
      pendingAssignments: stats[0]?.pendingAssignments || 0,
      submissionRate: stats[0]?.totalAssignments > 0 ? 
        Math.round((stats[0].submittedAssignments / stats[0].totalAssignments) * 100) : 0,
      recentAssignments: recentAssignmentsData
    };

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch assignment statistics',
        details: error.message
      }
    });
  }
};

module.exports = {
  getStudentAssignments,
  getAssignmentById,
  submitAssignment,
  updateAssignmentSubmission,
  downloadAssignmentFile,
  getStudentAssignmentStats
};
