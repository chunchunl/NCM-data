'use client'
import React, { useEffect, useState, useRef } from 'react'
import '../_styles/categoryMenu.scss'

const categories = [
  { name: '全部商品', sub: ['熱銷精選'] },
  {
    name: '典藏精品',
    sub: ['陶瓷', '迷你陶瓷', '琉璃'],
  },
  {
    name: '餐廚用品',
    sub: ['馬克杯/保溫杯', '品茗茶具', '餐墊/杯墊', '餐具碗盤'],
  },
  {
    name: '圖書影音',
    sub: ['電子書', '期刊', 'DVD'],
  },
  {
    name: '文創商品',
    sub: ['生活用品', '辦公用品', '居家小品'],
  },
]

export default function CategoryMenu({ onCategoryClick }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const categoryMenuRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleCategoryClick = (index, categoryName) => {
    if (onCategoryClick) {
      onCategoryClick({ category: categoryName, subcategory: null })
    }
    if (isMobile) {
      setActiveIndex(activeIndex === index ? null : index)
    }
  }

  const handleSubCategoryClick = (subCategoryName, categoryName) => {
    if (onCategoryClick) {
      onCategoryClick({ category: categoryName, subcategory: subCategoryName })
    }
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isMobile &&
        activeIndex !== null &&
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(e.target)
      ) {
        setActiveIndex(null)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isMobile, activeIndex])

  return (
    <div className="container py-4" ref={categoryMenuRef}>
      <div className="category-menu">
        {categories.map((cat, idx) => (
          <div
            key={cat.name}
            className={`category-item ${activeIndex === idx ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleCategoryClick(idx, cat.name)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                handleCategoryClick(idx, cat.name)
              }
            }}
            role="button"
            aria-pressed={activeIndex === idx}
            tabIndex={0}
          >
            <span>{cat.name}</span>
            {cat.sub && (
              <div className="subcategory">
                {cat.sub.map((item) => (
                  <a
                    key={item}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSubCategoryClick(item, cat.name)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSubCategoryClick(item, cat.name)
                      }
                    }}
                    tabIndex={0}
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
