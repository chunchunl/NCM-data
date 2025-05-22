// components/SuggestedProducts.js
'use client'

import Image from 'next/image'
import React from 'react'

const products = [
  {
    id: 1,
    title: '翠玉白菜',
    price: 990,
    image: '/images/b8.jpg',
  },
  {
    id: 2,
    title: '翠玉白菜',
    price: 990,
    image: '/images/b8.jpg',
  },
  {
    id: 3,
    title: '翠玉白菜',
    price: 990,
    image: '/images/b8.jpg',
  },
  {
    id: 4,
    title: '翠玉白菜',
    price: 990,
    image: '/images/b8.jpg',
  },
]

export default function SuggestedProducts() {
  return (
    <div className="py-5">
      <div className="container">
        <div className="col mb-4 text-center">
          <h3>您可能會喜歡的商品</h3>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4">
          {products.map((product) => (
            <div className="col mt-2" key={product.id}>
              <div className="card shadow-sm rounded-4 text-center border-0">
                <div>
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="img-fluid p-3"
                    style={{ objectFit: 'cover', maxHeight: '200px' }}
                  />
                </div>
                <div className="card-body">
                  <div className="h5 card-title text-left">{product.title}</div>
                  <p className="card-text">NT${product.price}</p>
                  <button
                    className="btn rounded-pill px-3 mb-3"
                    style={{ backgroundColor: '#7b2d12', color: '#fff' }}
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
