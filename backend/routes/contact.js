const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { Contact } = require('../models');
const emailService = require('../services/emailService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for contact form submissions
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 contact form submissions per windowMs
  message: {
    error: 'Too many contact form submissions from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules for contact form
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be less than 100 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject is required and must be less than 200 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message is required and must be less than 2000 characters')
];

// POST /api/contact - Submit contact form
router.post('/', contactLimiter, contactValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      console.log('Request body:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;
    
    // Get client IP and user agent for tracking
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('User-Agent');

    // Save contact to database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ip_address,
      user_agent,
      status: 'new'
    });

    // Send notification email to admin
    const notificationResult = await emailService.sendContactNotification({
      name,
      email,
      subject,
      message
    });

    // Send auto-reply to user
    const autoReplyResult = await emailService.sendAutoReply({
      name,
      email,
      subject
    });

    // Log email results
    if (!notificationResult.success) {
      console.error('Failed to send notification email:', notificationResult.error);
    }
    
    if (!autoReplyResult.success) {
      console.error('Failed to send auto-reply email:', autoReplyResult.error);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.',
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/contact - Get all contacts (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status && ['new', 'read', 'replied'].includes(status)) {
      whereClause.status = status;
    }

    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      attributes: ['id', 'name', 'email', 'subject', 'message', 'status', 'createdAt', 'updatedAt']
    });

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      }
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/contact/:id - Get specific contact (admin only)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'subject', 'message', 'status', 'ip_address', 'user_agent', 'createdAt', 'updatedAt']
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Mark as read if it was new
    if (contact.status === 'new') {
      await contact.update({ status: 'read' });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/contact/:id/status - Update contact status (admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: new, read, replied'
      });
    }

    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.update({ status });

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: {
        id: contact.id,
        status: contact.status,
        updatedAt: contact.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/contact/:id - Delete contact (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.destroy();

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/contact/test-email - Test email configuration (admin only)
router.get('/test-email', authenticateToken, async (req, res) => {
  try {
    const testResult = await emailService.testConnection();
    
    if (testResult) {
      // Send a test email
      const testEmailResult = await emailService.sendContactNotification({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Email Configuration Test',
        message: 'This is a test message to verify email configuration is working properly.'
      });

      res.json({
        success: true,
        message: 'Email configuration test completed',
        data: {
          connectionTest: testResult,
          emailTest: testEmailResult
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'SMTP connection test failed',
        data: {
          connectionTest: testResult
        }
      });
    }
  } catch (error) {
    console.error('Error testing email configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Email configuration test failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/contact/stats/summary - Get contact statistics (admin only)
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const totalContacts = await Contact.count();
    const newContacts = await Contact.count({ where: { status: 'new' } });
    const readContacts = await Contact.count({ where: { status: 'read' } });
    const repliedContacts = await Contact.count({ where: { status: 'replied' } });

    // Get contacts from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentContacts = await Contact.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: thirtyDaysAgo
        }
      }
    });

    res.json({
      success: true,
      data: {
        total: totalContacts,
        new: newContacts,
        read: readContacts,
        replied: repliedContacts,
        recent: recentContacts
      }
    });

  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;