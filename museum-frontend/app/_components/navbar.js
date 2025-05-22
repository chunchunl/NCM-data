'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import '../_styles/navbar.scss'
import AuthModal from '@/app/_components/Auth/AuthModal'
import { useAuth } from '@/app/_hooks/useAuth'
// import { useAuth } from '@/app/_components/Auth/AuthProvider'

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
import Image from 'next/image'

// toast
import { useToast } from './ToastManager'
import { io } from 'socket.io-client'
import ChatSidebar from './Chat/ChatSidebar'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()
  const {
    member,
    isLoggedIn,
    isLoading,
    login,
    logout,
    googleLogin,
    updateMember,
    avatarSrc,
    token,
  } = useAuth()

  /* ---------------------- State ---------------------- */
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

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

  /* -------------------- Handlers --------------------- */
  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  const handleLogin = () => {
    setIsLoginModalOpen(true)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const handleSubmitLogin = async (formData) => {
    try {
      // 1. 呼叫後端登入 API（使用 NEXT_PUBLIC_API_URL）
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      )

      // 2. 解析回傳
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.message || `登入失敗：HTTP ${res.status}`)
      }

      const { user, token } = json.data

      // 3. 呼叫 login 更新全局狀態
      login(user, token)

      // 4. UI 處理：關 Modal、Toast、轉頁
      setIsLoginModalOpen(false)
      showToast('success', '登入成功 🎉')
      router.push('/member/center')
    } catch (err) {
      console.error('登入錯誤：', err)
      showToast('danger', `登入失敗：${err.message || '未知錯誤'}`)
    }
  }

  const handleNavigateToMemberCenter = () => {
    router.push('/member/center')
  }

  const handleChatClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    setIsChatOpen(!isChatOpen)
  }

  //管理區不需要選單列
  if (pathname.includes('/admin')) {
    return <></>
  }

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="nav-container">
          {/* Logo */}
          <a href="/" className="logo-container logo" onClick={closeMenu}>
            <Image
              src="/img/logo-navbar/logo-navbar-light-1.svg"
              alt="國立故瓷博物館"
              className="large-logo"
              width={200}
              height={50}
            />
            <Image
              src="/img/ncmLogo/logo-ncm.png"
              alt="國立故瓷博物館"
              className="small-logo"
              width={40}
              height={40}
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
                    {/* 使用者頭像 */}
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="user-profile-avatar"
                      style={{ objectFit: 'cover', borderRadius: '50%' }}
                    />
                    <div className="user-dropdown">
                      <div className="user-profile-header">
                        <img
                          src={avatarSrc}
                          alt="avatar"
                          width={60}
                          height={60}
                          className="user-profile-avatar"
                          style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                        <div className="user-profile-info">
                          <div className="user-profile-name">
                            {member?.name || '未設定姓名'}
                          </div>
                          <div className="user-profile-email">
                            {member?.email}
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
                      <a
                        href="#"
                        className="user-dropdown-item"
                        onClick={handleChatClick}
                      >
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
                      src={member?.avatar || '/img/ncmLogo/logo-ncm.png'}
                      alt="avatar"
                      width={50}
                      height={50}
                      className="mobile-profile-avatar"
                      style={{ objectFit: 'cover', borderRadius: '50%' }}
                    />
                    <div className="mobile-profile-info">
                      <div className="mobile-profile-name">
                        {member?.name || '未設定姓名'}
                      </div>
                      <div className="mobile-profile-email">
                        {member?.email}
                      </div>
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

      {/* 聊天室側邊欄 */}
      <ChatSidebar 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        receiverId={member?.role === 'member' ? 93 : member?.role === 'staff' ? 92 : undefined}
        isStaff={member?.role === 'staff'}
      />
    </>
  )
}
