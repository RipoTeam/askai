const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');
const { messageQueries, chatQueries, settingsQueries, fileQueries } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Send message and get AI response
router.post('/chat/:chatId', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, fileIds } = req.body;

    // Verify chat belongs to user
    const chat = chatQueries.findById.get(chatId);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Get user settings
    let settings = settingsQueries.findByUserId.get(req.userId);
    if (!settings) {
      settingsQueries.create.run(req.userId);
      settings = settingsQueries.findByUserId.get(req.userId);
    }

    // Save user message
    const userMessageId = uuidv4();
    messageQueries.create.run(userMessageId, chatId, 'user', message);

    // Get conversation history
    const history = messageQueries.findByChatId.all(chatId);
    
    // Build messages array for OpenAI
    const messages = history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add file context if files are provided
    if (fileIds && fileIds.length > 0) {
      let fileContext = '\n\nAttached files:\n';
      for (const fileId of fileIds) {
        const file = fileQueries.findById.get(fileId);
        if (file && file.chat_id === chatId) {
          fileContext += `\nFile: ${file.original_name}\n`;
          if (file.content) {
            fileContext += `Content:\n${file.content}\n`;
          }
        }
      }
      messages[messages.length - 1].content += fileContext;
    }

    // Build conversation context for Gemini
    let conversationText = '';
    if (settings.agent_mode) {
      conversationText = 'You are an AI agent with advanced capabilities. You can analyze files, write and edit code, and perform complex tasks. Be proactive and thorough in your responses.\n\n';
    }
    
    // Format conversation history for Gemini
    messages.forEach(msg => {
      conversationText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
    });

    // Call Gemini API
    const model = genAI.getGenerativeModel({ 
      model: settings.model === 'gpt-4' ? 'gemini-pro' : 'gemini-pro',
      generationConfig: {
        temperature: settings.temperature || 0.7,
        maxOutputTokens: settings.max_tokens || 2000,
      }
    });

    const result = await model.generateContent(conversationText);
    const response = await result.response;
    const aiResponse = response.text();

    // Save AI response
    const aiMessageId = uuidv4();
    messageQueries.create.run(aiMessageId, chatId, 'assistant', aiResponse);

    // Update chat title if it's the first message
    if (history.length === 1) {
      const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
      chatQueries.update.run(title, chatId);
    }

    res.json({
      id: aiMessageId,
      role: 'assistant',
      content: aiResponse
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Stream chat response
router.post('/chat/:chatId/stream', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, fileIds } = req.body;

    const chat = chatQueries.findById.get(chatId);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    let settings = settingsQueries.findByUserId.get(req.userId);
    if (!settings) {
      settingsQueries.create.run(req.userId);
      settings = settingsQueries.findByUserId.get(req.userId);
    }

    const userMessageId = uuidv4();
    messageQueries.create.run(userMessageId, chatId, 'user', message);

    const history = messageQueries.findByChatId.all(chatId);
    
    // Build conversation context for Gemini
    let conversationText = '';
    if (settings.agent_mode) {
      conversationText = 'You are an AI agent with advanced capabilities. You can analyze files, write and edit code, and perform complex tasks. Be proactive and thorough in your responses.\n\n';
    }
    
    // Format conversation history
    history.forEach(msg => {
      conversationText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
    });

    // Add file context if present
    if (fileIds && fileIds.length > 0) {
      conversationText += '\n\nAttached files:\n';
      for (const fileId of fileIds) {
        const file = fileQueries.findById.get(fileId);
        if (file && file.chat_id === chatId) {
          conversationText += `\nFile: ${file.original_name}\n`;
          if (file.content) {
            conversationText += `Content:\n${file.content}\n`;
          }
        }
      }
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: settings.temperature || 0.7,
        maxOutputTokens: settings.max_tokens || 2000,
      }
    });

    const result = await model.generateContentStream(conversationText);
    let fullResponse = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullResponse += chunkText;
        res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
    }

    const aiMessageId = uuidv4();
    messageQueries.create.run(aiMessageId, chatId, 'assistant', fullResponse);

    if (history.length === 1) {
      const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
      chatQueries.update.run(title, chatId);
    }

    res.write(`data: ${JSON.stringify({ done: true, id: aiMessageId })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Stream error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to stream response' })}\n\n`);
    res.end();
  }
});

module.exports = router;
