// components/FieldWithTooltip.js
'use client'

import React from 'react'
import styles from '../_styles/FieldWithTooltip.module.scss'
import { FaExclamationCircle } from 'react-icons/fa'

export default function FieldWithTooltip({
  label,
  type = 'text',
  value,
  onChange,
  error = '',
  name,
  placeholder,
}) {
  return (
    <div className={styles.fieldWrapper}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={error ? styles.inputError : ''}
        autoComplete="off"
      />
      {error && (
        <div className={styles.tooltip}>
          <FaExclamationCircle className={styles.icon} />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
