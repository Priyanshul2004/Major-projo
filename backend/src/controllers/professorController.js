const { Professor, User } = require('../models');

// Create New Professor - ULTRA SIMPLE
const createProfessor = async (req, res) => {
  try {
    console.log('=== CREATE PROFESSOR API CALLED ===');
    console.log('Request body:', req.body);
    
    // Extract whatever data is sent from frontend
    const { 
      name, 
      email, 
      subject, 
      experience, 
      password, 
      phone, 
      qualifications,
      firstName,
      lastName,
      employeeId,
      department,
      qualification
    } = req.body;

    console.log('Data received from frontend:', {
      name: name || 'Not provided',
      email: email || 'Not provided',
      subject: subject || 'Not provided',
      experience: experience || 'Not provided',
      password: password ? '***' : 'Not provided',
      phone: phone || 'Not provided'
    });

    // Generate unique employee ID
    let finalEmployeeId = employeeId;
    if (!finalEmployeeId) {
      let employeeCount = await Professor.countDocuments();
      do {
        employeeCount++;
        finalEmployeeId = `PROF${String(employeeCount).padStart(3, '0')}`;
        const existingProfessor = await Professor.findOne({ employeeId: finalEmployeeId });
        if (!existingProfessor) break;
      } while (true);
    }

    // Generate unique email if the provided email already exists
    let finalEmail = email || `professor${Date.now()}@test.com`;
    if (email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        finalEmail = `professor${Date.now()}@test.com`;
        console.log(`Email ${email} already exists, using ${finalEmail} instead`);
      }
    }

    // Create user with default values for anything missing
    const user = new User({
      email: finalEmail,
      password: password || '12345',
      role: 'professor',
      profile: {
        firstName: firstName || (name ? name.split(' ')[0] : 'Professor'),
        lastName: lastName || (name ? name.split(' ').slice(1).join(' ') : 'User'),
        fullName: name || `${firstName || 'Professor'} ${lastName || 'User'}`,
        phone: phone || '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        }
      },
      college: {
        code: 'UNI001',
        name: 'University of Technology',
        department: department || 'Computer Science'
      }
    });

    console.log('Creating user with email:', user.email);
    const savedUser = await user.save();
    console.log('User created successfully with ID:', savedUser._id);

    // Create professor with default values for anything missing
    const professor = new Professor({
      userId: savedUser._id,
      employeeId: finalEmployeeId,
      subjects: [], // Start with empty subjects
      experience: {
        totalYears: parseInt(experience) || 5,
        previousInstitutions: []
      },
      qualifications: qualifications && qualifications.length > 0 ? 
        qualifications.map(q => ({ 
          degree: q, 
          field: 'Computer Science', 
          institution: 'University', 
          year: new Date().getFullYear() 
        })) : 
        [{ 
          degree: qualification || 'M.Tech', 
          field: 'Computer Science', 
          institution: 'University', 
          year: new Date().getFullYear() 
        }],
      schedule: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: {
          start: '09:00',
          end: '17:00'
        }
      },
      performance: {
        rating: 0,
        totalClasses: 0,
        attendancePercentage: 0,
        studentFeedback: 0
      },
      status: 'active'
    });

    console.log('Creating professor with employee ID:', professor.employeeId);
    const savedProfessor = await professor.save();
    console.log('Professor created successfully with ID:', savedProfessor._id);

    console.log('✅ Professor creation completed successfully');
    
    // Return success response
    res.status(201).json({
      success: true,
      data: {
        professor: {
          id: savedProfessor._id,
          employeeId: savedProfessor.employeeId,
          userId: savedUser._id,
          email: savedUser.email,
          name: savedUser.profile.fullName,
          department: department || 'Computer Science',
          experience: savedProfessor.experience.totalYears,
          status: savedProfessor.status
        }
      },
      message: 'Professor created successfully'
    });

  } catch (error) {
    console.error('❌ Professor Creation Error:', error);
    console.error('Error Stack:', error.stack);
    
    // Handle specific error types
    let errorMessage = 'Failed to create professor';
    let statusCode = 500;
    
    if (error.code === 11000) {
      // Duplicate key error
      errorMessage = 'Email already exists. Please use a different email address.';
      statusCode = 400;
    } else if (error.name === 'ValidationError') {
      // Validation error
      errorMessage = 'Invalid data provided. Please check your input.';
      statusCode = 400;
    }
    
    // Return error response
    res.status(statusCode).json({
      success: false,
      error: {
        message: errorMessage,
        details: error.message
      }
    });
  }
};

// Get All Professors
const getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.find()
      .populate('userId', 'email profile role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: professors,
      message: 'Professors retrieved successfully'
    });
  } catch (error) {
    console.error('Get All Professors Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to retrieve professors' }
    });
  }
};

// Get Professor by ID
const getProfessorById = async (req, res) => {
  try {
    const { id } = req.params;
    const professor = await Professor.findById(id)
      .populate('userId', 'email profile role');

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: { message: 'Professor not found' }
      });
    }

    res.json({
      success: true,
      data: professor,
      message: 'Professor retrieved successfully'
    });
  } catch (error) {
    console.error('Get Professor by ID Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to retrieve professor' }
    });
  }
};

// Update Professor
const updateProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const professor = await Professor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: false }
    ).populate('userId', 'email profile role');

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: { message: 'Professor not found' }
      });
    }

    res.json({
      success: true,
      data: professor,
      message: 'Professor updated successfully'
    });
  } catch (error) {
    console.error('Update Professor Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update professor' }
    });
  }
};

// Delete Professor
const deleteProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    const professor = await Professor.findById(id);
    if (!professor) {
      return res.status(404).json({
        success: false,
        error: { message: 'Professor not found' }
      });
    }

    // Delete associated user
    await User.findByIdAndDelete(professor.userId);

    // Delete professor
    await Professor.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Professor deleted successfully'
    });
  } catch (error) {
    console.error('Delete Professor Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete professor' }
    });
  }
};

module.exports = {
  createProfessor,
  getAllProfessors,
  getProfessorById,
  updateProfessor,
  deleteProfessor
};