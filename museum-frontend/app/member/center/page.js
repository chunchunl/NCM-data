// museum-frontend/app/member/center/page.jsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/_components/ToastManager'
import { useAuth } from '@/app/_hooks/useAuth'
// import { useAuth } from '../../_components/Auth/AuthProvider'

import styles from './styles/center.module.scss'
import LeftSidebar from './features/sidebar/LeftSidebar'
import LowContent from './features/cover/LowContent'
import RightContent from './features/lottery/RightContent'

// 分頁元件
import ProfileTab from './features/tabs/ProfileTab'
import OrdersTab from './features/tabs/OrdersTab'
import CouponsTab from './features/tabs/CouponsTab'
import FavoritesTab from './features/tabs/FavoritesTab'

export default function MemberCenter() {
  const router = useRouter()
  const { showToast } = useToast()
  const {
    member,
    token,
    isLoggedIn,
    isLoading: authLoading,
    updateMember,
  } = useAuth()

  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    address: '',
    birthday: '',
  })

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/')
    }
  }, [authLoading, isLoggedIn, router])

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        gender: member.gender || '',
        phone: member.phone || '',
        address: member.address || '',
        birthday: member.birthday || '',
      })
    }
  }, [member])

  // 編輯
  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: member.name || '',
      gender: member.gender || '',
      phone: member.phone || '',
      address: member.address || '',
      birthday: member.birthday || '',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 上傳頭像
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', '圖片大小不能超過 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      showToast('error', '請上傳圖片檔案')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      console.log('開始上傳頭像...')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/profile/avatar`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      console.log('收到回應:', res.status)
      const data = await res.json()
      console.log('回應數據:', data)

      if (data.success && data.data.avatarUrl) {
        const newAvatarUrl = data.data.avatarUrl.startsWith('http')
          ? data.data.avatarUrl
          : `${process.env.NEXT_PUBLIC_API_URL}${data.data.avatarUrl}`

        console.log('新的頭像 URL:', newAvatarUrl)

        const updatedMember = {
          ...member,
          avatar: newAvatarUrl,
        }
        updateMember(updatedMember)
        showToast('success', '頭像更新成功')
      } else {
        showToast('error', data.message || '上傳失敗')
      }
    } catch (error) {
      console.error('頭像上傳錯誤:', error)
      showToast('error', '上傳失敗，請稍後再試')
    }
  }

  // 更新會員資料
  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     console.log('Token:', token) // 檢查 token 是否存在
  //     console.log('發送更新請求:', formData)

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/members/profile`,
  //       {
  //         method: 'PUT',
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           ...formData,
  //           avatar: member.avatar, // 添加 avatar 欄位
  //         }),
  //       }
  //     )

  //     console.log('Response status:', response.status) // 檢查響應狀態
  //     const data = await response.json()
  //     console.log('收到回應:', data)

  //     if (!response.ok) {
  //       throw new Error(data.message || '更新失敗')
  //     }

  //     updateMember({
  //       ...member,
  //       ...data.data,
  //     })

  //     showToast('success', '資料更新成功')
  //   } catch (error) {
  //     console.error('更新失敗:', error)
  //     showToast('error', error.message || '更新失敗')
  //   }
  // }

  const handleSubmit = async (formData) => {
    try {
      console.log('Token:', token)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/profile`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // 直接發送 FormData
        }
      )

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('收到回應:', data)

      if (!response.ok) {
        throw new Error(data.message || '更新失敗')
      }

      updateMember({
        ...member,
        ...data.data,
      })

      showToast('success', '資料更新成功')
    } catch (error) {
      console.error('更新失敗:', error)
      showToast('error', error.message || '更新失敗')
    }
  }

  // 渲染主內容
  const renderMainContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab
            member={member}
            isEditing={isEditing}
            formData={formData}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onAvatarUpload={handleAvatarUpload} // 新增這行
          />
        )
      case 'orders':
        return <OrdersTab />
      case 'coupons':
        return <CouponsTab />
      case 'favorites':
        return <FavoritesTab />
      default:
        return <div>找不到此頁面</div>
    }
  }

  // 載入中
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    )
  }

  // 未登入
  if (!isLoggedIn) {
    return null
  }

  // 渲染頁面
  return (
    <>

      <div className={styles.lowContent}>
        <LowContent />
      </div>
      <div className={styles.leftSidebar}>
        <LeftSidebar
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          member={member || {}}
          // onAvatarUpload={handleAvatarUpload}
        />
      </div>
      <main className={styles.mainContent}>{renderMainContent()}</main>
      <div className={styles.rightContent}>
        <RightContent />
      </div>
    </>
  )
}