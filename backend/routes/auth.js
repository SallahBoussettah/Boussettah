const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { Admin } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    message: 'Too many login attempts, please try again later.',
    code: 'TOO_MANY_ATTEMPTS'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login endpoint
router.post('/login', 
  loginLimiter,
  [
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 1 })
      .withMessage('Password cannot be empty')
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array(),
          code: 'VALIDATION_ERROR'
        });
      }

      const { password } = req.body;

      // Find admin (there should only be one)
      const admin = await Admin.findOne({ 
        where: { 
          username: 'admin',
          isActive: true 
        } 
      });

      if (!admin) {
        return res.status(401).json({
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Check password
      const isValidPassword = await admin.checkPassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Update last login
      await admin.update({ lastLogin: new Date() });

      // Generate JWT token
      const token = jwt.sign(
        { 
          adminId: admin.id,
          username: admin.username 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          lastLogin: admin.lastLogin
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      });
    }
  }
);

// Verify token endpoint
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: 'Token is valid',
      admin: {
        id: req.admin.id,
        username: req.admin.username,
        email: req.admin.email,
        lastLogin: req.admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Logout endpoint (optional - mainly for clearing server-side sessions if needed)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

// Change password endpoint
router.put('/change-password',
  authenticateToken,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array(),
          code: 'VALIDATION_ERROR'
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Verify current password
      const isValidPassword = await req.admin.checkPassword(currentPassword);
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Current password is incorrect',
          code: 'INVALID_PASSWORD'
        });
      }

      // Update password
      await req.admin.update({ password: newPassword });

      res.json({
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      });
    }
  }
);

// Request password reset code endpoint
router.post('/request-reset-code',
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array(),
          code: 'VALIDATION_ERROR'
        });
      }

      const { email } = req.body;

      // Find admin by email
      const admin = await Admin.findOne({ 
        where: { 
          email: email.toLowerCase(),
          isActive: true 
        } 
      });

      if (!admin) {
        // Don't reveal if email exists or not for security
        return res.json({
          message: 'If this email is registered, you will receive a reset code shortly.',
          code: 'RESET_CODE_SENT'
        });
      }

      // Generate 6-digit reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Save reset code to database
      await admin.update({ 
        resetToken: resetCode,
        resetTokenExpiry: resetTokenExpiry
      });

      // Send email with reset code
      const emailService = require('../services/emailService');
      const emailResult = await emailService.sendPasswordResetCode(admin.email, resetCode);

      if (!emailResult.success) {
        console.error('Failed to send reset code email:', emailResult.error);
        return res.status(500).json({
          message: 'Failed to send reset code. Please try again.',
          code: 'EMAIL_SEND_FAILED'
        });
      }

      console.log(`🔐 Password reset code sent to: ${admin.email}`);

      res.json({
        message: 'Reset code sent to your email address.',
        code: 'RESET_CODE_SENT'
      });

    } catch (error) {
      console.error('Request reset code error:', error);
      res.status(500).json({
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      });
    }
  }
);

// Verify reset code endpoint
router.post('/verify-reset-code',
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required'),
    body('resetCode')
      .isLength({ min: 6, max: 6 })
      .withMessage('Reset code must be 6 digits')
      .isNumeric()
      .withMessage('Reset code must contain only numbers')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array(),
          code: 'VALIDATION_ERROR'
        });
      }

      const { email, resetCode } = req.body;

      // Find admin by email
      const admin = await Admin.findOne({ 
        where: { 
          email: email.toLowerCase(),
          isActive: true 
        } 
      });

      if (!admin || !admin.resetToken || !admin.resetTokenExpiry) {
        return res.status(400).json({
          message: 'Invalid or expired reset code',
          code: 'INVALID_RESET_CODE'
        });
      }

      // Check if code has expired
      if (new Date() > admin.resetTokenExpiry) {
        // Clear expired token
        await admin.update({ 
          resetToken: null,
          resetTokenExpiry: null
        });
        
        return res.status(400).json({
          message: 'Reset code has expired. Please request a new one.',
          code: 'RESET_CODE_EXPIRED'
        });
      }

      // Verify reset code
      if (admin.resetToken !== resetCode) {
        return res.status(400).json({
          message: 'Invalid reset code',
          code: 'INVALID_RESET_CODE'
        });
      }

      console.log(`✅ Reset code verified for: ${admin.email}`);

      res.json({
        message: 'Reset code verified successfully',
        code: 'RESET_CODE_VERIFIED'
      });

    } catch (error) {
      console.error('Verify reset code error:', error);
      res.status(500).json({
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      });
    }
  }
);

// Reset password endpoint (requires verified code)
router.post('/reset-password',
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required'),
    body('resetCode')
      .isLength({ min: 6, max: 6 })
      .withMessage('Reset code must be 6 digits')
      .isNumeric()
      .withMessage('Reset code must contain only numbers'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array(),
          code: 'VALIDATION_ERROR'
        });
      }

      const { email, resetCode, newPassword } = req.body;

      // Find admin by email
      const admin = await Admin.findOne({ 
        where: { 
          email: email.toLowerCase(),
          isActive: true 
        } 
      });

      if (!admin || !admin.resetToken || !admin.resetTokenExpiry) {
        return res.status(400).json({
          message: 'Invalid or expired reset code',
          code: 'INVALID_RESET_CODE'
        });
      }

      // Check if code has expired
      if (new Date() > admin.resetTokenExpiry) {
        // Clear expired token
        await admin.update({ 
          resetToken: null,
          resetTokenExpiry: null
        });
        
        return res.status(400).json({
          message: 'Reset code has expired. Please request a new one.',
          code: 'RESET_CODE_EXPIRED'
        });
      }

      // Verify reset code
      if (admin.resetToken !== resetCode) {
        return res.status(400).json({
          message: 'Invalid reset code',
          code: 'INVALID_RESET_CODE'
        });
      }

      // Update password and clear reset token
      await admin.update({ 
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      });

      console.log(`🔄 Password reset successfully for admin: ${admin.email}`);

      res.json({
        message: 'Password reset successfully',
        email: admin.email
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      });
    }
  }
);

// Get admin info endpoint
router.get('/admin-info', async (req, res) => {
  try {
    const admin = await Admin.findOne({ 
      where: { username: 'admin' },
      attributes: ['id', 'username', 'email', 'lastLogin', 'createdAt']
    });

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found',
        code: 'ADMIN_NOT_FOUND'
      });
    }

    res.json({
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      }
    });

  } catch (error) {
    console.error('Get admin info error:', error);
    res.status(500).json({
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;