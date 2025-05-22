// museum-backend/src/services/socketService.js
// 這個檔案是負責處理 socket 的連接、斷開、訊息的發送和接收
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
let io

// 存儲在線用戶
const onlineUsers = new Map()
const onlineStaff = new Map()
// 新增：存儲等待客服的會員
const waitingMembers = new Map()

const initializeSocket = (server) => {
  console.log('初始化 Socket.IO 服務器...')
  console.log('服務器配置:', {
    port: process.env.PORT || 3005,
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
  
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    transports: ['websocket', 'polling'],  // 添加 polling 作為備選
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 20000,
    allowEIO3: true,
    path: '/socket.io/',
    cookie: {
      name: 'io',
      path: '/',
      httpOnly: true,
      sameSite: 'lax'
    }
  })

  // 身份驗證中間件
  io.use((socket, next) => {
    console.log('收到新的連接請求...', {
      id: socket.id,
      handshake: {
        auth: socket.handshake.auth,
        headers: socket.handshake.headers,
        query: socket.handshake.query
      }
    })
    
    const token = socket.handshake.auth.token
    if (!token) {
      console.error('未提供認證令牌')
      return next(new Error('Authentication error: No token provided'))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      socket.userId = decoded.id
      socket.userType = decoded.type || decoded.role || 'member'
      console.log('Token 驗證成功:', { 
        userId: socket.userId, 
        userType: socket.userType,
        socketId: socket.id,
        decodedToken: decoded
      })
      next()
    } catch (err) {
      console.error('Token 驗證失敗:', err.message)
      next(new Error('Authentication error: Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    console.log('用戶連接成功:', {
      socketId: socket.id,
      userId: socket.userId,
      userType: socket.userType,
      transport: socket.conn.transport.name
    })

    // 發送連接確認
    socket.emit('connectionConfirmed', {
      userId: socket.userId,
      type: socket.userType,
      status: 'online'
    })

    // 處理會員等待客服事件
    socket.on('waitingForStaff', ({ userId, userName }) => {
      waitingMembers.set(userId, socket)
      // 如果有客服在線，立即通知
      if (onlineStaff.size > 0) {
        socket.emit('staffOnline')
      }
    })

    // 用戶註冊
    socket.on('register', (userData) => {
      try {
        console.log('收到用戶註冊請求:', userData)
        const userInfo = {
          id: socket.userId,
          socketId: socket.id,
          name: userData.name,
          type: socket.userType,
          status: 'online'
        }

        if (socket.userType === 'staff') {
          onlineStaff.set(socket.userId, userInfo)
          // 新增：客服註冊時通知所有等待的會員
          waitingMembers.forEach((memberSocket) => {
            memberSocket.emit('staffOnline')
          })
        } else {
          onlineUsers.set(socket.userId, userInfo)
        }

        // 廣播用戶狀態更新
        io.emit('userStatus', {
          userId: socket.userId,
          status: 'online',
          type: socket.userType
        })

        // 如果是客服，發送在線會員列表
        if (socket.userType === 'staff') {
          socket.emit('onlineMembers', Array.from(onlineUsers.values()))
        }

        console.log('用戶註冊成功:', userInfo)
      } catch (error) {
        console.error('用戶註冊錯誤:', error)
        socket.emit('error', { message: '註冊失敗' })
      }
    })

    // 發送私聊消息
    socket.on('privateMessage', async (data) => {
      try {
        const { receiver_id, content, image } = data
        const senderId = socket.userId
        const senderType = socket.userType

        console.log('收到私聊消息:', {
          senderId,
          receiver_id,
          content,
          image: image ? '有圖片' : '無圖片',
          senderType
        })

        if (!receiver_id || (!content && !image)) {
          throw new Error('缺少必要參數')
        }

        // 保存消息到數據庫
        const message = await prisma.chatMessage.create({
          data: {
            sender_id: senderId,
            receiver_id: receiver_id,
            content: content || '',
            image_url: image || null,
            status: 'sent'
          }
        })

        console.log('消息已保存到數據庫:', message)

        // 發送給接收者
        const receiverSocketId = senderType === 'staff' 
          ? onlineUsers.get(receiver_id)?.socketId 
          : onlineStaff.get(receiver_id)?.socketId

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('privateMessage', {
            id: message.id,
            sender_id: message.sender_id,
            receiver_id: message.receiver_id,
            content: message.content,
            image: message.image_url,
            status: message.status,
            created_at: message.created_at,
            senderType
          })
          console.log('消息已發送給接收者:', receiverSocketId)
        } else {
          console.log('接收者不在線:', receiver_id)
        }

        // 發送回發送者
        socket.emit('privateMessage', {
          id: message.id,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          content: message.content,
          image: message.image_url,
          status: message.status,
          created_at: message.created_at,
          senderType
        })
        console.log('消息已發送回發送者')
      } catch (error) {
        console.error('發送消息錯誤:', error)
        socket.emit('error', { message: '發送消息失敗: ' + error.message })
      }
    })

    // 標記消息為已讀
    socket.on('markAsRead', async (messageId) => {
      try {
        await prisma.chatMessage.update({
          where: { id: messageId },
          data: { status: 'read' }
        })

        socket.emit('messageRead', { messageId })
      } catch (error) {
        console.error('標記已讀錯誤:', error)
        socket.emit('error', { message: '標記已讀失敗' })
      }
    })

    // 處理正在輸入事件
    socket.on('typing', ({ to }) => {
      let targetSocketId = onlineUsers.get(to)?.socketId || onlineStaff.get(to)?.socketId;
      if (targetSocketId) {
        io.to(targetSocketId).emit('typing', { from: socket.userId });
      }
    });
    socket.on('stopTyping', ({ to }) => {
      let targetSocketId = onlineUsers.get(to)?.socketId || onlineStaff.get(to)?.socketId;
      if (targetSocketId) {
        io.to(targetSocketId).emit('stopTyping', { from: socket.userId });
      }
    });

    // 斷開連接
    socket.on('disconnect', () => {
      console.log('用戶斷開連接:', socket.id)
      
      if (socket.userType === 'staff') {
        onlineStaff.delete(socket.userId)
        // 新增：客服下線時通知所有等待的會員
        waitingMembers.forEach((memberSocket) => {
          memberSocket.emit('staffOffline')
        })
      } else {
        onlineUsers.delete(socket.userId)
        waitingMembers.delete(socket.userId)
      }

      // 廣播用戶離線狀態
      io.emit('userStatus', {
        userId: socket.userId,
        status: 'offline',
        type: socket.userType
      })
    })
  })

  return io
}

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO 未初始化')
  }
  return io
}

export {
  initializeSocket,
  getIO
}