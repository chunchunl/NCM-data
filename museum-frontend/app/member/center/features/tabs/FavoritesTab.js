// app/member/center/features/tabs/favorites/FavoritesTab.js
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/_hooks/useAuth'
import { getFavoritesByType, removeFavoriteByType } from '@/app/api/favorites'
import FavoriteCard from './_components/FavoriteCard'

export default function FavoritesTab() {
  const { member } = useAuth()
  const memberId = member?.id
  const [type, setType] = useState('product') // ← 加這行
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchFavorites = async () => {
    if (!memberId || !type) return
    setIsLoading(true)
    try {
      const result = await getFavoritesByType(type, memberId)
      console.log('✅ 收藏資料：', result)
      // setData(result.data || [])  // ← 這一定要改成 .data
      // 注意這裡取 result.data.data 才是真正資料
      setData(result?.data?.data || [])
    } catch (err) {
      console.error('❌ 取得收藏失敗', err)
    } finally {
      setIsLoading(false)
    }
  }
  console.log('⭐ data 中的收藏：', data)

  useEffect(() => {
    fetchFavorites()
  }, [type, memberId])

  const handleRemove = async (itemId) => {
    await removeFavoriteByType(type, memberId, itemId)
    setData((prev) => prev.filter((item) => item.id !== itemId))
  }

  return (
    <>
      <div className="tabs mb-3">
        <button
          onClick={() => setType('product')}
          className="btn btn-primary me-2"
        >
          商品
        </button>
        <button
          onClick={() => setType('course')}
          className="btn btn-primary me-2"
        >
          課程
        </button>
        <button
          onClick={() => setType('exhibition')}
          className="btn btn-primary"
        >
          展覽
        </button>
      </div>

      {isLoading ? (
        <p className="text-center py-5">載入中...</p>
      ) : (
        <div className="row">
          {data.length > 0 ? (
            data.map((item) => (
              <FavoriteCard
                key={item.id}
                item={item}
                type={type}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <p className="text-center py-5 text-muted">
              尚未收藏任何
              {type === 'product'
                ? '商品'
                : type === 'course'
                  ? '課程'
                  : '展覽'}
              。
            </p>
          )}
        </div>
      )}
    </>
  )
}
