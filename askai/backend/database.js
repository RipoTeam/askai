const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, 'database.db'));

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize database tables
function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
    )
  `);

  // Files table
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      message_id TEXT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      path TEXT NOT NULL,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
      FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
    )
  `);

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER PRIMARY KEY,
      theme TEXT DEFAULT 'dark',
      model TEXT DEFAULT 'gpt-4',
      temperature REAL DEFAULT 0.7,
      max_tokens INTEGER DEFAULT 2000,
      agent_mode BOOLEAN DEFAULT 0,
      voice_enabled BOOLEAN DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Code Canvas table
  db.exec(`
    CREATE TABLE IF NOT EXISTS code_canvas (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      title TEXT NOT NULL,
      language TEXT NOT NULL,
      code TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
}

// Database helper functions
const userQueries = {
  create: db.prepare(`
    INSERT INTO users (email, password, name)
    VALUES (?, ?, ?)
  `),
  
  findByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),
  
  findById: db.prepare(`
    SELECT id, email, name, avatar, created_at FROM users WHERE id = ?
  `),
  
  update: db.prepare(`
    UPDATE users SET name = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
};

const chatQueries = {
  create: db.prepare(`
    INSERT INTO chats (id, user_id, title)
    VALUES (?, ?, ?)
  `),
  
  findByUserId: db.prepare(`
    SELECT * FROM chats WHERE user_id = ?
    ORDER BY updated_at DESC
  `),
  
  findById: db.prepare(`
    SELECT * FROM chats WHERE id = ?
  `),
  
  update: db.prepare(`
    UPDATE chats SET title = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  delete: db.prepare(`
    DELETE FROM chats WHERE id = ?
  `)
};

const messageQueries = {
  create: db.prepare(`
    INSERT INTO messages (id, chat_id, role, content)
    VALUES (?, ?, ?, ?)
  `),
  
  findByChatId: db.prepare(`
    SELECT * FROM messages WHERE chat_id = ?
    ORDER BY created_at ASC
  `),
  
  delete: db.prepare(`
    DELETE FROM messages WHERE id = ?
  `)
};

const fileQueries = {
  create: db.prepare(`
    INSERT INTO files (id, chat_id, message_id, filename, original_name, mime_type, size, path, content)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  findByChatId: db.prepare(`
    SELECT * FROM files WHERE chat_id = ?
    ORDER BY created_at DESC
  `),
  
  findById: db.prepare(`
    SELECT * FROM files WHERE id = ?
  `)
};

const settingsQueries = {
  create: db.prepare(`
    INSERT INTO user_settings (user_id)
    VALUES (?)
  `),
  
  findByUserId: db.prepare(`
    SELECT * FROM user_settings WHERE user_id = ?
  `),
  
  update: db.prepare(`
    UPDATE user_settings 
    SET theme = ?, model = ?, temperature = ?, max_tokens = ?, agent_mode = ?, voice_enabled = ?
    WHERE user_id = ?
  `)
};

const canvasQueries = {
  create: db.prepare(`
    INSERT INTO code_canvas (id, chat_id, title, language, code)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  findByChatId: db.prepare(`
    SELECT * FROM code_canvas WHERE chat_id = ?
    ORDER BY updated_at DESC
  `),
  
  update: db.prepare(`
    UPDATE code_canvas SET code = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  delete: db.prepare(`
    DELETE FROM code_canvas WHERE id = ?
  `)
};

module.exports = {
  db,
  initDatabase,
  userQueries,
  chatQueries,
  messageQueries,
  fileQueries,
  settingsQueries,
  canvasQueries
};
