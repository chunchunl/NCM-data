'use client'

import { useEffect, useState } from 'react'

export default function MemberOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')

        const member = JSON.parse(localStorage.getItem('member') || '{}')
        const memberId = member.id

        const res = await fetch(
          `http://localhost:3005/api/orders/${memberId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json()
        if (data.success) {
          setOrders(data.orders)
        } else {
          alert(data.message || '載入訂單失敗')
        }
      } catch (error) {
        console.error('查詢訂單失敗:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) return <p>載入中...</p>
  if (orders.length === 0) return <p>尚無訂單紀錄</p>

  return (
    <div className="container mt-5">
      <h2>📦 我的訂單</h2>
      {orders.map((order) => (
        <div key={order.id} className="card p-3 my-3 shadow-sm">
          <h5>訂單編號：{order.order_number}</h5>
          <p>日期：{new Date(order.created_at).toLocaleString()}</p>
          <p>收件人：{order.recipient_name}</p>
          <p>付款方式：{order.payment_method}</p>
          <p>運送方式：{order.shipping_method}</p>
          <p>地址：{order.recipient_address}</p>
          <h6>內容：</h6>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.item_type === 'product' ? '🛒 商品' : '🎓 課程'}：
                {item.item_id}（{item.price} x {item.quantity}）
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
