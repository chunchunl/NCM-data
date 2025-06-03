import express from 'express'
import db from '../../config/database.js'
import { v4 as uuidv4 } from 'uuid'
import { authenticateToken } from '../../middleware/auth.js'

const router = express.Router()

// ✅ 單張領取 API
router.post('/claim', authenticateToken, async (req, res) => {
  const memberId = req.user.id
  const { couponId } = req.body
  if (!couponId) return res.status(400).json({ status: 'error', message: '缺少優惠券 ID' })

  try {
    const [rows] = await db.query(
      `SELECT * FROM member_coupons 
   WHERE member_id = ? AND coupon_id = ? AND DATE(claimed_at) = CURDATE()`,
      [memberId, couponId]
    )
    if (rows.length > 0) {
      return res.status(409).json({ status: 'error', message: '今日已經領取過此優惠券' })
    }

    const [[coupon]] = await db.query(
      'SELECT name, minSpend, endDate, category, type, source FROM coupons WHERE id = ?',
      [couponId]
    )
    if (!coupon) return res.status(404).json({ status: 'error', message: '查無此優惠券' })

    const uuid = uuidv4()
    const now = new Date()

    await db.query(
      `INSERT INTO member_coupons 
      (member_id, coupon_id, uuid_code, claimed_at, expired_at, name, minSpend, category, type, source) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memberId,
        couponId,
        uuid,
        now,
        coupon.endDate,
        coupon.name,
        coupon.minSpend,
        coupon.category,
        coupon.type,
        coupon.source,
      ]
    )

    return res.json({
      status: 'success',
      data: {
        memberId,
        couponId,
        uuid_code: uuid,
        claimed_at: now,
      },
    })
  } catch (err) {
    console.error('❌ 單張領取錯誤:', err)
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// ✅ 一鍵領取 API
router.post('/claim-multiple', authenticateToken, async (req, res) => {
  const memberId = req.user.id
  const { couponIds } = req.body
  if (!Array.isArray(couponIds)) {
    return res.status(400).json({ status: 'error', message: '優惠券參數錯誤' })
  }

  try {
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

    const placeholders2 = toClaim.map(() => '?').join(',')
    const [couponDataRows] = await db.query(
      `SELECT id, name, minSpend, endDate, category, type, source FROM coupons WHERE id IN (${placeholders2})`,
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
      coupon.type,
      coupon.source,
    ])

    await db.query(
      'INSERT INTO member_coupons (member_id, coupon_id, uuid_code, claimed_at, expired_at, name, minSpend, category, type, source) VALUES ?',
      [values]
    )

    return res.json({
      status: 'success',
      claimed: values.map(([_, id, uuid]) => ({ couponId: id, uuid_code: uuid })),
      skipped: alreadyClaimedIds,
    })
    return res.status(409).json({
      status: 'error',
      message: '今日已經領取過此優惠券'
    })
  } catch (err) {
    console.error('❌ 一鍵領取錯誤:', err)
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

export default router
