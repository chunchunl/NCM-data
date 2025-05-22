'use client'
import Navbar from '../../_components/navbar'
import React, { useEffect } from 'react'
import Image from 'next/image'
import './orderSuccess.scss'

export default function CartSuccessPage() {
  useEffect(() => {
    localStorage.removeItem('cartItems')
  }, [])

  return (
    <>
      <Navbar />
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* 購買流程 */}
            <div className="crumbs">
              <ul>
                <li>
                  <div>
                    <i className="fa fa-cart-plus"></i> 購物車
                  </div>
                </li>
                <li>
                  <div>
                    <i className="fa-regular fa-credit-card"></i> 付款資訊
                  </div>
                </li>
                <li>
                  <div className="active">
                    <i className="fa-solid fa-truck"></i> 完成訂單
                  </div>
                </li>
              </ul>
            </div>

            {/* 訂單資訊內容 */}
            <div className="text-center mt-4 mb-4 custom-border">
              <Image
                className="img-fluid"
                width={80}
                height={20}
                src="/cart-img/check.png"
                alt="check icon"
              />
            </div>

            <div>
              <h3 className="mt-5 text-center">訂單已成功建立!</h3>
            </div>

            <div className="row justify-content-center mt-4 mb-4">
              <div className="col-md-6 text-center mt-4 mb-4">
                <h5>感謝您的訂購!</h5>
                <p>我們會盡快處理您的訂單，並發送確認郵件給您。</p>
                <p>如果您有任何問題，請隨時聯繫我們的客服團隊。</p>
                <p>祝您有美好的一天!</p>
                <div className="mt-4 text-center">
                  <a className="btn btn-block m-1" href="#">
                    查看訂單
                  </a>
                  <a className="btn btn-block m-1" href="#">
                    返回首頁
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
