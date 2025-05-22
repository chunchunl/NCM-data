'use client'

import React, { useRef, useEffect } from 'react'
import '@/app/_styles/VerificationCodeInput.scss'

export default function VerificationCodeInput({
  value = '',
  onChange,
  label = '驗證碼',
}) {
  const inputs = useRef([])

  //   const handleChange = (e, index) => {
  //     const val = e.target.value.replace(/[^0-9]/g, '') // 限制只能數字
  //     if (!val) return
  //     const newValue = value.split('')
  //     newValue[index] = val
  //     onChange(newValue.join('').slice(0, 6))
  //     if (index < 5) {
  //       inputs.current[index + 1]?.focus()
  //     }
  //   }

  // ✅ 改這裡：傳出一個模擬 DOM 的 event 給外部用
  //   const handleChange = (e, index) => {
  //     const val = e.target.value.replace(/[^0-9]/g, '') // 限制只能數字
  //     if (!val) return

  //     const newValue = value.split('')
  //     newValue[index] = val

  //     // ✅ 改這裡：傳出一個模擬 DOM 的 event 給外部用
  //     onChange({
  //       target: {
  //         name: 'verificationCode',
  //         value: newValue.join('').slice(0, 6),
  //       },
  //     })

  //     if (index < 5) {
  //       inputs.current[index + 1]?.focus()
  //     }
  //   }

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    const newValue = value.split('')

    newValue[index] = val
    onChange(newValue.join('').slice(0, 6))

    if (val && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      const newValue = value.split('')
      newValue[index - 1] = ''
      onChange(newValue.join(''))
      inputs.current[index - 1]?.focus()
    }
  }

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus()
    }
  }, [])

  return (
    <div className="code-input-wrapper">
      <label className="code-label">{label}</label>
      <div className="code-input-container">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="code-input"
            ref={(el) => (inputs.current[i] = el)}
          />
        ))}
      </div>
    </div>
  )
}
