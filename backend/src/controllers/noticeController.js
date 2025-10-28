const { Notice, User } = require('../models');
const mongoose = require('mongoose');

// Get All Notices
const getAllNotices = async (req, res) => {
  try {
    const { page = 1, limit = 20, priority = '', category = '', search = '' } = req.query;
    
    // Build query
    const query = {};
    
    if (priority) {
      query.priority = priority;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Get notices with author information
    const notices = await Notice.find(query)
      .populate('author.userId', 'profile.fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Notice.countDocuments(query);

    // Format response
    const noticesData = notices.map(notice => ({
      id: notice._id,
      title: notice.title,
      content: notice.content,
      date: notice.createdAt.toISOString().split('T')[0],
      author: notice.author.name || (notice.author.userId && notice.author.userId.profile ? notice.author.userId.profile.fullName : 'Unknown'),
      priority: notice.priority,
      category: notice.category
    }));

    res.json({
      success: true,
      data: noticesData,
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
        message: 'Failed to fetch notices',
        details: error.message
      }
    });
  }
};

// Create New Notice
const createNotice = async (req, res) => {
  try {
    console.log('=== CREATE NOTICE API CALLED ===');
    console.log('Request body:', req.body);
    
    const { title, content, priority, category, authorId } = req.body;

    // Validate required fields
    if (!title || !content || !priority || !category) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Title, content, priority, and category are required'
        }
      });
    }

    // Convert to lowercase to match model enum values
    const normalizedPriority = priority.toLowerCase();
    const normalizedCategory = category.toLowerCase();

    // Validate priority values (model expects lowercase)
    const validPriorities = ['high', 'medium', 'low'];
    if (!validPriorities.includes(normalizedPriority)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Priority must be High, Medium, or Low'
        }
      });
    }

    // Validate category values (model expects lowercase)
    const validCategories = ['academic', 'general', 'event', 'health'];
    if (!validCategories.includes(normalizedCategory)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Category must be Academic, General, Event, or Health'
        }
      });
    }

    // Get author information (for now, use a default HOD user or create one)
    let authorUserId;
    let authorName = 'HOD';
    let authorRole = 'hod';

    if (authorId && mongoose.Types.ObjectId.isValid(authorId)) {
      try {
        const user = await User.findById(authorId);
        if (user) {
          authorUserId = new mongoose.Types.ObjectId(authorId);
          authorName = user.profile.fullName || `${user.profile.firstName} ${user.profile.lastName}`;
          authorRole = user.role;
        } else {
          authorUserId = new mongoose.Types.ObjectId();
        }
      } catch (error) {
        console.log('Could not find user, using default values');
        authorUserId = new mongoose.Types.ObjectId();
      }
    } else {
      // Generate a new ObjectId if no valid authorId provided
      authorUserId = new mongoose.Types.ObjectId();
    }

    // Create new notice with proper author structure
    const notice = new Notice({
      title,
      content,
      priority: normalizedPriority,
      category: normalizedCategory,
      author: {
        userId: authorUserId,
        name: authorName,
        role: authorRole
      },
      status: 'published', // Model expects 'published', not 'active'
      targetAudience: ['all'], // Should be an array
      publishDate: new Date()
    });

    console.log('Creating notice with data:', {
      title,
      content,
      priority: normalizedPriority,
      category: normalizedCategory,
      author: notice.author
    });

    await notice.save();
    console.log('Notice created successfully with ID:', notice._id);

    res.status(201).json({
      success: true,
      data: {
        id: notice._id,
        title: notice.title,
        content: notice.content,
        date: notice.createdAt.toISOString().split('T')[0],
        author: notice.author.name,
        priority: notice.priority,
        category: notice.category
      },
      message: 'Notice created successfully'
    });
  } catch (error) {
    console.error('❌ Notice Creation Error:', error);
    console.error('Error Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create notice',
        details: error.message
      }
    });
  }
};

module.exports = {
  getAllNotices,
  createNotice
};
