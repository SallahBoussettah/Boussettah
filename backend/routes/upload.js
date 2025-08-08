const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const artDir = path.join(uploadDir, 'art');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(artDir)) {
  fs.mkdirSync(artDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
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
router.post('/art', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No image file provided'
      });
    }

    // Return the file URL - include full backend URL for cross-origin access
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.BACKEND_URL || 'http://localhost:5000'
      : 'http://localhost:5000';
    const imageUrl = `${baseUrl}/uploads/art/${req.file.filename}`;
    
    console.log('Image uploaded successfully:', {
      filename: req.file.filename,
      imageUrl: imageUrl,
      originalname: req.file.originalname
    });

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading image'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      message: 'Only image files are allowed!'
    });
  }

  res.status(500).json({
    message: 'Error uploading file'
  });
});

module.exports = router;