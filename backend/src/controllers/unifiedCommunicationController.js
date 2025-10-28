const { Communication, Professor, Student, Subject, User } = require('../models');
const mongoose = require('mongoose');

// Get ALL student doubts/questions for ALL professors (unified API)
const getAllStudentDoubts = async (req, res) => {
  try {
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

    console.log('=== UNIFIED COMMUNICATION API CALLED ===');
    console.log('Query params:', { page, limit, status, priority, subject, search, sortBy, sortOrder });

    // Build query - get ALL communications from ALL students
    let query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sort order
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get communications with pagination
    const communications = await Communication.find(query)
      .populate('studentId', 'rollNumber userId')
      .populate('studentId.userId', 'profile.fullName email')
      .populate('reply.repliedBy', 'profile.fullName')
      .select('studentId studentName rollNumber subject question askedDate status priority reply createdAt updatedAt')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Communication.countDocuments(query);

    // Format response
    const communicationsData = communications.map(comm => ({
      id: comm._id,
      student: {
        id: comm.studentId?._id,
        name: comm.studentName || comm.studentId?.userId?.profile?.fullName || 'Unknown Student',
        rollNo: comm.rollNumber || comm.studentId?.rollNumber || 'N/A',
        email: comm.studentId?.userId?.email || 'N/A'
      },
      subject: comm.subject,
      question: comm.question,
      askedDate: comm.askedDate,
      status: comm.status,
      priority: comm.priority,
      reply: comm.reply ? {
        content: comm.reply.content,
        repliedBy: comm.reply.repliedBy?.profile?.fullName || 'Unknown Professor',
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
    console.error('Error in getAllStudentDoubts:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch student doubts',
        details: error.message
      }
    });
  }
};

// Get communication statistics for all doubts
const getCommunicationStatistics = async (req, res) => {
  try {
    console.log('=== UNIFIED COMMUNICATION STATISTICS API CALLED ===');

    // Get total communications
    const totalCommunications = await Communication.countDocuments();
    
    // Get pending communications
    const pendingCommunications = await Communication.countDocuments({ status: 'pending' });
    
    // Get replied communications
    const repliedCommunications = await Communication.countDocuments({ status: 'replied' });
    
    // Get communications by priority
    const highPriority = await Communication.countDocuments({ priority: 'high' });
    const mediumPriority = await Communication.countDocuments({ priority: 'medium' });
    const lowPriority = await Communication.countDocuments({ priority: 'low' });
    
    // Get recent communications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCommunications = await Communication.countDocuments({
      askedDate: { $gte: sevenDaysAgo }
    });

    // Get communications by subject
    const subjectStats = await Communication.aggregate([
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
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        total: totalCommunications,
        pending: pendingCommunications,
        replied: repliedCommunications,
        replyRate: totalCommunications > 0 ? Math.round((repliedCommunications / totalCommunications) * 100) : 0,
        priority: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority
        },
        recent: recentCommunications,
        subjectStats: subjectStats.map(stat => ({
          subject: stat._id,
          total: stat.count,
          pending: stat.pending,
          replied: stat.replied
        }))
      }
    });
  } catch (error) {
    console.error('Error in getCommunicationStatistics:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch communication statistics',
        details: error.message
      }
    });
  }
};

// Reply to student doubt (unified for all professors)
const replyToStudentDoubt = async (req, res) => {
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
          id: communicationData.studentId?._id,
          name: communicationData.studentName || communicationData.studentId?.userId?.profile?.fullName || 'Unknown Student',
          rollNo: communicationData.rollNumber || communicationData.studentId?.rollNumber || 'N/A',
          email: communicationData.studentId?.userId?.email || 'N/A'
        },
        subject: communicationData.subject,
        question: communicationData.question,
        askedDate: communicationData.askedDate,
        status: communicationData.status,
        priority: communicationData.priority,
        reply: communicationData.reply ? {
          content: communicationData.reply.content,
          repliedBy: communicationData.reply.repliedBy?.profile?.fullName || 'Unknown Professor',
          repliedDate: communicationData.reply.repliedDate
        } : null
      },
      message: 'Reply sent successfully'
    });
  } catch (error) {
    console.error('Error in replyToStudentDoubt:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to send reply',
        details: error.message
      }
    });
  }
};

module.exports = {
  getAllStudentDoubts,
  getCommunicationStatistics,
  replyToStudentDoubt
};
