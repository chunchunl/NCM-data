import express from 'express'
import db from '../../config/database.js'
import { successResponse, errorResponse } from '../../lib/utils.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM coupons')
    successResponse(res, rows)
  } catch (err) {
    errorResponse(res, '取得優惠券失敗', err)
  }
})

export default router
