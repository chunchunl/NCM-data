'use client'
import React from 'react'
import '../_styles/marquee.scss'

export default function Marquee() {
  return (
    <section className="marquee-wrapper">
      <div className="marquee">
        <div className="marquee-track">
          <div className="marquee-content">
            <span>
              📢 餐廚生活升級首選！質感陶瓷餐具/碗盤期間限定 85 折，錯過等明年～🎁
              下單再送專屬好禮・滿千免運！
            </span>
            <span>
              🌸 夏日新作登場，瓷感生活等你收藏 ✨ 現貨限量，手刀搶購！
            </span>
            <span>⚠️ 一週限定優惠中 ， 精選陶藝品下單即贈好禮，錯過不再！</span>
          </div>
          <div className="marquee-content">
            <span>
              📢 餐廚生活升級首選！質感陶瓷餐具/碗盤期間限定 85 折，錯過等明年～🎁
              下單再送專屬好禮・滿千免運！
            </span>
            <span>
              🌸 夏日新作登場，瓷感生活等你收藏 ✨ 現貨限量，手刀搶購！
            </span>
            <span>⚠️ 一週限定優惠中 ， 精選陶藝品下單即贈好禮，錯過不再！</span>
          </div>
        </div>
      </div>
    </section>
  )
}
