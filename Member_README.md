# 博物館網站專案

這是一個使用 Next.js 和 Express.js 開發的博物館網站專案，包含前端和後端兩個部分。

## 專案結構

```
museum-website/
├── museum-frontend/     # Next.js 前端專案
└── museum-backend/      # Express.js 後端專案
```

## 技術棧

### 前端
- Next.js 14 (App Router)
- React
- CSS Modules
- Axios
- React Bootstrap

### 後端
- Express.js
- MySQL
- JWT 認證
- Passport.js (Google OAuth)
- Socket.io (即時通訊)

## 功能特點

- 會員系統（註冊、登入、個人資料管理）
- Google OAuth 登入
- 即時通訊功能
- 響應式設計
- 多語言支援

## 開發環境設置

### 前端設置
```bash
cd museum-frontend
npm install
npm run dev
```

### 後端設置
```bash
cd museum-backend
npm install
npm run dev
```

## 環境變數

### 前端 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3005
```

### 後端 (.env)
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

## API 文檔

### 會員相關
- POST /api/members/register - 註冊新會員
- POST /api/members/login - 會員登入
- GET /api/members/me - 獲取當前會員資料
- PUT /api/members/profile - 更新會員資料
- POST /api/members/change-password - 修改密碼

### 即時通訊
- WebSocket 連接 - 即時聊天功能

## 部署

### 前端部署
```bash
cd museum-frontend
npm run build
npm start
```

### 後端部署
```bash
cd museum-backend
npm run build
npm start
```

## 開發團隊

- [您的名字/團隊名稱]

## 授權

[MIT License](LICENSE) 