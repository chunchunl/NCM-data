'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Carousel() {
  const [exhibitions, setExhibitions] = useState([])

  useEffect(() => {
    // 確保 Bootstrap JS 被正確加載
    import('bootstrap/dist/js/bootstrap.bundle.min.js')

    // 抓取當期展覽
    fetch('http://localhost:3005/api/exhibitions?state=current')
      .then((res) => res.json())
      .then((res) => {
        if (res?.data?.exhibitions) {
          setExhibitions(res.data.exhibitions)
        }
      })
      .catch((err) => console.error('展覽取得失敗：', err))
  }, [])

  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide pt-0 "
      data-bs-ride="carousel"
      style={{ maxWidth: '1800px', width: '100%' }} // ← 控制整體寬度
    >
      <div className="carousel-indicators">
        {exhibitions.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-current={index === 0 ? 'true' : undefined}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {exhibitions.map((e, index) => (
          <div
            key={e.id}
            className={`carousel-item ${index === 0 ? 'active' : ''} `}
          >
            <div className="ratio ratio-16x9" style={{ maxHeight: '400px' }}>
              <Image
                src={`/images/${e.image}`}
                alt={e.title}
                width={1000}
                height={500}
                className="d-block w-100 object-fit-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">上一張</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">下一張</span>
      </button>
    </div>
  )
}
