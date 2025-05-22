// routes/couponClaim/index.js

import express from 'express'
import db from '../../config/database.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// ✅ 單張領取 API
router.post('/claim', async (req, res) => {
  const { memberId, couponId } = req.body
  if (!memberId || !couponId) return res.status(400).json({ status: 'error', message: '缺少必要參數' })

  try {
    // 檢查是否已領取
    const [rows] = await db.query(
      'SELECT * FROM member_coupons WHERE member_id = ? AND coupon_id = ?',
      [memberId, couponId]
    )
    if (rows.length > 0) {
      return res.status(409).json({ status: 'error', message: '已經領取過此優惠券' })
    }

    // 查詢優惠券資訊
    const [[coupon]] = await db.query(
      'SELECT name, minSpend, endDate, category, type FROM coupons WHERE id = ?',
      [couponId]
    )
    if (!coupon) return res.status(404).json({ status: 'error', message: '查無此優惠券' })

    const uuid = uuidv4()
    const now = new Date()

    await db.query(
      'INSERT INTO member_coupons (member_id, coupon_id, uuid_code, claimed_at, expired_at, name, minSpend, category, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [memberId, couponId, uuid, now, coupon.endDate, coupon.name, coupon.minSpend, coupon.category, coupon.type]
    )

    return res.json({
      status: 'success',
      data: {
        memberId,
        couponId,
        uuid_code: uuid,
        claimed_at: now
      }
    })
  } catch (err) {
    console.error('❌ 單張領取錯誤:', err)
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})


// ✅ 一鍵領取 API
router.post('/claim-multiple', async (req, res) => {
  const { memberId, couponIds } = req.body
  if (!memberId || !Array.isArray(couponIds)) {
    return res.status(400).json({ status: 'error', message: '參數錯誤' })
  }

  try {
    // 檢查已領取過的
    const placeholders = couponIds.map(() => '?').join(',')
    const [existingRows] = await db.query(
      `SELECT coupon_id FROM member_coupons WHERE member_id = ? AND coupon_id IN (${placeholders})`,
      [memberId, ...couponIds]
    )

    const alreadyClaimedIds = existingRows.map((row) => row.coupon_id)
    const toClaim = couponIds.filter((id) => !alreadyClaimedIds.includes(id))

    if (toClaim.length === 0) {
      return res.json({ status: 'success', claimed: [], skipped: alreadyClaimedIds })
    }

    // 查詢所有尚未領取的 coupon 詳細資料
    const placeholders2 = toClaim.map(() => '?').join(',')
    const [couponDataRows] = await db.query(
      `SELECT id, name, minSpend, endDate, category, type FROM coupons WHERE id IN (${placeholders2})`,
      [...toClaim]
    )

    const now = new Date()
    const values = couponDataRows.map((coupon) => [
      memberId,
      coupon.id,
      uuidv4(),
      now,
      coupon.endDate,
      coupon.name,
      coupon.minSpend,
      coupon.category,
      coupon.type
    ])

    await db.query(
      'INSERT INTO member_coupons (member_id, coupon_id, uuid_code, claimed_at, expired_at, name, minSpend, category, type) VALUES ?',
      [values]
    )

    return res.json({
      status: 'success',
      claimed: values.map(([_, id, uuid]) => ({ couponId: id, uuid_code: uuid })),
      skipped: alreadyClaimedIds
    })
  } catch (err) {
    console.error('❌ 一鍵領取錯誤:', err)
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})


export default router
