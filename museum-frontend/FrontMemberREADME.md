# 國立故瓷博物院 - 前端專案

## 專案概述
本專案是國立故宮博物院的官方網站前端部分，採用現代化的技術棧和最佳實踐進行開發。

## 技術棧

### 核心框架
- Next.js 14 (App Router)
- React 18
- TypeScript

### 狀態管理
- React Hooks (useState, useEffect, useContext)
- localStorage 用於本地數據持久化
- 自定義事件系統用於組件間通信

### UI/UX
- SCSS/SASS 用於樣式管理
- Bootstrap 5 用於響應式設計
- React Icons 用於圖標
- 自定義 Toast 通知系統
- 自適應導航欄
- 響應式側邊欄

### 路由與導航
- Next.js App Router
- 動態路由
- 路由守衛
- 頁面轉場動畫

### 表單處理
- 自定義表單驗證
- 文件上傳處理
- 密碼強度檢查
- 表單錯誤提示

### 認證與授權
- JWT (JSON Web Token) 認證
- Google OAuth 2.0 登入
- 本地存儲 token 管理
- 自動登出機制

### API 整合
- Fetch API 用於 HTTP 請求
- RESTful API 整合
- 文件上傳處理
- 請求攔截器

### 性能優化
- 圖片優化
- 組件懶加載
- 狀態管理優化
- 代碼分割

### 開發工具
- ESLint
- Prettier
- Git 版本控制
- VS Code 配置

## 主要功能

### 用戶認證
- 電子郵件註冊/登入
- Google 帳號登入
- 密碼重置
- 電子郵件驗證
- 記住登入狀態

### 會員中心
- 個人資料管理
- 頭像上傳與更新
- 密碼修改
- 電子郵件修改
- 個人偏好設置

### 響應式設計
- 桌面版界面
- 平板版界面
- 移動版界面
- 自適應導航欄
- 觸控優化

### 通知系統
- Toast 通知
- 錯誤處理
- 成功提示
- 全局狀態提示

## 開發指南

### 環境設置
1. 安裝依賴：
```bash
npm install
```

2. 配置環境變量：
創建 `.env.local` 文件並設置以下變量：
```
NEXT_PUBLIC_API_URL=http://localhost:3005
```

3. 啟動開發服務器：
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
museum-frontend/
├── app/                    # 應用主目錄
│   ├── _components/       # 共享組件
│   │   ├── authModal/    # 認證相關組件
│   │   ├── navbar/       # 導航欄組件
│   │   └── toast/        # 通知組件
│   ├── _styles/          # 全局樣式
│   │   ├── globals.scss  # 全局樣式
│   │   └── variables.scss # 變量定義
│   ├── member/           # 會員相關頁面
│   └── page.js           # 首頁
├── public/               # 靜態資源
│   ├── img/             # 圖片資源
│   └── fonts/           # 字體文件
└── package.json         # 項目配置
```

## 組件說明

### 導航欄 (Navbar)
- 響應式設計
- 用戶狀態顯示
- 下拉選單
- 移動端側邊欄

### 認證模態框 (AuthModal)
- 登入/註冊切換
- 表單驗證
- 錯誤提示
- 社交媒體登入

### 通知系統 (Toast)
- 成功/錯誤/警告提示
- 自動消失
- 動畫效果
- 隊列管理

## 注意事項
- 確保後端 API 服務器正在運行
- 開發時請遵循 ESLint 規則
- 提交代碼前請運行 `npm run lint` 檢查代碼質量
- 注意組件間的通信方式
- 保持代碼風格一致性 