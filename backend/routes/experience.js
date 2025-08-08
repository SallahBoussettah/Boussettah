const express = require('express');
const router = express.Router();
const { Experience } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get all experience entries (public)
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experience data' });
  }
});

// Get all experience entries for admin (includes inactive)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const experiences = await Experience.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences for admin:', error);
    res.status(500).json({ error: 'Failed to fetch experience data' });
  }
});

// Get single experience entry
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience entry not found' });
    }
    
    res.json(experience);
  } catch (error) {
    console.error('Error fetching experience entry:', error);
    res.status(500).json({ error: 'Failed to fetch experience entry' });
  }
});

// Create new experience entry (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      company,
      period,
      location,
      description,
      achievements,
      order,
      isActive,
      isCurrent
    } = req.body;

    // Validate required fields
    if (!title || !company || !period) {
      return res.status(400).json({ 
        error: 'Title, company, and period are required' 
      });
    }

    const experience = await Experience.create({
      title,
      company,
      period,
      location,
      description,
      achievements: achievements || [],
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      isCurrent: isCurrent || false
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error('Error creating experience entry:', error);
    res.status(500).json({ error: 'Failed to create experience entry' });
  }
});

// Update experience entry (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience entry not found' });
    }

    const {
      title,
      company,
      period,
      location,
      description,
      achievements,
      order,
      isActive,
      isCurrent
    } = req.body;

    await experience.update({
      title: title || experience.title,
      company: company || experience.company,
      period: period || experience.period,
      location: location !== undefined ? location : experience.location,
      description: description !== undefined ? description : experience.description,
      achievements: achievements !== undefined ? achievements : experience.achievements,
      order: order !== undefined ? order : experience.order,
      isActive: isActive !== undefined ? isActive : experience.isActive,
      isCurrent: isCurrent !== undefined ? isCurrent : experience.isCurrent
    });

    res.json(experience);
  } catch (error) {
    console.error('Error updating experience entry:', error);
    res.status(500).json({ error: 'Failed to update experience entry' });
  }
});

// Delete experience entry (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience entry not found' });
    }

    await experience.destroy();
    res.json({ message: 'Experience entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience entry:', error);
    res.status(500).json({ error: 'Failed to delete experience entry' });
  }
});

// Reorder experience entries (admin only)
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { experienceIds } = req.body;
    
    if (!Array.isArray(experienceIds)) {
      return res.status(400).json({ error: 'experienceIds must be an array' });
    }

    // Update order for each experience entry
    const updatePromises = experienceIds.map((id, index) => 
      Experience.update({ order: index }, { where: { id } })
    );

    await Promise.all(updatePromises);
    
    res.json({ message: 'Experience entries reordered successfully' });
  } catch (error) {
    console.error('Error reordering experience entries:', error);
    res.status(500).json({ error: 'Failed to reorder experience entries' });
  }
});

module.exports = router;