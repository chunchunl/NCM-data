// // museum-frontend/app/api/members/auth/firebase/route.js
// import { NextResponse } from 'next/server'

// export async function POST(request) {
//   try {
//     const body = await request.json()
//     const { uid, email, displayName, photoURL } = body

//     if (!uid || !email) {
//       return NextResponse.json(
//         { success: false, message: '缺少必要的用戶信息' },
//         { status: 400 }
//       )
//     }

//     // 調用後端 API 進行 Firebase 驗證
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/auth/firebase`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         uid,
//         email,
//         displayName,
//         photoURL
//       })
//     })

//     const data = await response.json()

//     if (!response.ok) {
//       return NextResponse.json(
//         { success: false, message: data.message || '驗證失敗' },
//         { status: response.status }
//       )
//     }

//     // 設置 cookie 或返回 token
//     const response = NextResponse.json(data)
    
//     // 如果需要設置 cookie
//     if (data.token) {
//       response.cookies.set('token', data.token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 7 * 24 * 60 * 60 // 7 天
//       })
//     }

//     return response
//   } catch (error) {
//     console.error('Firebase 驗證錯誤:', error)
//     return NextResponse.json(
//       { success: false, message: '驗證失敗' },
//       { status: 500 }
//     )
//   }
// }