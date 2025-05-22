'use client'

import { useState, useCallback } from 'react'

/**
 * 表單驗證 Hook
 * @param {Object} initialValues - 初始欄位值
 * @param {Object} validationRules - 驗證規則物件，每個欄位對應一個驗證函式
 * @returns {Object} 包含表單狀態和處理函式的物件
 */
export function useFormValidation(initialValues, validationRules) {
  // 初始化狀態
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // 驗證單個欄位
  const validateField = useCallback(
    (name, value) => {
      if (!validationRules[name]) return ''

      const error = validationRules[name](value, values)
      return error || ''
    },
    [validationRules, values]
  )

  // 處理欄位變更
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))

      // 如果欄位已被觸碰過，則進行驗證
      if (touched[name]) {
        const error = validateField(name, value)
        setErrors((prev) => ({ ...prev, [name]: error }))
      }
    },
    [touched, validateField]
  )

  // 處理欄位失焦
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target
      setTouched((prev) => ({ ...prev, [name]: true }))

      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    },
    [validateField]
  )

  // 驗證所有欄位
  const validateAll = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach((name) => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validateField, values])

  // 重置錯誤狀態
  const resetErrors = useCallback((newErrors = {}) => {
    setErrors(newErrors)
  }, [])

  // 重置表單
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetErrors,
    resetForm,
    // 方便使用的輔助函式
    getFieldProps: (name) => ({
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      errorMsg: errors[name],
      isValid: !errors[name],
    }),
  }
}
