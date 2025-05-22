import React from 'react'

export default function EnrollmentSection({ course, onEnroll }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="enrollment-section" data-aos="fade-left">
      <div className="price-tag">
        {formatPrice(course.price)}
        {course.original_price && (
          <span className="original-price">
            {formatPrice(course.original_price)}
          </span>
        )}
      </div>
      <ul className="enrollment-features list-unstyled">
        <li>
          <i className="bi bi-calendar3"></i>
          {course.duration_value}週課程，每週{course.sessions_per_week}堂
        </li>
        <li>
          <i className="bi bi-clock"></i>
          每堂{course.hours_per_session}小時
        </li>
        <li>
          <i className="bi bi-people"></i>
          小班制教學（限{course.max_students}人）
        </li>
        <li>
          <i className="bi bi-tools"></i>
          {course.materials_included ? '含材料與工具' : '不含材料'}
        </li>
      </ul>
      <button 
        className="btn btn-enroll mb-3"
        onClick={onEnroll}
      >
        <i className="bi bi-cart-plus"></i> 立即報名
      </button>
      <button className="btn btn-enroll btn-outline">
        <i className="bi bi-chat-text"></i> 諮詢課程
      </button>
    </div>
  )
} 