'use client'

import React, { useState, useEffect } from 'react'
// button
import Button from 'react-bootstrap/Button'
// modal
import Modal from 'react-bootstrap/Modal'
// toast
import { useToast } from '@/app/_components/ToastManager'

// form
import Form from 'react-bootstrap/Form'
import { useForm } from 'react-hook-form'
import FloatingField from '@/app/_components/FloatingField'
// import PasswordField from '@/app/_components/PasswordField'
import FormRow from '@/app/_components/FormRow'
// import '@/app/_styles/formCustom'

export default function AppPage(props) {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  // toast
  const { showToast } = useToast()
  const variants = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ]

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const onSubmit = (data) => console.log('🎉', data)

  return (
    <>
      <h1>首頁</h1>
      <hr />
      <div>
        <Button variant="primary" onClick={handleShow}>
          開啟跳出對話盒
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div>
        <button type="button" className="btn btn-primary">
          Primary
        </button>
        <button type="button" className="btn btn-secondary">
          Secondary
        </button>
        <button type="button" className="btn btn-success">
          Success
        </button>
        <button type="button" className="btn btn-danger">
          Danger
        </button>
        <button type="button" className="btn btn-warning">
          Warning
        </button>
        <button type="button" className="btn btn-info">
          Info
        </button>
        <button type="button" className="btn btn-light">
          Light
        </button>
        <button type="button" className="btn btn-dark">
          Dark
        </button>
        <button type="button" className="btn btn-link">
          Link
        </button>
      </div>
      <div>
        <div>
          <div className="alert alert-primary" role="alert">
            <i className="fa-solid fa-circle-info"></i>A simple primary
            alert—check it out!
          </div>
          <div className="alert alert-secondary" role="alert">
            A simple secondary alert—check it out!
          </div>
          <div className="alert alert-success" role="alert">
            A simple success alert—check it out!
          </div>
          <div className="alert alert-danger" role="alert">
            A simple danger alert—check it out!
          </div>
          <div className="alert alert-warning" role="alert">
            A simple warning alert—check it out!
          </div>
        </div>
      </div>

      {/* toast */}
      <button onClick={() => showToast('success', '登入成功 🎉')}>
        點我吐司
      </button>

      <div className="d-flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v}
            className={`btn btn-${v}`}
            onClick={() => showToast(v, `${v} 提示訊息`)}
          >
            Show {v}
          </button>
        ))}
      </div>

      {/* 第一排：Email + 選單 */}
      <FormRow
        // 每個欄位設定不同的寬度
        colProps={[
          { md: 4, lg: 3 }, // 第 1 欄
          { md: 8, lg: 9 }, // 第 2 欄
        ]}
        // 設定每個欄位
        cols={[
          <FloatingField
            as="input"
            type="email"
            placeholder="name@example.com"
            label="Email address"
            controlId="email"
          />,
          <FloatingField
            as="select"
            label="職業"
            controlId="job"
            options={['工程師', '設計師', '學生']}
            aria-label="選擇職業"
          />,
        ]}
      />

      {/* 第二排：姓名＋密碼 */}
      <FormRow
        cols={[
          <FloatingField
            as="input"
            type="text"
            placeholder="王小明"
            label="姓名"
            controlId="name"
          />,
          <FloatingField
            as="input"
            type="password"
            placeholder="密碼"
            label="密碼"
            controlId="password"
          />,
        ]}
      />

      {/* FloatingField 的 register 屬性，需要從 useForm 的 register 傳入 */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow
          cols={[
            <FloatingField
              label="Email"
              controlId="email"
              type="email"
              placeholder="name@example.com"
              register={register}
              errorMsg={errors.email?.message}
              // 驗證規則
              {...register('email', {
                required: '必填',
                pattern: { value: /\S+@\S+\.\S+/, message: '格式錯誤' },
              })}
            />,
            <FloatingField
              as="select"
              label="職業"
              controlId="job"
              options={['工程師', '設計師', '學生']}
              register={register}
              errorMsg={errors.job?.message}
              {...register('job', { required: '必選一項' })}
            />,
          ]}
        />
        <button className="btn btn-primary mt-3">送出</button>
      </Form>
    </>
  )
}
