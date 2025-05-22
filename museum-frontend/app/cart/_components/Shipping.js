'use client'

import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'

import React, { useEffect, useState } from 'react'
import twzipcode from 'twzipcode-data'

export default function Shipping({ value, onChange }) {
  const [cities, setCities] = useState([])
  const [zipcodes, setZipcodes] = useState([])
  const [districts, setDistricts] = useState([])
  const methodMap = {
    home: '宅配',
    store: '超商',
  }

  useEffect(() => {
    const data = twzipcode()
    setCities(data.counties)
    setZipcodes(data.zipcodes)
  }, [])

  // 同步父層選擇縣市的狀態
  const handleCityChange = (e) => {
    const cityName = e.target.value
    // 更新區域清單
    const filteredDistricts = zipcodes.filter((z) => z.county === cityName)
    setDistricts(filteredDistricts)
    // 回傳父層
    onChange({
      ...value,
      city: cityName,
      district: '', // 縣市改變區域清空
    })
  }

  // 區域改變
  const handleDistrictChange = (e) => {
    onChange({
      ...value,
      district: e.target.value,
    })
  }

  // 取貨方式切換
  const selectedMethod =
    Object.entries(methodMap).find(
      ([, val]) => val === value.shippingMethod
    )?.[0] || ''

  const selectShipping = (key) => {
    const method = methodMap[key]
    onChange({
      ...value,
      shippingMethod: method,
      // 若切換到超商，就清掉地址區欄位；反之亦然
      ...(method === '宅配'
        ? { store: '' }
        : { city: '', district: '', address: '' }),
    })
  }

  // 地址輸入
  const handleAddressChange = (e) => {
    onChange({
      ...value,
      address: e.target.value,
    })
  }

  // 超商門市輸入
  const handleStoreChange = (e) => {
    onChange({
      ...value,
      store: e.target.value,
    })
  }

  return (
    <div className="col-md-12">
      <h4 className="mb-4">付款與取貨方式*</h4>
      <Accordion defaultActiveKey="home">
        {/* 宅配 */}
        <Accordion.Item eventKey="home" className="accordion-item-shipping">
          <Accordion.Header onClick={() => selectShipping('home')}>
            <div className="d-flex align-items-center w-100">
              <input
                className="form-check-input me-2 m-0"
                type="radio"
                name="shipping"
                id="homeRadio"
                checked={selectedMethod === 'home'}
                onChange={() => selectShipping('home')}
              />
              <label htmlFor="homeRadio" className="mb-0">
                宅配到府
              </label>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <div className="row mb-3">
              <div className="col">
                <label>縣市</label>
                <select
                  className="form-select"
                  onChange={handleCityChange}
                  value={value.city || ''}
                >
                  <option value="">請選擇縣市</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <label>區域</label>
                <select
                  className="form-select"
                  onChange={handleDistrictChange}
                  value={value.district || ''}
                  disabled={!value.city}
                >
                  <option value="">請選擇區域</option>
                  {districts.map((d) => (
                    <option key={`${d.zipcode}-${d.city}`} value={d.city}>
                      {d.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label>地址</label>
              <input
                type="text"
                className="form-control"
                placeholder="輸入詳細地址"
                value={value.address || ''}
                onChange={handleAddressChange}
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* 超商 */}
        <Accordion.Item eventKey="store" className="accordion-item-shipping">
          <Accordion.Header onClick={() => selectShipping('store')}>
            <div className="d-flex align-items-center w-100">
              <input
                className="form-check-input me-2 m-0"
                type="radio"
                name="shipping"
                id="storeRadio"
                checked={selectedMethod === 'store'}
                onChange={() => selectShipping('store')}
              />
              <label htmlFor="storeRadio" className="mb-0">
                超商取貨
              </label>
            </div>
          </Accordion.Header>
          <Accordion.Body className="accordion-body-shipping">
            <label>門市名稱或編號</label>
            <input
              type="text"
              className="form-control"
              placeholder="請輸入您要取貨的門市（例如：7-11 光明店）"
              value={value.store || ''}
              onChange={handleStoreChange}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
