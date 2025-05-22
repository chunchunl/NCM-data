// museum-frontend/app/member/center/features/tabs/components/ProfileInfo.js
'use client'

import React from 'react'

const InfoRow = ({ label, value }) => (
  <div className="info-row mb-3">
    <div className="info-label">{label}</div>
    <div className="info-value">{value || '未設定'}</div>
  </div>
)

export default function ProfileInfo({ member }) {
  return (
    <div className="profile-info">
      <div className="text-center mb-4">
        <img
          src={member?.avatar || '/img/ncmLogo/logo-ncm.png'}
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
          member?.gender === 'M' ? '男' : member?.gender === 'F' ? '女' : '其他'
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
  )
}
