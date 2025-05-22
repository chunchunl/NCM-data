// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Form } from 'react-bootstrap'
// import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa'
// import FloatingField from '@/app/_components/FloatingField'
// import { useToast } from '@/app/_components/ToastManager'
// import { useAuth } from '@/app/_hooks/useAuth'

// export default function RegisterForm({ formData, setFormData, onSubmit, onClose }) {
//   const [loading, setLoading] = useState(false)
//   const [errors, setErrors] = useState({})
//   const [isValid, setIsValid] = useState({})
//   const { showToast } = useToast()
//   const router = useRouter()
//   const { login } = useAuth()

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//     setErrors((prev) => ({ ...prev, [name]: '' }))
//     setIsValid((prev) => ({ ...prev, [name]: false }))
//   }

//   const handleBlur = (e) => {
//     const { name, value } = e.target
//     validateField(name, value)
//   }

//   const validateField = (name, value) => {
//     let error = ''
//     let valid = false

//     if (name === 'name') {
//       if (!value) {
//         error = '請輸入姓名'
//       } else if (value.length < 2 || value.length > 20) {
//         error = '姓名需為 2-20 字元'
//       } else {
//         valid = true
//       }
//     }

//     if (name === 'email') {
//       if (!value) {
//         error = '請輸入電子郵件'
//       } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//         error = '電子郵件格式錯誤'
//       } else {
//         valid = true
//       }
//     }

//     if (name === 'password') {
//       if (!value) {
//         error = '請輸入密碼'
//       } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
//         error = '密碼需包含大小寫、數字與特殊符號，且至少 8 字元'
//       } else {
//         valid = true
//       }
//     }

//     if (name === 'confirmPassword') {
//       if (!value) {
//         error = '請再次輸入密碼'
//       } else if (value !== formData.password) {
//         error = '兩次輸入的密碼不一致'
//       } else {
//         valid = true
//       }
//     }

//     setErrors((prev) => ({ ...prev, [name]: error }))
//     setIsValid((prev) => ({ ...prev, [name]: valid }))
//   }

//   const handleRegister = async (e) => {
//     e.preventDefault()

//     const newErrors = {}
//     const newValid = {}
//     let hasErrors = false

//     for (const name in formData) {
//       const value = formData[name]
//       validateField(name, value)
//       if (!value || errors[name]) {
//         hasErrors = true
//       }
//     }

//     if (hasErrors) return

//     setLoading(true)
//     try {
//       const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/members/register`

//       const res = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify({
//           name: formData.name.trim(),
//           email: formData.email.trim(),
//           password: formData.password,
//         }),
//       })

//       const contentType = res.headers.get('content-type')
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await res.text()
//         throw new Error('伺服器回應格式錯誤，請檢查 API 地址是否正確')
//       }

//       const data = await res.json()
//       if (!res.ok || !data.success) {
//         throw new Error(data.message || '註冊失敗')
//       }

//       if (!data.token || !data.user) {
//         throw new Error('註冊成功但未收到必要資訊')
//       }

//       login(data.user, data.token)
//       showToast('success', '註冊成功 🎉')
//       if (onClose) onClose()
//       router.push('/member/center')
//     } catch (err) {
//       console.error('註冊錯誤:', err)
//       showToast('danger', `註冊失敗：${err.message || '系統錯誤'}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleGoogleRegister = () => {
//     window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/members/auth/google`
//   }

//   return (
//     <Form onSubmit={handleRegister}>
//       <FloatingField
//         controlId="name"
//         name="name"
//         label={<><FaUser className="icon" /> 姓名</>}
//         placeholder="請輸入姓名"
//         value={formData.name}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         errorMsg={errors.name}
//         isValid={isValid.name}
//       />
//       <FloatingField
//         controlId="email"
//         name="email"
//         type="text"
//         label={<><FaEnvelope className="icon" /> 電子郵件</>}
//         placeholder="請輸入電子郵件"
//         value={formData.email}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         errorMsg={errors.email}
//         isValid={isValid.email}
//       />
//       <FloatingField
//         controlId="password"
//         name="password"
//         type="password"
//         label={<><FaLock className="icon" /> 密碼</>}
//         placeholder="請輸入密碼"
//         value={formData.password}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         errorMsg={errors.password}
//         isValid={isValid.password}
//       />
//       <FloatingField
//         controlId="confirmPassword"
//         name="confirmPassword"
//         type="password"
//         label={<><FaLock className="icon" /> 確認密碼</>}
//         placeholder="請再次輸入密碼"
//         value={formData.confirmPassword}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         errorMsg={errors.confirmPassword}
//         isValid={isValid.confirmPassword}
//       />

//       <div className="d-grid gap-2 mt-4">
//         <button type="submit" className="btn btn-primary" disabled={loading}>
//           {loading ? '註冊中...' : '註冊'}
//         </button>

//         <div className="text-center my-3">
//           <span className="text-muted">或</span>
//         </div>

//         <button
//           type="button"
//           className="btn btn-outline-primary"
//           onClick={handleGoogleRegister}
//         >
//           <FaGoogle className="icon" />
//           使用 Google 註冊
//         </button>
//       </div>
//     </Form>
//   )
// }

'use client'

import { useState } from 'react'
import { Form, ProgressBar } from 'react-bootstrap'
import FloatingField from '@/app/_components/FloatingField'
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa'
import { useToast } from '@/app/_components/ToastManager'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/_hooks/useAuth'

export default function RegisterForm({
  formData,
  setFormData,
  onSubmit,
  onClose,
}) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { showToast } = useToast()
  const router = useRouter()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  // const validateField = (name, value) => {
  //   let error = ''
  //   let valid = false

  //   if (name === 'name') {
  //     if (!value) {
  //       error = '請輸入姓名'
  //     } else if (value.length < 2 || value.length > 20) {
  //       error = '姓名需為 2-20 字元'
  //     } else {
  //       valid = true
  //     }
  //   }

  //   if (name === 'email') {
  //     if (!value) {
  //       error = '請輸入電子郵件'
  //     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
  //       error = '電子郵件格式錯誤'
  //     } else {
  //       valid = true
  //     }
  //   }

  //   if (name === 'password') {
  //     if (!value) {
  //       error = '請輸入密碼'
  //     } else if (
  //       !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
  //     ) {
  //       error = '密碼需包含大小寫、數字與特殊符號，且至少 8 字元'
  //     } else {
  //       valid = true
  //     }
  //     setPasswordStrength(calculatePasswordStrength(value))
  //   }

  //   if (name === 'confirmPassword') {
  //     if (!value) {
  //       error = '請再次輸入密碼'
  //     } else if (value !== formData.password) {
  //       error = '兩次輸入的密碼不一致'
  //     } else {
  //       valid = true
  //     }
  //   }

  //   setErrors((prev) => ({ ...prev, [name]: error }))
  //   setIsValid((prev) => ({ ...prev, [name]: valid }))
  // }

  const validateField = (name, value) => {
    let error = ''
    let valid = false

    if (name === 'name') {
      if (!value) {
        error = '請輸入姓名'
      } else if (value.length < 2 || value.length > 20) {
        error = '姓名需為 2-20 字元'
      } else {
        valid = true
      }
    }

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
      setPasswordStrength(calculatePasswordStrength(value))
    }

    if (name === 'confirmPassword') {
      if (!value) {
        error = '請再次輸入密碼'
      } else if (value !== formData.password) {
        error = '兩次輸入的密碼不一致'
      } else {
        valid = true
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
    setIsValid((prev) => ({ ...prev, [name]: valid }))
  }

  // ✅ 密碼強度
  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/\d/.test(password) || /[\W_]/.test(password)) strength += 25
    return strength
  }

  // const handleRegister = async (e) => {
  //   e.preventDefault()

  //   let hasErrors = false
  //   for (const name in formData) {
  //     validateField(name, formData[name])
  //     if (!formData[name] || errors[name]) hasErrors = true
  //   }

  //   // 如果有錯誤，顯示錯誤訊息
  //   if (hasErrors) {
  //     showToast('danger', '請修正表單錯誤')
  //     return
  //   }

  //   setLoading(true)
  //   try {
  //     const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/members/register`

  //     const res = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //       body: JSON.stringify({
  //         name: formData.name.trim(),
  //         email: formData.email.trim(),
  //         password: formData.password,
  //       }),
  //     })

  //     const contentType = res.headers.get('content-type')
  //     if (!contentType || !contentType.includes('application/json')) {
  //       throw new Error('伺服器回應格式錯誤，請檢查 API 地址是否正確')
  //     }

  //     const data = await res.json()
  //     if (!res.ok || !data.success) {
  //       throw new Error(data.message || '註冊失敗')
  //     }

  //     if (!data.token || !data.user) {
  //       throw new Error('註冊成功但未收到必要資訊')
  //     }

  //     login(data.user, data.token)
  //     showToast('success', '註冊成功 🎉')
  //     if (onClose) onClose()
  //     router.push('/member/center')
  //   } catch (err) {
  //     console.error('註冊錯誤:', err)
  //     showToast('danger', `註冊失敗：${err.message || '系統錯誤'}`)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleRegister = async (e) => {
    e.preventDefault()

    // 先驗證所有欄位
    let hasErrors = false
    const newErrors = {}
    const newValid = {}

    // 驗證姓名
    if (!formData.name) {
      newErrors.name = '請輸入姓名'
      hasErrors = true
    } else if (formData.name.length < 2 || formData.name.length > 20) {
      newErrors.name = '姓名需為 2-20 字元'
      hasErrors = true
    } else {
      newValid.name = true
    }

    // 驗證電子郵件
    if (!formData.email) {
      newErrors.email = '請輸入電子郵件'
      hasErrors = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '電子郵件格式錯誤'
      hasErrors = true
    } else {
      newValid.email = true
    }

    // 驗證密碼
    if (!formData.password) {
      newErrors.password = '請輸入密碼'
      hasErrors = true
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password = '密碼需包含大小寫、數字與特殊符號，且至少 8 字元'
      hasErrors = true
    } else {
      newValid.password = true
    }

    // 驗證確認密碼
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '請再次輸入密碼'
      hasErrors = true
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = '兩次輸入的密碼不一致'
      hasErrors = true
    } else {
      newValid.confirmPassword = true
    }

    // 更新錯誤和驗證狀態
    setErrors(newErrors)
    setIsValid(newValid)

    // 如果有錯誤，顯示錯誤訊息
    if (hasErrors) {
      showToast('danger', '請修正表單錯誤')
      return
    }

    setLoading(true)
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/members/register`

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('伺服器回應格式錯誤，請檢查 API 地址是否正確')
      }

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || '註冊失敗')
      }

      if (!data.token || !data.user) {
        throw new Error('註冊成功但未收到必要資訊')
      }

      login(data.user, data.token)
      showToast('success', '註冊成功 🎉')
      if (onClose) onClose()
      router.push('/member/center')
    } catch (err) {
      console.error('註冊錯誤:', err)
      showToast('danger', `註冊失敗：${err.message || '系統錯誤'}`)
    } finally {
      setLoading(false)
    }
  }

  // const handleGoogleRegister = () => {
  //   window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/members/auth/google`
  // }

  return (
    <Form onSubmit={handleRegister}>
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
        onBlur={handleBlur}
        errorMsg={errors.name}
        isValid={isValid.name}
      />
      <FloatingField
        controlId="email"
        name="email"
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
        errorMsg={errors.email}
        isValid={isValid.email}
      />
      <FloatingField
        controlId="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        label={
          <>
            <FaLock className="icon" /> 密碼
          </>
        }
        placeholder="請輸入密碼"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        errorMsg={errors.password}
        isValid={isValid.password}
      />

      <ProgressBar
        now={passwordStrength}
        className="my-2"
        variant={
          passwordStrength < 50
            ? 'danger'
            : passwordStrength < 75
              ? 'warning'
              : 'success'
        }
      />

      <FloatingField
        controlId="confirmPassword"
        name="confirmPassword"
        type={showPassword ? 'text' : 'password'}
        label={
          <>
            <FaLock className="icon" /> 確認密碼
          </>
        }
        placeholder="請再次輸入密碼"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        errorMsg={errors.confirmPassword}
        isValid={isValid.confirmPassword}
      />

      <div className="text-end">
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />} 顯示密碼
        </button>
      </div>

      <div className="d-grid gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '註冊中...' : '註冊'}
        </button>
        {/* 
        <div className="text-center my-3">
          <span className="text-muted">或</span>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={handleGoogleRegister}
        >
          <FaGoogle className="icon" />
          使用 Google 註冊
        </button> */}
      </div>
    </Form>
  )
}
