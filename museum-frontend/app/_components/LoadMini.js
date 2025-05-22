'use client'

import React from 'react'
import '../_styles/loadMini.scss'

export default function LoadMini() {
  return (
    <div className="loader">
      <div className="loader-inner">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>
    </div>
  )
}
