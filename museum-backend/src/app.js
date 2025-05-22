import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { initializeSocket } from './services/socketService.js';
import memberRoutes from './routes/memberRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import exhibitionsRoutes from './routes/exhibitions/index.js';
import couponsRoutes from './routes/coupons/index.js'
import couponsClaimRoutes from './routes/couponsClaim/index.js'
import memberCouponRoutes from './routes/memberCoupons.js'
import productFavRoutes from './routes/favorites/products.js'
import courseFavRoutes from './routes/favorites/courses.js'
import exhibitionFavRoutes from './routes/favorites/exhibitions.js'
import db from './config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import courseRoutes from './routes/courseRoutes.js';
import artistRoutes from './routes/artistRoutes.js';

import productRoutes from './routes/products/index.js'
import orderRoutes from "./routes/orders/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);

// 中間件
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// 添加請求日誌中間件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// 確保在初始化 Socket.IO 之前設置好所有中間件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// 靜態文件服務
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 測試數據庫連接的路由
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({
      success: true,
      message: "數據庫連接正常",
      result: rows[0].result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "數據庫連接失敗",
      error: error.message,
    });
  }
});

// 查看資料表結構的路由
app.get("/api/tables", async (req, res) => {
  try {
    const [tables] = await db.query(
      `
      SELECT TABLE_NAME, TABLE_COMMENT 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [process.env.DB_NAME || 'museum_db']);
    
    const tableDetails = await Promise.all(tables.map(async (table) => {
      const [columns] = await db.query(`
        SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT, IS_NULLABLE, COLUMN_KEY
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      `, [process.env.DB_NAME || 'museum_db', table.TABLE_NAME]);
      
      return {
        tableName: table.TABLE_NAME,
        comment: table.TABLE_COMMENT,
        columns: columns
      };
    }));

    res.json({
      success: true,
      tables: tableDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "獲取資料表結構失敗",
      error: error.message,
    });
  }
});

// 路由
app.use('/api/members', memberRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/exhibitions', exhibitionsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/couponsClaim', couponsClaimRoutes);
app.use('/api/memberCoupons', memberCouponRoutes);
app.use('/api/favorites/products', productFavRoutes);
app.use('/api/favorites/courses', courseFavRoutes);
app.use('/api/favorites/exhibitions', exhibitionFavRoutes);
app.use('/api/products', productRoutes)
app.use("/api/orders", orderRoutes);

// Socket.IO 連接
// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return next(new Error('未提供認證令牌'));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const [user] = await db.query(
//       'SELECT id, role FROM members WHERE id = ? AND is_deleted = FALSE',
//       [decoded.id]
//     );

//     if (!user) {
//       return next(new Error('用戶不存在'));
//     }

//     socket.user = user;
//     next();
//   } catch (error) {
//     next(new Error('認證失敗'));
//   }
// });

// io.on('connection', (socket) => {
//   console.log('用戶已連接:', socket.user.id);

//   // 加入用戶的房間
//   socket.join(`user_${socket.user.id}`);

//   // 處理消息
//   socket.on('message', async (data) => {
//     try {
//       const { toUserId, content } = data;
      
//       // 保存消息到數據庫
//       const messageId = await saveMessage(socket.user.id, toUserId, content);

//       // 獲取發送者信息
//       const [sender] = await db.query(
//         'SELECT name, avatar FROM members WHERE id = ?',
//         [socket.user.id]
//       );

//       // 構建消息對象
//       const message = {
//         id: messageId,
//         from_user_id: socket.user.id,
//         to_user_id: toUserId,
//         content,
//         timestamp: new Date(),
//         from_name: sender[0].name,
//         from_avatar: sender[0].avatar
//       };

//       // 發送消息給接收者
//       io.to(`user_${toUserId}`).emit('message', message);
      
//       // 如果是客服發送消息，也發送給自己
//       if (socket.user.role === 'staff') {
//         socket.emit('message', message);
//       }
//     } catch (error) {
//       console.error('發送消息失敗:', error);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('用戶已斷開連接:', socket.user.id);
//   });
// });

// 設置端口
const PORT = process.env.PORT || 3005;

// 初始化 Socket.IO
console.log('正在初始化 Socket.IO...');
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 服務器運行在 http://localhost:${PORT}`);
  console.log('環境變量:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET ? '已設置' : '未設置'
  });
});

export default app;
