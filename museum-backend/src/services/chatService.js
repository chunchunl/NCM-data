import db from '../config/database.js';

// 獲取客服列表
export const getCustomerServiceList = async () => {
  try {
    const [staff] = await db.query(
      `SELECT m.id, mp.name, mp.avatar 
       FROM members m 
       JOIN member_profiles mp ON m.id = mp.member_id 
       WHERE m.role = 'staff' AND m.is_deleted = FALSE`
    );
    return staff;
  } catch (error) {
    throw new Error('獲取客服列表失敗');
  }
};

// 獲取聊天記錄
export const getChatHistory = async (userId, staffId) => {
  try {
    const [messages] = await db.query(
      `SELECT 
        m.id,
        m.sender_id,
        m.receiver_id,
        m.content,
        m.message_type,
        m.status,
        m.created_at,
        m.updated_at,
        sender.name as sender_name,
        sender.avatar as sender_avatar,
        receiver.name as receiver_name,
        receiver.avatar as receiver_avatar
      FROM chat_messages m
      JOIN member_profiles sender ON m.sender_id = sender.member_id
      JOIN member_profiles receiver ON m.receiver_id = receiver.member_id
      WHERE (m.sender_id = ? AND m.receiver_id = ?)
      OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC`,
      [userId, staffId, staffId, userId]
    );
    return messages;
  } catch (error) {
    throw new Error('獲取聊天記錄失敗');
  }
};

// 保存消息
export const saveMessage = async (senderId, receiverId, content, messageType = 'text') => {
  try {
    const [result] = await db.query(
      `INSERT INTO chat_messages 
       (sender_id, receiver_id, content, message_type, status) 
       VALUES (?, ?, ?, ?, 'sent')`,
      [senderId, receiverId, content, messageType]
    );
    return result.insertId;
  } catch (error) {
    throw new Error('保存消息失敗');
  }
};

// 更新消息狀態
export const updateMessageStatus = async (messageId, status) => {
  try {
    await db.query(
      'UPDATE chat_messages SET status = ? WHERE id = ?',
      [status, messageId]
    );
    return true;
  } catch (error) {
    throw new Error('更新消息狀態失敗');
  }
};

// 獲取用戶的客服
export const getUserStaff = async (userId) => {
  try {
    // 這裡可以實現更複雜的分配邏輯，目前簡單地返回第一個客服
    const [staff] = await db.query(
      `SELECT m.id, mp.name, mp.avatar 
       FROM members m 
       JOIN member_profiles mp ON m.id = mp.member_id 
       WHERE m.role = 'staff' AND m.is_deleted = FALSE 
       LIMIT 1`
    );
    return staff[0];
  } catch (error) {
    throw new Error('獲取客服失敗');
  }
};

// 創建聊天室
export const createChatRoom = async (name, creatorId) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 創建聊天室
    const [roomResult] = await connection.query(
      'INSERT INTO chat_rooms (name) VALUES (?)',
      [name]
    );
    const roomId = roomResult.insertId;

    // 添加創建者為聊天室成員
    await connection.query(
      'INSERT INTO chat_room_members (room_id, member_id, role) VALUES (?, ?, ?)',
      [roomId, creatorId, 'owner']
    );

    await connection.commit();
    return { roomId, name };
  } catch (error) {
    await connection.rollback();
    throw new Error('創建聊天室失敗');
  } finally {
    connection.release();
  }
};

// 獲取聊天室消息
export const getRoomMessages = async (roomId) => {
  try {
    const [messages] = await db.query(
      `SELECT 
        m.id,
        m.sender_id,
        m.content,
        m.message_type,
        m.status,
        m.created_at,
        m.updated_at,
        sender.name as sender_name,
        sender.avatar as sender_avatar
      FROM chat_room_messages m
      JOIN member_profiles sender ON m.sender_id = sender.member_id
      WHERE m.room_id = ?
      ORDER BY m.created_at ASC`,
      [roomId]
    );
    return messages;
  } catch (error) {
    throw new Error('獲取聊天室消息失敗');
  }
};

// 保存聊天室消息
export const saveRoomMessage = async (roomId, senderId, content, messageType = 'text') => {
  try {
    const [result] = await db.query(
      `INSERT INTO chat_room_messages 
       (room_id, sender_id, content, message_type, status) 
       VALUES (?, ?, ?, ?, 'sent')`,
      [roomId, senderId, content, messageType]
    );
    return result.insertId;
  } catch (error) {
    throw new Error('保存聊天室消息失敗');
  }
}; 