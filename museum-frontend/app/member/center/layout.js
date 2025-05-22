'use client'

import React from 'react'
import styles from './styles/center.module.scss'
import Navbar from '@/app/_components/navbar'

export default function MemberCenterLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className={styles.container}>{children}</div>
    </>
  )
}
