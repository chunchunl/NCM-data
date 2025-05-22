'use client'
import React from 'react'
import './WaveLoader.scss'

const WaveLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader">
        <span className="loading-text">Loading...</span>
      </div>
    </div>
  )
}

export default WaveLoader
