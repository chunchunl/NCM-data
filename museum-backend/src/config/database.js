import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// 初始化數據庫連接
// ben粉在此使用 連線池
const db = await mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "museum_db",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// 測試數據庫連接
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ 數據庫連接成功！');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ 數據庫連接失敗：', error.message);
    return false;
  }
};

// 立即執行測試
testConnection();

const createMessagesTable = `
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_user_id INT NOT NULL,
  to_user_id INT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES members(id),
  FOREIGN KEY (to_user_id) REFERENCES members(id)
)`;

// 在初始化數據庫時執行
const initDatabase = async () => {
  try {
    await db.query(createMessagesTable);
    console.log('Messages table created or already exists');
  } catch (error) {
    console.error('Error creating messages table:', error);
  }
};

initDatabase();

export default db; 