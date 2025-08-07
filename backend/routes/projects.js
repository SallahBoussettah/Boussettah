const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Project } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all projects (public endpoint)
router.get('/', 
  [
    query('category').optional().isIn(['web', 'mobile', 'game', 'desktop']),
    query('status').optional().isIn(['planning', 'in-progress', 'completed', 'on-hold']),
    query('featured').optional().isBoolean(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { 
        category, 
        status, 
        featured, 
        limit = 20, 
        offset = 0,
        search 
      } = req.query;

      const where = {};
      
      if (category) where.category = category;
      if (status) where.status = status;
      if (featured !== undefined) where.featured = featured === 'true';
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { technologies: { [Op.contains]: [search] } }
        ];
      }

      const projects = await Project.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [
          ['featured', 'DESC'],
          ['priority', 'DESC'],
          ['createdAt', 'DESC']
        ]
      });

      res.json({
        projects: projects.rows,
        total: projects.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
);

// Get single project by slug (public endpoint)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({
      where: { slug }
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    // Increment views
    await project.increment('views');

    res.json(project);

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Create new project (admin only)
router.post('/',
  authenticateToken,
  [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 255 })
      .withMessage('Title must be less than 255 characters'),
    body('category')
      .isIn(['web', 'mobile', 'game', 'desktop'])
      .withMessage('Invalid category'),
    body('status')
      .optional()
      .isIn(['planning', 'in-progress', 'completed', 'on-hold']),
    body('technologies')
      .optional()
      .isArray()
      .withMessage('Technologies must be an array'),
    body('githubUrl')
      .optional()
      .isURL()
      .withMessage('Invalid GitHub URL'),
    body('liveUrl')
      .optional()
      .isURL()
      .withMessage('Invalid live URL')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const project = await Project.create(req.body);

      res.status(201).json({
        message: 'Project created successfully',
        project
      });

    } catch (error) {
      console.error('Create project error:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Project with this slug already exists'
        });
      }

      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
);

// Update project (admin only)
router.put('/:id',
  authenticateToken,
  [
    body('title')
      .optional()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Title must be less than 255 characters'),
    body('category')
      .optional()
      .isIn(['web', 'mobile', 'game', 'desktop'])
      .withMessage('Invalid category'),
    body('status')
      .optional()
      .isIn(['planning', 'in-progress', 'completed', 'on-hold']),
    body('technologies')
      .optional()
      .isArray()
      .withMessage('Technologies must be an array'),
    body('githubUrl')
      .optional()
      .isURL()
      .withMessage('Invalid GitHub URL'),
    body('liveUrl')
      .optional()
      .isURL()
      .withMessage('Invalid live URL')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const project = await Project.findByPk(id);

      if (!project) {
        return res.status(404).json({
          message: 'Project not found'
        });
      }

      await project.update(req.body);

      res.json({
        message: 'Project updated successfully',
        project
      });

    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
);

// Delete project (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    await project.destroy();

    res.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Like project (public endpoint)
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    await project.increment('likes');

    res.json({
      message: 'Project liked successfully',
      likes: project.likes + 1
    });

  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;