'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function ConfirmDeleteModal({ show, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          {/* Modal 本體 */}
          <motion.div
            className="modal d-block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">確認刪除</h5>
                </div>
                <div className="modal-body">
                  <p>確定要刪除此商品嗎？</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={onCancel}>
                    取消
                  </button>
                  <button className="btn btn-danger" onClick={onConfirm}>
                    確定刪除
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
