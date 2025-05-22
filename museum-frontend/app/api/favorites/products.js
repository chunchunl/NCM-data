// app/member/center/features/tabs/favorites/api/products.js
import axios from 'axios'

const BASE = 'http://localhost:3005/api/favorites/products'

export async function getProductFavorites(memberId) {
  const res = await axios.get(`${BASE}/${memberId}`)
  return res.data.data
}

export async function addProductFavorite(memberId, productId) {
  return axios.post(BASE, { memberId, productId })
}

export async function removeProductFavorite(memberId, productId) {
  return axios.delete(BASE, {
    data: { memberId, productId },
  })
}
