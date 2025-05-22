// app/member/center/features/tabs/favorites/_components/FavoriteCard.js

import Link from 'next/link'
import AddToFavoritesButton from '@/app/_components/AddToFavoritesButton'

export default function FavoriteCard({ item, type, onRemove }) {
  const detailPath = {
    product: `/products/${item.id}`,
    course: `/courses/${item.id}`,
    exhibition: `/exhibitions/${item.id}`,
  }

  return (
    <div className="col-12 col-md-4 mb-3">
      <div className="card position-relative">
        {/* 收藏按鈕獨立於 Link 外 */}
        <div
          className="position-absolute top-0 end-0 m-2 z-3"
          onClick={(e) => e.stopPropagation()}
        >
          <AddToFavoritesButton
            itemId={item.id}
            itemType={type}
            isFavorite={true}
            onToggleFavorite={(_, __, state) => {
              if (!state && onRemove) onRemove(item.id)
            }}
          />
        </div>

        {/* 只有這部分可以跳轉 */}
        <Link
          href={detailPath[type]}
          className="text-decoration-none text-dark"
        >
          <img
            src={`/images/${item.image}`}
            className="card-img-top"
            alt={item.title || item.name}
          />
          <div className="card-body">
            <h6 className="card-title fw-bold">{item.title || item.name}</h6>
            <h6>
              {item.startDate.slice(0, 10)} ~ {item.endDate.slice(0, 10)}
            </h6>
          </div>
        </Link>
      </div>
    </div>
  )
}
