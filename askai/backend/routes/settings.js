const express = require('express');
const { settingsQueries } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user settings
router.get('/', authMiddleware, (req, res) => {
  try {
    let settings = settingsQueries.findByUserId.get(req.userId);
    
    if (!settings) {
      settingsQueries.create.run(req.userId);
      settings = settingsQueries.findByUserId.get(req.userId);
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings
router.put('/', authMiddleware, (req, res) => {
  try {
    const { theme, model, temperature, max_tokens, agent_mode, voice_enabled } = req.body;

    settingsQueries.update.run(
      theme || 'dark',
      model || 'gpt-4',
      temperature !== undefined ? temperature : 0.7,
      max_tokens || 2000,
      agent_mode ? 1 : 0,
      voice_enabled !== false ? 1 : 0,
      req.userId
    );

    const settings = settingsQueries.findByUserId.get(req.userId);
    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
