const { Material, Professor, Subject, Student, User } = require('../models');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Get all materials for a professor
const getProfessorMaterials = async (req, res) => {
  try {
    const { professorId } = req.params;
    const { page = 1, limit = 20, type = '', subjectId = '', search = '', status = 'active' } = req.query;

    console.log('=== PROFESSOR MATERIALS API CALLED ===');
    console.log('Professor ID:', professorId);
    console.log('Query params:', { page, limit, type, subjectId, search, status });

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
          error: { message: 'Professor not found' }
        });
      }
    }

    // Build query - show ALL materials from all professors (same as student API)
    const query = { 
      status 
    };

    if (type) {
      query.type = type;
    }

    if (subjectId) {
      query.subjectId = new mongoose.Types.ObjectId(subjectId);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get materials with pagination - show ALL materials from all professors
    const materials = await Material.find(query)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate({
        path: 'professorId',
        select: 'employeeId userId',
        populate: {
          path: 'userId',
          select: 'profile.fullName'
        }
      })
      .select('title description type subjectId professorId fileUrl filename fileSize fileType downloads status createdAt updatedAt')
      .sort({ createdAt: -1 })
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
        id: material.subjectId?._id || 'Unknown',
        name: material.subjectId?.subjectName || 'Unknown Subject',
        code: material.subjectId?.subjectCode || 'N/A',
        department: material.subjectId?.department || 'Unknown'
      },
      professor: {
        id: material.professorId?._id || 'Unknown',
        employeeId: material.professorId?.employeeId || 'Unknown',
        name: material.professorId?.userId?.profile?.fullName || 'Unknown Professor'
      },
      file: {
        url: material.fileUrl,
        name: material.filename,
        size: material.fileSize,
        type: material.fileType,
        sizeFormatted: formatFileSize(material.fileSize)
      },
      downloads: material.downloads,
      status: material.status,
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

// Get single material
const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId')
      .populate('userId', 'profile.fullName email');

    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Material not found'
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
        employeeId: material.professorId.employeeId
      },
      file: {
        url: material.fileUrl,
        name: material.filename,
        size: material.fileSize,
        type: material.fileType,
        sizeFormatted: formatFileSize(material.fileSize)
      },
      downloads: material.downloads,
      status: material.status,
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
        message: 'Failed to fetch material',
        details: error.message
      }
    });
  }
};

// Upload new material
const uploadMaterial = async (req, res) => {
  try {
    const { professorId } = req.params;
    const { title, description, type, subjectId } = req.body;

    // Validate required fields
    if (!title || !description || !type || !subjectId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Title, description, type, and subject are required'
        }
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'File is required'
        }
      });
    }

    // Validate professor exists - handle both professor ID and user ID
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

    // Handle subject validation - check if it's a sample subject ID
    let subject;
    let actualSubjectId = subjectId;
    
    if (subjectId === 'sub1' || subjectId === 'sub2') {
      // These are sample subject IDs, create or find a real subject
      console.log('Sample subject ID detected, creating/finding real subject...');
      
      if (subjectId === 'sub1') {
        // Create or find Computer Science subject
        subject = await Subject.findOne({ subjectCode: 'CS101' });
        if (!subject) {
          subject = new Subject({
            subjectName: 'Computer Science',
            subjectCode: 'CS101',
            department: 'Computer Science',
            credits: 3,
            description: 'Introduction to Computer Science'
          });
          await subject.save();
          console.log('Created Computer Science subject with ID:', subject._id);
        }
      } else if (subjectId === 'sub2') {
        // Create or find Data Structures subject
        subject = await Subject.findOne({ subjectCode: 'CS102' });
        if (!subject) {
          subject = new Subject({
            subjectName: 'Data Structures',
            subjectCode: 'CS102',
            department: 'Computer Science',
            credits: 3,
            description: 'Introduction to Data Structures'
          });
          await subject.save();
          console.log('Created Data Structures subject with ID:', subject._id);
        }
      }
      actualSubjectId = subject._id;
      
      // Add subject to professor's subjects if not already there
      const existingSubject = professor.subjects.find(
        sub => sub.subjectId.toString() === actualSubjectId.toString()
      );
      if (!existingSubject) {
        professor.subjects.push({
          subjectId: actualSubjectId,
          progress: 0
        });
        await professor.save();
        console.log('Added subject to professor\'s subjects');
      }
    } else {
      // Validate real subject exists
      subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Subject not found'
          }
        });
      }

      // Check if professor teaches this subject
      const professorSubject = professor.subjects.find(
        sub => sub.subjectId.toString() === subjectId
      );
      if (!professorSubject) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Professor does not teach this subject'
          }
        });
      }
    }

    // Create material record
    const material = new Material({
      title,
      description,
      type,
      subjectId: actualSubjectId,
      professorId: professor._id,
      fileUrl: req.file.path,
      filename: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype
    });

    const savedMaterial = await material.save();

    // Populate the response
    const materialData = await Material.findById(savedMaterial._id)
      .populate('subjectId', 'subjectName subjectCode department')
      .populate('professorId', 'employeeId');

    res.status(201).json({
      success: true,
      data: {
        id: materialData._id,
        title: materialData.title,
        description: materialData.description,
        type: materialData.type,
        subject: {
          id: materialData.subjectId._id,
          name: materialData.subjectId.subjectName,
          code: materialData.subjectId.subjectCode,
          department: materialData.subjectId.department
        },
        professor: {
          id: materialData.professorId._id,
          employeeId: materialData.professorId.employeeId
        },
        file: {
          url: materialData.fileUrl,
          name: materialData.filename,
          size: materialData.fileSize,
          type: materialData.fileType,
          sizeFormatted: formatFileSize(materialData.fileSize)
        },
        downloads: materialData.downloads,
        status: materialData.status,
        uploadDate: materialData.createdAt
      },
      message: 'Material uploaded successfully'
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
        message: 'Failed to upload material',
        details: error.message
      }
    });
  }
};

// Update material
const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, subjectId } = req.body;

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Material not found'
        }
      });
    }

    // Update fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (type) updateData.type = type;
    if (subjectId) {
      // Validate subject exists
      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Subject not found'
          }
        });
      }
      updateData.subjectId = subjectId;
    }

    const updatedMaterial = await Material.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('subjectId', 'subjectName subjectCode department')
     .populate('professorId', 'employeeId');

    res.json({
      success: true,
      data: {
        id: updatedMaterial._id,
        title: updatedMaterial.title,
        description: updatedMaterial.description,
        type: updatedMaterial.type,
        subject: {
          id: updatedMaterial.subjectId._id,
          name: updatedMaterial.subjectId.subjectName,
          code: updatedMaterial.subjectId.subjectCode,
          department: updatedMaterial.subjectId.department
        },
        professor: {
          id: updatedMaterial.professorId._id,
          employeeId: updatedMaterial.professorId.employeeId
        },
        file: {
          url: updatedMaterial.fileUrl,
          name: updatedMaterial.filename,
          size: updatedMaterial.fileSize,
          type: updatedMaterial.fileType,
          sizeFormatted: formatFileSize(updatedMaterial.fileSize)
        },
        downloads: updatedMaterial.downloads,
        status: updatedMaterial.status,
        uploadDate: updatedMaterial.createdAt,
        lastModified: updatedMaterial.updatedAt
      },
      message: 'Material updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update material',
        details: error.message
      }
    });
  }
};

// Delete material
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Material not found'
        }
      });
    }

    // Delete file from filesystem
    if (material.fileUrl && fs.existsSync(material.fileUrl)) {
      try {
        fs.unlinkSync(material.fileUrl);
      } catch (unlinkError) {
        console.error('Failed to delete file:', unlinkError);
      }
    }

    // Delete material record
    await Material.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete material',
        details: error.message
      }
    });
  }
};

// Download material
const downloadMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Material not found'
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

// Get material statistics for professor
const getMaterialStatistics = async (req, res) => {
  try {
    const { professorId } = req.params;

    console.log('=== MATERIAL STATISTICS API CALLED ===');
    console.log('Professor ID:', professorId);

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
          error: { message: 'Professor not found' }
        });
      }
    }

    // Get material statistics
    const stats = await Material.aggregate([
      {
        $match: { professorId: new mongoose.Types.ObjectId(professor._id) }
      },
      {
        $group: {
          _id: null,
          totalMaterials: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' },
          totalFileSize: { $sum: '$fileSize' },
          materialsByType: {
            $push: {
              type: '$type',
              downloads: '$downloads',
              fileSize: '$fileSize'
            }
          }
        }
      }
    ]);

    // Get materials by type
    const materialsByType = await Material.aggregate([
      {
        $match: { professorId: new mongoose.Types.ObjectId(professorId) }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' },
          totalFileSize: { $sum: '$fileSize' }
        }
      }
    ]);

    // Get recent materials
    const recentMaterials = await Material.find({ professorId })
      .populate('subjectId', 'subjectName subjectCode')
      .select('title type subjectId downloads createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const statistics = {
      totalMaterials: stats[0]?.totalMaterials || 0,
      totalDownloads: stats[0]?.totalDownloads || 0,
      totalFileSize: stats[0]?.totalFileSize || 0,
      totalFileSizeFormatted: formatFileSize(stats[0]?.totalFileSize || 0),
      materialsByType: materialsByType.map(item => ({
        type: item._id,
        count: item.count,
        totalDownloads: item.totalDownloads,
        totalFileSize: item.totalFileSize,
        totalFileSizeFormatted: formatFileSize(item.totalFileSize)
      })),
      recentMaterials: recentMaterials.map(material => ({
        id: material._id,
        title: material.title,
        type: material.type,
        subject: {
          id: material.subjectId._id,
          name: material.subjectId.subjectName,
          code: material.subjectId.subjectCode
        },
        downloads: material.downloads,
        uploadDate: material.createdAt
      }))
    };

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch material statistics',
        details: error.message
      }
    });
  }
};

// Archive/Unarchive material
const toggleMaterialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Status must be either "active" or "archived"'
        }
      });
    }

    const material = await Material.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('subjectId', 'subjectName subjectCode department')
     .populate('professorId', 'employeeId');

    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Material not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        id: material._id,
        title: material.title,
        status: material.status
      },
      message: `Material ${status === 'active' ? 'activated' : 'archived'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update material status',
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
  getProfessorMaterials,
  getMaterialById,
  uploadMaterial,
  updateMaterial,
  deleteMaterial,
  downloadMaterial,
  getMaterialStatistics,
  toggleMaterialStatus
};
