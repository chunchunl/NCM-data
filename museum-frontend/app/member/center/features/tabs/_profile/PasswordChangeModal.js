// museum-frontend/app/member/center/features/tabs/components/PasswordChangeModal.js
'use client'

import React, { useState } from 'react'
import { Modal, Button, Form, ProgressBar } from 'react-bootstrap'
import FloatingField from '@/app/_components/FloatingField'
import { FaLock, FaKey, FaCheckCircle, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa'

export default function PasswordChangeModal({
  show,
  onHide,
  passwordData,
  onChange,
  onSubmit,
  isLoading,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState({})

  const validateField = (name, value) => {
    let error = ''
    let valid = false

    if (name === 'newPassword') {
      if (!value) {
        error = '請輸入新密碼'
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
        error = '密碼需含大小寫、數字與符號，至少 8 字元'
      } else {
        valid = true
      }
    }

    if (name === 'confirmPassword') {
      if (!value) {
        error = '請再次輸入密碼'
      } else if (value !== passwordData.newPassword) {
        error = '兩次輸入的密碼不一致'
      } else {
        valid = true
      }
    }

    setErrors(prev => ({ ...prev, [name]: error }))
    setIsValid(prev => ({ ...prev, [name]: valid }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(e)

    if (name === 'newPassword') {
      let strength = 0
      if (value.length >= 8) strength += 25
      if (/[A-Z]/.test(value)) strength += 25
      if (/[a-z]/.test(value)) strength += 25
      if (/\d/.test(value) || /[\W_]/.test(value)) strength += 25
      setPasswordStrength(strength)
    }

    validateField(name, value)
  }

  const renderError = (name) =>
    errors[name] && (
      <div className="error-tooltip">
        <div className="error-arrow"></div>
        <div className="error-content">
          <FaExclamationCircle className="error-icon text-danger" />
          <div className="error-message">{errors[name]}</div>
        </div>
      </div>
    )

  const renderSuccess = (name) =>
    isValid[name] &&
    !errors[name] && (
      <span className="success-icon">
        <FaCheckCircle />
      </span>
    )

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>修改密碼</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <div className={`floating-field ${errors.currentPassword ? 'has-error' : ''}`}>
            <FloatingField
              controlId="currentPassword"
              name="currentPassword"
              type="password"
              label={<><FaLock className="icon" /> 當前密碼</>}
              placeholder="請輸入當前密碼"
              value={passwordData.currentPassword}
              onChange={handleChange}
              required
            />
            {renderError('currentPassword')}
          </div>

          <div className={`floating-field ${errors.newPassword ? 'has-error' : ''}`}>
            <FloatingField
              controlId="newPassword"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              label={<><FaKey className="icon" /> 新密碼</>}
              placeholder="請輸入新密碼"
              value={passwordData.newPassword}
              onChange={handleChange}
              required
            />
            {renderError('newPassword')}
            {renderSuccess('newPassword')}
          </div>

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

          <div className={`floating-field ${errors.confirmPassword ? 'has-error' : ''}`}>
            <FloatingField
              controlId="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              label={<><FaCheckCircle className="icon" /> 確認新密碼</>}
              placeholder="請再次輸入密碼"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              required
            />
            {renderError('confirmPassword')}
            {renderSuccess('confirmPassword')}
          </div>

          <div className="text-end mb-3">
            <Button
              variant="link"
              className="p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} 顯示密碼
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          取消
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? '更新中...' : '確認修改'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}