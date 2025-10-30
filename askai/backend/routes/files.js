const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { fileQueries, chatQueries } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Extract text from file
async function extractTextFromFile(filePath, mimeType) {
  try {
    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (mimeType.startsWith('text/') || 
               mimeType === 'application/json' ||
               mimeType === 'application/javascript') {
      return fs.readFileSync(filePath, 'utf-8');
    }
    return null;
  } catch (error) {
    console.error('Text extraction error:', error);
    return null;
  }
}

// Upload file
router.post('/upload/:chatId', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Verify chat belongs to user
    const chat = chatQueries.findById.get(chatId);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const filePath = req.file.path;
    
    // Extract text content if possible
    const content = await extractTextFromFile(filePath, req.file.mimetype);

    // Save file metadata to database
    fileQueries.create.run(
      fileId,
      chatId,
      null, // message_id will be set when used in a message
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      filePath,
      content
    );

    const file = fileQueries.findById.get(fileId);

    res.json({
      id: file.id,
      filename: file.original_name,
      size: file.size,
      mimeType: file.mime_type,
      hasContent: !!content
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get files for a chat
router.get('/:chatId', authMiddleware, (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = chatQueries.findById.get(chatId);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const files = fileQueries.findByChatId.all(chatId);
    
    res.json(files.map(file => ({
      id: file.id,
      filename: file.original_name,
      size: file.size,
      mimeType: file.mime_type,
      createdAt: file.created_at,
      hasContent: !!file.content
    })));
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Download file
router.get('/download/:fileId', authMiddleware, (req, res) => {
  try {
    const { fileId } = req.params;
    const file = fileQueries.findById.get(fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const chat = chatQueries.findById.get(file.chat_id);
    if (!chat || chat.user_id !== req.userId) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(file.path, file.original_name);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

module.exports = router;
