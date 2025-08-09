const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const artDir = path.join(uploadDir, 'art');
const projectsDir = path.join(uploadDir, 'projects');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(artDir)) {
  fs.mkdirSync(artDir, { recursive: true });
}
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}

// Configure multer for art uploads
const artStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, artDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `art-${uniqueSuffix}${ext}`);
  }
});

// Configure multer for project uploads
const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, projectsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `project-${uniqueSuffix}${ext}`);
  }
});

const artUpload = multer({
  storage: artStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const projectUpload = multer({
  storage: projectStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload art image endpoint
router.post('/art', authenticateToken, artUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      console.error('Upload failed: No file provided');
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
        code: 'NO_FILE'
      });
    }

    // Return the file URL - include full backend URL for cross-origin access
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.BACKEND_URL || process.env.DOMAIN ? `https://${process.env.DOMAIN}` : 'https://boussettahsalah.online')
      : 'http://localhost:5000';
    
    const imageUrl = `${baseUrl}/uploads/art/${req.file.filename}`;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Image uploaded:', req.file.filename);
    }

    // Send success response with proper headers
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      code: 'UPLOAD_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Upload project image endpoint
router.post('/project', authenticateToken, projectUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      console.error('Upload failed: No file provided');
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
        code: 'NO_FILE'
      });
    }

    // Return the file URL - include full backend URL for cross-origin access
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.BACKEND_URL || process.env.DOMAIN ? `https://${process.env.DOMAIN}` : 'https://boussettahsalah.online')
      : 'http://localhost:5000';
    
    const imageUrl = `${baseUrl}/uploads/projects/${req.file.filename}`;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Project image uploaded:', req.file.filename);
    }

    // Send success response with proper headers
    res.status(200).json({
      success: true,
      message: 'Project image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading project image',
      code: 'UPLOAD_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Upload error:', error.message);
  }
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.',
        code: 'FILE_TOO_LARGE',
        maxSize: '50MB'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Use "image" as the field name.',
        code: 'UNEXPECTED_FIELD'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed!',
      code: 'INVALID_FILE_TYPE',
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
  }

  res.status(500).json({
    success: false,
    message: 'Error uploading file',
    code: 'UPLOAD_ERROR',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = router;