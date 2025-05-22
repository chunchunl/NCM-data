'use client'

import React from 'react'
import '../_styles/loader.scss'

export default function Loader() {
  return (
    <div className="loader">
      <div className="loader-inner">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      <div className="loader-text">
        <h1>Loading...</h1>
      </div>
    </div>
  )
}
