'use client'

// app/_hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react'
import { auth } from '@/app/_config/firebase'
import { signOut as firebaseSignOut } from 'firebase/auth'

export function useAuth() {
  const [member, setMember] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(null)

  // helper：拼成最終要用的 avatar URL
  const getAvatarSrc = (avatar) => {
    if (!avatar) {
      return '/img/ncmLogo/default-avatar.png'
    }
    // 如果已經是完整的 http(s) 開頭，就直接回傳
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar
    }
    // 只有在「相對路徑」時，才補上你的 API 根址
    return `${process.env.NEXT_PUBLIC_API_URL}${avatar}`
  }

  // 初始化：從 localStorage 載入
  useEffect(() => {
    const storedMember = localStorage.getItem('member')
    const storedToken = localStorage.getItem('token')
    if (storedMember && storedToken) {
      const trimmed = storedMember.trim()
      // 如果是 HTML (以 '<' 開頭)，直接清除
      if (trimmed.startsWith('<')) {
        console.warn('localStorage.member 似乎為 HTML, 已清除')
        localStorage.removeItem('member')
        localStorage.removeItem('token')
      }
      // 如果看起來像 JSON (以 '{' 開頭) 才嘗試解析
      else if (trimmed.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmed)
          setMember(parsed)
          setToken(storedToken)
          setIsLoggedIn(true)
        } catch (e) {
          console.warn('JSON 解析失敗, 已清除本地儲存:', e)
          localStorage.removeItem('member')
          localStorage.removeItem('token')
        }
      } else {
        console.warn('localStorage.member 不是 JSON, 已清除')
        localStorage.removeItem('member')
        localStorage.removeItem('token')
      }
    }
    setIsLoading(false)
  }, [])

  // 監聽會員資料更新事件
  useEffect(() => {
    const handleMemberUpdate = (event) => {
      const newMemberData = event.detail
      setMember(newMemberData)
      localStorage.setItem('member', JSON.stringify(newMemberData))
    }

    window.addEventListener('memberUpdate', handleMemberUpdate)
    return () => window.removeEventListener('memberUpdate', handleMemberUpdate)
  }, [])

  // token 有了就更新會員資料
  useEffect(() => {
    if (!token || !member?.id) return
    ;(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/members/${member.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const json = await res.json()
        if (json.success) {
          setMember(json.data)
          localStorage.setItem('member', JSON.stringify(json.data))
        }
      } catch (e) {
        console.error('更新會員資料失敗:', e)
      }
    })()
  }, [token, member?.id])

  // 直接登入
  const login = (memberData, authToken) => {
    setMember(memberData)
    setToken(authToken)
    setIsLoggedIn(true)
    localStorage.setItem('member', JSON.stringify(memberData))
    localStorage.setItem('token', authToken)
  }

  // 更新会员资料
  const updateMember = (newMemberData) => {
    setMember(newMemberData)
    localStorage.setItem('member', JSON.stringify(newMemberData))
    // 觸發全局更新事件
    window.dispatchEvent(
      new CustomEvent('memberUpdate', {
        detail: newMemberData,
      })
    )
  }

  // 登出
  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      setMember(null)
      setToken(null)
      setIsLoggedIn(false)
      localStorage.removeItem('member')
      localStorage.removeItem('token')
    } catch (e) {
      console.error('登出失敗:', e)
      throw e
    }
  }

  // 計算一個 avatarSrc，讓元件直接用
  const avatarSrc = getAvatarSrc(member?.avatar)

  return {
    member,
    token,
    isLoading,
    isLoggedIn,
    login,
    updateMember,
    logout,
    avatarSrc,
  }
}
