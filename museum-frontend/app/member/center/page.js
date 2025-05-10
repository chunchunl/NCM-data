'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/app/_components/ToastManager'
import '@/app/_styles/globals.scss'
import '@/app/_styles/formCustom.scss'
import '@/app/_styles/memberCenter.scss'

export default function MemberCenter() {
  const router = useRouter()
  const { showToast } = useToast()
  const [member, setMember] = useState({
    avatar: 'null',
    name: '',
    email: '',
    gender: 'null',
    phone: 'null',
    address: 'null',
    birthday: 'null',
  })
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    address: '',
    birthday: ''
  })

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        // 檢查 URL 參數中是否有用戶資料
        const searchParams = new URLSearchParams(window.location.search)
        const userData = searchParams.get('user')
        const token = searchParams.get('token')

        if (userData && token) {
          // 如果有 URL 參數，使用這些資料
          const parsedUserData = JSON.parse(decodeURIComponent(userData))
          setMember(parsedUserData)
          localStorage.setItem('token', token)
          localStorage.setItem('member', JSON.stringify(parsedUserData))
          setFormData({
            name: parsedUserData.name || '',
            gender: parsedUserData.gender || '',
            phone: parsedUserData.phone || '',
            address: parsedUserData.address || '',
            birthday: parsedUserData.birthday || ''
          })
          setIsLoading(false)
          return
        }

        // 如果沒有 URL 參數，從 localStorage 和 API 獲取資料
        const savedToken = localStorage.getItem('token')
        if (!savedToken) {
          router.push('/')
          return
        }

        // 先從 localStorage 讀取用戶資料
        const savedMember = localStorage.getItem('member')
        if (savedMember) {
          const parsedMember = JSON.parse(savedMember)
          setMember(parsedMember)
          setFormData({
            name: parsedMember.name || '',
            gender: parsedMember.gender || '',
            phone: parsedMember.phone || '',
            address: parsedMember.address || '',
            birthday: parsedMember.birthday || ''
          })
        }

        // 然後從 API 獲取最新資料
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/members/me`, {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        })

        const data = await response.json()
        if (data.success) {
          setMember(data.data)
          setFormData({
            name: data.data.name || '',
            gender: data.data.gender || '',
            phone: data.data.phone || '',
            address: data.data.address || '',
            birthday: data.data.birthday || ''
          })
          // 更新 localStorage 中的用戶資料
          localStorage.setItem('member', JSON.stringify(data.data))
        } else {
          console.error('獲取會員資料失敗:', data.message)
          localStorage.removeItem('token')
          localStorage.removeItem('member')
          router.push('/')
        }
      } catch (error) {
        console.error('獲取會員資料時發生錯誤:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('member')
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemberData()
  }, [router])

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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 檢查檔案大小（限制 5MB）
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', '圖片大小不能超過 5MB')
      return
    }

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      showToast('error', '請上傳圖片檔案')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        showToast('error', '請先登入')
        return
      }

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

      console.log('上傳回應狀態:', res.status)
      const data = await res.json()
      console.log('上傳回應數據:', data)

      if (data.success && data.data.avatarUrl) {
        // 立即預覽
        const localUrl = URL.createObjectURL(file)
        setMember((prev) => ({ ...(prev || {}), avatar: localUrl }))
        
        // 立即更新大頭貼畫面
        const newAvatarUrl = data.data.avatarUrl.startsWith('http')
          ? data.data.avatarUrl
          : `${process.env.NEXT_PUBLIC_API_URL}${data.data.avatarUrl}`
        console.log('新的頭像URL:', newAvatarUrl)

        const updatedMember = {
          ...(member || {}),
          avatar: newAvatarUrl,
        }
        setMember(updatedMember)
        localStorage.setItem('member', JSON.stringify(updatedMember))
        // 觸發自定義事件
        window.dispatchEvent(new Event('memberUpdate'))
        showToast('success', '頭像更新成功')
      } else {
        console.error('上傳失敗:', data.message)
        showToast('error', data.message || '上傳失敗')
      }
    } catch (error) {
      console.error('頭像上傳錯誤:', error)
      showToast('error', '上傳失敗，請稍後再試')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()
      if (data.success) {
        const updatedMember = {
          ...member,
          ...data.data,
        }
        setMember(updatedMember)
        localStorage.setItem('member', JSON.stringify(updatedMember))
        // 觸發自定義事件
        window.dispatchEvent(new Event('memberUpdate'))
        setIsEditing(false)
        showToast('success', '資料更新成功')
      } else {
        showToast('error', data.message || '更新失敗')
      }
    } catch (error) {
      console.error('更新資料時發生錯誤:', error)
      showToast('error', '更新失敗，請稍後再試')
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="member-center container py-5 mt-5">
      <div className="row">
        <div className="col-md-3">
          {/* 側邊欄選單 */}
          <div className="card">
            <div className="card-body">
              <div className="text-center mb-4">
                <div
                  className="avatar-placeholder mb-3"
                  style={{ position: 'relative', cursor: 'pointer' }}
                >
                  <input
                    type="file"
                    id="avatarUpload"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                  <label htmlFor="avatarUpload" className="avatar-label">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="rounded-circle"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div className="avatar-initial">
                        {member.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="avatar-overlay">
                      <span>點我更換大頭貼</span>
                    </div>
                  </label>
                </div>
                <h5 className="card-title mb-0">
                  {member.name || '未設定姓名'}
                </h5>
                <small className="text-muted">{member.email}</small>
              </div>
              <div className="list-group">
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person me-2"></i>個人資料
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <i className="bi bi-bag me-2"></i>我的訂單
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${activeTab === 'favorites' ? 'active' : ''}`}
                  onClick={() => setActiveTab('favorites')}
                >
                  <i className="bi bi-heart me-2"></i>我的收藏
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${activeTab === 'coupons' ? 'active' : ''}`}
                  onClick={() => setActiveTab('coupons')}
                >
                  <i className="bi bi-ticket-perforated me-2"></i>我的優惠券
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          {/* 主要內容區域 */}
          <div className="card">
            <div className="card-body">
              {activeTab === 'profile' && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">個人資料</h4>
                    {!isEditing ? (
                      <button className="btn btn-primary" onClick={handleEdit}>
                        <i className="bi bi-pencil me-2"></i>編輯資料
                      </button>
                    ) : (
                      <div>
                        <button
                          className="btn btn-secondary me-2"
                          onClick={handleCancel}
                        >
                          取消
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={handleSubmit}
                        >
                          儲存
                        </button>
                      </div>
                    )}
                  </div>
                  {!isEditing ? (
                    <div className="profile-info">
                      <div className="row mb-3">
                        <div className="col-md-3">
                          <strong>姓名：</strong>
                        </div>
                        <div className="col-md-9">
                          {member.name || '未設定'}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-3">
                          <strong>電子郵件：</strong>
                        </div>
                        <div className="col-md-9">{member.email}</div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-3">
                          <strong>性別：</strong>
                        </div>
                        <div className="col-md-9">
                          {member.gender === 'M'
                            ? '男'
                            : member.gender === 'F'
                              ? '女'
                              : '其他'}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-3">
                          <strong>電話：</strong>
                        </div>
                        <div className="col-md-9">
                          {member.phone || '未設定'}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-3">
                          <strong>地址：</strong>
                        </div>
                        <div className="col-md-9">
                          {member.address || '未設定'}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-3">
                          <strong>生日：</strong>
                        </div>
                        <div className="col-md-9">
                          {member.birthday
                            ? new Date(member.birthday).toLocaleDateString(
                                'zh-TW'
                              )
                            : '未設定'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">姓名</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">性別</label>
                        <select
                          className="form-select"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">請選擇</option>
                          <option value="M">男</option>
                          <option value="F">女</option>
                          <option value="O">其他</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">電話</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">地址</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">生日</label>
                        <input
                          type="date"
                          className="form-control"
                          name="birthday"
                          value={
                            formData.birthday
                              ? formData.birthday.split('T')[0]
                              : ''
                          }
                          onChange={handleChange}
                        />
                      </div>
                    </form>
                  )}
                </>
              )}
              {activeTab === 'orders' && (
                <h4 className="card-title mb-4">我的訂單</h4>
              )}
              {activeTab === 'favorites' && (
                <h4 className="card-title mb-4">我的收藏</h4>
              )}
              {activeTab === 'coupons' && (
                <h4 className="card-title mb-4">我的優惠券</h4>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
