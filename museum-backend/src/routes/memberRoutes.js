import express, { response } from "express";
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
  sendResetPasswordEmail,
  createFirebaseUser,
} from "../services/memberService.js";
import { authenticateToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin.js";
// import passport from "../config/passport.js";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";

import crypto from "crypto";
import nodemailer from "nodemailer";
import transporter from "../config/nodemailer.js";

import { isValidPassword } from "../utils/validatePassword.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const express = require('express');
const router = express.Router();
// const memberService = require('../services/memberService');
// const auth = require('../middleware/auth');

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
    // if (password.length < 8) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "密碼長度至少為8個字符",
    //   });
    // }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "密碼需包含至少8字元，且包含大寫、小寫、數字與特殊符號",
      });
    }

    const result = await register(email, password, name, avatar);
    res.json(result);
  } catch (error) {
    console.error("註冊錯誤:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// 登入
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 查找用户
//     const [users] = await pool.query(
//       "SELECT * FROM members WHERE email = ? AND is_deleted = FALSE",
//       [email]
//     );

//     if (users.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "電子郵箱或密碼錯誤",
//       });
//     }

//     const user = users[0];

//     // 驗證密碼
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "電子郵箱或密碼錯誤",
//       });
//     }

//     // 生成 JWT token
//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET || "your-secret-key",
//       { expiresIn: "24h" }
//     );

//     // 返回用戶信息（不包含密碼）
//     const userData = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       created_at: user.created_at,
//     };

//     res.json({
//       success: true,
//       message: "登入成功",
//       data: {
//         token,
//         user: userData,
//       },
//     });
//   } catch (error) {
//     console.error("登入錯誤:", error);
//     res.status(500).json({
//       success: false,
//       message: "登入失敗，請稍後重試",
//     });
//   }
// });

// 登入
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用戶（包含會員資料）
    const [users] = await pool.query(
      `SELECT m.*, mp.name, mp.gender, mp.phone, mp.address, mp.avatar, mp.birthday
       FROM members m 
       LEFT JOIN member_profiles mp ON m.id = mp.member_id 
       WHERE m.email = ? AND m.is_deleted = FALSE`,
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
      { 
        id: user.id, 
        email: user.email,
        type: user.role,  // 添加 type 字段
        role: user.role   // 添加 role 字段
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // 返回用戶信息（包含會員資料）
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      gender: user.gender,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      birthday: user.birthday,
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
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const memberId = req.params.id;

    // 獲取會員基本資料
    const [members] = await pool.query(
      "SELECT id, email, role, created_at FROM members WHERE id = ? AND is_deleted = FALSE",
      [memberId]
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
      [memberId]
    );

    const profile = profiles[0] || {};

    // 構建完整的頭像URL
    const host =
      process.env.SERVER_ORIGIN || `${req.protocol}://${req.get("host")}`;
    // const fullAvatar = profile.avatar ? `${host}${profile.avatar}` : null;

    // 只有相對路徑補前綴，完整 URL 保持原狀
    let fullAvatar = null;
    if (profile.avatar) {
      if (
        profile.avatar.startsWith("http://") ||
        profile.avatar.startsWith("https://")
      ) {
        fullAvatar = profile.avatar;
      } else {
        fullAvatar = `${host}${profile.avatar}`;
      }
    }

    res.json({
      success: true,
      data: {
        ...members[0],
        ...profile,
        avatar: fullAvatar,
      },
    });
  } catch (error) {
    console.error("獲取會員資料錯誤:", error);
    res.status(500).json({
      success: false,
      message: "獲取會員資料失敗",
    });
  }
});

// 獲取當前用戶資料
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const [members] = await pool.query(
      "SELECT id, email, role, created_at FROM members WHERE id = ? AND is_deleted = FALSE",
      [req.user.id]
    );
    if (members.length === 0) {
      return res.status(404).json({ success: false, message: "用戶不存在" });
    }
    const [profiles] = await pool.query(
      "SELECT name, gender, phone, address, avatar, birthday FROM member_profiles WHERE member_id = ?",
      [req.user.id]
    );
    const profile = profiles[0] || {};

    const host =
      process.env.SERVER_ORIGIN || `${req.protocol}://${req.get("host")}`;
    let fullAvatar = null;
    if (profile.avatar) {
      if (
        profile.avatar.startsWith("http://") ||
        profile.avatar.startsWith("https://")
      ) {
        fullAvatar = profile.avatar;
      } else {
        fullAvatar = `${host}${profile.avatar}`;
      }
    }

    res.json({
      success: true,
      data: {
        ...members[0],
        ...profile,
        avatar: fullAvatar,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "獲取用戶資料失敗" });
  }
});



// 更新會員資料
router.put(
  "/profile",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const memberId = req.user.id;
      const { name, gender, phone, address, birthday } = req.body;

      // 如果有上傳新頭像，生成頭像路徑
      let avatarPath = null;
      if (req.file) {
        avatarPath = `/uploads/${req.file.filename}`;
      }

      // 使用 updateMemberProfile 服務函數
      const result = await updateMemberProfile(memberId, {
        name,
        gender,
        phone,
        address,
        birthday,
        avatar: avatarPath, // 如果有新頭像就更新，沒有就保持原樣
      });

      // 獲取更新後的完整資料
      const [updatedProfile] = await pool.query(
        `SELECT m.email, mp.name, mp.gender, mp.phone, mp.address, mp.avatar, mp.birthday
       FROM members m 
       JOIN member_profiles mp ON m.id = mp.member_id 
       WHERE m.id = ? AND m.is_deleted = FALSE`,
        [memberId]
      );

      // 構建完整的頭像URL
      const host =
        process.env.SERVER_ORIGIN || `${req.protocol}://${req.get("host")}`;
      const fullAvatar = updatedProfile[0].avatar
        ? `${host}${updatedProfile[0].avatar}`
        : null;

      res.json({
        success: true,
        message: "資料更新成功",
        data: {
          ...updatedProfile[0],
          avatar: fullAvatar,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        success: false,
        message: error.message || "更新資料失敗",
      });
    }
  }
);

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
  const { currentPassword, newPassword } = req.body;
  const memberId = req.user.id;

  try {
    // 驗證當前密碼
    const [member] = await pool.query("SELECT * FROM members WHERE id = ?", [
      memberId,
    ]);

    if (member.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到會員資料",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      member[0].password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "當前密碼錯誤",
      });
    }

    // 加密新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "新密碼格式不符，需包含大小寫、數字、特殊符號且至少8字元",
      });
    }
    

    // 更新密碼
    await pool.query("UPDATE members SET password = ? WHERE id = ?", [
      hashedPassword,
      memberId,
    ]);

    res.json({
      success: true,
      message: "密碼修改成功",
    });
  } catch (error) {
    console.error("修改密碼錯誤:", error);
    res.status(500).json({
      success: false,
      message: "修改密碼失敗",
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

    console.log("收到刪除帳號請求:", { memberId });

    // 驗證必要參數
    if (!password) {
      console.log("缺少密碼參數");
      return res.status(400).json({
        success: false,
        message: "請提供密碼",
      });
    }

    // 驗證密碼
    const [members] = await pool.query(
      "SELECT * FROM members WHERE id = ? AND is_deleted = FALSE",
      [memberId]
    );

    console.log(
      "查詢會員結果:",
      members.length > 0 ? "找到會員" : "未找到會員"
    );

    if (members.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到會員資料",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, members[0].password);
    console.log("密碼驗證結果:", isPasswordValid ? "密碼正確" : "密碼錯誤");

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "密碼錯誤",
      });
    }

    // 開始事務
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 軟刪除會員資料
      console.log("開始軟刪除會員資料");
      await connection.query(
        "UPDATE members SET is_deleted = TRUE WHERE id = ?",
        [memberId]
      );

      // 軟刪除會員詳細資料
      console.log("開始軟刪除會員詳細資料");
      await connection.query(
        "UPDATE member_profiles SET is_deleted = TRUE WHERE member_id = ?",
        [memberId]
      );

      // 提交事務
      await connection.commit();
      console.log("帳號刪除成功");

      res.json({
        success: true,
        message: "帳號已成功刪除",
      });
    } catch (error) {
      // 如果出錯，回滾事務
      await connection.rollback();
      throw error;
    } finally {
      // 釋放連接
      connection.release();
    }
  } catch (error) {
    console.error("刪除帳號錯誤:", error);
    console.error("錯誤詳情:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    res.status(500).json({
      success: false,
      message: "刪除帳號失敗",
    });
  }
});

// Google 登入
// router.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     session: false,
//   })
// );

// Google 登入回調
// router.get(
//   "/auth/google/callback",
//   (req, res, next) => {
//     console.log('收到 Google 回調請求');
//     passport.authenticate("google", {
//       session: false,
//       failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=Google登入失敗`
//     })(req, res, next);
//   },
//   (req, res) => {
//     try {
//       console.log('Google 回調處理開始');
//       console.log('用戶資料:', req.user);

//       if (!req.user) {
//         console.error('未獲取到用戶資料');
//         throw new Error('未獲取到用戶資料');
//       }

//       // 登入成功，生成 JWT token
//       const token = jwt.sign(
//         {
//           id: req.user.id,
//           email: req.user.email,
//           role: req.user.role
//         },
//         process.env.JWT_SECRET || 'your-secret-key',
//         { expiresIn: '24h' }
//       );

//       // 獲取完整的用戶資料
//       const userData = {
//         id: req.user.id,
//         email: req.user.email,
//         name: req.user.name,
//         avatar: req.user.avatar,
//         role: req.user.role
//       };

//       console.log('準備重定向，用戶資料:', userData);

//       // 重定向到前端，並帶上 token 和用戶信息
//       const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/member/center?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
//       console.log('重定向 URL:', redirectUrl);

//       res.redirect(redirectUrl);
//     } catch (error) {
//       console.error('Google callback error:', error);
//       res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=${encodeURIComponent(error.message)}`);
//     }
//   }
// );

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

// 忘記密碼
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // 生成6位數驗證碼
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 將驗證碼存入資料庫，有效期15分鐘
    await pool.query(
      "UPDATE members SET reset_token = ?, reset_token_expiry = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE email = ? AND is_deleted = FALSE",
      [verificationCode, email]
    );

    // 發送驗證碼郵件
    await sendResetPasswordEmail(email, verificationCode);

    res.json({
      success: true,
      message: "驗證碼已發送到您的郵箱",
    });
  } catch (error) {
    console.error("忘記密碼錯誤:", error);
    res.status(500).json({
      success: false,
      message: error.message || "發送驗證碼失敗",
    });
  }
});

// 重設密碼
router.post("/reset-password", async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;

    // 檢查驗證碼是否有效
    const [members] = await pool.query(
      "SELECT * FROM members WHERE email = ? AND reset_token = ? AND reset_token_expiry > NOW() AND is_deleted = FALSE",
      [email, verificationCode]
    );

    if (members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "驗證碼無效或已過期",
      });
    }

    // 加密新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "密碼格式錯誤，請確認包含大寫、小寫、數字與特殊符號",
      });
    }
    

    // 更新密碼並清除驗證碼
    await pool.query(
      "UPDATE members SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    res.json({
      success: true,
      message: "密碼重設成功",
    });
  } catch (error) {
    console.error("重設密碼錯誤:", error);
    res.status(500).json({
      success: false,
      message: "重設密碼失敗",
    });
  }
});

// Firebase 驗證路由
router.post("/auth/firebase", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ success: false, message: "缺少 idToken" });
  }

  try {
    // 驗證並解碼 ID Token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid: firebaseUid, email, name, picture: avatar } = decoded;

    // 查或建會員（包含會員資料）
    let [members] = await pool.query(
      `SELECT m.*, mp.name, mp.gender, mp.phone, mp.address, mp.avatar, mp.birthday
       FROM members m 
       LEFT JOIN member_profiles mp ON m.id = mp.member_id 
       WHERE m.firebase_uid = ?`,
      [firebaseUid]
    );
    let member = members[0];

    if (!member) {
      [members] = await pool.query(
        `SELECT m.*, mp.name, mp.gender, mp.phone, mp.address, mp.avatar, mp.birthday
         FROM members m 
         LEFT JOIN member_profiles mp ON m.id = mp.member_id 
         WHERE m.email = ? AND m.is_deleted = FALSE`,
        [email]
      );
      member = members[0];
      if (member) {
        await pool.query("UPDATE members SET firebase_uid = ? WHERE id = ?", [
          firebaseUid,
          member.id,
        ]);
      }
    }
    if (!member) {
      member = await createFirebaseUser({ email, name, avatar, firebaseUid });
    }

    // 發你自己的 JWT
    const accessToken = jwt.sign(
      { 
        id: member.id, 
        email: member.email,
        type: member.role,
        role: member.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // ─── 在這裡新增 avatarUrl 的處理 ───
    let avatarUrl = null;
    if (member.avatar) {
      // 如果已經是完整網址，就直接用
      if (
        member.avatar.startsWith("http://") ||
        member.avatar.startsWith("https://")
      ) {
        avatarUrl = member.avatar;
      } else {
        // 否則當成相對路徑，加上 host 前綴
        const host =
          process.env.SERVER_ORIGIN || `${req.protocol}://${req.get("host")}`;
        avatarUrl = `${host}${member.avatar}`;
      }
    }

    res.json({
      success: true,
      accessToken,
      user: {
        id: member.id,
        email: member.email,
        role: member.role,
        name: member.name,
        gender: member.gender,
        phone: member.phone,
        address: member.address,
        // avatar: member.avatar,
        avatar: avatarUrl,
        birthday: member.birthday,
      },
    });
  } catch (err) {
    console.error("Firebase 驗證錯誤：", err);
    res.status(401).json({ success: false, message: "驗證失敗：" + err.code });
  }
});

export default router;
