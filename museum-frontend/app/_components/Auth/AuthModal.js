// ✅ AuthModal.js（主容器元件）
'use client'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useToast } from '@/app/_components/ToastManager'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import ResetPasswordForm from './ResetPasswordForm'

export default function AuthModal({ show, onHide, onSubmit }) {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  })

  const { showToast } = useToast()

  const toggleMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword)
    setIsVerificationSent(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      verificationCode: '',
    })
  }

  const handleClose = () => {
    if (onHide) onHide()
    setIsForgotPassword(false)
    setIsVerificationSent(false)
    resetForm()
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isForgotPassword
            ? isVerificationSent
              ? '重設密碼'
              : '忘記密碼'
            : isLogin
            ? '會員登入'
            : '註冊新帳號'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isForgotPassword ? (
          isVerificationSent ? (
            <ResetPasswordForm
              formData={formData}
              setFormData={setFormData}
              setIsVerificationSent={setIsVerificationSent}
              setIsForgotPassword={setIsForgotPassword}
            />
          ) : (
            <ForgotPasswordForm
              formData={formData}
              setFormData={setFormData}
              setIsVerificationSent={setIsVerificationSent}
            />
          )
        ) : isLogin ? (
          <LoginForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            onClose={handleClose}
          />
        ) : (
          <RegisterForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            onClose={handleClose}
          />
        )}
        <div className="text-center mt-3">
          {isForgotPassword ? (
            <button
              type="button"
              className="btn btn-link"
              onClick={toggleForgotPassword}
            >
              返回登入
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-link"
                onClick={toggleMode}
              >
                {isLogin ? '還沒有帳號？立即註冊' : '已有帳號？立即登入'}
              </button>
              {isLogin && (
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={toggleForgotPassword}
                >
                  忘記密碼？
                </button>
              )}
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}
