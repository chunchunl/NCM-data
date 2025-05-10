'use client'

import { Row, Col } from 'react-bootstrap'


/**
 * 封裝一排欄位，gutter 預設 2
 * 用法：
 * <FormRow cols={[ <FloatingField .../>, <FloatingField .../> ]} />
 */
export default function FormRow({ cols = [], colProps = [], gutter = 2 }) {
  return (
    <Row className={`g-${gutter}`}>
      {cols.map((field, idx) => (
        <Col
          key={idx}
          {...(Array.isArray(colProps) ? colProps[idx] || {} : colProps)}
        >
          {field}
        </Col>
      ))}
    </Row>
  )
}
