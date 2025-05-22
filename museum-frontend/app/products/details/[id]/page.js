'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import CategoryMenu from '@/app/products/_components/CategoryMenu'
import ProductDetail from './_components/ProductDetail'
import ProductTabs from './_components/ProductTabs'
import ProductServiceTagline from './_components/ProductServiceTagline'
import YouMightLike from './_components/YouMightLike'

export default function IdPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (!id) return

    // 撈單筆商品資料
    fetch(`http://localhost:3005/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
      })

    // 撈推薦商品（可用 category 為依據過濾）
    fetch(`http://localhost:3005/api/products/recommend/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRelatedProducts(data)
      })
  }, [id])

  if (!product) return <div>Loading...</div>

  return (
    <>
      <div style={{ marginTop: '79px' }}>
        <CategoryMenu />
      </div>
      <ProductDetail product={product} />
      <ProductTabs product={product} />
      <ProductServiceTagline />
      <YouMightLike products={relatedProducts} />
    </>
  )
}
