'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../_styles/ex-page.module.scss'
import Link from 'next/link'

export default function ExhibitionList({ state = 'current', year }) {
  const [exhibitions, setExhibitions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const query = new URLSearchParams({ state })
    if (year) query.append('year', year)

    const url = `http://localhost:3005/api/exhibitions?${query.toString()}`
    console.log('🔥 fetch URL:', url)

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res?.data?.exhibitions) {
          setExhibitions(res.data.exhibitions)
        } else {
          setExhibitions([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('❌ fetch 錯誤:', err)
        setLoading(false)
      })
  }, [state, year])

  return (
    <main className="container my-5">
      {loading ? (
        <p className="text-center text-muted">資料載入中...</p>
      ) : exhibitions.length === 0 ? (
        <p className="text-center text-muted">查無展覽資料</p>
      ) : (
        exhibitions.map((ex) => (
          <Link
            href={`/exhibitions/${ex.id}`}
            key={ex.id}
            className="text-decoration-none"
          >
            <div
              className={`${styles.exhibitionCard} row align-items-center overflow-hidden mb-0`}
              style={{ cursor: 'pointer' }}
            >
              <div className={`col-md-5 ${styles.imageContainer}`}>
              <div className={styles.imageOverlay}></div> {/* ← 遮罩層 */}
                <Image
                  src={`/images/${ex.image}`}
                  alt={ex.title}
                  width={600}
                  height={250}
                  className=" exhibitionImg"
                />
              </div>
              <div className={`col-md-7 ${styles.infoContainer}`}>
                <h5 className="fw-bold">{ex.title}</h5>
                <div className="mt-5">
                  <p className="text-muted mb-1">
                    展覽期間：{ex.startDate.slice(0, 10)} ~{' '}
                    {ex.endDate.slice(0, 10)}
                  </p>
                  <p className="text-muted mb-2">展廳區域：{ex.venue_id}</p>
                  <div className="d-flex justify-content-end">
                    <button className={`btn btn-light`}>
                      <span>查看更多</span>
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </main>
  )
}
