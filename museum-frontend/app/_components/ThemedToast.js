'use client'

import React, { useEffect, useState } from 'react'
import { Toast } from 'react-bootstrap'
import {
  FaStar,
  FaCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaLightbulb,
  FaMoon,
} from 'react-icons/fa'

const iconMap = {
  primary: <FaStar className="me-2 primary" />,
  secondary: <FaCircle className="me-2 secondary" />,
  success: <FaCheckCircle className="me-2 success" />,
  danger: <FaTimesCircle className="me-2 danger" />,
  warning: <FaExclamationTriangle className="me-2 warning" />,
  info: <FaInfoCircle className="me-2 info" />,
  light: <FaLightbulb className="me-2 light" />,
  dark: <FaMoon className="me-2 dark" />,
}

const ThemedToast = ({
  variant = 'primary',
  message = '',
  delay = 5000,
  onClose,
}) => {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          setShow(false)
          setTimeout(() => {
            if (onClose) onClose()
          }, 0)
        }
        return prev - 2
      })
    }, delay / 50)

    return () => clearInterval(interval)
  }, [delay, onClose])

  return (
    // <Toast
    //   bg={variant}
    //   show={show}
    //   onClose={() => setShow(false)}
    //   className={`themed-toast ${variant}`}
    // >
    //   <Toast.Header>
    //     {iconMap[variant]}
    //     <strong className="me-auto">訊息</strong>
    //     <small>剛剛</small>
    //   </Toast.Header>
    //   <Toast.Body>
    //     <div className="toast-message">{message}</div>
    //     <div
    //       className="toast-progress"
    //       style={{ width: `${progress}%` }}
    //     ></div>
    //   </Toast.Body>
    // </Toast>

    <Toast
      bg={variant}
      show={show}
      onClose={() => setShow(false)}
      className={`themed-toast ${variant}`}
    >
      <Toast.Body>
        <div className="toast-left">
          {iconMap[variant]}
        <div className="toast-message">{message}</div>
      </div>
      <div className="toast-right">
        <small>just now</small>
        <button className="btn-close" onClick={() => setShow(false)}></button>
      </div>
        <div className="toast-progress" style={{ width: `${progress}%` }}></div>
      </Toast.Body>
    </Toast>
  )
}

export default ThemedToast
