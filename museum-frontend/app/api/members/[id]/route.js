import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json(
        { success: false, message: '未提供認證令牌' },
        { status: 401 }
      )
    }

    // 這裡應該調用後端 API 獲取會員信息
    // const response = await fetch(`http://localhost:3005/api/members/${params.id}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // })
    // const data = await response.json()

    // 模擬成功響應
    return NextResponse.json({
      success: true,
      data: {
        id: params.id,
        name: '測試用戶',
        email: 'test@example.com',
        role: 'member',
        created_at: new Date().toISOString(),
        profile: {
          phone: '0912345678',
          address: '測試地址',
          birthday: '1990-01-01'
        }
      }
    })
  } catch (error) {
    console.error('獲取會員信息錯誤:', error)
    return NextResponse.json(
      { success: false, message: '獲取會員信息失敗' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]
    const body = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, message: '未提供認證令牌' },
        { status: 401 }
      )
    }

    // 這裡應該調用後端 API 更新會員信息
    // const response = await fetch(`http://localhost:3005/api/members/${params.id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(body)
    // })
    // const data = await response.json()

    // 模擬成功響應
    return NextResponse.json({
      success: true,
      message: '更新成功',
      data: {
        ...body,
        id: params.id,
        email: 'test@example.com',
        role: 'member',
        created_at: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('更新會員信息錯誤:', error)
    return NextResponse.json(
      { success: false, message: '更新會員信息失敗' },
      { status: 500 }
    )
  }
} 