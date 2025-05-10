-- 更新 members 表，添加 staff 角色
ALTER TABLE members MODIFY COLUMN role ENUM('member', 'admin', 'staff') DEFAULT 'member';

-- 更新 chat_messages 表
ALTER TABLE chat_messages 
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN message_type ENUM('text', 'image', 'file') DEFAULT 'text',
ADD COLUMN status ENUM('sent', 'delivered', 'read') DEFAULT 'sent';

-- 添加索引
CREATE INDEX idx_sender_receiver ON chat_messages(sender_id, receiver_id);
CREATE INDEX idx_created_at ON chat_messages(created_at);
CREATE INDEX idx_status ON chat_messages(status);

-- 添加聊天室表
CREATE TABLE IF NOT EXISTS chat_rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 添加聊天室成員表
CREATE TABLE IF NOT EXISTS chat_room_members (
  room_id INT NOT NULL,
  member_id INT NOT NULL,
  role ENUM('owner', 'admin', 'member') DEFAULT 'member',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (room_id, member_id),
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- 添加聊天室消息表
CREATE TABLE IF NOT EXISTS chat_room_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  room_id INT NOT NULL,
  sender_id INT NOT NULL,
  content TEXT NOT NULL,
  message_type ENUM('text', 'image', 'file') DEFAULT 'text',
  status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES members(id) ON DELETE CASCADE
);

-- 添加索引
CREATE INDEX idx_room_messages ON chat_room_messages(room_id, created_at);
CREATE INDEX idx_room_member ON chat_room_members(room_id, member_id); 