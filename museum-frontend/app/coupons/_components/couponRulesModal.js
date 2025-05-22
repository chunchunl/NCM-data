'use client'

import { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import '@/app/_styles/authModal.scss' // 改成純引入，不要用 styles.xxx
import { FaLightbulb } from 'react-icons/fa'

export default function CouponRulesModal() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      backdrop="static"
      keyboard={false}
      className="authModal" // ✅ 直接用 class 名稱字串
    >
      <Modal.Header closeButton className="modalHeader">
        <Modal.Title className="d-flex align-items-center justify-content-start">
          <FaLightbulb className="me-1" />
          領取提示：
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 d-flex justify-content-start">
        <div className="fs-5" style={{ fontFamily: 'Noto Serif TC' }}>
          點擊優惠券，即領取成功。
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
          variant="primary"
          className="btn-primary " // ✅ 同樣直接使用樣式名稱
          onClick={() => setShow(false)}
        >
          知道了
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
