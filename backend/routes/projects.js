const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Project, sequelize } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all projects (public endpoint)
router.get('/', 
  [
    query('category').optional().isIn(['web', 'mobile', 'game', 'desktop']),
    query('status').optional().isIn(['planning', 'in-progress', 'completed', 'on-hold']),
    query('featured').optional().isBoolean(),
    query('year').optional().isNumeric(),
    query('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
    query('sortBy').optional().isIn(['title', 'createdAt', 'views', 'likes', 'priority', 'year']),
    query('sortOrder').optional().isIn(['ASC', 'DESC'])
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
        year,
        difficulty,
        limit = 20, 
        offset = 0,
        search,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        tags
      } = req.query;

      const where = { isPublic: true };
      
      if (category) where.category = category;
      if (status) where.status = status;
      if (featured !== undefined) where.featured = featured === 'true';
      if (year) where.year = year.toString();
      if (difficulty) where.difficulty = difficulty;
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { subtitle: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { longDescription: { [Op.iLike]: `%${search}%` } },
          { technologies: { [Op.contains]: [search] } },
          { tags: { [Op.contains]: [search] } }
        ];
      }

      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        where.tags = { [Op.overlap]: tagArray };
      }

      // Build order array
      const orderArray = [
        ['featured', 'DESC'], // Always prioritize featured projects
        ['priority', 'DESC']  // Then by priority
      ];

      // Add custom sort
      if (sortBy && sortBy !== 'priority') {
        orderArray.push([sortBy, sortOrder]);
      }

      const projects = await Project.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: orderArray,
        attributes: {
          exclude: ['longDescription', 'features', 'challenges', 'learnings'] // Exclude heavy fields for list view
        }
      });

      // Get category counts for filtering
      const categoryCounts = await Project.findAll({
        where: { isPublic: true },
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('category')), 'count']
        ],
        group: ['category'],
        raw: true
      });

      // Get status counts
      const statusCounts = await Project.findAll({
        where: { isPublic: true },
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('status')), 'count']
        ],
        group: ['status'],
        raw: true
      });

      res.json({
        projects: projects.rows,
        total: projects.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        filters: {
          categories: categoryCounts,
          statuses: statusCounts
        }
      });

    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
);

// Get featured projects (public endpoint)
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const projects = await Project.findAll({
      where: { 
        featured: true,
        isPublic: true 
      },
      limit: parseInt(limit),
      order: [
        ['priority', 'DESC'],
        ['createdAt', 'DESC']
      ],
      attributes: {
        exclude: ['longDescription', 'features', 'challenges', 'learnings']
      }
    });

    res.json({
      projects,
      total: projects.length
    });

  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

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
    body('subtitle')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Subtitle must be less than 255 characters'),
    body('category')
      .isIn(['web', 'mobile', 'game', 'desktop'])
      .withMessage('Invalid category'),
    body('status')
      .optional()
      .isIn(['planning', 'in-progress', 'completed', 'on-hold']),
    body('difficulty')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced']),
    body('technologies')
      .optional()
      .isArray()
      .withMessage('Technologies must be an array'),
    body('features')
      .optional()
      .isArray()
      .withMessage('Features must be an array'),
    body('challenges')
      .optional()
      .isArray()
      .withMessage('Challenges must be an array'),
    body('learnings')
      .optional()
      .isArray()
      .withMessage('Learnings must be an array'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('awards')
      .optional()
      .isArray()
      .withMessage('Awards must be an array'),
    body('images')
      .optional()
      .isArray()
      .withMessage('Images must be an array'),
    body('githubUrl')
      .optional()
      .isURL()
      .withMessage('Invalid GitHub URL'),
    body('liveUrl')
      .optional()
      .isURL()
      .withMessage('Invalid live URL'),
    body('demoUrl')
      .optional()
      .isURL()
      .withMessage('Invalid demo URL'),
    body('year')
      .optional()
      .isLength({ min: 4, max: 4 })
      .withMessage('Year must be 4 digits'),
    body('completionPercentage')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Completion percentage must be between 0 and 100'),
    body('teamSize')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Team size must be at least 1'),
    body('priority')
      .optional()
      .isInt()
      .withMessage('Priority must be an integer')
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

// Get project statistics (admin only)
router.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    const totalProjects = await Project.count();
    const completedProjects = await Project.count({ where: { status: 'completed' } });
    const inProgressProjects = await Project.count({ where: { status: 'in-progress' } });
    const featuredProjects = await Project.count({ where: { featured: true } });
    
    const totalViews = await Project.sum('views') || 0;
    const totalLikes = await Project.sum('likes') || 0;
    
    const categoryStats = await Project.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('category')), 'count'],
        [sequelize.fn('SUM', sequelize.col('views')), 'totalViews'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'totalLikes']
      ],
      group: ['category'],
      raw: true
    });

    const recentProjects = await Project.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'status', 'createdAt', 'views', 'likes']
    });

    const topProjects = await Project.findAll({
      limit: 5,
      order: [['views', 'DESC']],
      attributes: ['id', 'title', 'category', 'views', 'likes']
    });

    res.json({
      overview: {
        totalProjects,
        completedProjects,
        inProgressProjects,
        featuredProjects,
        totalViews,
        totalLikes
      },
      categoryStats,
      recentProjects,
      topProjects
    });

  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Get all projects for admin (includes private ones)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const { 
      category, 
      status, 
      featured, 
      limit = 50, 
      offset = 0,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const where = {};
    
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured !== undefined) where.featured = featured === 'true';
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { subtitle: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { technologies: { [Op.contains]: [search] } }
      ];
    }

    const projects = await Project.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]]
    });

    res.json({
      projects: projects.rows,
      total: projects.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get admin projects error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Bulk update projects (admin only)
router.patch('/admin/bulk-update', authenticateToken, async (req, res) => {
  try {
    const { projectIds, updates } = req.body;

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({
        message: 'Project IDs array is required'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'Updates object is required'
      });
    }

    const [updatedCount] = await Project.update(updates, {
      where: {
        id: {
          [Op.in]: projectIds
        }
      }
    });

    res.json({
      message: `${updatedCount} projects updated successfully`,
      updatedCount
    });

  } catch (error) {
    console.error('Bulk update projects error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Get projects by category (public endpoint)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    if (!['web', 'mobile', 'game', 'desktop'].includes(category)) {
      return res.status(400).json({
        message: 'Invalid category'
      });
    }

    const projects = await Project.findAndCountAll({
      where: { 
        category,
        isPublic: true 
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['featured', 'DESC'],
        ['priority', 'DESC'],
        ['createdAt', 'DESC']
      ],
      attributes: {
        exclude: ['longDescription', 'features', 'challenges', 'learnings']
      }
    });

    res.json({
      projects: projects.rows,
      total: projects.count,
      category,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get projects by category error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;