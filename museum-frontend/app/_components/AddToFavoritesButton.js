// app/_components/AddToFavoritesButton.js
// 收藏按鈕

import { useState, useEffect } from 'react'
import { FaRegBookmark, FaBookmark } from 'react-icons/fa'

const AddToFavoritesButton = ({
  itemId,
  itemType, // 'product' | 'course' | 'exhibition'
  isFavorite: initialIsFavorite,
  onToggleFavorite,
  // 百慕達三角地帶
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false)

  useEffect(() => {
    setIsFavorite(initialIsFavorite || false)
  }, [initialIsFavorite])

  const toggleFavorite = () => {
    const newState = !isFavorite
    setIsFavorite(newState)
    if (onToggleFavorite) {
      onToggleFavorite(itemId, itemType, newState)
    }
  }

  return (
    <button
      className="btn-icon favorite-button d-flex align-items-center px-1 py-1"
      onClick={toggleFavorite}
      title={isFavorite ? '取消收藏' : '加入收藏'}
    >
      {isFavorite ? <FaBookmark className="text-danger" /> : <FaRegBookmark />}
    </button>
  )
}

export default AddToFavoritesButton
// 匯出收藏按鈕
