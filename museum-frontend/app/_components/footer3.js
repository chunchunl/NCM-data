'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Container, Row, Col } from 'react-bootstrap'
import '../_styles/footer3.scss'
import '@/app/_styles/globals.scss'
import {
  FaFacebookF,
  FaInstagram,
  FaLine,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaAngleRight,
} from 'react-icons/fa'

export default function Footer3() {
  const pathname = usePathname()
  const [email, setEmail] = useState('')

  //管理區不需要選單列
  if (pathname.includes('/admin')) {
    return <></>
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return alert('請輸入電子郵件')
    alert(`已訂閱：${email}`)
    setEmail('')
  }

  return (
    <footer className="bg-footer">
      <Container>
        <Row className="gy-4">
          {/* 關於我們 */}
          <Col md={6} lg={3}>
            <div className="title-wrapper">
              <h2 className="title">關於我們</h2>
              <div className="underline"></div>
            </div>
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
          </Col>

          {/* 快速連結 */}
          <Col md={6} lg={3}>
            <div className="title-wrapper">
              <h2 className="title">快速連結</h2>
              <div className="underline"></div>
            </div>
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
          </Col>

          {/* 聯絡資訊 */}
          <Col md={6} lg={3}>
            <div className="title-wrapper">
              <h2 className="title">聯絡資訊</h2>
              <div className="underline"></div>
            </div>
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
          </Col>

          {/* 訂閱電子報 */}
          <Col md={6} lg={3}>
            <section className="section4">
              <div className="title-wrapper">
                <h2 className="title">訂閱電子報</h2>
                <div className="underline"></div>
              </div>
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
          </Col>
        </Row>

        {/* 最下方 */}
        <hr className="my-4" />
        <Row className="text-center pb-4">
          <Col>
            <div className="copyright">© 2025 國立故瓷博物館 版權所有</div>
            <div className="footer-links">
              <a href="#">隱私權政策</a>
              <span>|</span>
              <a href="#">使用條款</a>
              <span>|</span>
              <a href="#">網站地圖</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
