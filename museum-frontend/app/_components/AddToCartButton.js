'use client'
import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'

export default function AddToCartButton({ productId, onAddToCart, disabled }) {
  const handleClick = () => {
    if (!disabled && onAddToCart) {
      onAddToCart(productId)
    } else if (disabled) {
      console.log(`商品 ${productId} 庫存不足，無法加入購物車`)
    }
  }

  return (
    <button
      className={`btn btn-primary ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <FaShoppingCart className="me-2" />
      加入購物車
    </button>
  )
}
