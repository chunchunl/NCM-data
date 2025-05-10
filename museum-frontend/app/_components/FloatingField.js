'use client';

import { useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { FaExclamationCircle } from 'react-icons/fa';
import { useToast } from '@/app/_components/ToastManager';
import '@/app/_styles/globals.scss';
import '@/app/_styles/formCustom.scss';

/**
 * 通用浮動欄位
 * @param {string} as         - 'input' | 'select'
 * @param {string} label      - 浮動文字
 * @param {string} controlId  - 唯一 id
 * @param {object}  rest      - 其餘傳給 <Form.Control>/<Form.Select> 的屬性
 * @param {array?}  options   - select 專用：[{value,label}] or string array
 */

export default function FloatingField({
  as = 'input',
  type = 'text',
  label = '',
  controlId,
  register = () => ({}),
  errorMsg = '',
  options = [],
  ...rest
}) {
  const [visible, setVisible] = useState(false);
  const realType = type === 'password' ? (visible ? 'text' : 'password') : type;

  return (
    <Form.Group className="mb-3 position-relative">
      <Form.Floating>
        {as === 'select' ? (
          <Form.Select {...register(controlId)} {...rest} isInvalid={!!errorMsg}>
            {options.map((opt, i) =>
              typeof opt === 'string'
                ? <option key={i} value={opt}>{opt}</option>
                : <option key={i} value={opt.value}>{opt.label}</option>
            )}
          </Form.Select>
        ) : (
          <Form.Control 
            {...register(controlId)} 
            {...rest} 
            isInvalid={!!errorMsg} 
            type={realType}
            className={errorMsg ? 'has-error' : ''}
          />
        )}
        <Form.Label htmlFor={controlId}>{label}</Form.Label>
      </Form.Floating>
      {errorMsg && (
        <div className="error-tooltip">
          <div className="error-arrow"></div>
          <div className="error-content">
            <FaExclamationCircle className="error-icon my-auto mx-2 text-danger" />
            <div className="error-message">{errorMsg}</div>
          </div>
        </div>
      )}
    </Form.Group>
  );
}
