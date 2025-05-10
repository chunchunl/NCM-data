import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import memberRoutes from './routes/memberRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import db from './config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from './config/passport.js';
import { saveMessage } from './services/chatService.js';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 中間件
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Session 配置
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 小時
  }
}));

// Passport 初始化
app.use(passport.initialize());
app.use(passport.session());

// 靜態文件服務
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 測試數據庫連接的路由
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ 
      success: true, 
      message: '數據庫連接正常',
      result: rows[0].result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '數據庫連接失敗',
      error: error.message 
    });
  }
});

// 查看資料表結構的路由
app.get('/api/tables', async (req, res) => {
  try {
    const [tables] = await db.query(`
      SELECT TABLE_NAME, TABLE_COMMENT 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [process.env.DB_NAME || 'my_test_db']);
    
    // 查看資料表結構
    // map 使用
    const tableDetails = await Promise.all(tables.map(async (table) => {
      const [columns] = await db.query(`
        SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT, IS_NULLABLE, COLUMN_KEY
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      `, [process.env.DB_NAME || 'my_test_db', table.TABLE_NAME]);
      
      return {
        tableName: table.TABLE_NAME,
        comment: table.TABLE_COMMENT,
        columns: columns
      };
    }));

    res.json({ 
      success: true, 
      tables: tableDetails 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '獲取資料表結構失敗',
      error: error.message 
    });
  }
});

// 路由
app.use('/api/members', memberRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO 連接
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('未提供認證令牌'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await db.query(
      'SELECT id, role FROM members WHERE id = ? AND is_deleted = FALSE',
      [decoded.id]
    );

    if (!user) {
      return next(new Error('用戶不存在'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('認證失敗'));
  }
});

io.on('connection', (socket) => {
  console.log('用戶已連接:', socket.user.id);

  // 加入用戶的房間
  socket.join(`user_${socket.user.id}`);

  // 處理消息
  socket.on('message', async (data) => {
    try {
      const { toUserId, content } = data;
      
      // 保存消息到數據庫
      const messageId = await saveMessage(socket.user.id, toUserId, content);

      // 獲取發送者信息
      const [sender] = await db.query(
        'SELECT name, avatar FROM members WHERE id = ?',
        [socket.user.id]
      );

      // 構建消息對象
      const message = {
        id: messageId,
        from_user_id: socket.user.id,
        to_user_id: toUserId,
        content,
        timestamp: new Date(),
        from_name: sender[0].name,
        from_avatar: sender[0].avatar
      };

      // 發送消息給接收者
      io.to(`user_${toUserId}`).emit('message', message);
      
      // 如果是客服發送消息，也發送給自己
      if (socket.user.role === 'staff') {
        socket.emit('message', message);
      }
    } catch (error) {
      console.error('發送消息失敗:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('用戶已斷開連接:', socket.user.id);
  });
});

// 設置端口
const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`服務器運行在端口 ${PORT}`);
}); 