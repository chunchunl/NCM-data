// src/routes/favorites/exhibitions.js

import express from 'express'
import db from '../../config/database.js'
import { successResponse, errorResponse } from '../../lib/utils.js'

const router = express.Router()

// router.get('/test', (req, res) => {
//   res.send('收藏 API 有掛上 ✅')
// })


// ✅ 加入收藏
router.post('/', async (req, res) => {
  console.log('📦 接收到 POST 請求', req.body) // ← 確認有請求進來

  const { memberId, exhibitionId } = req.body
  if (!memberId || !exhibitionId) {
    return errorResponse(res, '❌ 缺少必要參數')
  }

  try {
    const sql = `INSERT IGNORE INTO exhibition_favorites (member_id, exhibition_id) VALUES (?, ?)`
    const [result] = await db.query(sql, [memberId, exhibitionId])
    console.log('✅ 資料庫寫入結果:', result)
    successResponse(res, '收藏成功')
  } catch (err) {
    console.error('❌ 資料庫錯誤:', err)
    errorResponse(res, '加入收藏失敗', err)
  }
})


// ✅ 移除收藏
router.delete('/', async (req, res) => {
  const { memberId, exhibitionId } = req.body
  if (!memberId || !exhibitionId) {
    return errorResponse(res, '缺少必要參數')
  }

  try {
    const sql = `
      DELETE FROM exhibition_favorites
      WHERE member_id = ? AND exhibition_id = ?`
    await db.query(sql, [memberId, exhibitionId])
    successResponse(res, '已取消收藏')
  } catch (err) {
    errorResponse(res, '移除收藏失敗', err)
  }
})

// ✅ 查詢收藏
router.post('/list', async (req, res) => {
  const { memberId } = req.body
  if (!memberId) return errorResponse(res, '缺少 memberId')

  try {
    const sql = `SELECT e.* FROM exhibitions AS e JOIN exhibition_favorites AS f ON e.id = f.exhibition_id WHERE f.member_id = ?`
    const [rows] = await db.query(sql, [memberId])
    successResponse(res, rows)
  } catch (err) {
    errorResponse(res, '查詢收藏失敗', err)
  }
})

export default router
