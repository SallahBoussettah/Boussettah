const express = require('express');
const router = express.Router();
const { TechStack } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get all tech stacks grouped by category (public)
router.get('/', async (req, res) => {
  try {
    const techStacks = await TechStack.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['order', 'ASC'], ['name', 'ASC']]
    });
    
    // Group by category
    const groupedTechStacks = techStacks.reduce((acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    }, {});
    
    res.json(groupedTechStacks);
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    res.status(500).json({ error: 'Failed to fetch tech stack data' });
  }
});

// Get all tech stacks for admin (includes inactive)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const techStacks = await TechStack.findAll({
      order: [['category', 'ASC'], ['order', 'ASC'], ['name', 'ASC']]
    });
    
    res.json(techStacks);
  } catch (error) {
    console.error('Error fetching tech stacks for admin:', error);
    res.status(500).json({ error: 'Failed to fetch tech stack data' });
  }
});

// Get single tech stack entry
router.get('/:id', async (req, res) => {
  try {
    const techStack = await TechStack.findByPk(req.params.id);
    
    if (!techStack) {
      return res.status(404).json({ error: 'Tech stack entry not found' });
    }
    
    res.json(techStack);
  } catch (error) {
    console.error('Error fetching tech stack entry:', error);
    res.status(500).json({ error: 'Failed to fetch tech stack entry' });
  }
});

// Create new tech stack entry (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      category,
      order,
      isActive
    } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ 
        error: 'Name and category are required' 
      });
    }

    // Validate category
    const validCategories = ['Frontend', 'Backend', 'Mobile', 'Game Dev', 'Design', 'Tools'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid category. Must be one of: ' + validCategories.join(', ')
      });
    }

    const techStack = await TechStack.create({
      name,
      category,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(techStack);
  } catch (error) {
    console.error('Error creating tech stack entry:', error);
    res.status(500).json({ error: 'Failed to create tech stack entry' });
  }
});

// Update tech stack entry (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const techStack = await TechStack.findByPk(req.params.id);
    
    if (!techStack) {
      return res.status(404).json({ error: 'Tech stack entry not found' });
    }

    const {
      name,
      category,
      order,
      isActive
    } = req.body;

    // Validate category if provided
    if (category) {
      const validCategories = ['Frontend', 'Backend', 'Mobile', 'Game Dev', 'Design', 'Tools'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          error: 'Invalid category. Must be one of: ' + validCategories.join(', ')
        });
      }
    }

    await techStack.update({
      name: name || techStack.name,
      category: category || techStack.category,
      order: order !== undefined ? order : techStack.order,
      isActive: isActive !== undefined ? isActive : techStack.isActive
    });

    res.json(techStack);
  } catch (error) {
    console.error('Error updating tech stack entry:', error);
    res.status(500).json({ error: 'Failed to update tech stack entry' });
  }
});

// Delete tech stack entry (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const techStack = await TechStack.findByPk(req.params.id);
    
    if (!techStack) {
      return res.status(404).json({ error: 'Tech stack entry not found' });
    }

    await techStack.destroy();
    res.json({ message: 'Tech stack entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting tech stack entry:', error);
    res.status(500).json({ error: 'Failed to delete tech stack entry' });
  }
});

// Reorder tech stack entries (admin only)
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { techStackIds } = req.body;
    
    if (!Array.isArray(techStackIds)) {
      return res.status(400).json({ error: 'techStackIds must be an array' });
    }

    // Update order for each tech stack entry
    const updatePromises = techStackIds.map((id, index) => 
      TechStack.update({ order: index }, { where: { id } })
    );

    await Promise.all(updatePromises);
    
    res.json({ message: 'Tech stack entries reordered successfully' });
  } catch (error) {
    console.error('Error reordering tech stack entries:', error);
    res.status(500).json({ error: 'Failed to reorder tech stack entries' });
  }
});

module.exports = router;