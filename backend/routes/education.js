const express = require('express');
const router = express.Router();
const { Education } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get all education entries (public)
router.get('/', async (req, res) => {
  try {
    const education = await Education.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    
    res.json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
    res.status(500).json({ error: 'Failed to fetch education data' });
  }
});

// Get all education entries for admin (includes inactive)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const education = await Education.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });
    
    res.json(education);
  } catch (error) {
    console.error('Error fetching education for admin:', error);
    res.status(500).json({ error: 'Failed to fetch education data' });
  }
});

// Get single education entry
router.get('/:id', async (req, res) => {
  try {
    const education = await Education.findByPk(req.params.id);
    
    if (!education) {
      return res.status(404).json({ error: 'Education entry not found' });
    }
    
    res.json(education);
  } catch (error) {
    console.error('Error fetching education entry:', error);
    res.status(500).json({ error: 'Failed to fetch education entry' });
  }
});

// Create new education entry (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      degree,
      school,
      year,
      description,
      icon,
      order,
      isActive
    } = req.body;

    // Validate required fields
    if (!degree || !school || !year) {
      return res.status(400).json({ 
        error: 'Degree, school, and year are required' 
      });
    }

    const education = await Education.create({
      degree,
      school,
      year,
      description,
      icon: icon || 'GraduationCap',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(education);
  } catch (error) {
    console.error('Error creating education entry:', error);
    res.status(500).json({ error: 'Failed to create education entry' });
  }
});

// Update education entry (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const education = await Education.findByPk(req.params.id);
    
    if (!education) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    const {
      degree,
      school,
      year,
      description,
      icon,
      order,
      isActive
    } = req.body;

    await education.update({
      degree: degree || education.degree,
      school: school || education.school,
      year: year || education.year,
      description: description !== undefined ? description : education.description,
      icon: icon || education.icon,
      order: order !== undefined ? order : education.order,
      isActive: isActive !== undefined ? isActive : education.isActive
    });

    res.json(education);
  } catch (error) {
    console.error('Error updating education entry:', error);
    res.status(500).json({ error: 'Failed to update education entry' });
  }
});

// Delete education entry (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const education = await Education.findByPk(req.params.id);
    
    if (!education) {
      return res.status(404).json({ error: 'Education entry not found' });
    }

    await education.destroy();
    res.json({ message: 'Education entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting education entry:', error);
    res.status(500).json({ error: 'Failed to delete education entry' });
  }
});

// Reorder education entries (admin only)
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { educationIds } = req.body;
    
    if (!Array.isArray(educationIds)) {
      return res.status(400).json({ error: 'educationIds must be an array' });
    }

    // Update order for each education entry
    const updatePromises = educationIds.map((id, index) => 
      Education.update({ order: index }, { where: { id } })
    );

    await Promise.all(updatePromises);
    
    res.json({ message: 'Education entries reordered successfully' });
  } catch (error) {
    console.error('Error reordering education entries:', error);
    res.status(500).json({ error: 'Failed to reorder education entries' });
  }
});

module.exports = router;