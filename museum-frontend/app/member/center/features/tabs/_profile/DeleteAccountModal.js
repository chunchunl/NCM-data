// museum-frontend/app/member/center/features/tabs/components/DeleteAccountModal.js
'use client'

import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

export default function DeleteAccountModal({
  show,
  onHide,
  deletePassword,
  onChange,
  onSubmit,
  isLoading,
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>刪除帳號</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          警告：此操作無法撤銷，您的所有資料將被永久刪除。
        </div>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>請輸入密碼確認刪除</Form.Label>
            <Form.Control
              type="password"
              value={deletePassword}
              onChange={onChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          取消
        </Button>
        <Button variant="danger" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? '處理中...' : '確認刪除'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}