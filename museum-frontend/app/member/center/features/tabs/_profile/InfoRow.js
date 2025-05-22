// museum-frontend/app/member/center/features/tabs/components/InfoRow.js
export default function InfoRow({ label, value }) {
  return (
    <div className="row mb-3">
      <div className="col-md-3">
        <strong>{label}：</strong>
      </div>
      <div className="col-md-9">{value || '未設定'}</div>
    </div>
  )
}
