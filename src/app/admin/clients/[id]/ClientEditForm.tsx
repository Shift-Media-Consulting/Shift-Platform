'use client'

import { useActionState } from 'react'
import { updateClientAction } from '../actions'

const sectors = [
  'Automotive', 'Retail', 'Telecommunications', 'FMCG', 'Financial Services',
  'Pharmaceutical', 'Technology', 'Fashion', 'Food & Beverage', 'Entertainment',
  'Travel & Tourism', 'Sports', 'Luxury', 'Healthcare', 'Energy',
  'Real Estate', 'Media & Publishing', 'Non-Profit', 'Government', 'Other',
]

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: '13px',
  fontFamily: "'Poppins', Calibri, Arial, sans-serif",
  border: '1px solid #DDDDDD', borderRadius: '4px',
  backgroundColor: '#FFFFFF', color: '#111111', outline: 'none',
  boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700,
  color: '#555555', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px',
}

export default function ClientEditForm({ client }: { client: any }) {
  const [state, formAction, pending] = useActionState(updateClientAction, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={client.id} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Company Name</label>
          <input name="company_name" type="text" defaultValue={client.company_name} required style={inp} />
        </div>
        <div>
          <label style={lbl}>Client Type</label>
          <select name="client_type" defaultValue={client.client_type} style={inp}>
            <option value="Brand">Brand</option>
            <option value="Agency">Agency</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Sector</label>
          <select name="sector" defaultValue={client.sector} style={inp}>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Main Contact</label>
          <input name="main_contact" type="text" defaultValue={client.main_contact} required style={inp} />
        </div>
        <div>
          <label style={lbl}>Email</label>
          <input name="email" type="email" defaultValue={client.email} required style={inp} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Physical Address</label>
          <input name="address" type="text" defaultValue={client.address} required style={inp} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Logo URL <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <input name="logo_url" type="url" defaultValue={client.logo_url ?? ''} style={inp} placeholder="https://…" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Other Contacts <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <textarea
            name="other_contacts"
            rows={3}
            defaultValue={client.other_contacts ?? ''}
            style={{ ...inp, resize: 'vertical' }}
            placeholder={'e.g. Max Müller (Finance) — max@acme.com\nSarah Lee (Legal) — sarah@acme.com'}
          />
        </div>
      </div>

      {state?.error && (
        <div style={{ padding: '10px 14px', backgroundColor: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: '4px', fontSize: '13px', color: '#c0392b', marginBottom: '16px' }}>
          {state.error}
        </div>
      )}
      {state?.success && (
        <div style={{ padding: '10px 14px', backgroundColor: '#eafaf1', border: '1px solid #a9dfbf', borderRadius: '4px', fontSize: '13px', color: '#1e8449', marginBottom: '16px' }}>
          Saved successfully.
        </div>
      )}

      <button type="submit" disabled={pending} style={{
        backgroundColor: pending ? '#26A69A' : '#00897B', color: '#FFFFFF',
        padding: '9px 20px', border: 'none', borderRadius: '4px',
        fontSize: '13px', fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer',
        fontFamily: "'Poppins', Calibri, Arial, sans-serif",
      }}>
        {pending ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}
