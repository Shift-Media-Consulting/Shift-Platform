'use client'

import { useActionState } from 'react'
import { addPartnerAction } from './actions'

const inputStyle = { width: '100%', padding: '9px 12px', fontSize: '13px', fontFamily: "'Poppins', Calibri, Arial, sans-serif", border: '1px solid #DDDDDD', borderRadius: '4px', backgroundColor: '#FFFFFF', color: '#111111', outline: 'none', boxSizing: 'border-box' as const }
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 700 as const, color: '#555555', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '6px' }

export default function AddPartnerForm({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState(addPartnerAction, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="project_id" value={projectId} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Company Name *</label>
          <input name="company_name" type="text" required style={inputStyle} placeholder="Film Factory GmbH" />
        </div>
        <div>
          <label style={labelStyle}>Contact Name *</label>
          <input name="contact_name" type="text" required style={inputStyle} placeholder="Anna Müller" />
        </div>
        <div>
          <label style={labelStyle}>Contact Email *</label>
          <input name="contact_email" type="email" required style={inputStyle} placeholder="anna@filmfactory.de" />
        </div>
        <div>
          <label style={labelStyle}>Creative / Director</label>
          <input name="creative_name" type="text" style={inputStyle} placeholder="Max Muster" />
        </div>
      </div>

      {state?.error && <div style={{ padding: '10px 12px', backgroundColor: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: '4px', fontSize: '12px', color: '#c0392b', marginTop: '12px' }}>{state.error}</div>}
      {state?.success && <div style={{ padding: '10px 12px', backgroundColor: '#eafaf1', border: '1px solid #a9dfbf', borderRadius: '4px', fontSize: '12px', color: '#1e8449', marginTop: '12px' }}>Partner added. Bid portal link generated.</div>}

      <button type="submit" disabled={pending} style={{ marginTop: '16px', width: '100%', backgroundColor: pending ? '#26A69A' : '#00897B', color: '#FFFFFF', padding: '10px', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer', fontFamily: "'Poppins', Calibri, Arial, sans-serif" }}>
        {pending ? 'Adding...' : 'Add Partner'}
      </button>
    </form>
  )
}
