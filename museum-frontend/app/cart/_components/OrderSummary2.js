'use client'

import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'

export default function OrderSummary2({ cartItems }) {
  // cartItems 範例格式：
  // [{ id, name, quantity, price, discount }, ...]

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const totalDiscount = cartItems.reduce(
    (sum, item) => sum + (item.discount || 0),
    0
  )
  const shippingFee = 50
  const finalTotal = totalPrice - totalDiscount + shippingFee

  return (
    <div className="col-md-4 col-12 mb-4">
      <div
        className="card sticky-top p-3"
        style={{ position: 'sticky', top: '66px', zIndex: 10 }}
      >
        <div className="card-body">
          <div
            className="fs-4 mb-4 pb-3"
            style={{ borderBottom: '2px solid #000' }}
          >
            訂單資訊
          </div>

          <Accordion defaultActiveKey="0" className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>查看商品詳情</Accordion.Header>
              <Accordion.Body>
                {cartItems.map((item) => (
                  <div className="d-flex justify-content-between" key={item.id}>
                    <div>
                      {item.title}*{item.quantity}
                    </div>
                    <div>${(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}

                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <div>小計</div>
                  <div>${totalPrice.toLocaleString()}</div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* 這邊你可以加入課程或其他明細，或移除 */}

          {/* 總結金額 */}
          <div className="mt-4">
            <div className="d-flex justify-content-between">
              <div>商品總金額</div>
              <div>${(totalPrice - totalDiscount).toLocaleString()}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div>折扣優惠</div>
              <div>${totalDiscount}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div>運費</div>
              <div>${shippingFee}</div>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <div>合計</div>
              <div>${finalTotal.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
