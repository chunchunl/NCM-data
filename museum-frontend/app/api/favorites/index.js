// app/api/favorites/index.js 

import * as course from './courses'
import * as product from './products'
import * as exhibition from './exhibitions'

const map = { course, product, exhibition }

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getFavoritesByType(type, memberId) {
  return map[type]?.[`get${capitalize(type)}Favorites`](memberId)
}

export function addFavoriteByType(type, memberId, itemId) {
  return map[type]?.[`add${capitalize(type)}Favorite`](memberId, itemId)
}

export function removeFavoriteByType(type, memberId, itemId) {
  return map[type]?.[`remove${capitalize(type)}Favorite`](memberId, itemId)
}
