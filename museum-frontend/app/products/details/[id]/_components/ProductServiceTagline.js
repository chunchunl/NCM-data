import React from 'react'
import '../_styles/ProductServiceTagline.scss'
import { FaGift, FaCreditCard, FaTruck } from 'react-icons/fa'

export default function ProductServiceTagline() {
  return (
    <div className="container service-tagline">
      <div className="row text-center">
        <div className="col-12 col-md-4 mb-4 mb-md-0">
          <div className="icon">
            <FaGift />
          </div>
          <div className="title fw-bold">精美禮品包裝</div>
          <div className="desc">
            為您的商品提供精美的禮品包裝，讓您的心意更顯珍貴。
          </div>
        </div>
        <div className="col-12 col-md-4 mb-4 mb-md-0">
          <div className="icon">
            <FaCreditCard />
          </div>
          <div className="title fw-bold">多元線上付款</div>
          <div className="desc">
            我們提供信用卡、Line Pay等多種便捷的線上付款方式。
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="icon">
            <FaTruck />
          </div>
          <div className="title fw-bold">快速配送服務</div>
          <div className="desc">
            我們承諾快速且可靠的配送服務，讓您盡快收到商品。
          </div>
        </div>
      </div>
    </div>
  )
}