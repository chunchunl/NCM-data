import express from "express";
import {
  register,
  login,
  getMemberProfile,
  updateMemberProfile,
  deleteMember,
  changePassword,
  sendPasswordChangeEmail,
  sendEmailChangeEmail,
  confirmEmailChange,
  deleteAccount,
} from "../services/memberService.js";
import { authenticateToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 註冊
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, avatar } = req.body;

    // 驗證必要參數
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "請提供所有必要信息（email、password、name）",
      });
    }

    // 驗證郵箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "請提供有效的郵箱地址",
      });
    }

    // 驗證密碼長度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "密碼長度至少為6個字符",
      });
    }

    const result = await register(email, password, name, avatar);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// 登入
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const [users] = await pool.query(
      "SELECT * FROM members WHERE email = ? AND is_deleted = FALSE",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "電子郵箱或密碼錯誤",
      });
    }

    const user = users[0];

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "電子郵箱或密碼錯誤",
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // 返回用戶信息（不包含密碼）
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    res.json({
      success: true,
      message: "登入成功",
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    console.error("登入錯誤:", error);
    res.status(500).json({
      success: false,
      message: "登入失敗，請稍後重試",
    });
  }
});

// 獲取會員資料
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.id;
    const profile = await getMemberProfile(memberId);
    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// 更新會員資料
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, gender, phone, address, birthday } = req.body;
    console.log(req.body);
    const memberId = req.user.id;
    // const parsedBirthday = birthday ? birthday : null;

    // 更新會員詳細資料
    await pool.query(
      `UPDATE member_profiles 
       SET name = ?, gender = ?, phone = ?, address = ?, birthday = ?
       WHERE member_id = ?`,
      [name, gender, phone, address, birthday, memberId]
    );

    res.json({
      success: true,
      message: "資料更新成功",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "更新資料失敗",
    });
  }
});

// 刪除會員（軟刪除）
router.delete("/", authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.id;
    const result = await deleteMember(memberId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 上傳頭像
router.post(
  "/profile/avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      console.log("收到頭像上傳請求");
      console.log("文件信息:", req.file);
      console.log("用戶信息:", req.user);

      if (!req.file) {
        console.log("未收到文件");
        return res.status(400).json({
          success: false,
          message: "請選擇要上傳的圖片",
        });
      }

      // 生成圖片的URL路徑
      // const avatarUrl = `/uploads/${req.file.filename}`;
      // console.log('生成的頭像URL:', avatarUrl);

      // 1. 先把相對路徑存 DB
      const avatarPath = `/uploads/${req.file.filename}`;

      // 2. 組出完整網址給前端
      const host =
        process.env.SERVER_ORIGIN || // 正式環境
        `${req.protocol}://${req.get("host")}`; // dev
      const avatarUrl = `${host}${avatarPath}`;

      // 更新會員的頭像
      // const result = await updateMemberProfile(req.user.id, {
      //   avatar: avatarUrl,
      // });
      const result = await updateMemberProfile(req.user.id, {
        avatar: avatarPath,
      }); // ← DB 只存相對路徑
      console.log("更新結果:", result);

      if (!result.success) {
        throw new Error(result.message || "更新頭像失敗");
      }

      res.json({
        success: true,
        message: "頭像上傳成功",
        data: {
          avatarUrl,
        },
      });
    } catch (error) {
      console.error("頭像上傳錯誤:", error);
      res.status(400).json({
        success: false,
        message: error.message || "上傳失敗",
      });
    }
  }
);

// 修改密碼
router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // 驗證必要參數
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "請提供舊密碼和新密碼",
      });
    }

    // 修改密碼
    const result = await changePassword(memberId, oldPassword, newPassword);

    // 發送確認郵件
    const [members] = await pool.query(
      "SELECT email FROM members WHERE id = ?",
      [memberId]
    );

    if (members && members.length > 0) {
      await sendPasswordChangeEmail(members[0].email);
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// 確認修改密碼（通過郵件鏈接）
router.get("/confirm-password-change", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "缺少確認令牌",
      });
    }

    // 驗證 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "password_change") {
      throw new Error("無效的確認令牌");
    }

    res.json({
      success: true,
      message: "密碼修改已確認",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// 修改信箱
router.post("/change-email", authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.id;
    const { newEmail } = req.body;

    // 驗證必要參數
    if (!newEmail) {
      return res.status(400).json({
        success: false,
        message: "請提供新信箱",
      });
    }

    // 驗證信箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        success: false,
        message: "請提供有效的信箱地址",
      });
    }

    // 獲取當前信箱
    const [members] = await pool.query(
      "SELECT email FROM members WHERE id = ? AND is_deleted = FALSE",
      [memberId]
    );

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "找不到會員資料",
      });
    }

    const oldEmail = members[0].email;

    // 檢查新信箱是否與舊信箱相同
    if (oldEmail === newEmail) {
      return res.status(400).json({
        success: false,
        message: "新信箱不能與舊信箱相同",
      });
    }

    // 發送確認郵件
    const result = await sendEmailChangeEmail(oldEmail, newEmail);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// 確認修改信箱（通過郵件鏈接）
router.get("/confirm-email-change", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "缺少確認令牌",
      });
    }

    // 確認並更新信箱
    const result = await confirmEmailChange(token);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// 刪除會員帳號
router.delete("/account", authenticateToken, async (req, res) => {
  try {
    const memberId = req.user.id;
    const { password } = req.body;

    // 驗證必要參數
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "請提供密碼",
      });
    }

    // 刪除帳號
    const result = await deleteAccount(memberId, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Google 登入
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google 登入回調
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3000/login?error=Google登入失敗"
  }),
  (req, res) => {
    try {
      console.log('Google 登入成功，用戶資料:', req.user);

      // 登入成功，生成 JWT token
      const token = jwt.sign(
        { 
          id: req.user.id, 
          email: req.user.email,
          role: req.user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // 獲取完整的用戶資料
      const userData = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
        role: req.user.role
      };

      console.log('準備重定向，用戶資料:', userData);

      // 重定向到前端，並帶上 token 和用戶信息
      const redirectUrl = `http://localhost:3000/member/center?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      console.log('重定向 URL:', redirectUrl);
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`http://localhost:3000/login?error=${encodeURIComponent(error.message)}`);
    }
  }
);

// 處理上傳錯誤
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "文件大小不能超過 5MB",
      });
    }
  }
  res.status(400).json({
    success: false,
    message: error.message,
  });
});

// 獲取當前用戶資料
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // 獲取會員基本資料
    const [members] = await pool.query(
      "SELECT id, email, role, created_at FROM members WHERE id = ? AND is_deleted = FALSE",
      [req.user.id]
    );

    if (members.length === 0) {
      return res.status(404).json({
        success: false,
        message: "用戶不存在",
      });
    }

    // 獲取會員詳細資料
    const [profiles] = await pool.query(
      "SELECT name, gender, phone, address, avatar, birthday FROM member_profiles WHERE member_id = ?",
      [req.user.id]
    );

    const profile = profiles[0] || {};

    // res.json({
    //   success: true,
    //   data: {
    //     ...members[0],
    //     ...profile,
    //   },
    // });

    /* 將 avatar 欄位補成完整 URL */
    const host =
      process.env.SERVER_ORIGIN || `${req.protocol}://${req.get("host")}`;
    const fullAvatar = profile.avatar ? `${host}${profile.avatar}` : null;

    res.json({
      success: true,
      data: {
        ...members[0],
        ...profile,
        avatar: fullAvatar, // ← 前端一拿就能 <img src="">
      },
    });
    
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      message: "獲取用戶資料失敗",
    });
  }
});

export default router;
