'use client'

import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'

import React from 'react'
import Image from 'next/image'

export default function Payment({ value, onChange }) {
  const selectedMethod = value.paymentMethod || 'credit'

  const selectPayment = (method) => {
    onChange({
      ...value,
      paymentMethod: method,
    })
  }

  return (
    <div className="col-md-12">
      <Accordion defaultActiveKey="credit">
        {/* 信用卡 */}
        <Accordion.Item eventKey="credit" className="accordion-item-payment">
          <Accordion.Header onClick={() => selectPayment('credit')}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex align-items-center">
                <input
                  className="form-check-input me-2 m-0"
                  type="radio"
                  name="payment"
                  id="creditRadio"
                  checked={selectedMethod === 'credit'}
                  onChange={() => selectPayment('credit')}
                />
                <label htmlFor="creditRadio" className="mb-0">
                  信用卡付款
                </label>
              </div>
              <div className="ms-auto d-flex gap-2">
                <Image
                  alt="VISA"
                  src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/visa.sxIq5Dot.svg"
                  width={40}
                  height={25}
                />
                <Image
                  alt="MASTERCARD"
                  src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/mastercard.1c4_lyMp.svg"
                  width={40}
                  height={25}
                />
                <Image
                  alt="JCB"
                  src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.en/assets/jcb.BgZHqF0u.svg"
                  width={40}
                  height={25}
                />
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            {/* 卡號輸入 */}
            <input
              className="form-control mb-2"
              placeholder="卡片號碼"
              value={value.cardNumber || ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '') // 移除非數字
                const formatted =
                  raw
                    .slice(0, 16)
                    .match(/.{1,4}/g) // 每4碼一組
                    ?.join(' ') || ''
                onChange({ ...value, cardNumber: formatted })
              }}
            />

            {/* 有效期限 */}
            <div className="row">
              <div className="col">
                <input
                  className="form-control mb-2"
                  placeholder="有效期限 (MM/YY)"
                  value={value.cardExpiry || ''}
                  onChange={(e) => {
                    let raw = e.target.value.replace(/\D/g, '').slice(0, 4)
                    if (raw.length >= 3) {
                      raw = raw.slice(0, 2) + '/' + raw.slice(2)
                    }
                    onChange({ ...value, cardExpiry: raw })
                  }}
                />
              </div>

              {/* CVC */}
              <div className="col">
                <input
                  className="form-control mb-2"
                  placeholder="安全碼"
                  value={value.cardCVC || ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 3)
                    onChange({ ...value, cardCVC: raw })
                  }}
                />
              </div>
            </div>

            {/* 持卡人姓名 */}
            <input
              className="form-control mb-2"
              placeholder="持卡人姓名"
              value={value.cardHolder || ''}
              onChange={(e) =>
                onChange({ ...value, cardHolder: e.target.value })
              }
            />
          </Accordion.Body>
        </Accordion.Item>

        {/* LinePay */}
        <Accordion.Item eventKey="linepay" className="accordion-item-payment">
          <Accordion.Header onClick={() => selectPayment('linepay')}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex align-items-center">
                <input
                  className="form-check-input me-2 m-0"
                  type="radio"
                  name="payment"
                  id="linepayRadio"
                  checked={selectedMethod === 'linepay'}
                  onChange={() => selectPayment('linepay')}
                />
                <label htmlFor="linepayRadio" className="mb-0">
                  LINE Pay付款
                </label>
              </div>
              <div className="ms-auto d-flex gap-2">
                <Image
                  src="/images/LINE-Pay.png"
                  alt="LINE Pay"
                  width={80}
                  height={25}
                />
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body className="accordion-body-payment">
            您將被導向 LinePay 完成付款。
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
