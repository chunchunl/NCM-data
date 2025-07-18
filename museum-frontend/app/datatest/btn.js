'use client'

import React, { useState } from 'react'
import './Button.scss'

const FA_SHOPPING_CART_PATH_D =
  'M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z'

const CartSVG = () => (
  <svg viewBox="0 0 36 26">
    <path
      d={FA_SHOPPING_CART_PATH_D}
      transform="scale(0.06) translate(10, 5)"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />

    <polyline points="15 13.5 17 15.5 22 10.5" />
  </svg>
)

export default function Btn({ onClick, children }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = (e) => {
    e.preventDefault()

    if (!isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        if (onClick) {
          onClick()
        }
      }, 3700)
    }
  }

  return (
    <button
      className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      <span>{children || '加到購物車'}</span>
      <div className="cart">
        <CartSVG />
      </div>
    </button>
  )
}
