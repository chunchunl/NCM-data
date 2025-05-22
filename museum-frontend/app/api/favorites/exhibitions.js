// app/api/favorites/exhibitions.js

import axios from 'axios'

// const BASE = '/api/favorites/exhibitions'
const BASE = 'http://localhost:3005/api/favorites/exhibitions'


// ✅ 加入收藏
export async function addExhibitionFavorite(memberId, exhibitionId) {
  return axios.post(BASE, { memberId, exhibitionId })
}

// ✅ 移除收藏
export async function removeExhibitionFavorite(memberId, exhibitionId) {
  return axios.delete(BASE, { data: { memberId, exhibitionId } })
}

// ✅ 取得收藏清單
export async function getExhibitionFavorites(memberId) {
  return axios.post('http://localhost:3005/api/favorites/exhibitions/list', {
    memberId,
  })
}

