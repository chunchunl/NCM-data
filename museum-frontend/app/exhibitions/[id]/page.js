// app/exhibitions/[id]/page.js

'use client'

import '@/app/_styles/globals.scss'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IoLocationSharp } from 'react-icons/io5'
import { FaRegCalendarPlus } from 'react-icons/fa6'
import Image from 'next/image'
import styles from '../_styles/ex-detail.module.scss'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'
import { addFavoriteByType, removeFavoriteByType } from '@/app/api/favorites'
import { useAuth } from '@/app/_hooks/useAuth'
import { useToast } from '@/app/_components/ToastManager'
import { FaHome, FaReply } from 'react-icons/fa'

export default function ExhibitionDetailPage() {
  const { id } = useParams()
  const [exhibits, setExhibits] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const { member } = useAuth()
  const memberId = member?.id
  const { showToast } = useToast()

  useEffect(() => {
    if (!id) return
    setIsLoading(true)

    fetch(`http://localhost:3005/api/exhibitions/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success') {
          setExhibits(res.data)
        } else {
          setIsError(true)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('❌ fetch detail error:', err)
        setIsError(true)
        setIsLoading(false)
      })
  }, [id])

  if (isLoading) return <div className="text-center py-5">資料載入中...</div>
  if (isError || !exhibits)
    return <div className="text-center text-danger py-5">資料載入失敗</div>

  const toUTCString = (dateStr) => {
    const date = new Date(dateStr)
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const googleCalendarUrl =
    exhibits?.startDate && exhibits?.endDate
      ? `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(exhibits.title)}` +
      `&details=${encodeURIComponent(exhibits.intro?.slice(0, 100) || '')}` +
      `&location=${encodeURIComponent(exhibits.venueId || '國立故瓷博物館')}` +
      `&dates=${toUTCString(exhibits.startDate)}/${toUTCString(exhibits.endDate)}`
      : '#'

  return (
    <>
      <div className={`${styles.heroBanner} d-flex justify-content-center`}>
        <Image
          src={`/images/${exhibits.image}`}
          alt={exhibits.title}
          width={1000}
          height={500}
          className="img-fluid"
          style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
        />
      </div>

      <div
        className={`container d-flex justify-content-center flex-column py-4 ${styles.exhibitionInfo}`}
      >
        <div className="d-flex justify-content-center align-items-center">
          <h3
            className={`${styles.titleEx} fw-bold text-center d-flex align-items-center justify-content-center`}
          >
            {exhibits.title}
            <div className="ms-2 fs-6">
              <AddToFavoritesButton
                itemId={exhibits.id}
                itemType="exhibition"
                isFavorite={exhibits.isFavorite}
                onToggleFavorite={async (itemId, itemType, state) => {
                  try {
                    if (!memberId) {
                      showToast('danger', '請先登入會員')
                      return
                    }

                    if (state) {
                      await addFavoriteByType(itemType, memberId, itemId)
                      showToast('success', '成功加入收藏')
                    } else {
                      await removeFavoriteByType(itemType, memberId, itemId)
                      showToast('warning', '已移除收藏')
                    }

                    setExhibits((prev) => ({
                      ...prev,
                      isFavorite: state,
                    }))
                  } catch (err) {
                    console.error('收藏操作失敗：', err)
                    showToast('danger', '收藏操作失敗')
                  }
                  // console.log('🧪 itemId:', itemId)
                  // console.log('🧪 memberId:', memberId)
                  // console.log('🧪 itemType:', itemType)
                  // console.log('🧪 state:', state)
                }}
              />
            </div>
          </h3>
        </div>

        <div className="container d-flex justify-content-center">
          <div className="d-flex flex-column align-items-start text-center">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-decoration-none text-center text-dark fs-5 d-flex align-items-center ${styles.customHover}`}
              title="加入行事曆"
            >
              <FaRegCalendarPlus className="me-2" />
              展期：
              {exhibits.startDate.slice(0, 10)} ~{' '}
              {exhibits.endDate.slice(0, 10)}
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              title="查看展區導引"
              className={`${styles.customHover} d-flex align-items-center text-center text-dark fs-5 d-inline-block me-2 mb-0  text-decoration-none`}
            >
              <IoLocationSharp className="me-2" />
              展區：
              {exhibits.venue_id}
            </a>
          </div>
        </div>

        <div className={`container py-4 `}>
          <h4 className={`${styles.subEx} fw-bold mb-3`}>展覽概述</h4>
          <div style={{ textIndent: '2rem' }}>{exhibits.intro}。</div>
          <br />
          <div style={{ textIndent: '2rem' }}>{exhibits.intro}</div>
          
        </div>
      </div>

      <div className="container my-5 d-flex justify-content-center gap-3">
        <Link
          href="/"
          className="btn btn-dark px-4 text-decoration-none d-flex align-items-center"
        >
          <FaHome className="me-2" />
          返回首頁
        </Link>
        <button
          type="button"
          className="btn btn-secondary px-4 d-flex align-items-center"
          onClick={() => history.back()}
        >
          <FaReply className="me-2" />
          返回上一頁
        </button>
      </div>
    </>
  )
}
