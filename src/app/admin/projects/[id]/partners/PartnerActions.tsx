'use client'

import { updatePartnerStatusAction, removePartnerAction } from './actions'

const statuses = ['Long List','Short List','Approached','Pitch','Awarded','Not Awarded']

export default function PartnerActions({ partner, projectId }: { partner: any; projectId: string }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <select
        defaultValue={partner.status}
        onChange={async (e) => { await updatePartnerStatusAction(partner.id, projectId, e.target.value) }}
        style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid #DDDDDD', borderRadius: '4px', color: '#555555', backgroundColor: '#FFFFFF', fontFamily: "'Poppins', Calibri, Arial, sans-serif", cursor: 'pointer' }}
      >
        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <button
        onClick={async () => {
          if (confirm(`Remove ${partner.company_name}?`)) {
            await removePartnerAction(partner.id, projectId)
          }
        }}
        style={{ fontSize: '11px', color: '#C0392B', background: 'none', border: '1px solid #f5c6c2', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontFamily: "'Poppins', Calibri, Arial, sans-serif" }}
      >
        Remove
      </button>
    </div>
  )
}
