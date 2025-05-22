// // museum-frontend/app/api/members/[id]/route.js
// import { NextResponse } from 'next/server'

// export async function GET(request, { params }) {
//   try {
//     const token = request.headers.get('Authorization')?.split(' ')[1]

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: '未提供認證令牌' },
//         { status: 401 }
//       )
//     }

//     // 調用後端 API 獲取會員信息
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/${params.id}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })
    
//     const data = await response.json()
    
//     if (!response.ok) {
//       return NextResponse.json(
//         { success: false, message: data.message || '獲取會員信息失敗' },
//         { status: response.status }
//       )
//     }

//     return NextResponse.json(data)
//   } catch (error) {
//     console.error('獲取會員信息錯誤:', error)
//     return NextResponse.json(
//       { success: false, message: '獲取會員信息失敗' },
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(request, { params }) {
//   try {
//     const token = request.headers.get('Authorization')?.split(' ')[1]
//     const body = await request.json()

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: '未提供認證令牌' },
//         { status: 401 }
//       )
//     }

//     // 調用後端 API 更新會員信息
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/${params.id}`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(body)
//     })
    
//     const data = await response.json()
    
//     if (!response.ok) {
//       return NextResponse.json(
//         { success: false, message: data.message || '更新會員信息失敗' },
//         { status: response.status }
//       )
//     }

//     return NextResponse.json(data)
//   } catch (error) {
//     console.error('更新會員信息錯誤:', error)
//     return NextResponse.json(
//       { success: false, message: '更新會員信息失敗' },
//       { status: 500 }
//     )
//   }
// }