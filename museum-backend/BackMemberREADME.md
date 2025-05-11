# 國立故瓷博物院 - 後端專案

## 專案概述
本專案是國立故宮博物院的官方網站後端部分，提供 RESTful API 服務，支援前端應用的各項功能。

## 技術棧

### 核心框架
- Node.js
- Express.js
- MySQL 8.0

### 數據庫
- MySQL 8.0
- 事務處理
- 關聯查詢
- 索引優化
- 數據庫遷移
- 數據備份

### 認證與授權
- JWT (JSON Web Token)
- Passport.js
- Google OAuth 2.0
- bcrypt 密碼加密
- 角色權限控制
- 會話管理

### 文件處理
- Multer 文件上傳
- 圖片處理
- 文件存儲管理
- 文件類型驗證
- 文件大小限制
- 文件命名規範

### API 設計
- RESTful API
- 中間件
- 錯誤處理
- 請求驗證
- API 版本控制
- 響應格式統一

### 安全性
- CORS 配置
- 請求限制
- SQL 注入防護
- XSS 防護
- CSRF 防護
- 安全標頭設置

### 開發工具
- ESLint
- Prettier
- Git 版本控制
- Postman 測試
- 日誌記錄

## 主要功能

### 用戶管理
- 用戶註冊
- 用戶登入
- 密碼重置
- 電子郵件驗證
- Google 登入整合
- 用戶狀態管理

### 會員中心
- 個人資料管理
- 頭像上傳
- 密碼修改
- 電子郵件修改
- 會員等級系統
- 積分管理

### 文件處理
- 圖片上傳
- 文件存儲
- 文件刪除
- 文件訪問控制
- 文件壓縮
- 圖片裁剪

### 安全性
- 請求驗證
- 錯誤處理
- 日誌記錄
- 數據驗證
- 敏感數據加密
- 訪問控制

## 開發指南

### 環境設置
1. 安裝依賴：
```bash
npm install
```

2. 配置環境變量：
創建 `.env` 文件並設置以下變量：
```
# 服務器配置
PORT=3005
NODE_ENV=development

# 數據庫配置
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=museum_db

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Google OAuth 配置
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3005/api/members/auth/google/callback

# 郵件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# 文件上傳配置
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

3. 數據庫設置：
```sql
CREATE DATABASE museum_db;
USE museum_db;

-- 創建用戶表
CREATE TABLE members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    google_id VARCHAR(255),
    role ENUM('member', 'admin') DEFAULT 'member',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 創建會員資料表
CREATE TABLE member_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    name VARCHAR(255),
    gender ENUM('M', 'F', 'O'),
    phone VARCHAR(20),
    address TEXT,
    avatar VARCHAR(255),
    birthday DATE,
    FOREIGN KEY (member_id) REFERENCES members(id)
);
```

4. 啟動開發服務器：
```bash
npm run dev
```

### 構建生產版本
```bash
npm run build
npm start
```

## 目錄結構
```
museum-backend/
├── src/
│   ├── config/           # 配置文件
│   │   ├── database.js   # 數據庫配置
│   │   ├── passport.js   # Passport 配置
│   │   └── upload.js     # 文件上傳配置
│   ├── middleware/       # 中間件
│   │   ├── auth.js      # 認證中間件
│   │   └── upload.js    # 文件上傳中間件
│   ├── routes/          # 路由
│   │   └── memberRoutes.js # 會員相關路由
│   ├── services/        # 業務邏輯
│   │   └── memberService.js # 會員相關服務
│   ├── utils/           # 工具函數
│   │   ├── logger.js    # 日誌工具
│   │   └── validator.js # 驗證工具
│   └── app.js           # 應用入口
├── uploads/             # 上傳文件存儲
└── package.json         # 項目配置
```

## API 文檔

### 認證相關
- POST /api/members/register - 用戶註冊
- POST /api/members/login - 用戶登入
- GET /api/members/auth/google - Google 登入
- GET /api/members/auth/google/callback - Google 登入回調
- POST /api/members/logout - 用戶登出

### 會員中心
- GET /api/members/me - 獲取當前用戶資料
- PUT /api/members/profile - 更新用戶資料
- POST /api/members/profile/avatar - 上傳頭像
- POST /api/members/change-password - 修改密碼
- POST /api/members/change-email - 修改電子郵件
- DELETE /api/members/account - 刪除帳號

## 數據庫設計

### members 表
- id: 主鍵
- email: 電子郵件（唯一）
- password: 密碼（加密存儲）
- google_id: Google ID
- role: 角色（member/admin）
- is_deleted: 軟刪除標記
- created_at: 創建時間

### member_profiles 表
- id: 主鍵
- member_id: 關聯 members 表
- name: 姓名
- gender: 性別
- phone: 電話
- address: 地址
- avatar: 頭像路徑
- birthday: 生日

## 注意事項
- 確保 MySQL 服務器正在運行
- 開發時請遵循 ESLint 規則
- 提交代碼前請運行 `npm run lint` 檢查代碼質量
- 定期備份數據庫
- 注意文件上傳的安全性
- 保護敏感配置信息
- 定期更新依賴包
- 監控服務器日誌 