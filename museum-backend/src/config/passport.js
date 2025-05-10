import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from './database.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [users] = await db.query(
      'SELECT * FROM members WHERE id = ? AND is_deleted = FALSE',
      [id]
    );
    done(null, users[0]);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3005/api/members/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
      state: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile:', profile);
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
          // 檢查是否已有此 Google ID 的會員
          const [existingUsers] = await connection.query(
            'SELECT m.*, mp.name, mp.avatar FROM members m LEFT JOIN member_profiles mp ON m.id = mp.member_id WHERE m.google_id = ? AND m.is_deleted = FALSE',
            [profile.id]
          );

          if (existingUsers.length > 0) {
            // 已存在的會員，直接返回
            await connection.commit();
            return done(null, existingUsers[0]);
          }

          // 檢查 email 是否已被使用
          const [emailUsers] = await connection.query(
            'SELECT m.*, mp.name, mp.avatar FROM members m LEFT JOIN member_profiles mp ON m.id = mp.member_id WHERE m.email = ? AND m.is_deleted = FALSE',
            [profile.emails[0].value]
          );

          if (emailUsers.length > 0) {
            // 如果 email 已被使用，更新該帳號的 google_id
            await connection.query(
              'UPDATE members SET google_id = ? WHERE id = ?',
              [profile.id, emailUsers[0].id]
            );
            await connection.commit();
            return done(null, emailUsers[0]);
          }

          // 創建新會員
          const [result] = await connection.query(
            'INSERT INTO members (email, google_id, role) VALUES (?, ?, ?)',
            [profile.emails[0].value, profile.id, 'member']
          );

          const memberId = result.insertId;

          // 創建會員資料
          await connection.query(
            'INSERT INTO member_profiles (member_id, name, avatar) VALUES (?, ?, ?)',
            [
              memberId,
              profile.displayName,
              profile.photos[0]?.value || 'https://example.com/default-avatar.png'
            ]
          );

          await connection.commit();

          const [newUser] = await connection.query(
            'SELECT m.*, mp.name, mp.avatar FROM members m LEFT JOIN member_profiles mp ON m.id = mp.member_id WHERE m.id = ?',
            [memberId]
          );

          return done(null, newUser[0]);
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport; 