import db from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import transporter from '../config/nodemailer.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const register = async (email, password, name, avatar = 'https://example.com/default-avatar.png') => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 檢查郵箱是否已存在
    const [existingMembers] = await connection.query(
      'SELECT id FROM members WHERE email = ? AND is_deleted = FALSE',
      [email]
    );

    if (Array.isArray(existingMembers) && existingMembers.length > 0) {
      throw new Error('該郵箱已被註冊');
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建會員
    const [result] = await connection.query(
      'INSERT INTO members (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'member']
    );

    const memberId = result.insertId;

    // 創建會員資料
    await connection.query(
      'INSERT INTO member_profiles (member_id, name, avatar) VALUES (?, ?, ?)',
      [memberId, name, avatar]
    );

    await connection.commit();
    return { 
      success: true, 
      memberId,
      message: '註冊成功'
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const login = async (email, password) => {
  try {
    // 查詢會員
    const [members] = await db.query(
      'SELECT * FROM members WHERE email = ? AND is_deleted = FALSE',
      [email]
    );

    if (!Array.isArray(members) || members.length === 0) {
      throw new Error('帳號或密碼錯誤');
    }

    const member = members[0];

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, member.password);
    if (!isValidPassword) {
      throw new Error('帳號或密碼錯誤');
    }

    // 生成 JWT token
    const token = jwt.sign(
      { id: member.id, email: member.email, role: member.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 獲取會員資料
    const [profiles] = await db.query(
      'SELECT * FROM member_profiles WHERE member_id = ?',
      [member.id]
    );
    console.log('profiles:', profiles)

    const profile = profiles[0];

    return {
      success: true,
      token,
      member: {
        id: member.id,
        email: member.email,
        role: member.role,
        name: profile.name,
        gender: profile.gender,
        phone: profile.phone,
        address: profile.address,
        avatar: profile.avatar,
        birthday: profile.birthday
      }
    };
  } catch (error) {
    throw error;
  }
};

const getMemberProfile = async (memberId) => {
  try {
    const [profiles] = await db.query(
      `SELECT m.email, mp.name, mp.gender, mp.phone, mp.address, mp.avatar, mp.birthday
       FROM members m 
       JOIN member_profiles mp ON m.id = mp.member_id 
       WHERE m.id = ? AND m.is_deleted = FALSE`,
      [memberId]
    );

    if (!Array.isArray(profiles) || profiles.length === 0) {
      throw new Error('找不到會員資料');
    }

    return profiles[0];
  } catch (error) {
    throw error;
  }
};

const updateMemberProfile = async (memberId, profileData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 處理生日格式
    if (profileData.birthday) {
      try {
        profileData.birthday = new Date(profileData.birthday).toISOString().split('T')[0];
      } catch (error) {
        throw new Error('生日格式無效');
      }
    }

    // 檢查是否已存在會員資料
    const [checkResult] = await connection.query(
      'SELECT * FROM member_profiles WHERE member_id = ?',
      [memberId]
    );

    if (checkResult && checkResult.length > 0) {
      // 更新現有資料
      const updateQuery = `
        UPDATE member_profiles 
        SET phone = ?, 
            address = ?, 
            birthday = ?, 
            avatar = ?
        WHERE member_id = ?
      `;
      await connection.query(updateQuery, [
        profileData.phone,
        profileData.address,
        profileData.birthday,
        profileData.avatar,
        memberId
      ]);
    } else {
      // 創建新資料
      const insertQuery = `
        INSERT INTO member_profiles (member_id, phone, address, birthday, avatar)
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.query(insertQuery, [
        memberId,
        profileData.phone,
        profileData.address,
        profileData.birthday,
        profileData.avatar
      ]);
    }

    // 獲取更新後的資料
    const [updatedProfile] = await connection.query(
      'SELECT * FROM member_profiles WHERE member_id = ?',
      [memberId]
    );

    await connection.commit();
    return { 
      success: true, 
      data: updatedProfile[0],
      message: '會員資料更新成功' 
    };
  } catch (error) {
    await connection.rollback();
    console.error('Error in updateMemberProfile:', error);
    throw error;
  } finally {
    connection.release();
  }
};

const deleteMember = async (memberId) => {
  await db.query(
    'UPDATE members SET is_deleted = TRUE WHERE id = ?',
    [memberId]
  );
  return { success: true };
};

const changePassword = async (memberId, oldPassword, newPassword) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 獲取當前會員的密碼
    const [members] = await connection.query(
      'SELECT password FROM members WHERE id = ? AND is_deleted = FALSE',
      [memberId]
    );

    if (!Array.isArray(members) || members.length === 0) {
      throw new Error('找不到會員資料');
    }

    const member = members[0];

    // 驗證舊密碼
    const isValidPassword = await bcrypt.compare(oldPassword, member.password);
    if (!isValidPassword) {
      throw new Error('舊密碼不正確');
    }

    // 驗證新密碼長度
    if (newPassword.length < 6) {
      throw new Error('新密碼長度至少為6個字符');
    }

    // 加密新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密碼
    await connection.query(
      'UPDATE members SET password = ? WHERE id = ?',
      [hashedPassword, memberId]
    );

    await connection.commit();
    return { 
      success: true, 
      message: '密碼修改成功' 
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// 發送密碼修改確認郵件
const sendPasswordChangeEmail = async (email) => {
  // 生成確認 token
  const token = jwt.sign(
    { email, type: 'password_change' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // 這裡是發送郵件的示例代碼
  // 實際項目中需要配置郵件服務
  const emailContent = `
    <h1>密碼修改確認</h1>
    <p>您正在修改密碼，請點擊以下鏈接確認：</p>
    <a href="http://your-domain.com/confirm-password-change?token=${token}">
      確認修改密碼
    </a>
    <p>如果這不是您的操作，請忽略此郵件。</p>
    <p>此鏈接將在1小時後失效。</p>
  `;

  // 這裡應該調用實際的郵件發送服務
  console.log('發送郵件到:', email);
  console.log('郵件內容:', emailContent);

  return { 
    success: true, 
    message: '確認郵件已發送' 
  };
};

// 發送信箱修改確認郵件
const sendEmailChangeEmail = async (oldEmail, newEmail) => {
  // 生成確認 token
  const token = jwt.sign(
    { oldEmail, newEmail, type: 'email_change' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // 這裡是發送郵件的示例代碼
  // 實際項目中需要配置郵件服務
  const emailContent = `
    <h1>信箱修改確認</h1>
    <p>您正在將信箱從 ${oldEmail} 修改為 ${newEmail}，請點擊以下鏈接確認：</p>
    <a href="http://your-domain.com/confirm-email-change?token=${token}">
      確認修改信箱
    </a>
    <p>如果這不是您的操作，請忽略此郵件。</p>
    <p>此鏈接將在1小時後失效。</p>
  `;

  // 這裡應該調用實際的郵件發送服務
  console.log('發送郵件到:', newEmail);
  console.log('郵件內容:', emailContent);

  return { 
    success: true, 
    message: '確認郵件已發送到新信箱' 
  };
};

// 確認並更新信箱
const confirmEmailChange = async (token) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 驗證 token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.type !== 'email_change') {
      throw new Error('無效的確認令牌');
    }

    const { oldEmail, newEmail } = decoded;

    // 檢查新信箱是否已被使用
    const [existingMembers] = await connection.query(
      'SELECT id FROM members WHERE email = ? AND is_deleted = FALSE',
      [newEmail]
    );

    if (Array.isArray(existingMembers) && existingMembers.length > 0) {
      throw new Error('該信箱已被使用');
    }

    // 更新信箱
    await connection.query(
      'UPDATE members SET email = ? WHERE email = ? AND is_deleted = FALSE',
      [newEmail, oldEmail]
    );

    await connection.commit();
    return { 
      success: true, 
      message: '信箱修改成功' 
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// 刪除會員帳號（軟刪除）
const deleteAccount = async (memberId, password) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 獲取會員資料
    const [members] = await connection.query(
      'SELECT password FROM members WHERE id = ? AND is_deleted = FALSE',
      [memberId]
    );

    if (!Array.isArray(members) || members.length === 0) {
      throw new Error('找不到會員資料');
    }

    const member = members[0];

    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password, member.password);
    if (!isValidPassword) {
      throw new Error('密碼不正確');
    }

    // 更新會員狀態為已刪除
    await connection.query(
      'UPDATE members SET is_deleted = TRUE WHERE id = ?',
      [memberId]
    );

    // 更新會員資料狀態
    await connection.query(
      'UPDATE member_profiles SET is_deleted = TRUE WHERE member_id = ?',
      [memberId]
    );

    await connection.commit();
    return { 
      success: true, 
      message: '帳號已成功刪除' 
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const sendResetPasswordEmail = async (email, verificationCode) => {
  try {
    console.log('開始發送驗證碼郵件...');
    console.log('收件人:', email);
    console.log('驗證碼:', verificationCode);

    // 創建郵件內容
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '故瓷博物院 - 密碼重設驗證碼',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">密碼重設驗證碼</h2>
          <p>您好，</p>
          <p>您的密碼重設驗證碼是：</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${verificationCode}</strong>
          </div>
          <p>此驗證碼將在 15 分鐘後失效。</p>
          <p>如果您沒有請求重設密碼，請忽略此郵件。</p>
          <p>謝謝！</p>
          <p>故瓷博物院團隊</p>
        </div>
      `
    };

    console.log('郵件配置:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    // 發送郵件
    const info = await transporter.sendMail(mailOptions);
    console.log('郵件發送成功:', info.messageId);
    return true;
  } catch (error) {
    console.error('發送驗證碼郵件時發生錯誤:', error);
    throw new Error('發送驗證碼郵件失敗');
  }
};

export {
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
  sendResetPasswordEmail
}; 