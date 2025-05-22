'use client'
import { useState } from 'react'
import { Form } from 'react-bootstrap'
import FloatingField from '@/app/_components/FloatingField'
import { FaEnvelope } from 'react-icons/fa'
import { useToast } from '@/app/_components/ToastManager'

export default function ForgotPasswordForm({ formData, setFormData, setIsVerificationSent }) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!formData.email) {
      showToast('error', '請輸入電子郵件')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3005/api/members/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || '發送驗證碼失敗')
      }

      showToast('success', '驗證碼已寄出 ✉️ 請至信箱查看')
      setIsVerificationSent(true)
    } catch (err) {
      console.error('忘記密碼錯誤:', err)
      showToast('error', err.message || '系統錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSendCode}>
      <FloatingField
        controlId="email"
        name="email"
        type="email"
        label={<><FaEnvelope className="icon" /> 電子郵件</>}
        placeholder="請輸入註冊時的電子郵件"
        value={formData.email}
        onChange={handleChange}
      />

      <div className="d-grid gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '發送中...' : '發送驗證碼'}
        </button>
      </div>
    </Form>
  )
}
