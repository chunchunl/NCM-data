'use client'
import React, { useState, useEffect } from 'react'
import { FaFilter, FaSearch } from 'react-icons/fa'
import '../_styles/productFilter.scss'

export default function ProductListHeader() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [selectedFilters, setSelectedFilters] = useState({
    material: [],
    origin: [],
    function: [],
  })

  const openFilterPanel = () => setIsFilterOpen(true)
  const closeFilterPanel = () => setIsFilterOpen(false)

  const toggleFilter = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }))
  }

  const clearFilters = () => {
    setMinPrice(0)
    setMaxPrice(10000)
    setSelectedFilters({ material: [], origin: [], function: [] })
  }

  const applyFilters = () => {
    console.log('套用篩選：', { minPrice, maxPrice, selectedFilters })
    closeFilterPanel()
  }

  const handleMinPriceChange = (e) => {
    const newMinPrice = Number(e.target.value)
    setMinPrice(newMinPrice)
  }

  const handleMaxPriceChange = (e) => {
    const newMaxPrice = Number(e.target.value)
    setMaxPrice(newMaxPrice)
  }

  const rangePercent = () => {
    const min = Math.min(minPrice, maxPrice)
    const max = Math.max(minPrice, maxPrice)
    const minPct = (min / 10000) * 100
    const maxPct = (max / 10000) * 100
    return { left: `${minPct}%`, width: `${maxPct - minPct}%` }
  }

  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [isFilterOpen])

  return (
    <div className="container py-2">
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-3">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="搜尋商品..."
            />
          </div>
        </div>
        <div className="col-12 col-md-3">
          <select className="form-select">
            <option value="">排序</option>
            <option value="price-asc">價格低到高</option>
            <option value="price-desc">價格高到低</option>
            <option value="newest">最新上架</option>
          </select>
        </div>
        <div className="col-12 col-md-3">
          <button
            className="btn-add btn btn-primary p-3"
            onClick={openFilterPanel}
          >
            <FaFilter className="me-2 " />
            篩選
          </button>
        </div>
      </div>

      <div className={`filter-panel ${isFilterOpen ? 'show' : ''}`}>
        <button
          className="btn-close position-absolute top-0 end-0 m-3"
          aria-label="Close"
          onClick={closeFilterPanel}
        ></button>
        <h5 className="mb-3">篩選條件</h5>

        <div className="mb-4">
          <label className="form-label">價格範圍(請選擇價格區間)</label>
          <div className="range-container">
            <div className="range-track"></div>
            <div className="range-selected" style={rangePercent()}></div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
          <div className="text-center mt-2">
            價格：NT${Math.min(minPrice, maxPrice)} ~ NT$
            {Math.max(minPrice, maxPrice)}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">材質</label>
          <div className="filter-button-group">
            {[
              { type: 'material', value: 'ceramic', label: '陶瓷' },
              { type: 'material', value: 'glass', label: '玻璃' },
              { type: 'material', value: 'metal', label: '琉璃' },
              { type: 'material', value: 'bronze', label: '青銅' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn btn-outline-primary filter-btn ${
                  selectedFilters.material.includes(option.value)
                    ? 'active'
                    : ''
                }`}
                onClick={() => toggleFilter(option.type, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">生產地</label>
          <div className="filter-button-group">
            {[
              { type: 'origin', value: 'tw', label: '台灣' },
              { type: 'origin', value: 'jp', label: '日本' },
              { type: 'origin', value: 'cn', label: '中國' },
              { type: 'origin', value: 'kr', label: '韓國' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn btn-outline-primary filter-btn ${
                  selectedFilters.origin.includes(option.value) ? 'active' : ''
                }`}
                onClick={() => toggleFilter(option.type, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">功能</label>
          <div className="filter-button-group">
            {[
              { type: 'function', value: 'decor', label: '擺飾' },
              { type: 'function', value: 'utility', label: '盤杯組' },
              { type: 'function', value: 'collection', label: '收藏品' },
              { type: 'function', value: 'other', label: '其他' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn btn-outline-primary filter-btn ${
                  selectedFilters.function.includes(option.value)
                    ? 'active'
                    : ''
                }`}
                onClick={() => toggleFilter(option.type, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-secondary w-50" onClick={clearFilters}>
            清除篩選
          </button>
          <button className="btn btn-primary w-50" onClick={applyFilters}>
            套用篩選
          </button>
        </div>
      </div>

      <div
        className={`overlay ${isFilterOpen ? 'show' : ''}`}
        onClick={closeFilterPanel}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            closeFilterPanel()
          }
        }}
      ></div>
    </div>
  )
}
