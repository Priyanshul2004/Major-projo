const { Material, Student, Professor, Subject } = require('../models');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Get student's available materials
const getStudentMaterials = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      type = '', 
      subject = '', 
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
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
      subjectId: { $in: studentSubjects },
      status: 'active'
    };

    if (type) {
      query.type = type;
    }

    if (subject) {
      query.subjectId = new mongoose.Types.ObjectId(subject);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get materials with pagination
    const materials = await Material.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName')
      .select('title description type subjectId professorId fileUrl filename fileSize fileType downloads status createdAt updatedAt')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Material.countDocuments(query);

    // Format response
    const materialsData = materials.map(material => ({
      id: material._id,
      title: material.title,
      description: material.description,
      type: material.type,
      subject: {
        id: material.subjectId._id,
        name: material.subjectId.subjectName,
        code: material.subjectId.subjectCode,
        department: material.subjectId.department
      },
      professor: {
        id: material.professorId._id,
        employeeId: material.professorId.employeeId,
        name: material.professorId.userId.profile.fullName
      },
      file: {
        url: material.fileUrl,
        name: material.filename,
        size: material.fileSize,
        type: material.fileType,
        sizeFormatted: formatFileSize(material.fileSize)
      },
      downloads: material.downloads,
      uploadDate: material.createdAt,
      lastModified: material.updatedAt
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
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch materials',
        details: error.message
      }
    });
  }
};

// Get single material details
const getMaterialById = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    // Verify student has access to this material
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

    const material = await Material.findById(id)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName');

    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Material not found'
        }
      });
    }

    // Check if student has access to this material's subject
    if (!studentSubjects.includes(material.subjectId._id)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'You do not have access to this material'
        }
      });
    }

    const materialData = {
      id: material._id,
      title: material.title,
      description: material.description,
      type: material.type,
      subject: {
        id: material.subjectId._id,
        name: material.subjectId.subjectName,
        code: material.subjectId.subjectCode,
        department: material.subjectId.department
      },
      professor: {
        id: material.professorId._id,
        employeeId: material.professorId.employeeId,
        name: material.professorId.userId.profile.fullName
      },
      file: {
        url: material.fileUrl,
        name: material.filename,
        size: material.fileSize,
        type: material.fileType,
        sizeFormatted: formatFileSize(material.fileSize)
      },
      downloads: material.downloads,
      uploadDate: material.createdAt,
      lastModified: material.updatedAt
    };

    res.json({
      success: true,
      data: materialData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch material details',
        details: error.message
      }
    });
  }
};

// Download material
const downloadMaterial = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    // Verify student has access to this material
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

    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Material not found'
        }
      });
    }

    // Check if student has access to this material's subject
    if (!studentSubjects.includes(material.subjectId)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'You do not have access to this material'
        }
      });
    }

    // Check if file exists
    if (!fs.existsSync(material.fileUrl)) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'File not found on server'
        }
      });
    }

    // Increment download count
    await Material.findByIdAndUpdate(id, { $inc: { downloads: 1 } });

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${material.filename}"`);
    res.setHeader('Content-Type', material.fileType);

    // Stream the file
    const fileStream = fs.createReadStream(material.fileUrl);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to download material',
        details: error.message
      }
    });
  }
};

// Get materials by subject
const getMaterialsBySubject = async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      type = '', 
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Verify student is enrolled in this subject
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Student not found'
        }
      });
    }

    const isEnrolled = student.subjects.some(
      sub => sub.subjectId.toString() === subjectId
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Student is not enrolled in this subject'
        }
      });
    }

    // Build query
    const query = {
      subjectId: new mongoose.Types.ObjectId(subjectId),
      status: 'active'
    };

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get materials with pagination
    const materials = await Material.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName')
      .select('title description type subjectId professorId fileUrl filename fileSize fileType downloads status createdAt updatedAt')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Material.countDocuments(query);

    // Format response
    const materialsData = materials.map(material => ({
      id: material._id,
      title: material.title,
      description: material.description,
      type: material.type,
      subject: {
        id: material.subjectId._id,
        name: material.subjectId.subjectName,
        code: material.subjectId.subjectCode,
        department: material.subjectId.department
      },
      professor: {
        id: material.professorId._id,
        employeeId: material.professorId.employeeId,
        name: material.professorId.userId.profile.fullName
      },
      file: {
        url: material.fileUrl,
        name: material.filename,
        size: material.fileSize,
        type: material.fileType,
        sizeFormatted: formatFileSize(material.fileSize)
      },
      downloads: material.downloads,
      uploadDate: material.createdAt,
      lastModified: material.updatedAt
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
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch materials by subject',
        details: error.message
      }
    });
  }
};

// Get materials by type
const getMaterialsByType = async (req, res) => {
  try {
    const { studentId, type } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      subject = '', 
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
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
      subjectId: { $in: studentSubjects },
      type: type,
      status: 'active'
    };

    if (subject) {
      query.subjectId = new mongoose.Types.ObjectId(subject);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get materials with pagination
    const materials = await Material.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName')
      .select('title description type subjectId professorId fileUrl filename fileSize fileType downloads status createdAt updatedAt')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Material.countDocuments(query);

    // Format response
    const materialsData = materials.map(material => ({
      id: material._id,
      title: material.title,
      description: material.description,
      type: material.type,
      subject: {
        id: material.subjectId._id,
        name: material.subjectId.subjectName,
        code: material.subjectId.subjectCode,
        department: material.subjectId.department
      },
      professor: {
        id: material.professorId._id,
        employeeId: material.professorId.employeeId,
        name: material.professorId.userId.profile.fullName
      },
      file: {
        url: material.fileUrl,
        name: material.filename,
        size: material.fileSize,
        type: material.fileType,
        sizeFormatted: formatFileSize(material.fileSize)
      },
      downloads: material.downloads,
      uploadDate: material.createdAt,
      lastModified: material.updatedAt
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
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch materials by type',
        details: error.message
      }
    });
  }
};

// Get recent materials
const getRecentMaterials = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 10 } = req.query;

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

    // Get recent materials
    const materials = await Material.find({
      subjectId: { $in: studentSubjects },
      status: 'active'
    })
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId')
      .populate('professorId.userId', 'profile.fullName')
      .select('title description type subjectId professorId fileUrl filename fileSize fileType downloads createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Format response
    const materialsData = materials.map(material => ({
      id: material._id,
      title: material.title,
      description: material.description,
      type: material.type,
      subject: {
        id: material.subjectId._id,
        name: material.subjectId.subjectName,
        code: material.subjectId.subjectCode,
        department: material.subjectId.department
      },
      professor: {
        id: material.professorId._id,
        employeeId: material.professorId.employeeId,
        name: material.professorId.userId.profile.fullName
      },
      file: {
        url: material.fileUrl,
        name: material.filename,
        size: material.fileSize,
        type: material.fileType,
        sizeFormatted: formatFileSize(material.fileSize)
      },
      downloads: material.downloads,
      uploadDate: material.createdAt
    }));

    res.json({
      success: true,
      data: materialsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch recent materials',
        details: error.message
      }
    });
  }
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

module.exports = {
  getStudentMaterials,
  getMaterialById,
  downloadMaterial,
  getMaterialsBySubject,
  getMaterialsByType,
  getRecentMaterials
};
