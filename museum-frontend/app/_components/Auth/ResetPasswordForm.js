// 'use client'

// import { useState } from 'react'
// import { Form } from 'react-bootstrap'
// import FloatingField from '@/app/_components/FloatingField'
// import { FaEnvelope, FaLock } from 'react-icons/fa'
// import { useToast } from '@/app/_components/ToastManager'
// import VerificationCodeInput from '@/app/_components/Auth/VerificationCodeInput'

// export default function ResetPasswordForm({
//   formData,
//   setFormData,
//   setIsVerificationSent,
//   setIsForgotPassword,
// }) {
//   const [loading, setLoading] = useState(false)
//   const { showToast } = useToast()

//   // const handleChange = (e) => {
//   //   const { name, value } = e.target
//   //   setFormData((prev) => ({ ...prev, [name]: value }))
//   // }

//   // const handleChange = (e) => {
//   //   const name = e.target?.name || 'verificationCode'
//   //   const value = e.target?.value || ''
//   //   setFormData((prev) => ({ ...prev, [name]: value }))
//   // }

//   const isCodeFilled = formData.verificationCode.length === 6

//   const handleReset = async (e) => {
//     e.preventDefault()

//     if (!formData.verificationCode || !isCodeFilled) {
//       showToast('error', '請輸入六位驗證碼')
//       return
//     }
//     if (!formData.password) {
//       showToast('error', '請輸入新密碼')
//       return
//     }
//     if (formData.password !== formData.confirmPassword) {
//       showToast('error', '兩次輸入的密碼不一致')
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/members/reset-password`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             email: formData.email.trim(),
//             verificationCode: formData.verificationCode,
//             newPassword: formData.password,
//           }),
//         }
//       )

//       const data = await res.json()

//       if (!res.ok || !data.success) {
//         throw new Error(data.message || '重設密碼失敗')
//       }

//       showToast('success', '密碼重設成功，請使用新密碼登入')
//       setIsVerificationSent(false)
//       setIsForgotPassword(false)
//       setFormData({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         verificationCode: '',
//       })
//     } catch (err) {
//       console.error('重設密碼錯誤:', err)
//       showToast('error', err.message || '系統錯誤，請稍後再試')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ✅ handleChange for normal fields
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   // ✅ handleVerificationChange just for code
//   const handleVerificationChange = (val) => {
//     setFormData((prev) => ({ ...prev, verificationCode: val }))
//   }

//   return (
//     <Form onSubmit={handleReset}>
//       {/* <FloatingField
//           controlId="verificationCode"
//           name="verificationCode"
//           label={
//             <>
//               <FaEnvelope className="icon" /> 驗證碼
//             </>
//           }
//           placeholder="請輸入 6 位數驗證碼"
//           value={formData.verificationCode}
//           onChange={handleChange}
//         /> */}

//       <VerificationCodeInput
//         value={formData.verificationCode}
//         onChange={handleVerificationChange}
//       />
//       {!isCodeFilled && (
//         <div className="text-muted mb-3">請輸入驗證碼以啟用密碼修改區</div>
//       )}
//       <fieldset
//         disabled={!isCodeFilled}
//         style={{
//           filter: !isCodeFilled ? 'blur(2px)' : 'none',
//           transition: '0.3s ease',
//         }}
//       >
//         <FloatingField
//           controlId="password"
//           name="password"
//           type="password"
//           label={
//             <>
//               <FaLock className="icon" /> 新密碼
//             </>
//           }
//           placeholder="請輸入新密碼"
//           value={formData.password}
//           onChange={handleChange}
//         />

//         <FloatingField
//           controlId="confirmPassword"
//           name="confirmPassword"
//           type="password"
//           label={
//             <>
//               <FaLock className="icon" /> 確認密碼
//             </>
//           }
//           placeholder="請再次輸入密碼"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//         />
//       </fieldset>
//       <div className="d-grid gap-2 mt-4">
//         <button type="submit" className="btn btn-primary" disabled={loading}>
//           {loading ? '重設中...' : '重設密碼'}
//         </button>
//       </div>
//     </Form>
//   )
// }

'use client'

import { useState } from 'react'
import { Form, ProgressBar } from 'react-bootstrap'
import FloatingField from '@/app/_components/FloatingField'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useToast } from '@/app/_components/ToastManager'
import VerificationCodeInput from '@/app/_components/Auth/VerificationCodeInput'

export default function ResetPasswordForm({
  formData,
  setFormData,
  setIsVerificationSent,
  setIsForgotPassword,
}) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const isCodeFilled = formData.verificationCode?.length === 6

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleVerificationChange = (val) => {
    setFormData((prev) => ({ ...prev, verificationCode: val }))
    validateField('verificationCode', val)
  }

  const validateField = (name, value) => {
    let error = ''
    let valid = false

    if (name === 'verificationCode') {
      if (!value || value.length !== 6) {
        error = '請輸入 6 位數驗證碼'
      } else {
        valid = true
      }
    }

    if (name === 'password') {
      if (!value) {
        error = '請輸入新密碼'
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

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/\d/.test(password) || /[\W_]/.test(password)) strength += 25
    return strength
  }

  const handleReset = async (e) => {
    e.preventDefault()

    const isCodeValid = formData.verificationCode?.length === 6
    const isPwdValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
      formData.password
    )
    const isConfirmValid = formData.password === formData.confirmPassword

    if (!isCodeValid || !isPwdValid || !isConfirmValid) {
      showToast('error', '請修正表單錯誤')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email.trim(),
            verificationCode: formData.verificationCode,
            newPassword: formData.password,
          }),
        }
      )

      const data = await res.json()
      if (!res.ok || !data.success)
        throw new Error(data.message || '重設密碼失敗')

      showToast('success', '密碼重設成功，請使用新密碼登入')
      setIsVerificationSent(false)
      setIsForgotPassword(false)
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: '',
      })
    } catch (err) {
      showToast('danger', err.message || '系統錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleReset}>
      <VerificationCodeInput
        value={formData.verificationCode}
        onChange={handleVerificationChange}
        label="驗證碼"
      />
      {errors.verificationCode && (
        <div className="text-danger mb-2 ms-1">{errors.verificationCode}</div>
      )}

      <fieldset
        disabled={!isCodeFilled}
        style={{
          filter: !isCodeFilled ? 'blur(2px)' : 'none',
          transition: '0.3s ease',
        }}
      >
        <FloatingField
          controlId="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label={
            <>
              <FaLock className="icon" /> 新密碼
            </>
          }
          placeholder="請輸入新密碼"
          value={formData.password}
          onChange={handleChange}
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
      </fieldset>

      <div className="d-grid gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '重設中...' : '重設密碼'}
        </button>
      </div>
    </Form>
  )
}
