'use client'

import { useAuth } from '@/app/_hooks/useAuth'
import { useState, useEffect } from 'react'
import CouponTable from './_components/CouponTable'

export default function CouponsTab() {
  const { token, isLoggedIn } = useAuth()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('可使用')

  const TABS = ['可使用', '已失效']

  const getCoupons = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/memberCoupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success || data.status === 'success') {
        setCoupons(data.data)
      }
    } catch (error) {
      console.error('獲取優惠券失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      getCoupons()
    }
  }, [isLoggedIn])

  const filteredCoupons = coupons.filter((c) => {
    const now = new Date()
    if (activeTab === '可使用') {
      return !c.is_used && new Date(c.expired_at || c.endDate) > now
    }
    if (activeTab === '已失效') {
      return c.is_used || new Date(c.expired_at || c.endDate) <= now
    }
    return true
  })

  if (!isLoggedIn) return <div>請先登入</div>
  if (loading) return <div>載入中...</div>

  return (
    <div className="container px-0">
      {/* Tabs */}
      <ul className={`nav nav-tabs mb-3`}>
        {TABS.map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`btn-light nav-link ${activeTab === tab ? 'active' : ''}`}
              style={{ borderRadius: '0px' }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Table */}
      <CouponTable
        coupons={filteredCoupons}
        isExpiredMode={activeTab === '已失效'}
      />
    </div>
  )
}
