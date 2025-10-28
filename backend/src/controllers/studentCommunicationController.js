const { Communication, Student, Professor, Subject } = require('../models');
const mongoose = require('mongoose');

// Get student's communication history
const getStudentCommunications = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      status = '', 
      priority = '', 
      subject = '',
      search = ''
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
      studentId: new mongoose.Types.ObjectId(studentId)
    };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (subject) {
      query.subject = subject;
    }

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    // Get communications with pagination
    const communications = await Communication.find(query)
      .populate('reply.repliedBy', 'profile.fullName')
      .select('studentId studentName rollNumber subject question askedDate status priority reply createdAt updatedAt')
      .sort({ askedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Communication.countDocuments(query);

    // Format response
    const communicationsData = communications.map(comm => ({
      id: comm._id,
      student: {
        id: comm.studentId,
        name: comm.studentName,
        rollNumber: comm.rollNumber
      },
      subject: comm.subject,
      question: comm.question,
      askedDate: comm.askedDate,
      status: comm.status,
      priority: comm.priority,
      reply: comm.reply ? {
        content: comm.reply.content,
        repliedBy: {
          id: comm.reply.repliedBy._id,
          name: comm.reply.repliedBy.profile.fullName
        },
        repliedDate: comm.reply.repliedDate
      } : null,
      createdAt: comm.createdAt,
      updatedAt: comm.updatedAt
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
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch communications',
        details: error.message
      }
    });
  }
};

// Get single communication
const getCommunicationById = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const communication = await Communication.findById(id)
      .populate('reply.repliedBy', 'profile.fullName');

    if (!communication) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Communication not found'
        }
      });
    }

    // Verify student owns this communication
    if (communication.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'You do not have access to this communication'
        }
      });
    }

    const communicationData = {
      id: communication._id,
      student: {
        id: communication.studentId,
        name: communication.studentName,
        rollNumber: communication.rollNumber
      },
      subject: communication.subject,
      question: communication.question,
      askedDate: communication.askedDate,
      status: communication.status,
      priority: communication.priority,
      reply: communication.reply ? {
        content: communication.reply.content,
        repliedBy: {
          id: communication.reply.repliedBy._id,
          name: communication.reply.repliedBy.profile.fullName
        },
        repliedDate: communication.reply.repliedDate
      } : null,
      createdAt: communication.createdAt,
      updatedAt: communication.updatedAt
    };

    res.json({
      success: true,
      data: communicationData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch communication',
        details: error.message
      }
    });
  }
};

// Ask a new doubt/question
const askDoubt = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject, question, priority = 'medium' } = req.body;

    // Validate required fields
    if (!subject || !question) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Subject and question are required'
        }
      });
    }

    // Get student details
    const student = await Student.findById(studentId)
      .populate('userId', 'profile.fullName email');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    // Validate priority
    const validPriorities = ['high', 'medium', 'low'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Priority must be high, medium, or low'
        }
      });
    }

    // Create communication
    const communication = new Communication({
      studentId: new mongoose.Types.ObjectId(studentId),
      studentName: student.userId.profile.fullName,
      rollNumber: student.rollNumber,
      subject,
      question,
      askedDate: new Date(),
      status: 'pending',
      priority
    });

    const savedCommunication = await communication.save();

    res.status(201).json({
      success: true,
      data: {
        id: savedCommunication._id,
        student: {
          id: savedCommunication.studentId,
          name: savedCommunication.studentName,
          rollNumber: savedCommunication.rollNumber
        },
        subject: savedCommunication.subject,
        question: savedCommunication.question,
        askedDate: savedCommunication.askedDate,
        status: savedCommunication.status,
        priority: savedCommunication.priority
      },
      message: 'Doubt submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to submit doubt',
        details: error.message
      }
    });
  }
};

// Update communication (student can only update pending ones)
const updateCommunication = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const { question, priority } = req.body;

    const communication = await Communication.findById(id);

    if (!communication) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Communication not found'
        }
      });
    }

    // Verify student owns this communication
    if (communication.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'You do not have access to this communication'
        }
      });
    }

    // Can only update if pending
    if (communication.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot update communication that has been replied to'
        }
      });
    }

    // Update fields
    if (question) communication.question = question;
    if (priority) {
      const validPriorities = ['high', 'medium', 'low'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Priority must be high, medium, or low'
          }
        });
      }
      communication.priority = priority;
    }

    await communication.save();

    res.json({
      success: true,
      data: {
        id: communication._id,
        student: {
          id: communication.studentId,
          name: communication.studentName,
          rollNumber: communication.rollNumber
        },
        subject: communication.subject,
        question: communication.question,
        askedDate: communication.askedDate,
        status: communication.status,
        priority: communication.priority
      },
      message: 'Communication updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update communication',
        details: error.message
      }
    });
  }
};

// Delete communication (student can only delete pending ones)
const deleteCommunication = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const communication = await Communication.findById(id);

    if (!communication) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Communication not found'
        }
      });
    }

    // Verify student owns this communication
    if (communication.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'You do not have access to this communication'
        }
      });
    }

    // Can only delete if pending
    if (communication.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot delete communication that has been replied to'
        }
      });
    }

    await Communication.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Communication deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete communication',
        details: error.message
      }
    });
  }
};

// Get communications by subject
const getCommunicationsBySubject = async (req, res) => {
  try {
    const { studentId, subject } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      status = '', 
      priority = '',
      search = ''
    } = req.query;

    // Build query
    const query = {
      studentId: new mongoose.Types.ObjectId(studentId),
      subject: subject
    };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.question = { $regex: search, $options: 'i' };
    }

    // Get communications with pagination
    const communications = await Communication.find(query)
      .populate('reply.repliedBy', 'profile.fullName')
      .select('studentId studentName rollNumber subject question askedDate status priority reply createdAt updatedAt')
      .sort({ askedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Communication.countDocuments(query);

    // Format response
    const communicationsData = communications.map(comm => ({
      id: comm._id,
      student: {
        id: comm.studentId,
        name: comm.studentName,
        rollNumber: comm.rollNumber
      },
      subject: comm.subject,
      question: comm.question,
      askedDate: comm.askedDate,
      status: comm.status,
      priority: comm.priority,
      reply: comm.reply ? {
        content: comm.reply.content,
        repliedBy: {
          id: comm.reply.repliedBy._id,
          name: comm.reply.repliedBy.profile.fullName
        },
        repliedDate: comm.reply.repliedDate
      } : null,
      createdAt: comm.createdAt,
      updatedAt: comm.updatedAt
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
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch communications by subject',
        details: error.message
      }
    });
  }
};

// Get recent communications
const getRecentCommunications = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 10 } = req.query;

    // Get recent communications
    const communications = await Communication.find({
      studentId: new mongoose.Types.ObjectId(studentId)
    })
      .populate('reply.repliedBy', 'profile.fullName')
      .select('studentId studentName rollNumber subject question askedDate status priority reply')
      .sort({ askedDate: -1 })
      .limit(parseInt(limit));

    // Format response
    const communicationsData = communications.map(comm => ({
      id: comm._id,
      student: {
        id: comm.studentId,
        name: comm.studentName,
        rollNumber: comm.rollNumber
      },
      subject: comm.subject,
      question: comm.question,
      askedDate: comm.askedDate,
      status: comm.status,
      priority: comm.priority,
      reply: comm.reply ? {
        content: comm.reply.content,
        repliedBy: {
          id: comm.reply.repliedBy._id,
          name: comm.reply.repliedBy.profile.fullName
        },
        repliedDate: comm.reply.repliedDate
      } : null
    }));

    res.json({
      success: true,
      data: communicationsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch recent communications',
        details: error.message
      }
    });
  }
};

// Get communication statistics
const getCommunicationStats = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get communication statistics
    const stats = await Communication.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $group: {
          _id: null,
          totalCommunications: { $sum: 1 },
          pendingCommunications: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
            }
          },
          repliedCommunications: {
            $sum: {
              $cond: [{ $eq: ['$status', 'replied'] }, 1, 0]
            }
          },
          highPriorityCommunications: {
            $sum: {
              $cond: [{ $eq: ['$priority', 'high'] }, 1, 0]
            }
          },
          mediumPriorityCommunications: {
            $sum: {
              $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0]
            }
          },
          lowPriorityCommunications: {
            $sum: {
              $cond: [{ $eq: ['$priority', 'low'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get communications by subject
    const communicationsBySubject = await Communication.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $group: {
          _id: '$subject',
          totalCommunications: { $sum: 1 },
          pendingCommunications: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
            }
          },
          repliedCommunications: {
            $sum: {
              $cond: [{ $eq: ['$status', 'replied'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { totalCommunications: -1 }
      }
    ]);

    const statistics = stats[0] ? {
      totalCommunications: stats[0].totalCommunications,
      pendingCommunications: stats[0].pendingCommunications,
      repliedCommunications: stats[0].repliedCommunications,
      highPriorityCommunications: stats[0].highPriorityCommunications,
      mediumPriorityCommunications: stats[0].mediumPriorityCommunications,
      lowPriorityCommunications: stats[0].lowPriorityCommunications,
      replyRate: stats[0].totalCommunications > 0 ? 
        Math.round((stats[0].repliedCommunications / stats[0].totalCommunications) * 100) : 0,
      bySubject: communicationsBySubject
    } : {
      totalCommunications: 0,
      pendingCommunications: 0,
      repliedCommunications: 0,
      highPriorityCommunications: 0,
      mediumPriorityCommunications: 0,
      lowPriorityCommunications: 0,
      replyRate: 0,
      bySubject: []
    };

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch communication statistics',
        details: error.message
      }
    });
  }
};

module.exports = {
  getStudentCommunications,
  getCommunicationById,
  askDoubt,
  updateCommunication,
  deleteCommunication,
  getCommunicationsBySubject,
  getRecentCommunications,
  getCommunicationStats
};
