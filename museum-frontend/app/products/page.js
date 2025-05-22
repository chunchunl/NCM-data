'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Marquee from './_components/Marquee'
import HeroSlider from './_components/HeroSlider'
import CategoryShowcase from './_components/CategoryShowcase'
import CategoryMenu from './_components/CategoryMenu'
import ProductFilter from './_components/ProductFilter'
import ProductCard from '../_components/ProductCard'
import './_styles/productPage.scss'

export default function ProductPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState({
    category: null,
    subcategory: null,
  })
  const [categoryMap, setCategoryMap] = useState({})
  const [subcategoryMap, setSubcategoryMap] = useState({})

  // 撈分類對照表（名稱 ➜ ID）
  useEffect(() => {
    fetch('http://localhost:3005/api/products/categories')
      .then((res) => res.json())
      .then((data) => {
        const cMap = {}
        const sMap = {}

        data.forEach((cat) => {
          cMap[cat.category_name] = cat.category_id
          cat.subcategories.forEach((sub) => {
            sMap[sub.name] = sub.id
          })
        })

        setCategoryMap(cMap)
        setSubcategoryMap(sMap)
      })
  }, [])

  // 點分類時：轉成 ID 傳入 selectedCategory
  const handleCategoryClick = ({ category, subcategory }) => {
    const categoryId = category ? categoryMap[category] : null
    const subcategoryId = subcategory ? subcategoryMap[subcategory] : null
    setSelectedCategory({ category: categoryId, subcategory: subcategoryId })
    setCurrentPage(1)
  }

  // 組查詢字串
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams()
    params.set('page', currentPage)
    if (selectedCategory.category) {
      params.set('category', selectedCategory.category)
    }
    if (selectedCategory.subcategory) {
      params.set('subcategory', selectedCategory.subcategory)
    }
    return params.toString()
  }, [currentPage, selectedCategory])

  // 撈商品資料
  useEffect(() => {
    const query = buildQuery()
    fetch(`http://localhost:3005/api/products?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
        setTotalPages(data.totalPages || 1)
      })
      .catch(() => {
        setProducts([])
        setTotalPages(1)
      })
  }, [buildQuery])

  const goToPage = (pageNumber) => setCurrentPage(pageNumber)

  const renderPaginationButtons = () => {
    const buttons = []
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      )
    }
    return <div className="pagination">{buttons}</div>
  }

  return (
    <>
      <Marquee />
      <HeroSlider />
      <CategoryShowcase onCategoryClick={handleCategoryClick} />
      <div id="product-list">
        <CategoryMenu onCategoryClick={handleCategoryClick} />
      </div>
      <ProductFilter />
      <div className="container py-2">
        <div className="row g-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {totalPages > 1 && renderPaginationButtons()}
      </div>
    </>
  )
}
