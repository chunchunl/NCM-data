'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import '@/app/_styles/courseDetail.scss'

export default function CourseLayout({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    })
  }, [])

  return (
    <div className="course-layout">
      {children}
    </div>
  )
} 