import express from 'express'
import db from '../../config/database.js'
import { successResponse, errorResponse } from '../../lib/utils.js'

const router = express.Router()

// 加入收藏
router.post('/', async (req, res) => {
  const { memberId, productId } = req.body
  if (!memberId || !productId) {
    return errorResponse(res, '缺少必要參數')
  }

  try {
    const sql = `INSERT IGNORE INTO product_favorites (member_id, product_id) VALUES (?, ?)`
    await db.query(sql, [memberId, productId])
    successResponse(res, '收藏成功')
  } catch (err) {
    errorResponse(res, '加入收藏失敗', err)
  }
})

// 移除收藏
router.delete('/', async (req, res) => {
  const { memberId, productId } = req.body
  if (!memberId || !productId) {
    return errorResponse(res, '缺少必要參數')
  }

  try {
    const sql = `DELETE FROM product_favorites WHERE member_id = ? AND product_id = ?`
    await db.query(sql, [memberId, productId])
    successResponse(res, '已取消收藏')
  } catch (err) {
    errorResponse(res, '移除收藏失敗', err)
  }
})

// 查詢會員所有收藏
router.get('/:memberId', async (req, res) => {
  const { memberId } = req.params
  try {
    const sql = `SELECT * FROM product_favorites WHERE member_id = ?`
    const [rows] = await db.query(sql, [memberId])
    successResponse(res, rows)
  } catch (err) {
    errorResponse(res, '查詢收藏失敗', err)
  }
})

export default router
