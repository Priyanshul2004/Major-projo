const { Communication, Professor, Student, Subject, User } = require('../models');
const mongoose = require('mongoose');

// Get all communications for a professor
const getProfessorCommunications = async (req, res) => {
  try {
    const { professorId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      status = '', 
      priority = '', 
      subject = '', 
      search = '',
      sortBy = 'askedDate',
      sortOrder = 'desc'
    } = req.query;

    console.log('=== PROFESSOR COMMUNICATIONS API CALLED ===');
    console.log('Professor ID:', professorId);
    console.log('Query params:', { page, limit, status, priority, subject, search, sortBy, sortOrder });

    // First, ensure the professor document exists
    let professor = await Professor.findById(professorId).populate('subjects.subjectId', 'subjectName');
    
    if (!professor) {
      console.log('Professor not found by direct ID, trying by userId...');
      const user = await User.findById(professorId);
      if (user && user.role === 'professor') {
        console.log('Found user with professor role, looking for professor document...');
        professor = await Professor.findOne({ userId: user._id }).populate('subjects.subjectId', 'subjectName');
        
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

    // Build query
    const query = {};

    const professorSubjects = professor.subjects.map(sub => sub.subjectId.subjectName);
    
    // Filter by professor's subjects
    query.subject = { $in: professorSubjects };

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
        { studentName: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { question: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get communications with pagination
    const communications = await Communication.find(query)
      .populate('studentId', 'rollNumber userId')
      .populate('studentId.userId', 'profile.fullName email')
      .populate('reply.repliedBy', 'profile.fullName')
      .select('studentId studentName rollNumber subject question askedDate status priority reply createdAt updatedAt')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Communication.countDocuments(query);

    // Format response
    const communicationsData = communications.map(communication => ({
      id: communication._id,
      student: {
        id: communication.studentId._id,
        name: communication.studentId.userId.profile.fullName,
        rollNumber: communication.studentId.rollNumber,
        email: communication.studentId.userId.email
      },
      subject: communication.subject,
      question: communication.question,
      askedDate: communication.askedDate,
      status: communication.status,
      priority: communication.priority,
      reply: communication.reply ? {
        content: communication.reply.content,
        repliedBy: communication.reply.repliedBy ? {
          id: communication.reply.repliedBy._id,
          name: communication.reply.repliedBy.profile.fullName
        } : null,
        repliedDate: communication.reply.repliedDate
      } : null,
      createdAt: communication.createdAt,
      updatedAt: communication.updatedAt
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
    const { id } = req.params;

    const communication = await Communication.findById(id)
      .populate('studentId', 'rollNumber userId')
      .populate('studentId.userId', 'profile.fullName email')
      .populate('reply.repliedBy', 'profile.fullName');

    if (!communication) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Communication not found'
        }
      });
    }

    const communicationData = {
      id: communication._id,
      student: {
        id: communication.studentId._id,
        name: communication.studentId.userId.profile.fullName,
        rollNumber: communication.studentId.rollNumber,
        email: communication.studentId.userId.email
      },
      subject: communication.subject,
      question: communication.question,
      askedDate: communication.askedDate,
      status: communication.status,
      priority: communication.priority,
      reply: communication.reply ? {
        content: communication.reply.content,
        repliedBy: communication.reply.repliedBy ? {
          id: communication.reply.repliedBy._id,
          name: communication.reply.repliedBy.profile.fullName
        } : null,
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

// Reply to student communication
const replyToCommunication = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, professorId } = req.body;

    if (!content || !professorId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Reply content and professor ID are required'
        }
      });
    }

    const communication = await Communication.findById(id);
    if (!communication) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Communication not found'
        }
      });
    }

    // Check if already replied
    if (communication.status === 'replied') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Communication has already been replied to'
        }
      });
    }

    // Update communication with reply
    communication.reply = {
      content,
      repliedBy: professorId,
      repliedDate: new Date()
    };
    communication.status = 'replied';

    const updatedCommunication = await communication.save();

    // Populate the response
    const communicationData = await Communication.findById(updatedCommunication._id)
      .populate('studentId', 'rollNumber userId')
      .populate('studentId.userId', 'profile.fullName email')
      .populate('reply.repliedBy', 'profile.fullName');

    res.json({
      success: true,
      data: {
        id: communicationData._id,
        student: {
          id: communicationData.studentId._id,
          name: communicationData.studentId.userId.profile.fullName,
          rollNumber: communicationData.studentId.rollNumber,
          email: communicationData.studentId.userId.email
        },
        subject: communicationData.subject,
        question: communicationData.question,
        askedDate: communicationData.askedDate,
        status: communicationData.status,
        priority: communicationData.priority,
        reply: {
          content: communicationData.reply.content,
          repliedBy: {
            id: communicationData.reply.repliedBy._id,
            name: communicationData.reply.repliedBy.profile.fullName
          },
          repliedDate: communicationData.reply.repliedDate
        }
      },
      message: 'Reply sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to send reply',
        details: error.message
      }
    });
  }
};

// Update communication reply
const updateCommunicationReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Reply content is required'
        }
      });
    }

    const communication = await Communication.findById(id);
    if (!communication) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Communication not found'
        }
      });
    }

    if (!communication.reply) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No reply found to update'
        }
      });
    }

    // Update reply content
    communication.reply.content = content;
    communication.reply.repliedDate = new Date();

    const updatedCommunication = await communication.save();

    // Populate the response
    const communicationData = await Communication.findById(updatedCommunication._id)
      .populate('studentId', 'rollNumber userId')
      .populate('studentId.userId', 'profile.fullName email')
      .populate('reply.repliedBy', 'profile.fullName');

    res.json({
      success: true,
      data: {
        id: communicationData._id,
        reply: {
          content: communicationData.reply.content,
          repliedBy: {
            id: communicationData.reply.repliedBy._id,
            name: communicationData.reply.repliedBy.profile.fullName
          },
          repliedDate: communicationData.reply.repliedDate
        }
      },
      message: 'Reply updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update reply',
        details: error.message
      }
    });
  }
};

// Update communication priority
const updateCommunicationPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (!['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Priority must be high, medium, or low'
        }
      });
    }

    const communication = await Communication.findByIdAndUpdate(
      id,
      { priority },
      { new: true, runValidators: true }
    );

    if (!communication) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Communication not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        id: communication._id,
        priority: communication.priority
      },
      message: 'Priority updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update priority',
        details: error.message
      }
    });
  }
};

// Mark communication as resolved
const markCommunicationResolved = async (req, res) => {
  try {
    const { id } = req.params;

    const communication = await Communication.findById(id);
    if (!communication) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Communication not found'
        }
      });
    }

    if (communication.status !== 'replied') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Communication must be replied to before marking as resolved'
        }
      });
    }

    // Add resolved status (you might want to add this to the schema)
    communication.status = 'resolved';
    communication.resolvedAt = new Date();

    await communication.save();

    res.json({
      success: true,
      data: {
        id: communication._id,
        status: communication.status,
        resolvedAt: communication.resolvedAt
      },
      message: 'Communication marked as resolved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to mark communication as resolved',
        details: error.message
      }
    });
  }
};

// Get communication statistics
const getCommunicationStatistics = async (req, res) => {
  try {
    const { professorId } = req.params;

    const professor = await Professor.findById(professorId).populate('subjects.subjectId', 'subjectName');
    if (!professor) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Professor not found'
        }
      });
    }

    const professorSubjects = professor.subjects.map(sub => sub.subjectId.subjectName);

    // Get communication statistics
    const stats = await Communication.aggregate([
      {
        $match: { subject: { $in: professorSubjects } }
      },
      {
        $group: {
          _id: null,
          totalCommunications: { $sum: 1 },
          pendingCommunications: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          repliedCommunications: {
            $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] }
          },
          resolvedCommunications: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get communications by subject
    const communicationsBySubject = await Communication.aggregate([
      {
        $match: { subject: { $in: professorSubjects } }
      },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          replied: {
            $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get communications by priority
    const communicationsByPriority = await Communication.aggregate([
      {
        $match: { subject: { $in: professorSubjects } }
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get recent communications
    const recentCommunications = await Communication.find({ subject: { $in: professorSubjects } })
      .populate('studentId', 'rollNumber userId')
      .populate('studentId.userId', 'profile.fullName')
      .select('studentId subject question askedDate status priority')
      .sort({ askedDate: -1 })
      .limit(5);

    // Get pending high priority communications
    const pendingHighPriority = await Communication.find({
      subject: { $in: professorSubjects },
      status: 'pending',
      priority: 'high'
    })
      .populate('studentId', 'rollNumber userId')
      .populate('studentId.userId', 'profile.fullName')
      .select('studentId subject question askedDate priority')
      .sort({ askedDate: 1 })
      .limit(10);

    // Calculate average response time
    const responseTimeStats = await Communication.aggregate([
      {
        $match: { 
          subject: { $in: professorSubjects },
          status: { $in: ['replied', 'resolved'] },
          'reply.repliedDate': { $exists: true }
        }
      },
      {
        $project: {
          responseTime: {
            $subtract: ['$reply.repliedDate', '$askedDate']
          }
        }
      },
      {
        $group: {
          _id: null,
          averageResponseTime: { $avg: '$responseTime' },
          minResponseTime: { $min: '$responseTime' },
          maxResponseTime: { $max: '$responseTime' }
        }
      }
    ]);

    const statistics = {
      totalCommunications: stats[0]?.totalCommunications || 0,
      pendingCommunications: stats[0]?.pendingCommunications || 0,
      repliedCommunications: stats[0]?.repliedCommunications || 0,
      resolvedCommunications: stats[0]?.resolvedCommunications || 0,
      highPriority: stats[0]?.highPriority || 0,
      mediumPriority: stats[0]?.mediumPriority || 0,
      lowPriority: stats[0]?.lowPriority || 0,
      responseRate: stats[0]?.totalCommunications > 0 ? 
        Math.round(((stats[0].repliedCommunications + stats[0].resolvedCommunications) / stats[0].totalCommunications) * 100) : 0,
      communicationsBySubject: communicationsBySubject.map(item => ({
        subject: item._id,
        count: item.count,
        pending: item.pending,
        replied: item.replied
      })),
      communicationsByPriority: communicationsByPriority.map(item => ({
        priority: item._id,
        count: item.count,
        pending: item.pending
      })),
      recentCommunications: recentCommunications.map(communication => ({
        id: communication._id,
        student: {
          id: communication.studentId._id,
          name: communication.studentId.userId.profile.fullName,
          rollNumber: communication.studentId.rollNumber
        },
        subject: communication.subject,
        question: communication.question.substring(0, 100) + (communication.question.length > 100 ? '...' : ''),
        askedDate: communication.askedDate,
        status: communication.status,
        priority: communication.priority
      })),
      pendingHighPriority: pendingHighPriority.map(communication => ({
        id: communication._id,
        student: {
          id: communication.studentId._id,
          name: communication.studentId.userId.profile.fullName,
          rollNumber: communication.studentId.rollNumber
        },
        subject: communication.subject,
        question: communication.question.substring(0, 100) + (communication.question.length > 100 ? '...' : ''),
        askedDate: communication.askedDate,
        priority: communication.priority,
        daysPending: Math.ceil((new Date() - communication.askedDate) / (1000 * 60 * 60 * 24))
      })),
      responseTime: responseTimeStats[0] ? {
        averageHours: Math.round(responseTimeStats[0].averageResponseTime / (1000 * 60 * 60) * 100) / 100,
        minHours: Math.round(responseTimeStats[0].minResponseTime / (1000 * 60 * 60) * 100) / 100,
        maxHours: Math.round(responseTimeStats[0].maxResponseTime / (1000 * 60 * 60) * 100) / 100
      } : null
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

// Get communications by subject
const getCommunicationsBySubject = async (req, res) => {
  try {
    const { professorId, subject } = req.params;
    const { page = 1, limit = 20, status = '', priority = '' } = req.query;

    // Build query
    const query = { subject };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    // Get communications with pagination
    const communications = await Communication.find(query)
      .populate('studentId', 'rollNumber userId')
      .populate('studentId.userId', 'profile.fullName email')
      .populate('reply.repliedBy', 'profile.fullName')
      .select('studentId studentName rollNumber subject question askedDate status priority reply createdAt updatedAt')
      .sort({ askedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Communication.countDocuments(query);

    // Format response
    const communicationsData = communications.map(communication => ({
      id: communication._id,
      student: {
        id: communication.studentId._id,
        name: communication.studentId.userId.profile.fullName,
        rollNumber: communication.studentId.rollNumber,
        email: communication.studentId.userId.email
      },
      subject: communication.subject,
      question: communication.question,
      askedDate: communication.askedDate,
      status: communication.status,
      priority: communication.priority,
      reply: communication.reply ? {
        content: communication.reply.content,
        repliedBy: communication.reply.repliedBy ? {
          id: communication.reply.repliedBy._id,
          name: communication.reply.repliedBy.profile.fullName
        } : null,
        repliedDate: communication.reply.repliedDate
      } : null,
      createdAt: communication.createdAt,
      updatedAt: communication.updatedAt
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

// Delete communication (admin only)
const deleteCommunication = async (req, res) => {
  try {
    const { id } = req.params;

    const communication = await Communication.findById(id);
    if (!communication) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Communication not found'
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

// Get recent communications for professor
const getRecentCommunications = async (req, res) => {
  try {
    const { professorId } = req.params;
    const { limit = 10 } = req.query;

    const communications = await Communication.find({
      $or: [
        { senderId: professorId },
        { receiverId: professorId }
      ]
    })
      .populate('senderId', 'profile.fullName')
      .populate('receiverId', 'profile.fullName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: communications
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

module.exports = {
  getProfessorCommunications,
  getCommunicationById,
  replyToCommunication,
  updateCommunicationReply,
  updateCommunicationPriority,
  markCommunicationResolved,
  getCommunicationStatistics,
  getCommunicationsBySubject,
  getRecentCommunications,
  deleteCommunication
};
