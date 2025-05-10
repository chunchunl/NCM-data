'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import '../_styles/header_style.scss'
import '@/app/_styles/globals.scss'
import '@/app/_styles/formCustom.scss'
import '@/app/_styles/authModal.scss'
import AuthModal from '@/app/_components/authModal'
// import { IconName } from "react-icons/fa";
import {
  FaUserCircle,
  FaCommentDots,
  FaTicketAlt,
  FaShoppingBag,
  FaHeart,
  FaSignOutAlt,
  FaShoppingCart,
  FaUser,
} from 'react-icons/fa'

// toast
import { useToast } from './ToastManager'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()
  /* ---------------------- State ---------------------- */
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [member, setMember] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  /* -------------------- Effects ---------------------- */
  // 1. 監聽捲動：縮小／還原 Header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 2. Body overflow：開側欄時鎖住背景
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  // 3. 檢查登入狀態並獲取會員資料
  useEffect(() => {
    const loadMemberData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setMember(null)
          setIsLoggedIn(false)
          setIsLoading(false)
          return
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/members/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()
        if (data.success) {
          setMember(data.data)
          setIsLoggedIn(true)
        } else {
          console.error('獲取會員資料失敗:', data.message)
          localStorage.removeItem('token')
          setMember(null)
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('獲取會員資料時發生錯誤:', error)
        localStorage.removeItem('token')
        setMember(null)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadMemberData()

    // 監聽 localStorage 變化
    const handleStorageChange = (e) => {
      if (e.key === 'member' || e.key === 'token') {
        loadMemberData()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // 自定義事件監聽
    const handleMemberUpdate = () => {
      loadMemberData()
    }
    window.addEventListener('memberUpdate', handleMemberUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('memberUpdate', handleMemberUpdate)
    }
  }, [])

  /* -------------------- Handlers --------------------- */
  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  const handleLogin = () => {
    setIsLoginModalOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setMember(null)
    setIsLoggedIn(false)
    router.push('/')
    showToast('info', '您已登出 👋')
  }

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const handleSubmitLogin = (formData) => {
    setMember(formData.data)
    setIsLoggedIn(true)
    setIsLoginModalOpen(false)
    showToast('success', '登入成功 🎉')

    // 跳轉到會員中心
    router.push('/member/center')
  }

  const handleNavigateToMemberCenter = () => {
    router.push('/member/center')
  }

  //管理區不需要選單列
  if (pathname.includes('/admin')) {
    return <></>
  }

  return (
    <>
      {/* <div style={{ border: '2px solid red', height: 80 }}>導覽列/選單</div> */}

      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="nav-container">
          {/* Logo */}
          <a href="/" className="logo-container logo" onClick={closeMenu}>
            <img
              src="/img/logo-navbar/logo-navbar-light-1.svg"
              alt="國立故瓷博物館"
              className="large-logo"
            />
            <img
              src="/img/ncmLogo/logo-ncm.png"
              alt="國立故瓷博物館"
              className="small-logo"
            />
          </a>

          {/* Hamburger */}
          <button
            className={`hamburger-menu ${menuOpen ? 'active' : ''}`}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>

          {/* Desktop nav ----------------------------------------------------------------*/}
          <div className="nav-menu d-none d-md-flex">
            <a href="#">展覽 Exhibition</a>
            <a href="#">課程 Courses</a>
            <a href="#">故瓷電商 Shop</a>

            {/* Right cluster */}
            <div className="nav-right">
              {!isLoading &&
                (isLoggedIn ? (
                  <div className="user-greeting">
                    <FaUserCircle />
                    <div className="user-dropdown">
                      <div className="user-profile-header">
                        <img
                          src={member.avatar || '/img/ncmLogo/logo-ncm.png'}
                          alt="avatar"
                          className="user-profile-avatar"
                        />
                        <div className="user-profile-info">
                          <div className="user-profile-name">
                            {member.name || '未設定姓名'}
                          </div>
                          <div className="user-profile-email">
                            {member.email}
                          </div>
                        </div>
                      </div>

                      <a
                        href="#"
                        className="user-dropdown-item"
                        onClick={handleNavigateToMemberCenter}
                      >
                        <FaUser className="icon" /> 個人檔案
                      </a>
                      <a href="#" className="user-dropdown-item">
                        <span className="notification-dot">12</span>
                        <FaCommentDots className="icon" /> 我的訊息
                      </a>
                      <a href="#" className="user-dropdown-item">
                        <FaTicketAlt className="icon" /> 我的優惠券
                      </a>
                      <a href="#" className="user-dropdown-item">
                        <FaShoppingBag className="icon" /> 我的訂單
                      </a>
                      <a href="#" className="user-dropdown-item">
                        <FaHeart className="icon" /> 我的收藏
                      </a>

                      <div className="user-dropdown-divider" />
                      <a
                        href="#"
                        className="user-dropdown-item"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="icon" /> 登出
                      </a>
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={handleLogin}>
                    <FaUserCircle className="icon" /> 登入
                  </button>
                ))}

              <a href="#" className="nav-icon">
                <FaShoppingCart className="icon" />
                <span className="cart-count">0</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Mobile nav (side‑drawer) ----------------------------------------------------- */}
        <aside className={`mobile-nav ${menuOpen ? 'active' : ''}`}>
          <nav className="nav-menu" onClick={closeMenu}>
            <a href="#">展覽 Exhibition</a>
            <a href="#">課程 Courses</a>
            <a href="#">故瓷電商 Shop</a>
          </nav>

          {/* Profile & logout */}
          <div className="mobile-profile">
            {!isLoading &&
              (isLoggedIn ? (
                <>
                  <div className="mobile-profile-header">
                    <img
                      src={member.avatar || '/img/ncmLogo/logo-ncm.png'}
                      alt="avatar"
                      className="mobile-profile-avatar"
                    />
                    <div className="mobile-profile-info">
                      <div className="mobile-profile-name">
                        {member.name || '未設定姓名'}
                      </div>
                      <div className="mobile-profile-email">{member.email}</div>
                    </div>
                  </div>
                  <button
                    className="mobile-profile-item"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> 登出
                  </button>
                </>
              ) : (
                <button className="mobile-profile-item" onClick={handleLogin}>
                  <FaUserCircle /> 登入
                </button>
              ))}
          </div>
        </aside>
      </header>

      {/* Overlay */}
      <div
        className={`mobile-overlay ${menuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      {/* Login Modal */}
      <AuthModal
        show={isLoginModalOpen}
        onHide={handleCloseLoginModal}
        onSubmit={handleSubmitLogin}
      />
    </>
  )
}
