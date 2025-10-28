const { User, Professor, Student, Subject } = require('../models');
const mongoose = require('mongoose');

// Get Students in Professor's Class
const getStudentsInClass = async (req, res) => {
  try {
    const { professorId } = req.params;
    const { page = 1, limit = 20, search = '', subjectId = '' } = req.query;
    
    console.log('=== getStudentsInClass CALLED ===');
    console.log('Professor ID:', professorId);
    console.log('Query params:', { page, limit, search, subjectId });
    
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
          
          // Populate the subjects after saving
          professor = await Professor.findById(professor._id)
            .populate('subjects.subjectId', 'subjectName subjectCode');
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

    // Build query for students - use the actual professor document ID
    const actualProfessorId = professor._id;
    const studentQuery = { 
      status: 'active',
      $or: [
        { 'subjects.professorId': actualProfessorId }, // Students assigned to professor's subjects
        { 'createdBy': actualProfessorId }             // Students created by this professor
      ]
    };

    // Filter by specific subject if provided
    if (subjectId) {
      studentQuery['subjects.subjectId'] = new mongoose.Types.ObjectId(subjectId);
    }

    // Search by name, roll number, or email
    if (search) {
      studentQuery.$or = [
        { rollNumber: { $regex: search, $options: 'i' } },
        { 'userId.profile.fullName': { $regex: search, $options: 'i' } },
        { 'userId.profile.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Get students with populated user data
    const students = await Student.find(studentQuery)
      .populate('userId', 'profile.fullName profile.email profile.phone')
      .populate('subjects.subjectId', 'subjectName subjectCode')
      .select('rollNumber academicInfo.currentYear academicInfo.specialization subjects enrollmentDate')
      .sort({ rollNumber: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Student.countDocuments(studentQuery);

    // Format response
    const studentsData = students.map(student => ({
      id: student._id,
      rollNo: student.rollNumber,
      name: student.userId.profile.fullName,
      email: student.userId.profile.email,
      phone: student.userId.profile.phone,
      joinDate: student.enrollmentDate,
      year: student.academicInfo.currentYear,
      specialization: student.academicInfo.specialization,
      subjects: student.subjects
        .filter(sub => sub.professorId.toString() === actualProfessorId.toString())
        .map(sub => ({
          id: sub.subjectId._id,
          name: sub.subjectId.subjectName,
          code: sub.subjectId.subjectCode
        }))
    }));

    res.json({
      success: true,
      data: studentsData,
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
        message: 'Failed to fetch students in class',
        details: error.message
      }
    });
  }
};

// Get Student by ID
const getStudentById = async (req, res) => {
  try {
    const { professorId, studentId } = req.params;

    // Get student with populated data
    const student = await Student.findById(studentId)
      .populate('userId', 'profile.fullName profile.email profile.phone')
      .populate('subjects.subjectId', 'subjectName subjectCode')
      .populate('subjects.professorId', 'userId employeeId');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    // Check if student is taught by this professor
    const isTaughtByProfessor = student.subjects.some(
      sub => sub.professorId._id.toString() === professorId
    );

    if (!isTaughtByProfessor) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Student is not in your class'
        }
      });
    }

    // Format response
    const studentData = {
      id: student._id,
      rollNo: student.rollNumber,
      name: student.userId.profile.fullName,
      email: student.userId.profile.email,
      phone: student.userId.profile.phone,
      joinDate: student.enrollmentDate,
      year: student.academicInfo.currentYear,
      specialization: student.academicInfo.specialization,
      subjects: student.subjects
        .filter(sub => sub.professorId._id.toString() === professorId)
        .map(sub => ({
          id: sub.subjectId._id,
          name: sub.subjectId.subjectName,
          code: sub.subjectId.subjectCode,
          progress: sub.progress,
          attendance: sub.attendance
        }))
    };

    res.json({
      success: true,
      data: studentData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch student details',
        details: error.message
      }
    });
  }
};

// Add Student to Professor's Class
const addStudentToClass = async (req, res) => {
  try {
    console.log('=== addStudentToClass CONTROLLER CALLED ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    
    const { professorId } = req.params;
    const { rollNo, name, email, phone, password, subjectIds } = req.body;
    
    console.log('Extracted data:', { professorId, rollNo, name, email, phone, password, subjectIds });

    // Validate required fields
    if (!rollNo || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Roll number, name, email, and password are required'
        }
      });
    }

    // Check if student with this roll number already exists
    const existingStudent = await Student.findOne({ rollNumber: rollNo });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Student with this roll number already exists'
        }
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log('User with email already exists:', email);
      return res.status(400).json({
        success: false,
        error: {
          message: 'User with this email already exists'
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
          error: {
            message: 'Professor not found'
          }
        });
      }
    }

    // Create user account for student
    const user = new User({
      email: email,
      password: password, // In real app, this should be hashed
      role: 'student',
      profile: {
        fullName: name,
        phone: phone || '',
        avatar: ''
      },
      status: 'active'
    });

    await user.save();

    // Prepare subjects array - use the actual professor document ID
    const actualProfessorId = professor._id;
    const subjects = subjectIds ? subjectIds.map(subjectId => ({
      subjectId: new mongoose.Types.ObjectId(subjectId),
      professorId: actualProfessorId,
      enrollmentDate: new Date(),
      progress: {
        completedChapters: 0,
        totalChapters: 0
      },
      attendance: {
        totalClasses: 0,
        attendedClasses: 0,
        percentage: 0
      }
    })) : [];

    // Create student record with all required academic info
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
      userId: user._id,
      rollNumber: rollNo,
      enrollmentNumber: enrollmentNumber,
      academicInfo: {
        currentYear: 1, // Default to first year
        semester: 1,
        program: 'Bachelor of Technology',
        specialization: 'Computer Science', // Default specialization
        admissionDate: admissionDate,
        expectedGraduation: expectedGraduation
      },
      subjects: subjects,
      createdBy: professor._id, // Track which professor created this student
      status: 'active'
    });

    await student.save();

    // Populate the created student for response
    await student.populate('userId', 'profile.fullName profile.email profile.phone');

    res.status(201).json({
      success: true,
      data: {
        id: student._id,
        rollNo: student.rollNumber,
        name: student.userId.profile.fullName,
        email: student.userId.profile.email,
        phone: student.userId.profile.phone,
        joinDate: student.academicInfo.enrollmentDate
      },
      message: 'Student added successfully to class'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to add student to class',
        details: error.message
      }
    });
  }
};

// Remove Student from Professor's Class
const removeStudentFromClass = async (req, res) => {
  try {
    const { professorId, studentId } = req.params;

    // Get student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    // Check if student is taught by this professor
    const subjectIndex = student.subjects.findIndex(
      sub => sub.professorId.toString() === professorId
    );

    if (subjectIndex === -1) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Student is not in your class'
        }
      });
    }

    // Remove the subject from student's subjects array
    student.subjects.splice(subjectIndex, 1);

    // If student has no more subjects, you might want to handle this case
    // For now, we'll just remove the subject
    await student.save();

    res.json({
      success: true,
      message: 'Student removed successfully from class'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to remove student from class',
        details: error.message
      }
    });
  }
};

// Get Professor's Subjects (for adding students)
const getProfessorSubjects = async (req, res) => {
  try {
    const { professorId } = req.params;

    // Get professor with subjects
    const professor = await Professor.findById(professorId)
      .populate('subjects.subjectId', 'subjectName subjectCode');

    if (!professor) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Professor not found'
        }
      });
    }

    // Format subjects
    const subjects = professor.subjects.map(subject => ({
      id: subject.subjectId._id,
      name: subject.subjectId.subjectName,
      code: subject.subjectId.subjectCode
    }));

    res.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch professor subjects',
        details: error.message
      }
    });
  }
};

// Update Student Information
const updateStudentInfo = async (req, res) => {
  try {
    const { professorId, studentId } = req.params;
    const { name, email, phone } = req.body;

    // Get student
    const student = await Student.findById(studentId)
      .populate('userId');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    // Check if student is taught by this professor
    const isTaughtByProfessor = student.subjects.some(
      sub => sub.professorId.toString() === professorId
    );

    if (!isTaughtByProfessor) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Student is not in your class'
        }
      });
    }

    // Update user profile
    if (name) student.userId.profile.fullName = name;
    if (email) student.userId.profile.email = email;
    if (phone) student.userId.profile.phone = phone;

    await student.userId.save();

    res.json({
      success: true,
      message: 'Student information updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update student information',
        details: error.message
      }
    });
  }
};

module.exports = {
  getStudentsInClass,
  getStudentById,
  addStudentToClass,
  removeStudentFromClass,
  getProfessorSubjects,
  updateStudentInfo
};
