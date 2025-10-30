const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { chatQueries, messageQueries } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all chats for user
router.get('/', authMiddleware, (req, res) => {
  try {
    const chats = chatQueries.findByUserId.all(req.userId);
    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Create new chat
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title } = req.body;
    const chatId = uuidv4();
    
    chatQueries.create.run(chatId, req.userId, title || 'New Chat');
    
    const chat = chatQueries.findById.get(chatId);
    res.status(201).json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Get chat by ID with messages
router.get('/:chatId', authMiddleware, (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = chatQueries.findById.get(chatId);
    
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    const messages = messageQueries.findByChatId.all(chatId);
    
    res.json({
      ...chat,
      messages
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// Update chat title
router.patch('/:chatId', authMiddleware, (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    
    const chat = chatQueries.findById.get(chatId);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    chatQueries.update.run(title, chatId);
    const updatedChat = chatQueries.findById.get(chatId);
    
    res.json(updatedChat);
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({ error: 'Failed to update chat' });
  }
});

// Delete chat
router.delete('/:chatId', authMiddleware, (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = chatQueries.findById.get(chatId);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    chatQueries.delete.run(chatId);
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

module.exports = router;
