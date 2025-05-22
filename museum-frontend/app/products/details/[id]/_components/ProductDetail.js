'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '../_styles/ProductDetail.scss'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'

export default function ProductDetail({ product }) {
  const [mainImageSrc, setMainImageSrc] = useState('')
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // ✅ 初始化主圖為主圖網址
  useEffect(() => {
    if (product?.main_img) {
      setMainImageSrc(product.main_img)
    }
  }, [product])

  const handlePrevClick = () => {
    if (currentThumbnailIndex > 0) {
      const newIndex = currentThumbnailIndex - 1
      setCurrentThumbnailIndex(newIndex)
      setMainImageSrc(product.images[newIndex])
    }
  }

  const handleNextClick = () => {
    if (product.images && currentThumbnailIndex < product.images.length - 1) {
      const newIndex = currentThumbnailIndex + 1
      setCurrentThumbnailIndex(newIndex)
      setMainImageSrc(product.images[newIndex])
    }
  }

  const handleThumbnailClick = (index) => {
    setCurrentThumbnailIndex(index)
    setMainImageSrc(product.images[index])
  }

  const handleQuantityIncrement = () => {
    setQuantity(quantity + 1)
  }

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleToggleFavorite = (productId, isCurrentlyFavorite) => {
    console.log(
      `Product ${productId} is now ${isCurrentlyFavorite ? 'a favorite' : 'not a favorite'}`
    )
  }

  if (!product) {
    return <div>Loading...</div>
  }

  //僅用副圖作為輪播縮圖
  const thumbnails = product.images || []

  return (
    <section>
      <div className="container py-4">
        <div className="product-page">
          <div className="product-left">
            {mainImageSrc ? (
              <Image
                src={mainImageSrc}
                className="main-image"
                alt={product.name_zh}
                width={300}
                height={300}
              />
            ) : (
              <div className="placeholder-image">No Image Available</div>
            )}

            {thumbnails.length > 0 && (
              <div className="thumbnail-carousel-wrapper">
                <button className="thumb-prev" onClick={handlePrevClick}>
                  &lt;
                </button>
                <div className="thumbnail-fixed-view">
                  {thumbnails.map((thumbnailUrl, index) => (
                    <Image
                      key={index}
                      src={thumbnailUrl}
                      alt=""
                      width={60}
                      height={60}
                      className={
                        index === currentThumbnailIndex ? 'active' : ''
                      }
                      onClick={() => handleThumbnailClick(index)}
                    />
                  ))}
                </div>
                <button className="thumb-next" onClick={handleNextClick}>
                  &gt;
                </button>
              </div>
            )}
          </div>

          <div className="product-right">
            <h2 className="product-title">{product.name_zh}</h2>
            <p className="product-subtitle">{product.name_en}</p>
            <div className="product-price">
              NT$
              {product.discount_rate
                ? Math.round(product.price * (product.discount_rate / 10))
                : product.price}
            </div>
            <div className="quantity-cart">
              <div className="quantity-control">
                <button className="qty-btn" onClick={handleQuantityDecrement}>
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  className="qty-input"
                  readOnly
                />
                <button className="qty-btn" onClick={handleQuantityIncrement}>
                  +
                </button>
              </div>
              <button className="add-to-cart d-flex">加入購物車</button>
            </div>
            <div className="wishlist">
              <AddToFavoritesButton
                productId={product.id}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={false}
              />
              加入心願清單
            </div>
            <div className="stock-info">剩餘數量：{product.stock} 件</div>
            <hr />
            <div className="product-description">{product.description}</div>
          </div>
        </div>

        <div className="mobile-fixed-bar d-md-none">
          <div className="container d-flex justify-content-between align-items-center gap-2">
            <div className="quantity-control">
              <button className="qty-btn" onClick={handleQuantityDecrement}>
                -
              </button>
              <input
                type="text"
                value={quantity}
                className="qty-input"
                readOnly
              />
              <button className="qty-btn" onClick={handleQuantityIncrement}>
                +
              </button>
            </div>
            <button className="add-to-cart d-flex justify-content-center align-items-center flex-grow-1">
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
