// museum-frontend/app/member/center/features/tabs/components/EditProfileModal.js
'use client'

import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import FormInput from './FormInput'
import FormSelect from './FormSelect'

export default function EditProfileModal({
  show,
  onHide,
  member,
  formData,
  onChange,
  onSubmit,
  isLoading,
  avatarPreview,
  onAvatarChange,
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>編輯個人資料</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <div className="text-center mb-4">
            <img
              src={avatarPreview || member?.avatar || '/default-avatar.png'}
              alt="頭像預覽"
              width={150}
              height={150}
              className="rounded-circle mb-2"
              style={{ objectFit: 'cover' }}
            />
            <div>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                className="d-none"
                id="avatar-upload"
              />
              <Button
                variant="outline-primary"
                onClick={() => document.getElementById('avatar-upload').click()}
              >
                更換頭像
              </Button>
            </div>
          </div>

          <FormInput
            label="姓名"
            name="name"
            value={formData.name}
            onChange={onChange}
          />
          <FormSelect
            label="性別"
            name="gender"
            value={formData.gender}
            onChange={onChange}
          />
          <FormInput
            label="電話"
            name="phone"
            value={formData.phone}
            onChange={onChange}
          />
          <FormInput
            label="地址"
            name="address"
            value={formData.address}
            onChange={onChange}
          />
          <FormInput
            label="生日"
            name="birthday"
            type="date"
            value={formData.birthday?.split('T')[0] || ''}
            onChange={onChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          取消
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? '更新中...' : '儲存'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}