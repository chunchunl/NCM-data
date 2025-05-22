// museum-frontend/app/member/center/features/tabs/components/ProfileHeader.js
'use client'

import React from 'react'
import { Button } from 'react-bootstrap'

export default function ProfileHeader({
  onPasswordClick,
  onEditClick,
  onDeleteClick,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="card-title mb-0">個人資料</h4>
      <div>
        <Button
          variant="outline-primary"
          className="me-2"
          onClick={onPasswordClick}
        >
          <i className="bi bi-key me-2"></i>修改密碼
        </Button>
        <Button variant="primary" className="me-2" onClick={onEditClick}>
          <i className="bi bi-pencil me-2"></i>編輯資料
        </Button>
        <Button variant="outline-danger" onClick={onDeleteClick}>
          <i className="bi bi-trash me-2"></i>刪除帳號
        </Button>
      </div>
    </div>
  )
}
