'use client'

import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../_styles/footer2.scss'
import {
  FaFacebookF,
  FaInstagram,
  FaLine,
  FaYoutube,
  FaAngleRight,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from 'react-icons/fa'

export default function Footer2() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return alert('請輸入電子郵件')
    alert(`已訂閱：${email}`)
    setEmail('')
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <section className="about-block">
          <h2 className="about-title">關於我們</h2>
          <div className="about-underline"></div>
          <p className="about-description">
            國立故瓷博物館致力於保存與推廣陶瓷文化，透過展覽、教育活動與研究，讓更多人認識並欣賞陶瓷藝術之美。
          </p>
          <div className="about-social-icons">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Line">
              <FaLine />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </section>

        <section className="quick-links">
          <h2 className="title">快速連結</h2>
          <div className="underline"></div>
          <ul className="link-list">
            <li>
              <FaAngleRight /> 展覽資訊
            </li>
            <li>
              <FaAngleRight /> 課程報名
            </li>
            <li>
              <FaAngleRight /> 駐村藝術家
            </li>
            <li>
              <FaAngleRight /> 線上商店
            </li>
          </ul>
        </section>

        <section className="contact-info">
          <h2 className="contact-title">聯絡資訊</h2>
          <div className="contact-underline"></div>
          <ul className="contact-list">
            <li>
              <FaMapMarkerAlt /> 桃園市中壢區新生路二段421號
            </li>
            <li>
              <FaPhoneAlt /> 02-1234-5678
            </li>
            <li>
              <FaEnvelope /> info@museum.gov.tw
            </li>
            <li>
              <FaClock /> 週二至週日 09:00-17:00
            </li>
          </ul>
        </section>

        <section className="newsletter-form">
          <h2 className="newsletter-title">訂閱電子報</h2>
          <div className="newsletter-underline"></div>
          <p className="newsletter-description">
            訂閱我們的電子報，獲取最新展覽與活動資訊。
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="請輸入您的電子郵件"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">訂閱</button>
          </form>
        </section>
      </div>

      <div className="footer-bottom">
        <p className="copyright">© 2025 國立故瓷博物館 版權所有</p>
        <div className="footer-links">
          <a href="#">隱私權政策</a>
          <span>|</span>
          <a href="#">使用條款</a>
          <span>|</span>
          <a href="#">網站地圖</a>
        </div>
      </div>
    </footer>
  )
}
