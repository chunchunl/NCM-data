import { useState, useMemo, useEffect } from 'react'

export default function CouponSorter({ coupons, onSorted }) {
  const [sortType, setSortType] = useState('default')

  const sortedCoupons = useMemo(() => {
    let sorted = [...coupons]
    switch (sortType) {
      case 'expireSoon':
        sorted.sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
        break
      case 'highDiscount':
        sorted.sort((a, b) => b.discount - a.discount)
        break
      case 'lowSpend':
        sorted.sort((a, b) => a.minSpend - b.minSpend)
        break
      default:
        break
    }
    return sorted
  }, [coupons, sortType])

  useEffect(() => {
    if (onSorted) onSorted(sortedCoupons)
  }, [sortedCoupons, onSorted])

  return (
    <select
      value={sortType}
      onChange={(e) => setSortType(e.target.value)}
      className="p-1"
    >
      <option value="default">排序</option>
      <option value="expireSoon">即將到期</option>
      <option value="highDiscount">折扣最高</option>
      <option value="lowSpend">低消金額最低</option>
    </select>
  )
}
