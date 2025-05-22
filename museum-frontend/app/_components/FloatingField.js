
// 'use client'

// import { Form } from 'react-bootstrap'
// import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// import Tooltip from 'react-bootstrap/Tooltip'
// import { forwardRef } from 'react'

// /**
//  * 浮動標籤輸入欄位元件
//  * @param {Object} props
//  * @param {string} props.controlId - 欄位 ID
//  * @param {string} props.label - 浮動標籤文字
//  * @param {string} props.value - 欄位值
//  * @param {Function} props.onChange - 變更事件處理
//  * @param {Function} [props.onBlur] - 失焦事件處理
//  * @param {string} [props.placeholder] - 預設提示文字
//  * @param {string} [props.type='text'] - 欄位類型
//  * @param {string} [props.errorMsg] - 錯誤訊息
//  * @param {boolean} [props.isValid] - 是否驗證成功
//  * @param {Array} [props.options] - select 的選項陣列
//  * @param {string} [props.as='input'] - 元件類型 (input/select)
//  */
// const FloatingField = forwardRef(
//   (
//     {
//       controlId,
//       label,
//       value,
//       onChange,
//       onBlur,
//       placeholder = '',
//       type = 'text',
//       errorMsg,
//       isValid,
//       options = [],
//       as = 'input',
//       ...rest
//     },
//     ref
//   ) => {
//     // 處理 select 選項
//     const renderOptions = () => {
//       if (as !== 'select') return null

//       return options.map((option, index) => {
//         const value = typeof option === 'string' ? option : option.value
//         const label = typeof option === 'string' ? option : option.label

//         return (
//           <option key={index} value={value}>
//             {label}
//           </option>
//         )
//       })
//     }

//     // 渲染錯誤提示 自製
//     const renderErrorTooltip = () => {
//       if (!errorMsg) return null

//       return (
//         //bs內建錯誤訊息樣式
//         // <OverlayTrigger
//         //   placement="top"
//         //   overlay={
//         //     <Tooltip id={`${controlId}-tooltip`} className="error-tooltip">
//         //       {errorMsg}
//         //     </Tooltip>
//         //   }
//         // >
//         //   <span className={`error-icon ${errorMsg ? 'shake' : ''}`}>
//         //     <FaExclamationCircle />
//         //   </span>
//         // </OverlayTrigger>

//         <div className="error-tooltip">
//           <div className="error-arrow"></div>
//           <div className="error-content">
//             <FaExclamationCircle className="error-icon my-auto mx-2 text-danger" />
//             <div className="error-message">{errorMsg}</div>
//           </div>
//         </div>
//       )
//     }

//     // 渲染成功圖示
//     const renderSuccessIcon = () => {
//       if (!isValid || errorMsg) return null

//       return (
//         <span className="success-icon">
//           <FaCheckCircle />
//         </span>
//       )
//     }

//     return (
//       <div className={`floating-field ${isValid ? 'has-success' : ''}`}>
//         <Form.Floating>
//           <Form.Control
//             ref={ref}
//             id={controlId}
//             name={controlId}
//             type={as === 'input' ? type : undefined}
//             as={as}
//             value={value}
//             onChange={onChange}
//             onBlur={onBlur}
//             placeholder={placeholder}
//             // isInvalid={!!errorMsg} // ✅ 傳入錯誤訊息(bs內建)
//             // isValid={isValid} // ✅ 傳入成功狀態(bs內建)
//             className={`form-control ${errorMsg ? 'is-error' : ''} ${isValid ? 'is-valid' : ''}`} // ✅ 手動控制 class
//             {...rest}
//           >
//             {renderOptions()}
//           </Form.Control>
//           <Form.Label htmlFor={controlId}>{label}</Form.Label>
//         </Form.Floating>

//         {renderErrorTooltip()}
//         {renderSuccessIcon()}
//       </div>
//     )
//   }
// )

// FloatingField.displayName = 'FloatingField'

// export default FloatingField



'use client'

import { Form } from 'react-bootstrap'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { forwardRef } from 'react'

const FloatingField = forwardRef(
  (
    {
      controlId,
      label,
      value,
      onChange,
      onBlur,
      placeholder = '',
      type = 'text',
      errorMsg,
      isValid,
      options = [],
      as = 'input',
      ...rest
    },
    ref
  ) => {
    const renderOptions = () => {
      if (as !== 'select') return null

      return options.map((option, index) => {
        const value = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : option.label

        return (
          <option key={index} value={value}>
            {label}
          </option>
        )
      })
    }

    return (
      <div className={`floating-field ${isValid ? 'has-success' : ''}`}>
        <Form.Floating>
          <Form.Control
            ref={ref}
            id={controlId}
            name={controlId}
            type={as === 'input' ? type : undefined}
            as={as}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`form-control ${errorMsg ? 'is-error' : ''} ${isValid ? 'is-valid' : ''}`}
            {...rest}
          >
            {renderOptions()}
          </Form.Control>
          <Form.Label htmlFor={controlId}>{label}</Form.Label>
        </Form.Floating>

        {/* Icon in top-right corner */}
        {errorMsg && (
          <span className={`error-icon ${errorMsg ? 'shake' : ''}`}>
            <FaExclamationCircle />
          </span>
        )}

        {!errorMsg && isValid && (
          <span className="success-icon bounce-check">
            <FaCheckCircle />
          </span>
        )}

        {/* Tooltip bubble below */}
        {errorMsg && (
          <div className="error-tooltip">
            <div className="error-arrow"></div>
            <div className="error-content">
              {/* <FaExclamationCircle className="error-icon" /> */}
              <div className="error-message">{errorMsg}</div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

FloatingField.displayName = 'FloatingField'

export default FloatingField

