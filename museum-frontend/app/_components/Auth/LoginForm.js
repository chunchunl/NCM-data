'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form } from 'react-bootstrap'
import FloatingField from '@/app/_components/FloatingField'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import { useToast } from '@/app/_components/ToastManager'
import GoogleLoginButton from './GoogleLoginButton'
import { useAuth } from '@/app/_hooks/useAuth'

export default function LoginForm({
  // formData,
  // setFormData,
  onSubmit,
  onClose,
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })
  const [isValid, setIsValid] = useState({
    email: false,
    password: false,
  })

  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()
  const { login } = useAuth()

  // ✅ 即時輸入 + 清錯誤
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setIsValid((prev) => ({ ...prev, [name]: false }))
  }

  // ✅ 失焦時進行驗證
  const handleBlur = (e) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  // // ✅ 驗證函式 validateField
  const validateField = (name, value) => {
    let error = ''
    let valid = false

    if (name === 'email') {
      if (!value) {
        error = '請輸入電子郵件'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = '電子郵件格式錯誤'
      } else {
        valid = true
      }
    }

    if (name === 'password') {
      if (!value) {
        error = '請輸入密碼'
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
      ) {
        error = '密碼需包含大小寫、數字與特殊符號，且至少 8 字元'
      } else {
        valid = true
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
    setIsValid((prev) => ({ ...prev, [name]: valid }))
  }

  // tooltip錯誤訊息
  const handleLogin = async (e) => {
    e.preventDefault()

    const newErrors = {}
    const newValid = {}

    for (const name in formData) {
      const value = formData[name]
      let error = ''
      let valid = false

      if (name === 'email') {
        if (!value) {
          error = '請輸入電子郵件'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = '電子郵件格式錯誤'
        } else {
          valid = true
        }
      }

      if (name === 'password') {
        if (!value) {
          error = '請輸入密碼'
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
        ) {
          error = '密碼需包含大小寫、數字與特殊符號，且至少 8 字元'
        } else {
          valid = true
        }
      }

      newErrors[name] = error
      newValid[name] = valid
    }

    setErrors(newErrors)
    setIsValid(newValid)

    const hasErrors = Object.values(newErrors).some((msg) => msg)
    if (hasErrors) {
      // showToast('error', '請修正錯誤欄位')
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      // showToast('success', '登入成功')
      router.push('/member/center')
    } catch (err) {
      console.error('登入錯誤:', err)
      // showToast('error', err.message || '系統錯誤')
    } finally {
      setLoading(false)
    }
  }



  // Firebase Google Popup 登入成功後的 callback
  const handleGoogleLoginSuccess = async (idToken) => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/auth/firebase`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        }
      )
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Firebase 登入後端驗證失敗')
      }

      // 使用 useAuth.login 統一管理 state & localStorage
      login(data.user, data.accessToken)
      showToast('success', 'Google 登入成功 🎉')
      router.push('/member/center')
    } catch (err) {
      console.error('後端驗證錯誤：', err)
      // showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleLogin}>
      <FloatingField
        controlId="email"
        name="email"
        // type="email"
        type="text"
        label={
          <>
            <FaEnvelope className="icon" /> 電子郵件
          </>
        }
        placeholder="請輸入電子郵件"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        // ✅ 傳入錯誤訊息和成功狀態
        errorMsg={errors.email} // ✅ 傳錯誤訊息
        isValid={isValid.email} // ✅ 傳成功狀態
      />
      <FloatingField
        controlId="password"
        name="password"
        type="password"
        label={
          <>
            <FaLock className="icon" /> 密碼
          </>
        }
        placeholder="請輸入密碼"
        value={formData.password}
        onChange={handleChange}
        // ✅ 傳入錯誤訊息和成功狀態
        errorMsg={errors.password} // ✅ 傳錯誤訊息
        isValid={isValid.password} // ✅ 傳成功狀態（自訂條件）
        autoComplete="current-password"
      />

      <div className="d-grid gap-2 mt-4">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? '登入中...' : '登入'}
        </button>

        <div className="text-center my-3">
          <span className="text-muted">或</span>
        </div>

        <GoogleLoginButton
          onLoginSuccess={handleGoogleLoginSuccess}
          disabled={loading}
        />
      </div>
    </Form>
  )
}
