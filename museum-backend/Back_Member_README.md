# 博物館網站後端

這是博物館網站的後端專案，使用 Express.js 開發。

## 技術棧

- Express.js
- MySQL
- JWT 認證
- Passport.js (Google OAuth)
- Socket.io
- Multer (檔案上傳)

## 功能特點

- RESTful API
- JWT 認證
- Google OAuth 整合
- 即時通訊
- 檔案上傳

## 開發環境設置

1. 安裝依賴：
```bash
npm install
```

2. 創建環境變數文件 (.env)：
```
PORT=3005
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

3. 啟動開發服務器：
```bash
npm run dev
```

## 專案結構

```
src/
├── config/            # 配置文件
├── middleware/        # 中間件
├── routes/           # 路由
├── services/         # 業務邏輯
└── app.js            # 入口文件
```

## API 文檔

### 會員相關
- POST /api/members/register
  - 註冊新會員
  - 請求體：{ email, password, name }

- POST /api/members/login
  - 會員登入
  - 請求體：{ email, password }

- GET /api/members/me
  - 獲取當前會員資料
  - 需要 JWT 認證

- PUT /api/members/profile
  - 更新會員資料
  - 需要 JWT 認證
  - 請求體：{ name, gender, phone, address, birthday }

### 即時通訊
- WebSocket 連接
  - 事件：message, join, leave
  - 需要 JWT 認證

## 資料庫結構

### members 表
- id (主鍵)
- email
- password
- role
- created_at
- is_deleted

### member_profiles 表
- id (主鍵)
- member_id (外鍵)
- name
- gender
- phone
- address
- birthday
- avatar

## 部署

1. 構建專案：
```bash
npm run build
```

2. 啟動生產服務器：
```bash
npm start
```

## 開發注意事項

- 使用 async/await 處理異步操作
- 所有 API 響應統一格式
- 使用 JWT 進行身份驗證
- 實現適當的錯誤處理
- 使用事務確保數據一致性 