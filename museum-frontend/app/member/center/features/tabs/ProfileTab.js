// 'use client'

// import React, { useState } from 'react'
// import { Modal, Button, Form } from 'react-bootstrap'
// import Image from 'next/image'
// import { useToast } from '@/app/_components/ToastManager'

// function InfoRow({ label, value }) {
//   return (
//     <div className="row mb-3">
//       <div className="col-md-3">
//         <strong>{label}：</strong>
//       </div>
//       <div className="col-md-9">{value || '未設定'}</div>
//     </div>
//   )
// }

// function FormInput({ label, name, value, onChange, type = 'text' }) {
//   return (
//     <Form.Group className="mb-3">
//       <Form.Label>{label}</Form.Label>
//       <Form.Control type={type} name={name} value={value} onChange={onChange} />
//     </Form.Group>
//   )
// }

// function FormSelect({ label, name, value, onChange }) {
//   return (
//     <Form.Group className="mb-3">
//       <Form.Label>{label}</Form.Label>
//       <Form.Select name={name} value={value} onChange={onChange}>
//         <option value="">請選擇</option>
//         <option value="M">男</option>
//         <option value="F">女</option>
//         <option value="O">其他</option>
//       </Form.Select>
//     </Form.Group>
//   )
// }

// export default function ProfileTab({
//   member,
//   formData,
//   onEdit,
//   onCancel,
//   onSubmit,
//   onChange,
// }) {
//   const [showModal, setShowModal] = React.useState(false)
//   const [showPasswordModal, setShowPasswordModal] = React.useState(false)
//   const [showDeleteModal, setShowDeleteModal] = React.useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [avatarFile, setAvatarFile] = useState(null)
//   const [avatarPreview, setAvatarPreview] = useState(member?.avatar || null)
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   })
//   const [deletePassword, setDeletePassword] = useState('')
//   const { showToast } = useToast()

//   const handleClose = () => {
//     setShowModal(false)
//     onCancel()
//     setAvatarFile(null)
//     setAvatarPreview(member?.avatar || null)
//   }

//   const handleShow = () => {
//     setAvatarPreview(member?.avatar || null)
//     setShowModal(true)
//     onEdit()
//   }

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0]
//     if (!file) return

//     if (file.size > 5 * 1024 * 1024) {
//       alert('圖片大小不能超過 5MB')
//       return
//     }

//     if (!file.type.startsWith('image/')) {
//       alert('請上傳圖片檔案')
//       return
//     }

//     const reader = new FileReader()
//     reader.onloadend = () => {
//       setAvatarPreview(reader.result)
//     }
//     reader.readAsDataURL(file)

//     setAvatarFile(file)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     try {
//       const formDataToSend = new FormData()

//       Object.keys(formData).forEach((key) => {
//         formDataToSend.append(key, formData[key])
//       })

//       if (avatarFile) {
//         formDataToSend.append('avatar', avatarFile)
//       }

//       await onSubmit(formDataToSend)
//       setShowModal(false)
//     } catch (error) {
//       console.error('更新失敗:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target
//     setPasswordData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)

//     if (passwordData.newPassword.length < 8) {
//       showToast('error', '新密碼長度至少需要8個字符')
//       setIsLoading(false)
//       return
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       showToast('error', '兩次輸入的新密碼不一致')
//       setIsLoading(false)
//       return
//     }

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/members/change-password`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//           body: JSON.stringify({
//             currentPassword: passwordData.currentPassword,
//             newPassword: passwordData.newPassword,
//           }),
//         }
//       )

//       const data = await res.json()
//       if (!res.ok) {
//         throw new Error(data.message || '修改密碼失敗')
//       }

//       showToast('success', '密碼修改成功')
//       setShowPasswordModal(false)
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: '',
//       })
//     } catch (error) {
//       console.error('修改密碼錯誤:', error)
//       showToast('error', error.message || '修改密碼失敗')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDeleteAccount = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/members/account`
//       console.log('API URL:', apiUrl)
//       console.log('Token:', localStorage.getItem('token'))
//       console.log('請求數據:', { password: deletePassword })

//       const res = await fetch(apiUrl, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({
//           password: deletePassword,
//         }),
//       })

//       console.log('收到回應:', {
//         status: res.status,
//         statusText: res.statusText,
//         headers: Object.fromEntries(res.headers.entries()),
//       })

//       let data
//       try {
//         data = await res.json()
//         console.log('回應數據:', data)
//       } catch (jsonError) {
//         console.error('解析JSON失敗:', jsonError)
//         throw new Error('伺服器回應格式錯誤')
//       }

//       if (!res.ok) {
//         throw new Error(data.message || '刪除帳號失敗')
//       }

//       showToast('success', '帳號已成功刪除')
//       // 清除本地存儲
//       localStorage.removeItem('token')
//       localStorage.removeItem('member')
//       // 重定向到首頁
//       window.location.href = '/'
//     } catch (error) {
//       console.error('刪除帳號錯誤:', error)
//       console.error('錯誤詳情:', {
//         message: error.message,
//         stack: error.stack,
//         name: error.name,
//       })
//       showToast('error', error.message || '刪除帳號失敗')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="card-title mb-0">個人資料</h4>
//         <div>
//           <Button
//             variant="outline-primary"
//             className="me-2"
//             onClick={() => setShowPasswordModal(true)}
//           >
//             <i className="bi bi-key me-2"></i>修改密碼
//           </Button>
//           <Button variant="primary" className="me-2" onClick={handleShow}>
//             <i className="bi bi-pencil me-2"></i>編輯資料
//           </Button>
//           <Button
//             variant="outline-danger"
//             onClick={() => setShowDeleteModal(true)}
//           >
//             <i className="bi bi-trash me-2"></i>刪除帳號
//           </Button>
//         </div>
//       </div>

//       <div className="profile-info">
//         <div className="text-center mb-4">
//           <img
//             src={member?.avatar || '/default-avatar.png'}
//             alt="頭像"
//             width={150}
//             height={150}
//             className="rounded-circle"
//             style={{ objectFit: 'cover' }}
//           />
//         </div>
//         <InfoRow label="姓名" value={member?.name} />
//         <InfoRow label="電子郵件" value={member?.email} />
//         <InfoRow
//           label="性別"
//           value={
//             member?.gender === 'M'
//               ? '男'
//               : member?.gender === 'F'
//                 ? '女'
//                 : '其他'
//           }
//         />
//         <InfoRow label="電話" value={member?.phone} />
//         <InfoRow label="地址" value={member?.address} />
//         <InfoRow
//           label="生日"
//           value={
//             member?.birthday
//               ? new Date(member?.birthday).toLocaleDateString('zh-TW')
//               : '未設定'
//           }
//         />
//       </div>

//       <Modal show={showModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>編輯個人資料</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <div className="text-center mb-4">
//               <img
//                 src={avatarPreview || member?.avatar || '/default-avatar.png'}
//                 alt="頭像預覽"
//                 width={150}
//                 height={150}
//                 className="rounded-circle mb-2"
//                 style={{ objectFit: 'cover' }}
//               />
//               <div>
//                 <Form.Control
//                   type="file"
//                   accept="image/*"
//                   onChange={handleAvatarChange}
//                   className="d-none"
//                   id="avatar-upload"
//                 />
//                 <Button
//                   variant="outline-primary"
//                   onClick={() =>
//                     document.getElementById('avatar-upload').click()
//                   }
//                 >
//                   更換頭像
//                 </Button>
//               </div>
//             </div>

//             <FormInput
//               label="姓名"
//               name="name"
//               value={formData.name}
//               onChange={onChange}
//             />
//             <FormSelect
//               label="性別"
//               name="gender"
//               value={formData.gender}
//               onChange={onChange}
//             />
//             <FormInput
//               label="電話"
//               name="phone"
//               value={formData.phone}
//               onChange={onChange}
//             />
//             <FormInput
//               label="地址"
//               name="address"
//               value={formData.address}
//               onChange={onChange}
//             />
//             <FormInput
//               label="生日"
//               name="birthday"
//               type="date"
//               value={formData.birthday?.split('T')[0] || ''}
//               onChange={onChange}
//             />
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={handleClose}
//             disabled={isLoading}
//           >
//             取消
//           </Button>
//           <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? '更新中...' : '儲存'}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={showPasswordModal}
//         onHide={() => setShowPasswordModal(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>修改密碼</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handlePasswordSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>當前密碼</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="currentPassword"
//                 value={passwordData.currentPassword}
//                 onChange={handlePasswordChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>新密碼</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="newPassword"
//                 value={passwordData.newPassword}
//                 onChange={handlePasswordChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>確認新密碼</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="confirmPassword"
//                 value={passwordData.confirmPassword}
//                 onChange={handlePasswordChange}
//                 required
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowPasswordModal(false)}
//             disabled={isLoading}
//           >
//             取消
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handlePasswordSubmit}
//             disabled={isLoading}
//           >
//             {isLoading ? '更新中...' : '確認修改'}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* 刪除帳號 Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>刪除帳號</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="alert alert-danger">
//             <i className="bi bi-exclamation-triangle-fill me-2"></i>
//             警告：此操作無法撤銷，您的所有資料將被永久刪除。
//           </div>
//           <Form onSubmit={handleDeleteAccount}>
//             <Form.Group className="mb-3">
//               <Form.Label>請輸入密碼確認刪除</Form.Label>
//               <Form.Control
//                 type="password"
//                 value={deletePassword}
//                 onChange={(e) => setDeletePassword(e.target.value)}
//                 required
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowDeleteModal(false)}
//             disabled={isLoading}
//           >
//             取消
//           </Button>
//           <Button
//             variant="danger"
//             onClick={handleDeleteAccount}
//             disabled={isLoading}
//           >
//             {isLoading ? '處理中...' : '確認刪除'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   )
// }

// museum-frontend/app/member/center/features/tabs/ProfileTab.js
'use client'

import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useToast } from '@/app/_components/ToastManager'
import InfoRow from './_profile/InfoRow'
import EditProfileModal from './_profile/EditProfileModal'
import PasswordChangeModal from './_profile/PasswordChangeModal'
import DeleteAccountModal from './_profile/DeleteAccountModal'

export default function ProfileTab({ member, formData, onEdit, onCancel, onSubmit, onChange }) {
  const [showModal, setShowModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(member?.avatar || null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [deletePassword, setDeletePassword] = useState('')
  const { showToast } = useToast()

  const handleClose = () => {
    setShowModal(false)
    onCancel()
    setAvatarFile(null)
    setAvatarPreview(member?.avatar || null)
  }

  const handleShow = () => {
    setAvatarPreview(member?.avatar || null)
    setShowModal(true)
    onEdit()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('圖片大小不能超過 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('請上傳圖片檔案')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)

    setAvatarFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formDataToSend = new FormData()

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key])
      })

      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile)
      }

      await onSubmit(formDataToSend)
      setShowModal(false)
    } catch (error) {
      console.error('更新失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (passwordData.newPassword.length < 8) {
      showToast('error', '新密碼長度至少需要8個字符')
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', '兩次輸入的新密碼不一致')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/members/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || '修改密碼失敗')
      }

      showToast('success', '密碼修改成功')
      setShowPasswordModal(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('修改密碼錯誤:', error)
      showToast('error', error.message || '修改密碼失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/members/account`
      console.log('API URL:', apiUrl)
      console.log('Token:', localStorage.getItem('token'))
      console.log('請求數據:', { password: deletePassword })

      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      })

      console.log('收到回應:', {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
      })

      let data
      try {
        data = await res.json()
        console.log('回應數據:', data)
      } catch (jsonError) {
        console.error('解析JSON失敗:', jsonError)
        throw new Error('伺服器回應格式錯誤')
      }

      if (!res.ok) {
        throw new Error(data.message || '刪除帳號失敗')
      }

      showToast('success', '帳號已成功刪除')
      // 清除本地存儲
      localStorage.removeItem('token')
      localStorage.removeItem('member')
      // 重定向到首頁
      window.location.href = '/'
    } catch (error) {
      console.error('刪除帳號錯誤:', error)
      console.error('錯誤詳情:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
      showToast('error', error.message || '刪除帳號失敗')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="card-title mb-0">個人資料</h4>
        <div>
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={() => setShowPasswordModal(true)}
          >
            <i className="bi bi-key me-2"></i>修改密碼
          </Button>
          <Button variant="primary" className="me-2" onClick={handleShow}>
            <i className="bi bi-pencil me-2"></i>編輯資料
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <i className="bi bi-trash me-2"></i>刪除帳號
          </Button>
        </div>
      </div>

      <div className="profile-info">
        <div className="text-center mb-4">
          <img
            src={member?.avatar || '/default-avatar.png'}
            alt="頭像"
            width={150}
            height={150}
            className="rounded-circle"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <InfoRow label="姓名" value={member?.name} />
        <InfoRow label="電子郵件" value={member?.email} />
        <InfoRow
          label="性別"
          value={
            member?.gender === 'M'
              ? '男'
              : member?.gender === 'F'
                ? '女'
                : '其他'
          }
        />
        <InfoRow label="電話" value={member?.phone} />
        <InfoRow label="地址" value={member?.address} />
        <InfoRow
          label="生日"
          value={
            member?.birthday
              ? new Date(member?.birthday).toLocaleDateString('zh-TW')
              : '未設定'
          }
        />
      </div>

      <EditProfileModal
        show={showModal}
        onHide={handleClose}
        member={member}
        formData={formData}
        onChange={onChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        avatarPreview={avatarPreview}
        onAvatarChange={handleAvatarChange}
      />

      <PasswordChangeModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        passwordData={passwordData}
        onChange={handlePasswordChange}
        onSubmit={handlePasswordSubmit}
        isLoading={isLoading}
      />

      <DeleteAccountModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        deletePassword={deletePassword}
        onChange={(e) => setDeletePassword(e.target.value)}
        onSubmit={handleDeleteAccount}
        isLoading={isLoading}
      />
    </>
  )
}