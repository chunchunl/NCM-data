// museum-frontend/app/member/center/features/tabs/components/FormSelect.js
import { Form } from 'react-bootstrap'

export default function FormSelect({ label, name, value, onChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Select name={name} value={value} onChange={onChange}>
        <option value="">請選擇</option>
        <option value="M">男</option>
        <option value="F">女</option>
        <option value="O">其他</option>
      </Form.Select>
    </Form.Group>
  )
}