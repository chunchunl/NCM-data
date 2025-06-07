'use client'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/_context/CartContext'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Navbar from '../../_components/navbar'
import Footer3 from '../../_components/footer3'
import './orderSuccess.scss'

export default function CartSuccessPage() {
  const router = useRouter()
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    localStorage.removeItem('store711')
    localStorage.removeItem('cartDiscount')
  }, [])

  const handleViewOrders = () => {
    router.push('/member/center?tab=orders')
    // router.push('/member/center#orders')
  }

  const handleBackHome = () => {
    router.push('/')
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5 py-5">
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
                <p>感謝您的訂購!</p>
                <p>我們會盡快處理您的訂單。</p>
                <p>如果您有任何問題，請隨時聯繫我們的客服團隊。</p>
                <p>祝您有美好的一天!</p>
                <div className="mt-4 text-center">
                  <button
                    className="btn btn-primary m-1"
                    onClick={handleViewOrders}
                  >
                    查看訂單
                  </button>
                  <button
                    className="btn btn-outline-primary m-1"
                    onClick={handleBackHome}
                  >
                    返回首頁
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer3 />
    </>
  )
}
