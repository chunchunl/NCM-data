'use client'
import Navbar from '../../_components/navbar'
// import Footer from '../../_components/footer'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderSchema } from '@/app/_schemas/orderSchema'

//import icon
import { FaShoppingCart } from 'react-icons/fa'
import { MdOutlinePayment } from 'react-icons/md'
import { AiOutlineTruck } from 'react-icons/ai'

//import component
import Shipping from '../_components/Shipping'
import BuyerInfo from '../_components/BuyerInfo'
import Payment from '../_components/Payment'
import OrderSummary2 from '../_components/OrderSummary2'

// import style
import './checkout.scss'

export default function CartPage() {
  const router = useRouter()
  const [buyer, setBuyer] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [shipping, setShipping] = useState({
    shippingMethod: '宅配', // ✅ 預設值
    city: '',
    district: '',
    address: '',
    store: '',
  })
  const [payment, setPayment] = useState({
    paymentMethod: 'credit',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardHolder: '',
  })
  const [cartItems, setCartItems] = useState([])
  // console.log('shipping:', shipping)

  useEffect(() => {
    // 從 localStorage 拿購物車資料，假設 key 是 'cartItems'
    const storedCart = localStorage.getItem('cartItems')
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault() // 防止頁面重新整理
    const result = OrderSchema.safeParse({ ...buyer, ...shipping, ...payment })

    console.log('🚀 result.data:', result.data)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      alert('欄位錯誤：' + Object.values(errors)[0][0])
      return
    }

    // ✅ 資料合法 → 發送

    const orderData = {
      ...result.data,
      cartItems,
    }
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:3005/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 記得寫在Header裡面
        },
        body: JSON.stringify(orderData),
      })

      // ✅ 若不是 2xx，回傳 HTML，先取文字
      if (!response.ok) {
        const errorText = await response.text()
        console.error('伺服器錯誤：', errorText)
        alert(`伺服器錯誤 (${response.status})`)
        return
      }

      const res = await response.json()

      if (res.success) {
        router.push('/cart/order-success')
      } else {
        alert(`訂單建立失敗：${res.message}`)
      }
    } catch (err) {
      alert('網路錯誤，請稍後再試')
      console.error('fetch 錯誤:', err)
    }
  }

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
                    <FaShoppingCart /> 購物車
                  </div>
                </li>
                <li>
                  <div className="active">
                    <MdOutlinePayment /> 付款資訊
                  </div>
                </li>
                <li>
                  <div>
                    <AiOutlineTruck /> 完成訂單
                  </div>
                </li>
              </ul>
            </div>

            <div className="row">
              {/* 訂單資訊Title */}
              <div>
                <h3 className="mb-4 py-3 myOrder">付款資訊</h3>
              </div>
              {/* 左側收件人資料 */}
              <h4 className="mb-4">購買人資訊*</h4>
              <div className="col-md-8 col-12">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-4">
                    {/* 購買人資訊 */}
                    <BuyerInfo value={buyer} onChange={setBuyer} />
                    <Shipping value={shipping} onChange={setShipping} />
                    <Payment value={payment} onChange={setPayment} />
                  </div>

                  <div className="col-12 d-flex justify-content-between mt-4">
                    <a href="/cart" className="btn btn-dark px-5">
                      回到上一步
                    </a>
                    <button
                      id="orderBtn"
                      className="btn px-5"
                      style={{ backgroundColor: '#7b2d12', color: 'white' }}
                      type="submit"
                    >
                      前往付款
                    </button>
                  </div>
                </form>
              </div>

              {/* 右側訂單明細 */}
              <OrderSummary2 cartItems={cartItems} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
