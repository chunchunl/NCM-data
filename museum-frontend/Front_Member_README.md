# 博物館網站前端

這是博物館網站的前端專案，使用 Next.js 14 開發。

## 技術棧

- Next.js 14 (App Router)
- React 18
- CSS Modules
- Axios
- React Bootstrap

## 功能特點

- 響應式設計
- 會員系統
- 即時通訊
- 多語言支援

## 開發環境設置

1. 安裝依賴：
```bash
npm install
```

2. 創建環境變數文件 (.env.local)：
```
NEXT_PUBLIC_API_URL=http://localhost:3005
```

3. 啟動開發服務器：
```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000) 查看結果。

## 專案結構

```
app/
├── _components/        # 共用組件
├── admin/             # 管理後台
├── member/            # 會員相關頁面
├── chat/              # 即時通訊
├── layout.js          # 根佈局
└── page.js            # 首頁
```

## 主要功能

### 會員系統
- 註冊/登入
- 個人資料管理
- Google OAuth 登入

### 即時通訊
- 一對一聊天
- 群組聊天
- 消息通知

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

- 使用 `'use client'` 標記客戶端組件
- 使用 CSS Modules 進行樣式隔離
- API 請求統一使用 Axios
- 遵循 Next.js 的檔案系統路由規則

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
