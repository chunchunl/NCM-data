import { useState } from 'react'
import styles from '../_style/memCoupons.module.scss'
import {
  FaAngleUp,
  FaAngleDown,
  FaGift,
  FaBookOpen,
  FaHourglassHalf,
  FaTimesCircle,
} from 'react-icons/fa'

export default function CouponTable({ coupons = [], isExpiredMode = false  }) {
  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
   const tableClass = `${styles.couponTable} ${isExpiredMode ? styles.expired : ''}`

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getDaysLeft = (dateStr) => {
    const now = new Date()
    const target = new Date(dateStr)
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))

    if (diff > 0)
      return (
        <span className=" d-inline-flex align-items-center gap-1">
          <FaHourglassHalf /> 剩下 {diff} 天
        </span>
      )
    if (diff === 0) return `✅ 今日到期`
    return (
      <span className=" d-inline-flex align-items-center gap-1">
        <FaTimesCircle /> 已過期
      </span>
    )
  }

  const formatNumber = (num) =>
    typeof num === 'number' ? num.toLocaleString('en-US') : num

  const getSorted = (data) => {
    return [...data].sort((a, b) => {
      if (!sortField) return 0

      const aVal = a[sortField]
      const bVal = b[sortField]

      if (sortField === 'expired_at') {
        return sortDirection === 'asc'
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal)
      }

      if (sortField === 'discount') {
        const aDiscount = typeof aVal === 'number' ? aVal : parseFloat(aVal)
        const bDiscount = typeof bVal === 'number' ? bVal : parseFloat(bVal)
        return sortDirection === 'asc'
          ? aDiscount - bDiscount
          : bDiscount - aDiscount
      }

      if (sortField === 'minSpend') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      return 0
    })
  }

  const productCoupons = coupons.filter((c) => c.category === '商品')
  const courseCoupons = coupons.filter((c) => c.category === '課程')

  const renderTable = (data, typeName, icon) => (
    <div className="mb-5 ">
      <h5 className="fw-bold mb-3 d-flex align-items-center">
        {icon} {typeName}優惠券
      </h5>
      <div className="table-responsive">
        <table className={`table table-bordered ${tableClass}`}>
          <thead className="table-light text-center">
            <tr>
              <th>名稱</th>
              <th
                onClick={() => handleSort('discount')}
                style={{ cursor: 'pointer' }}
              >
                折扣{' '}
                {sortField === 'discount' &&
                  (sortDirection === 'asc' ? (
                    <FaAngleUp className="mb-2" />
                  ) : (
                    <FaAngleDown />
                  ))}
              </th>
              <th
                onClick={() => handleSort('minSpend')}
                style={{ cursor: 'pointer' }}
              >
                最低消費{' '}
                {sortField === 'minSpend' &&
                  (sortDirection === 'asc' ? (
                    <FaAngleUp className="mb-2" />
                  ) : (
                    <FaAngleDown />
                  ))}
              </th>
              <th
                onClick={() => handleSort('expired_at')}
                style={{ cursor: 'pointer' }}
              >
                使用期限{' '}
                {sortField === 'expired_at' &&
                  (sortDirection === 'asc' ? (
                    <FaAngleUp className="mb-2" />
                  ) : (
                    <FaAngleDown />
                  ))}
              </th>
              <th>剩餘天數</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {getSorted(data).length === 0 ? (
              <tr>
                <td colSpan="5" className="text-muted py-4">
                  無符合條件的優惠券
                </td>
              </tr>
            ) : (
              getSorted(data).map((c) => (
                <tr key={c.record_id}>
                  <td>{c.name}</td>
                  <td className="fw-bold text-danger">
                    {c.type === '現金'
                      ? `NT$ ${formatNumber(c.discount)}`
                      : `${c.discount}%`}
                  </td>
                  <td>NT$ {formatNumber(c.minSpend)}</td>
                  <td>{c.expired_at?.slice(0, 10)}</td>
                  <td>{getDaysLeft(c.expired_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <>
      {renderTable(productCoupons, '商品', <FaGift className="me-2" />)}
      {renderTable(courseCoupons, '課程', <FaBookOpen className="me-2" />)}
    </>
  )
}
