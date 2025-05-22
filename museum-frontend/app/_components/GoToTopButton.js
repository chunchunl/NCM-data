'use client'
import { useEffect, useState } from 'react'

export default function GoToTopButton() {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300) // 滾動超過 300px 才顯示按鈕
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {showButton && (
        <button className="go-to-top" onClick={scrollToTop}>
          ⬆
        </button>
      )}
    </>
  )
}
