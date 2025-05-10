import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
  getCustomerServiceList, 
  getChatHistory, 
  saveMessage, 
  updateMessageStatus,
  getUserStaff,
  createChatRoom,
  getRoomMessages,
  saveRoomMessage
} from '../services/chatService.js';

const router = express.Router();

// 獲取客服列表
router.get('/staff', authenticateToken, async (req, res) => {
  try {
    const staff = await getCustomerServiceList();
    res.json({ success: true, staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 獲取聊天記錄
router.get('/history/:staffId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const staffId = req.params.staffId;
    const messages = await getChatHistory(userId, staffId);
    res.json({ success: true, messages });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 發送消息
router.post('/message', authenticateToken, async (req, res) => {
  try {
    const { receiverId, content, messageType } = req.body;
    const senderId = req.user.id;
    
    const messageId = await saveMessage(senderId, receiverId, content, messageType);
    res.json({ success: true, messageId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 更新消息狀態
router.put('/message/:messageId/status', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;
    
    await updateMessageStatus(messageId, status);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 獲取用戶的客服
router.get('/my-staff', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const staff = await getUserStaff(userId);
    res.json({ success: true, staff });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 創建聊天室
router.post('/room', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    const creatorId = req.user.id;
    
    const room = await createChatRoom(name, creatorId);
    res.json({ success: true, room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 獲取聊天室消息
router.get('/room/:roomId/messages', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await getRoomMessages(roomId);
    res.json({ success: true, messages });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 發送聊天室消息
router.post('/room/:roomId/message', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, messageType } = req.body;
    const senderId = req.user.id;
    
    const messageId = await saveRoomMessage(roomId, senderId, content, messageType);
    res.json({ success: true, messageId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router; 