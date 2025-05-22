// components/OrderSummary.js

export default function OrderSummary({ items }) {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const discount = 200 // 假設固定折扣
  const finalAmount = totalAmount - discount

  return (
    <div className="col-md-4 col-12">
      <div
        className="card sticky-top p-3"
        style={{ position: 'sticky', top: '66px', zIndex: 11 }}
      >
        <div className="card-body">
          <div className="card-title fs-4 mb-4">訂單資訊</div>
          <div className="mb-3">
            <label className="form-label">優惠券</label>
            <select
              id="productshipping"
              className="form-select mb-2"
              defaultValue=""
            >
              <option value="none">請選擇商品優惠券</option>
              <option value="coupon1">優惠券1</option>
              <option value="coupon2">優惠券2</option>
            </select>
            <select id="courseshipping" className="form-select" defaultValue="">
              <option value="none">請選擇課程優惠券</option>
              <option value="coupon1">優惠券1</option>
              <option value="coupon2">優惠券2</option>
            </select>
          </div>
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-2">
              <div>商品小計</div>
              <div>${totalAmount}</div>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <div>折扣</div>
              <div>-${discount}</div>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>合計</span>
              <strong>${finalAmount}</strong>
            </div>
          </div>

          <a href="/cart/checkout" className="btn btn-checkout w-100">
            前往結帳
          </a>
        </div>
      </div>
    </div>
  )
}
