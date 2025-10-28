const { User, Professor, Student, Subject, Material, Communication, Attendance, ExamResult } = require('../models');
const mongoose = require('mongoose');

// Attendance functions
const getMyAttendance = async (req, res) => {
  try {
    console.log('=== getMyAttendance CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { page = 1, limit = 20, search = '', subject = '' } = req.query;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId })
      .populate('subjects.subjectId', 'subjectName subjectCode')
      .populate('subjects.professorId', 'userId')
      .populate('subjects.professorId.userId', 'profile.fullName');
    
    if (!student) {
      // Return empty data if student not found
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      });
    }

    console.log('Student found:', student.rollNumber);
    console.log('Student subjects:', student.subjects.length);

    // Filter subjects by search term if provided
    let filteredSubjects = student.subjects;
    
    if (search) {
      filteredSubjects = student.subjects.filter(subject => 
        subject.subjectId?.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
        subject.subjectId?.subjectCode?.toLowerCase().includes(search.toLowerCase()) ||
        subject.professorId?.userId?.profile?.fullName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by specific subject if provided
    if (subject) {
      filteredSubjects = filteredSubjects.filter(sub => 
        sub.subjectId && sub.subjectId._id.toString() === subject
      );
    }

    // Format response - create attendance data for each subject
    const attendanceData = filteredSubjects.map(subject => {
      const totalClasses = subject.attendance ? subject.attendance.totalClasses : 0;
      const attendedClasses = subject.attendance ? subject.attendance.attendedClasses : 0;
      const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100 * 10) / 10 : 0;

      return {
        id: subject.subjectId?._id || subject._id,
        subject: subject.subjectId?.subjectName || 'Unknown Subject',
        subjectCode: subject.subjectId?.subjectCode || 'N/A',
        professor: subject.professorId?.userId?.profile?.fullName || 'Unknown Professor',
        totalClasses: totalClasses,
        attended: attendedClasses,
        percentage: percentage,
        status: percentage >= 75 ? 'Good' : percentage >= 50 ? 'Average' : 'Poor'
      };
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = attendanceData.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: attendanceData.length,
        totalPages: Math.ceil(attendanceData.length / limit)
      }
    });
  } catch (error) {
    console.error('Error in getMyAttendance:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch attendance',
        details: error.message
      }
    });
  }
};

const getAttendanceSummary = async (req, res) => {
  try {
    console.log('=== getAttendanceSummary CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    // Find student document with populated subjects
    let student = await Student.findOne({ userId: studentId })
      .populate('subjects.subjectId', 'subjectName subjectCode')
      .populate('subjects.professorId', 'userId')
      .populate('subjects.professorId.userId', 'profile.fullName');
    
    if (!student) {
      // Return empty data if student not found
      return res.json({
        success: true,
        data: {
          totalClasses: 0,
          attendedClasses: 0,
          averageAttendance: 0,
          subjects: []
        }
      });
    }

    // Calculate attendance from student subjects
    let totalClasses = 0;
    let attendedClasses = 0;
    let subjects = [];

    if (student.subjects && student.subjects.length > 0) {
      student.subjects.forEach(subject => {
        if (subject.attendance) {
          const subjectTotalClasses = subject.attendance.totalClasses || 0;
          const subjectAttendedClasses = subject.attendance.attendedClasses || 0;
          
          totalClasses += subjectTotalClasses;
          attendedClasses += subjectAttendedClasses;
          
          const percentage = subjectTotalClasses > 0 ? Math.round((subjectAttendedClasses / subjectTotalClasses) * 100 * 10) / 10 : 0;
          
          subjects.push({
            id: subject.subjectId?._id || subject._id,
            name: subject.subjectId?.subjectName || 'Unknown Subject',
            code: subject.subjectId?.subjectCode || 'N/A',
            professor: subject.professorId?.userId?.profile?.fullName || 'Unknown Professor',
            totalClasses: subjectTotalClasses,
            attendedClasses: subjectAttendedClasses,
            percentage: percentage
          });
        }
      });
    }

    const averageAttendance = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalClasses,
        attendedClasses,
        averageAttendance: Math.round(averageAttendance * 100) / 100,
        subjects
      }
    });
  } catch (error) {
    console.error('Error in getAttendanceSummary:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch attendance summary',
        details: error.message
      }
    });
  }
};

const getAttendanceBySubject = async (req, res) => {
  try {
    console.log('=== getAttendanceBySubject CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { subjectId } = req.params;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { message: 'Student not found' }
      });
    }

    // Get attendance for specific subject
    const attendanceRecords = await Attendance.find({
      studentId: student._id,
      subjectId: new mongoose.Types.ObjectId(subjectId)
    })
    .populate('subjectId', 'subjectName subjectCode')
    .populate('professorId', 'userId')
    .populate('professorId.userId', 'profile.fullName')
    .select('date status remarks')
    .sort({ date: -1 });

    // Format response
    const attendanceData = attendanceRecords.map(record => ({
      id: record._id,
      date: record.date,
      status: record.status,
      subject: record.subjectId.subjectName,
      subjectCode: record.subjectId.subjectCode,
      professor: record.professorId.userId.profile.fullName,
      remarks: record.remarks
    }));

    res.json({
      success: true,
      data: attendanceData
    });
  } catch (error) {
    console.error('Error in getAttendanceBySubject:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch attendance by subject',
        details: error.message
      }
    });
  }
};

// Materials functions
const getMyMaterials = async (req, res) => {
  try {
    console.log('=== getMyMaterials CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { page = 1, limit = 20, search = '', subject = '', type = '' } = req.query;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      // Return empty data if student not found
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      });
    }

    // Build query for materials - show ALL materials from all professors
    const materialQuery = {};

    // Filter by type
    if (type) {
      materialQuery.type = type;
    }

    // Filter by subject
    if (subject) {
      materialQuery.subjectId = new mongoose.Types.ObjectId(subject);
    }

    // Search by title or description
    if (search) {
      materialQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get materials
    const materials = await Material.find(materialQuery)
      .populate('subjectId', 'subjectName subjectCode')
      .populate('professorId', 'employeeId')
      .select('title description type fileUrl professorId subjectId createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Material.countDocuments(materialQuery);

    // Format response
    const materialsData = materials.map(material => ({
      id: material._id,
      title: material.title,
      description: material.description,
      type: material.type,
      fileUrl: material.fileUrl,
      subject: material.subjectId?.subjectName || 'Unknown',
      subjectCode: material.subjectId?.subjectCode || 'N/A',
      uploadedBy: material.professorId?.employeeId || 'Unknown Professor',
      uploadedDate: material.createdAt
    }));

    res.json({
      success: true,
      data: materialsData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getMyMaterials:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch materials',
        details: error.message
      }
    });
  }
};

const getMaterialById = async (req, res) => {
  try {
    console.log('=== getMaterialById CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { materialId } = req.params;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { message: 'Student not found' }
      });
    }

    // Get material - show all materials (no student restriction)
    const material = await Material.findOne({
      _id: materialId
    })
    .populate('subjectId', 'subjectName subjectCode')
    .populate('professorId', 'employeeId');

    if (!material) {
      return res.status(404).json({
        success: false,
        error: { message: 'Material not found' }
      });
    }

    res.json({
      success: true,
      data: {
        id: material._id,
        title: material.title,
        description: material.description,
        type: material.type,
        fileUrl: material.fileUrl,
        subject: material.subjectId?.subjectName || 'Unknown',
        subjectCode: material.subjectId?.subjectCode || 'N/A',
        uploadedBy: material.professorId?.employeeId || 'Unknown Professor',
        uploadedDate: material.createdAt
      }
    });
  } catch (error) {
    console.error('Error in getMaterialById:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch material',
        details: error.message
      }
    });
  }
};

const downloadMaterial = async (req, res) => {
  try {
    console.log('=== downloadMaterial CALLED ===');
    
    // Get student ID from JWT token
    const studentId = req.user?.userId;
    console.log('Student ID from token:', studentId);
    
    if (!studentId) {
      return res.status(401).json({
        success: false,
        error: { message: 'Student not authenticated' }
      });
    }

    const { materialId } = req.params;
    
    // Find student document
    let student = await Student.findOne({ userId: studentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: { message: 'Student not found' }
      });
    }

    // Get material - allow download of all materials
    const material = await Material.findOne({
      _id: materialId
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        error: { message: 'Material not found' }
      });
    }

    // Return download URL
    res.json({
      success: true,
      data: {
        downloadUrl: material.fileUrl,
        fileName: material.title,
        fileType: material.type
      },
      message: 'Download link generated successfully'
    });
  } catch (error) {
    console.error('Error in downloadMaterial:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to download material',
        details: error.message
      }
    });
  }
};

module.exports = {
  getMyAttendance,
  getAttendanceSummary,
  getAttendanceBySubject,
  getMyMaterials,
  getMaterialById,
  downloadMaterial
};
