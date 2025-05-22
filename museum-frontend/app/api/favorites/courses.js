// app/member/center/features/tabs/favorites/api/courses.js
import axios from 'axios'

const BASE = 'http://localhost:3005/api/favorites/courses'

export async function getCourseFavorites(memberId) {
  const res = await axios.get(`${BASE}/${memberId}`)
  return res.data.data
}

export async function addCourseFavorite(memberId, courseId) {
  return axios.post(BASE, { memberId, courseId })
}

export async function removeCourseFavorite(memberId, courseId) {
  return axios.delete(BASE, {
    data: { memberId, courseId },
  })
}
