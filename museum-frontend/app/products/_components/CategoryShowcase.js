'use client'

import React from 'react'
import '../_styles/categoryShowcase.scss'
import Image from 'next/image'

export default function CategoryShowcase({ onCategoryClick }) {
  const handleClick = (categoryName) => {
    if (onCategoryClick) {
      onCategoryClick({ category: categoryName, subcategory: null })
    }
    requestAnimationFrame(() => {
      setTimeout(() => {
        const section = document.getElementById('product-list')
        if (section) {
          const yOffset = -80 // 可根據 header 高度微調
          const y =
            section.getBoundingClientRect().top + window.scrollY + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 100) // 給前端分類變動一點渲染時間
    })
  }

  return (
    <section className="py-4">
      <div className="container px-0">
        <div className="row g-0">
          {/* 文創商品 */}
          <div className="col-lg-6 d-flex flex-column">
            <a
              href="#"
              style={{ outline: 'none' }}
              className="text-decoration-none text-reset"
              onClick={(e) => {
                e.preventDefault()
                handleClick('文創商品')
              }}
            >
              <div
                className="hover-card h-100 d-flex align-items-center p-4 rounded-0 overflow-hidden group"
                style={{ minHeight: '320px', backgroundColor: '#ebd0a5' }}
              >
                <div className="row w-100 align-items-center g-0 animate-slidein">
                  <div className="col-md-6 col-6 d-flex justify-content-center align-items-center">
                    <Image
                      src="/image/1.png"
                      alt="文創商品"
                      width={380}
                      height={285}
                      className="img-fluid rounded border-0"
                      style={{
                        minWidth: '310px',
                        maxWidth: '380px',
                        objectFit: 'contain',
                        transition: 'transform 0.4s ease',
                        position: 'relative',
                        top: '80px',
                        right: '80px',
                        height: 'auto',
                      }}
                    />
                  </div>
                  <div className="col-md-6 col-6 text-start">
                    <h1 className="fw-bold mb-3">文創商品</h1>
                    <p className="group-hover-opacity-100 transition-opacity">
                      融合創意與傳統，打造兼具匠心的精緻文創商品，為生活帶來藝術氣息與文化記憶。
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <div className="row g-0">
              {/* 餐廚用品 */}
              <div className="col-md-6">
                <a
                  href="#"
                  style={{ outline: 'none' }}
                  className="text-decoration-none text-reset"
                  onClick={(e) => {
                    e.preventDefault()
                    handleClick('餐廚用品')
                  }}
                >
                  <div
                    className="hover-card p-4 h-100 overflow-hidden group d-flex align-items-center"
                    style={{ minHeight: '320px', backgroundColor: '#EAEAEA' }}
                  >
                    <div className="row align-items-center g-0 animate-slidein">
                      <div className="col-6 d-flex justify-content-center">
                        <Image
                          src="/image/2.png"
                          alt="餐廚用品"
                          width={250}
                          height={250}
                          className="img-fluid border-0"
                          style={{
                            minWidth: '240px',
                            maxWidth: '250px',
                            objectFit: 'contain',
                            transition: 'transform 0.4s ease',
                            position: 'relative',
                            right: '80px',
                            top: '50px',
                            height: 'auto',
                            width: 'auto',
                          }}
                        />
                      </div>
                      <div className="col-6 text-start">
                        <h2 className="fw-bold mb-3">餐廚用品</h2>
                        <p className="small text-muted group-hover-opacity-100 transition-opacity">
                          美觀實用的陶瓷餐具，提升生活品質。
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              {/* 圖書影音 */}
              <div className="col-md-6">
                <a
                  href="#"
                  style={{ outline: 'none' }}
                  className="text-decoration-none text-reset"
                  onClick={(e) => {
                    e.preventDefault()
                    handleClick('圖書影音')
                  }}
                >
                  <div
                    className="hover-card p-4 h-100 overflow-hidden group d-flex align-items-center"
                    style={{ minHeight: '320px', backgroundColor: '#3f3f3f9a' }}
                  >
                    <div className="row align-items-center g-0 animate-slidein">
                      <div className="col-6 d-flex justify-content-center">
                        <Image
                          src="/image/3.png"
                          alt="圖書影音"
                          width={130}
                          height={195}
                          className="img-fluid border-0"
                          style={{
                            minWidth: '120px',
                            maxWidth: '130px',
                            objectFit: 'contain',
                            transition: 'transform 0.4s ease',
                            position: 'relative',
                            right: '40px',
                            top: '50px',
                            height: 'auto',
                            width: 'auto',
                          }}
                        />
                      </div>
                      <div className="col-6 text-start">
                        <h2 className="fw-bold mb-3">圖書影音</h2>
                        <p className="small text-muted group-hover-opacity-100 transition-opacity">
                          探索陶藝歷史與美學，感受文化深度。
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* 右側：典藏精品 */}
          <div className="col-lg-6">
            <a
              href="#"
              style={{ outline: 'none' }}
              className="text-decoration-none text-reset"
              onClick={(e) => {
                e.preventDefault()
                handleClick('典藏精品')
              }}
            >
              <div
                className="hover-card text-white h-100 d-flex align-items-center justify-content-between position-relative overflow-hidden group p-4"
                style={{ minHeight: '320px', backgroundColor: '#9B3413' }}
              >
                <div className="row align-items-center animate-slidein">
                  <div className="col-6 text-start text-lg-start">
                    <h1 className="fw-bold mb-3">典藏精品</h1>
                    <p className="group-hover-opacity-100 transition-opacity text-white">
                      匠藝與美學融合，限期入藏計畫展現文化創作，感受精緻收藏的非凡之美。
                    </p>
                  </div>
                  <div className="col-6 text-end">
                    <Image
                      src="/image/4.png"
                      alt="瓷器"
                      width={300}
                      height={300}
                      className="img-fluid border-0 zoom-on-hover"
                    />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
