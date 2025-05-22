// museum-frontend/app/member/center/features/tabs/components/FormInput.js
import { Form } from 'react-bootstrap'

export default function FormInput({ label, name, value, onChange, type = 'text' }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control type={type} name={name} value={value} onChange={onChange} />
    </Form.Group>
  )
}