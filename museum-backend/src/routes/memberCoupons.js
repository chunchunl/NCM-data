import express from 'express'
import db from '../config/database.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// ✅ 查詢目前登入會員的優惠券清單（使用 token 解析 memberId）
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    console.log('🔍 [Auth Header]', authHeader)

    if (!authHeader) {
      console.warn('❌ 未提供 Authorization 標頭')
      return res.status(401).json({ status: 'error', message: '未提供授權憑證' })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('🔐 [Token]', token)

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('✅ [JWT Decoded]', decoded)
    } catch (err) {
      console.error('❌ JWT 驗證失敗:', err.message)
      return res.status(403).json({ status: 'error', message: 'Token 驗證失敗' })
    }

    const memberId = decoded.id
    if (!memberId) {
      console.error('❌ 無法從 token 取得 memberId')
      return res.status(401).json({ status: 'error', message: '會員身分無效' })
    }

    console.log('🔎 查詢會員優惠券資料 member_id =', memberId)

    const [rows] = await db.query(
      `SELECT 
        mc.id AS record_id,
        mc.uuid_code,
        mc.claimed_at,
        c.id AS coupon_id,
        c.name,
        c.category,
        c.discount,
        c.minSpend,
        mc.expired_at,
        c.type
      FROM member_coupons mc
      JOIN coupons c ON mc.coupon_id = c.id
      WHERE mc.member_id = ?`,
      [memberId]
    )

    console.log('📦 查詢結果筆數:', rows.length)

    res.json({ status: 'success', data: rows })
  } catch (err) {
    console.error('❌ 會員優惠券查詢錯誤:', err)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

export default router
