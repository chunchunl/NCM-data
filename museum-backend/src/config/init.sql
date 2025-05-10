-- 創建資料庫
CREATE DATABASE IF NOT EXISTS museum_db;
USE museum_db;

-- 創建 members 表
CREATE TABLE IF NOT EXISTS members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  google_id VARCHAR(255),
  role ENUM('member', 'admin') DEFAULT 'member',
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 創建 member_profiles 表
CREATE TABLE IF NOT EXISTS member_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  member_id INT NOT NULL,
  name VARCHAR(100),
  gender ENUM('M', 'F', 'O'),
  phone VARCHAR(20),
  address TEXT,
  avatar VARCHAR(255) DEFAULT 'https://example.com/default-avatar.png',
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- 創建聊天室消息表
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES members(id),
  FOREIGN KEY (receiver_id) REFERENCES members(id)
); 