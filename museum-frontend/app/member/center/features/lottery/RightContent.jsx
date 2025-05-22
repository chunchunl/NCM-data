'use client'

import React, { useState } from 'react'
import styles from './lottery.module.scss'


export default function RightContent() {
  
  

  

  return (
  //   <div className={styles.rightContainer}>
  //   <h3 className={styles.rightContentTitle}>
  //     <span>NCM</span>
  //     <span>MEMBER</span>
  //     {/* <span>CENTER</span> */}
  //   </h3>
  // </div>

  <div className={styles.rightContainer}>
      <div className={styles.ncm}>NCM</div>
      <div className={styles.member}>MEMBER</div>
    </div>
  )
} 