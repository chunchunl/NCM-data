'use client'
import CouponCard from './cou-card'
import styles from '../_styles/coupon.module.scss'
import CouponSorter from './cou-sorter'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { LuMousePointer2 } from 'react-icons/lu'
import { FaTicketAlt } from 'react-icons/fa'
import { useToast } from '@/app/_components/ToastManager'
import { useAuth } from '@/app/_hooks/useAuth'

export default function TabCoupons({ category }) {
  const [allCoupons, setAllCoupons] = useState([])
  const [sortedCoupons, setSortedCoupons] = useState([])
  const [claimedIds, setClaimedIds] = useState([])
  const { member } = useAuth()
  const memberId = member?.id
  const { showToast } = useToast()

  // ✅ 初始化與資料載入
  useEffect(() => {
    if (!memberId) return

    const STORAGE_KEY = `claimed_${category}_${memberId}`
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    setClaimedIds(parsed)

    axios
      .get('http://localhost:3005/api/coupons')
      .then((res) => {
        const filtered = res.data.data.filter((c) => c.category === category)
        setAllCoupons(filtered)
        setSortedCoupons(filtered)
      })
      .catch((err) => {
        console.error('❌ 無法取得優惠券資料:', err)
        showToast('danger', '無法載入優惠券資料')
      })
  }, [category, memberId, showToast])

  // ✅ 更新 localStorage 與狀態
  const updateClaimedStorage = (newIds) => {
    const updated = [...new Set([...claimedIds, ...newIds])]
    setClaimedIds(updated)
    const storageKey = `claimed_${category}_${memberId}`
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  // ✅ 一鍵領取
  const handleOneClickClaim = async () => {
    if (!memberId) {
      showToast('danger', '請先登入會員')
      return
    }

    const idsToClaim = sortedCoupons
      .filter((c) => !claimedIds.includes(c.id))
      .map((c) => c.id)

    if (idsToClaim.length === 0) {
      showToast('info', '沒有可領取的優惠券')
      return
    }

    try {
      const res = await axios.post(
        'http://localhost:3005/api/couponsClaim/claim-multiple',
        {
          memberId,
          couponIds: idsToClaim,
        }
      )

      if (res.data.status === 'success') {
        showToast('success', '成功領取所有優惠券')
        updateClaimedStorage(idsToClaim)
      } else {
        showToast('warning', res.data.message || '一鍵領取失敗')
      }
    } catch (err) {
      console.error('❌ 一鍵領取失敗:', err)
      showToast('danger', '一鍵領取失敗，請稍後再試')
    }
  }

  // ✅ 單張領取後更新
  const handleSingleClaimed = (id) => {
    updateClaimedStorage([id])
  }

  // ✅ 過濾已領取
  const visibleCoupons = sortedCoupons.filter((c) => !claimedIds.includes(c.id))

  return (
    <div className={`container my-4 ${styles.borderCustom}`}>
      <div className="row pt-3 px-3 mb-3 align-items-center">
        <div className="col-12 col-md-6 mb-2 mb-md-0">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
            <h5 className="d-flex align-items-center mb-2 mb-sm-0">
              <FaTicketAlt className="me-2" />
              可領取張數：{visibleCoupons.length}
            </h5>
            <button
              className="btn btn-secondary ms-0 ms-sm-4"
              onClick={handleOneClickClaim}
            >
              <LuMousePointer2 className="me-2" />
              一鍵領取
            </button>
          </div>
        </div>

        <div className="col-12 col-md-6 d-flex justify-content-md-end">
          <CouponSorter
            coupons={allCoupons}
            onSorted={(sorted) => setSortedCoupons(sorted)}
          />
        </div>
      </div>

      <hr />

      <div
        className="row row-cols-1 row-cols-md-4 g-4 pb-4 justify-content-center"
        style={{ minHeight: '300px' }} // ✅ 保持高度避免閃動
      >
        {visibleCoupons.length === 0 ? (
          <div className="text-center text-muted fs-5 mt-5">
            🎉 優惠券已全數領取。
          </div>
        ) : (
          visibleCoupons.map((c) => (
            <div
              key={c.id}
              className="col d-flex justify-content-center align-items-center"
            >
              <CouponCard
                coupon={c}
                memberId={memberId}
                onClaimed={handleSingleClaimed}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
