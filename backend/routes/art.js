const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Art } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all art pieces (public endpoint)
router.get('/', 
  [
    query('category').optional().isIn([
      'Digital Art', 'Character Portrait', 'Abstract', 
      'Landscape', 'Concept Art', 'Illustration', 'Pixel Art'
    ]),
    query('year').optional().isNumeric(),
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
        year, 
        featured, 
        limit = 20, 
        offset = 0,
        search 
      } = req.query;

      const where = { isPublic: true };
      
      if (category) where.category = category;
      if (year) where.year = year.toString();
      if (featured !== undefined) where.featured = featured === 'true';
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { tags: { [Op.contains]: [search] } }
        ];
      }

      const artPieces = await Art.findAndCountAll({
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
        artPieces: artPieces.rows,
        total: artPieces.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('Get art pieces error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
);

// Get all art pieces for admin (includes private ones)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const { 
      category, 
      year, 
      featured, 
      limit = 50, 
      offset = 0,
      search 
    } = req.query;

    const where = {};
    
    if (category) where.category = category;
    if (year) where.year = year.toString();
    if (featured !== undefined) where.featured = featured === 'true';
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.contains]: [search] } }
      ];
    }

    const artPieces = await Art.findAndCountAll({
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
      artPieces: artPieces.rows,
      total: artPieces.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get admin art pieces error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Get single art piece by slug (public endpoint)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const artPiece = await Art.findOne({
      where: { 
        slug,
        isPublic: true 
      }
    });

    if (!artPiece) {
      return res.status(404).json({
        message: 'Art piece not found'
      });
    }

    // Increment views
    await artPiece.increment('views');

    res.json(artPiece);

  } catch (error) {
    console.error('Get art piece error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Create new art piece (admin only)
router.post('/',
  authenticateToken,
  [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 255 })
      .withMessage('Title must be less than 255 characters'),
    body('category')
      .isIn([
        'Digital Art', 'Character Portrait', 'Abstract', 
        'Landscape', 'Concept Art', 'Illustration', 'Pixel Art'
      ])
      .withMessage('Invalid category'),
    body('year')
      .optional()
      .isLength({ min: 4, max: 4 })
      .withMessage('Year must be 4 digits'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
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

      const artPiece = await Art.create(req.body);

      res.status(201).json({
        message: 'Art piece created successfully',
        artPiece
      });

    } catch (error) {
      console.error('Create art piece error:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Art piece with this slug already exists'
        });
      }

      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
);

// Update art piece (admin only)
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
      .isIn([
        'Digital Art', 'Character Portrait', 'Abstract', 
        'Landscape', 'Concept Art', 'Illustration', 'Pixel Art'
      ])
      .withMessage('Invalid category'),
    body('year')
      .optional()
      .isLength({ min: 4, max: 4 })
      .withMessage('Year must be 4 digits'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
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
      const artPiece = await Art.findByPk(id);

      if (!artPiece) {
        return res.status(404).json({
          message: 'Art piece not found'
        });
      }

      await artPiece.update(req.body);

      res.json({
        message: 'Art piece updated successfully',
        artPiece
      });

    } catch (error) {
      console.error('Update art piece error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
);

// Delete art piece (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const artPiece = await Art.findByPk(id);

    if (!artPiece) {
      return res.status(404).json({
        message: 'Art piece not found'
      });
    }

    await artPiece.destroy();

    res.json({
      message: 'Art piece deleted successfully'
    });

  } catch (error) {
    console.error('Delete art piece error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Like art piece (public endpoint)
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const artPiece = await Art.findByPk(id);

    if (!artPiece) {
      return res.status(404).json({
        message: 'Art piece not found'
      });
    }

    await artPiece.increment('likes');

    res.json({
      message: 'Art piece liked successfully',
      likes: artPiece.likes + 1
    });

  } catch (error) {
    console.error('Like art piece error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;