const jwt = require('jsonwebtoken');
const { User, Student, Professor, HOD } = require('../models');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Student Signup - NO VALIDATION
const studentSignup = async (req, res) => {
  try {
    console.log('=== STUDENT SIGNUP ===');
    const {
      rollNumber,
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      academicYear,
      semester,
      specialization
    } = req.body;

    console.log('Student signup data:', { email, firstName, lastName });

    // Create user
    const user = new User({
      email: email || 'student@test.com',
      password: password || '12345',
      role: 'student',
      profile: {
        firstName: firstName || 'Student',
        lastName: lastName || 'User',
        fullName: `${firstName || 'Student'} ${lastName || 'User'}`,
        phone: phone || '',
        address: {
          street: address || '',
          city: '',
          state: '',
          zipCode: ''
        }
      },
      college: {
        code: 'UNI001',
        name: 'University of Technology',
        department: 'Computer Science'
      }
    });

    const savedUser = await user.save();
    console.log('User created:', savedUser._id);

    // Create student with proper academic info structure
    const currentDate = new Date();
    const admissionDate = new Date();
    const expectedGraduation = new Date();
    expectedGraduation.setFullYear(admissionDate.getFullYear() + 4); // 4-year program

    // Generate unique enrollment number
    let enrollmentNumber;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const enrollmentCount = await Student.countDocuments();
      enrollmentNumber = `ENR${String(enrollmentCount + 1 + attempts).padStart(6, '0')}`;
      
      // Check if this enrollment number already exists
      const existingStudent = await Student.findOne({ enrollmentNumber });
      if (!existingStudent) {
        isUnique = true;
      }
      attempts++;
    }
    
    if (!isUnique) {
      // Fallback to timestamp-based enrollment number
      enrollmentNumber = `ENR${Date.now()}`;
    }

    const student = new Student({
      userId: savedUser._id,
      rollNumber: rollNumber || `STU${Date.now()}`,
      enrollmentNumber: enrollmentNumber,
      academicInfo: {
        currentYear: 1,
        semester: parseInt(semester) || 1,
        program: 'Bachelor of Technology',
        specialization: specialization || 'Computer Science',
        admissionDate: admissionDate,
        expectedGraduation: expectedGraduation
      },
      subjects: [],
      createdBy: null, // Auth registration doesn't have a specific professor
      status: 'active'
    });

    const savedStudent = await student.save();
    console.log('Student created:', savedStudent._id);

    // Generate token
    const token = generateToken(savedUser._id, 'student');

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: savedUser._id,
          email: savedUser.email,
          role: savedUser.role,
          profile: savedUser.profile
        },
        student: {
          id: savedStudent._id,
          rollNumber: savedStudent.rollNumber,
          academicYear: savedStudent.academicYear,
          semester: savedStudent.semester,
          specialization: savedStudent.specialization
        }
      },
      message: 'Student registered successfully'
    });
  } catch (error) {
    console.error('Student Signup Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to register student' }
    });
  }
};

// Professor Signup - NO VALIDATION
const professorSignup = async (req, res) => {
  try {
    console.log('=== PROFESSOR SIGNUP ===');
    const {
      employeeId,
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      qualification,
      experience,
      department
    } = req.body;

    console.log('Professor signup data:', { email, firstName, lastName });

    // Create user
    const user = new User({
      email: email || 'professor@test.com',
      password: password || '12345',
      role: 'professor',
      profile: {
        firstName: firstName || 'Professor',
        lastName: lastName || 'User',
        fullName: `${firstName || 'Professor'} ${lastName || 'User'}`,
        phone: phone || '',
        address: {
          street: address || '',
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

    const savedUser = await user.save();
    console.log('User created:', savedUser._id);

    // Create professor with current model structure
    const professor = new Professor({
      userId: savedUser._id,
      employeeId: employeeId || `PROF${Date.now()}`,
      subjects: [],
      experience: {
        totalYears: parseInt(experience) || 5,
        previousInstitutions: []
      },
      qualifications: [{
        degree: qualification || 'M.Tech',
        field: 'Computer Science',
        institution: 'University',
        year: new Date().getFullYear() - 5
      }],
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

    const savedProfessor = await professor.save();
    console.log('Professor created:', savedProfessor._id);

    // Generate token
    const token = generateToken(savedUser._id, 'professor');

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: savedUser._id,
          email: savedUser.email,
          role: savedUser.role,
          profile: savedUser.profile
        },
        professor: {
          id: savedProfessor._id,
          employeeId: savedProfessor.employeeId,
          qualification: savedProfessor.qualification,
          experience: savedProfessor.experience,
          department: savedProfessor.department
        }
      },
      message: 'Professor registered successfully'
    });
  } catch (error) {
    console.error('Professor Signup Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to register professor' }
    });
  }
};

// HOD Signup - NO VALIDATION
const hodSignup = async (req, res) => {
  try {
    console.log('=== HOD SIGNUP ===');
    const { 
      employeeId, 
      email, 
      password, 
      firstName, 
      lastName,
      phone,
      dateOfBirth,
      address,
      qualification,
      experience,
      department
    } = req.body;

    console.log('HOD signup data:', { email, firstName, lastName });

    // Create user
    const user = new User({
      email: email || 'hod@test.com',
      password: password || '12345',
      role: 'hod',
      profile: {
        firstName: firstName || 'HOD',
        lastName: lastName || 'User',
        fullName: `${firstName || 'HOD'} ${lastName || 'User'}`,
        phone: phone || '',
        address: {
          street: address || '',
          city: '',
          state: '',
          zipCode: ''
        }
      },
      college: {
        code: 'TEST',
        name: 'Test College',
        department: department || 'General'
      }
    });

    const savedUser = await user.save();
    console.log('User created:', savedUser._id);

    // Create HOD
    const hod = new HOD({
      userId: savedUser._id,
      employeeId: employeeId || `HOD${Date.now()}`,
      qualification: qualification || 'Ph.D',
      experience: experience || 10,
      department: department || 'General'
    });

    const savedHOD = await hod.save();
    console.log('HOD created:', savedHOD._id);

    // Generate token
    const token = generateToken(savedUser._id, 'hod');

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: savedUser._id,
          email: savedUser.email,
          role: savedUser.role,
          profile: savedUser.profile
        },
        hod: {
          id: savedHOD._id,
          employeeId: savedHOD.employeeId,
          qualification: savedHOD.qualification,
          experience: savedHOD.experience,
          department: savedHOD.department
        }
      },
      message: 'HOD registered successfully'
    });
  } catch (error) {
    console.error('HOD Signup Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to register HOD' }
    });
  }
};

// SIMPLE LOGIN - JUST EMAIL AND PASSWORD
const login = async (req, res) => {
  try {
    console.log('=== LOGIN FUNCTION ===');
    console.log('Request body:', req.body);
    
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: password ? '***' : 'undefined' });

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' }
      });
    }

    console.log('User details:', { id: user._id, email: user.email, role: user.role });

    // Check password
    console.log('Checking password...');
    console.log('Stored password:', user.password);
    console.log('Input password:', password);
    console.log('Passwords match:', user.password === password);
    
    if (user.password !== password) {
      console.log('Password mismatch');
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' }
      });
    }

    // Ensure Professor document exists for professor users
    if (user.role === 'professor') {
      console.log('User is professor, checking if Professor document exists...');
      let professor = await Professor.findOne({ userId: user._id });
      
      if (!professor) {
        console.log('Professor document not found, creating one...');
        // Create professor document if missing
        const professorCount = await Professor.countDocuments();
        const employeeId = `PROF${String(professorCount + 1).padStart(3, '0')}`;

        professor = new Professor({
          userId: user._id,
          employeeId: employeeId,
          subjects: [],
          experience: {
            totalYears: 0,
            previousInstitutions: []
          },
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
      } else {
        console.log('Professor document found with ID:', professor._id);
      }
    }

    // Generate token
    console.log('Password correct, generating token...');
    const token = generateToken(user._id, user.role);
    console.log('Token generated successfully');

    console.log('Sending success response...');
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Login failed' }
    });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get user' }
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({
        success: false,
        error: { message: 'Current password is incorrect' }
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to change password' }
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Logout failed' }
    });
  }
};

module.exports = {
  studentSignup,
  professorSignup,
  hodSignup,
  login,
  getCurrentUser,
  changePassword,
  logout
};