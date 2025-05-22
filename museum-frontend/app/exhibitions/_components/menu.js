'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import styles from '../_styles/ex-menu.module.scss'

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const toggleMenu = () => {
    if (isOpen) {
      setIsClosing(true)
      setTimeout(() => {
        setIsOpen(false)
        setIsClosing(false)
      }, 1000)
    } else {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) toggleMenu()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  const overlayClass = `
    ${styles.overlay} 
    ${isOpen ? styles.open : ''} 
    ${isClosing ? styles.closing : ''}
  `.trim()

  const years = [2024, 2023, 2022, 2021]

  return (
    <>
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-primary" onClick={toggleMenu}>
          選擇年份 ▾
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        className={overlayClass}
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleMenu()
          }
        }}
      >
        <nav
          className={styles.overlayMenu}
          onClick={(e) => e.stopPropagation()}
        >
          <ul>
            {years.map((year) => (
              <li key={year}>
                <Link
                  href={`/exhibitions?state=past&year=${year}`} // ✅ 修正這行即可
                  onClick={toggleMenu}
                >
                  {year}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
