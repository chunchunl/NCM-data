import React from 'react'

export default function BuyerInfo({ value, onChange }) {
  const handleChange = (e) => {
    const { name, value: newValue } = e.target
    onChange({
      ...value,
      [name]: newValue,
    })
  }

  return (
    <div className="col-md-12">
      <div className="border card p-3">
        <label htmlFor="name" className="form-label fw-bold">
          購買人姓名:
        </label>
        <input
          type="text"
          name="name"
          value={value.name || ''}
          onChange={handleChange}
          className="form-control mb-3"
          placeholder="請輸入真實姓名"
          required
        />

        <label htmlFor="phone" className="form-label fw-bold">
          連絡電話:
        </label>
        <input
          type="text"
          name="phone"
          value={value.phone || ''}
          onChange={handleChange}
          className="form-control mb-3"
          placeholder="輸入手機號碼"
          required
        />

        <label htmlFor="email" className="form-label fw-bold">
          連絡信箱:
        </label>
        <input
          type="email"
          name="email"
          value={value.email || ''}
          onChange={handleChange}
          className="form-control mb-3"
          placeholder="輸入電子信箱"
          required
        />
      </div>
    </div>
  )
}
