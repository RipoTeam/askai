const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { canvasQueries, chatQueries } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create code canvas
router.post('/:chatId', authMiddleware, (req, res) => {
  try {
    const { chatId } = req.params;
    const { title, language, code } = req.body;

    const chat = chatQueries.findById.get(chatId);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const canvasId = uuidv4();
    canvasQueries.create.run(canvasId, chatId, title || 'Untitled', language || 'javascript', code || '');

    const canvas = canvasQueries.findByChatId.all(chatId).find(c => c.id === canvasId);
    res.status(201).json(canvas);
  } catch (error) {
    console.error('Create canvas error:', error);
    res.status(500).json({ error: 'Failed to create canvas' });
  }
});

// Get all canvases for a chat
router.get('/:chatId', authMiddleware, (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = chatQueries.findById.get(chatId);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const canvases = canvasQueries.findByChatId.all(chatId);
    res.json(canvases);
  } catch (error) {
    console.error('Get canvases error:', error);
    res.status(500).json({ error: 'Failed to fetch canvases' });
  }
});

// Update canvas
router.put('/:canvasId', authMiddleware, (req, res) => {
  try {
    const { canvasId } = req.params;
    const { code } = req.body;

    canvasQueries.update.run(code, canvasId);

    res.json({ message: 'Canvas updated successfully' });
  } catch (error) {
    console.error('Update canvas error:', error);
    res.status(500).json({ error: 'Failed to update canvas' });
  }
});

// Delete canvas
router.delete('/:canvasId', authMiddleware, (req, res) => {
  try {
    const { canvasId } = req.params;

    canvasQueries.delete.run(canvasId);
    res.json({ message: 'Canvas deleted successfully' });
  } catch (error) {
    console.error('Delete canvas error:', error);
    res.status(500).json({ error: 'Failed to delete canvas' });
  }
});

module.exports = router;
