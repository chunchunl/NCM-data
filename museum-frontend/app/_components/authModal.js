'use client'
import '@/app/_styles/globals.scss'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Modal, Form, Alert } from 'react-bootstrap'
import { FaGoogle, FaEnvelope, FaLock, FaUser } from 'react-icons/fa'
import FloatingField from '@/app/_components/FloatingField' // ⬅️ 新增
import { useToast } from '@/app/_components/ToastManager'
// import '@/app/_styles/authModal.module.scss';                         // ⬅️ 改成純載入
// import '@/app/_styles/formCustom.scss';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AuthModal({ show, onHide, onSubmit }) {
  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  /* ---------- 表單狀態與驗證 ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors = {}

    // 姓名驗證（註冊時）
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = '請輸入姓名'
        showToast('error', '請輸入姓名')
      } else if (formData.name.length < 2) {
        newErrors.name = '姓名至少需要2個字元'
        showToast('error', '姓名至少需要2個字元')
      } else if (formData.name.length > 20) {
        newErrors.name = '姓名不能超過20個字元'
        showToast('error', '姓名不能超過20個字元')
      }
    }

    // 電子郵件驗證
    if (!formData.email) {
      newErrors.email = '請輸入電子郵件'
      showToast('error', '請輸入電子郵件')
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '請輸入有效的電子郵件格式'
        showToast('error', '請輸入有效的電子郵件格式')
      }
    }

    // 密碼驗證
    if (!formData.password) {
      newErrors.password = '請輸入密碼'
      showToast('error', '請輸入密碼')
    } else {
      // 密碼長度
      if (formData.password.length < 8) {
        newErrors.password = '密碼長度至少為8個字元'
        showToast('error', '密碼長度至少為8個字元')
      }
      // 密碼複雜度
      const hasUpperCase = /[A-Z]/.test(formData.password)
      const hasLowerCase = /[a-z]/.test(formData.password)
      const hasNumbers = /\d/.test(formData.password)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        newErrors.password = '密碼必須包含大小寫字母、數字和特殊符號'
        showToast('error', '密碼必須包含大小寫字母、數字和特殊符號')
      }
    }

    // 確認密碼驗證（註冊時）
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '請確認密碼'
        showToast('error', '請確認密碼')
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '兩次輸入的密碼不一致'
        showToast('error', '兩次輸入的密碼不一致')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ---------- 送出 ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({})
    try {
      const endpoint = isLogin ? '/api/members/login' : '/api/members/register'
      const res = await fetch(`http://localhost:3005${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          ...(isLogin
            ? {}
            : {
                name: formData.name.trim(),
                // 可以添加其他註冊需要的字段
              }),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || (isLogin ? '登入失敗' : '註冊失敗'))
      }

      if (!data.success) {
        throw new Error(data.message)
      }

      // 若是登入成功就存 token 和用戶資料
      if (isLogin && data.data?.token) {
        localStorage.setItem('token', data.data.token)
        //
        localStorage.setItem('member', JSON.stringify(data.data.user))

        // ✅ 這一行是關鍵：觸發自訂事件，讓 Navbar 重新讀 token
        window.dispatchEvent(new Event('memberUpdate'))
        
        if (data.data.user) {
          localStorage.setItem('member', JSON.stringify(data.data.user))
        }
        showToast('success', '登入成功 🎉')
        // 跳轉到會員中心
        router.push('/member/center')
      } else if (!isLogin) {
        showToast('success', '註冊成功！')
        // 跳轉到會員中心
        router.push('/member/center')
      }

      if (onSubmit) onSubmit(data)
      if (onHide) onHide()
    } catch (err) {
      console.error(isLogin ? '登入錯誤:' : '註冊錯誤:', err)
      showToast('error', err.message || '系統錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  /* ---------- 其他 ---------- */
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3005/api/members/auth/google'
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
  }

  /* ---------- Render ---------- */
  return (
    <Modal
      show={show}
      onHide={() => {
        if (onHide) onHide()
        setErrors({})
        setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? '會員登入' : '註冊新帳號'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <FloatingField
              controlId="name"
              name="name"
              label={
                <>
                  <FaUser className="icon" /> 姓名
                </>
              }
              placeholder="請輸入姓名"
              value={formData.name}
              onChange={handleChange}
              errorMsg={errors.name}
            />
          )}

          <FloatingField
            controlId="email"
            name="email"
            type="email"
            label={
              <>
                <FaEnvelope className="icon" /> 電子郵件
              </>
            }
            placeholder="請輸入電子郵件"
            value={formData.email}
            onChange={handleChange}
            errorMsg={errors.email}
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
            errorMsg={errors.password}
          />

          {!isLogin && (
            <FloatingField
              controlId="confirmPassword"
              name="confirmPassword"
              type="password"
              label={
                <>
                  <FaLock className="icon" /> 確認密碼
                </>
              }
              placeholder="請再次輸入密碼"
              value={formData.confirmPassword}
              onChange={handleChange}
              errorMsg={errors.confirmPassword}
            />
          )}

          <div className="d-grid gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? isLogin
                  ? '登入中...'
                  : '註冊中...'
                : isLogin
                  ? '登入'
                  : '註冊'}
            </button>

            <div className="text-center my-3">
              <span className="text-muted">或</span>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="icon" />
              使用 Google {isLogin ? '登入' : '註冊'}
            </button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <button type="button" className="btn btn-link" onClick={toggleMode}>
            {isLogin ? '還沒有帳號？立即註冊' : '已有帳號？立即登入'}
          </button>
          {isLogin && (
            <a href="/forgot-password" className="btn btn-link">
              忘記密碼？
            </a>
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}
