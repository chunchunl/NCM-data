import express from 'express'
import db from '../../config/database.js'
import {validatedParamId, successResponse, errorResponse} from '../../lib/utils.js'

const router = express.Router()

// ✅ 查單筆展覽
router.get('/:id(\\d+)', async (req, res) => {
  try {
    const id = Number(req.params.id)
    validatedParamId(id)

    const [rows] = await db.query('SELECT * FROM exhibitions WHERE id = ?', [id])

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: '找不到展覽資料' })
    }

    successResponse(res, rows[0])
  } catch (err) {
    errorResponse(res, err)
  }
})


// ✅ 查展覽列表（可選 state 和 year）
router.get('/', async (req, res) => {
  try {
    const { state = 'current', year } = req.query

    let sql = 'SELECT * FROM exhibitions WHERE state = ?'
    const params = [state]

    if (year) {
      sql += ' AND YEAR(startDate) = ?'
      params.push(year)
    }

    const [rows] = await db.query(sql, params)
    successResponse(res, { exhibitions: rows })
  } catch (err) {
    errorResponse(res, err)
  }
})

export default router
