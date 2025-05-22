import React from 'react'
import ProductCard from '@/app/_components/ProductCard'
import '../_styles/YouMightLike.scss'

export default function YouMightLike({ products }) {
  return (
    <div className="others-section">
      <div className="text-center fw-bold my-4">
        <h4>您可能會有興趣</h4>
        <p className="others-title">更多相關商品</p>
      </div>
      <div className="card-scroll">
        {products &&
          products
            .slice(0, 8)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        {products && products.length === 0 && <p>暫無相關商品推薦。</p>}
      </div>
    </div>
  )
}