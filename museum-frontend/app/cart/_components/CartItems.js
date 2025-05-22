import CartItem from './CartItem'

export default function CartItems({ items, updateQuantity, deleteItem }) {
  const productItems = items.filter((item) => item.type === 'product')
  const courseItems = items.filter((item) => item.type === 'course')

  return (
    <div className="col-md-8 col-12">
      <div className="card p-3 mb-5 shadow-sm">
        <div className="card-body">
          <div className="pb-2 fs-4">商品列表</div>
          <div className="container mb-4">
            {productItems.map((item) => (
              <CartItem
                key={item.id}
                imageSrc={item.imageSrc}
                title={item.title}
                price={item.price}
                quantity={item.quantity}
                subtotal={item.price * item.quantity}
                onQuantityChange={(delta) => updateQuantity(item.id, delta)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </div>

          <div className="pb-2 fs-4">課程列表</div>
          <div className="container">
            {courseItems.map((item) => (
              <CartItem
                key={item.id}
                imageSrc={item.imageSrc}
                title={item.title}
                price={item.price}
                quantity={item.quantity}
                subtotal={item.price * item.quantity}
                onQuantityChange={(delta) => updateQuantity(item.id, delta)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
