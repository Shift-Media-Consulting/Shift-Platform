'use client'

import { useActionState } from 'react'
import { createClientAction } from '../actions'
import Link from 'next/link'

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
const sectionHead: React.CSSProperties = {
  fontSize: '11px', fontWeight: 700, color: '#888888',
  letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px',
}

export default function NewClientPage() {
  const [state, formAction, pending] = useActionState(createClientAction, null)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Clients</p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>New Client</h1>
        </div>
        <Link href="/admin/clients" style={{ fontSize: '13px', color: '#888888', textDecoration: 'none' }}>‹ Back to clients</Link>
      </div>

      <div style={{ maxWidth: '760px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '40px' }}>
          <form action={formAction}>

            {/* Company section */}
            <p style={sectionHead}>Company</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={lbl}>Company Name *</label>
                <input name="company_name" type="text" required style={inp} placeholder="Acme GmbH" />
              </div>
              <div>
                <label style={lbl}>Client Type *</label>
                <select name="client_type" required style={inp}>
                  <option value="">Select type…</option>
                  <option value="Brand">Brand</option>
                  <option value="Agency">Agency</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Sector *</label>
                <select name="sector" required style={inp}>
                  <option value="">Select sector…</option>
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={lbl}>Physical Address *</label>
                <input name="address" type="text" required style={inp} placeholder="Musterstraße 1, 20095 Hamburg" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={lbl}>Logo URL <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                <input name="logo_url" type="url" style={inp} placeholder="https://client.com/logo.png" />
              </div>
            </div>

            {/* Contacts section */}
            <div style={{ borderTop: '1px solid #EEEEEE', paddingTop: '24px', marginBottom: '28px' }}>
              <p style={sectionHead}>Contacts</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={lbl}>Main Contact *</label>
                  <input name="main_contact" type="text" required style={inp} placeholder="Jane Smith" />
                </div>
                <div>
                  <label style={lbl}>Email Address *</label>
                  <input name="email" type="email" required style={inp} placeholder="jane@acme.com" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Other Contacts <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <textarea
                    name="other_contacts"
                    rows={3}
                    style={{ ...inp, resize: 'vertical' }}
                    placeholder={'e.g. Max Müller (Finance) — max@acme.com\nSarah Lee (Legal) — sarah@acme.com'}
                  />
                </div>
              </div>
            </div>

            {state?.error && (
              <div style={{ padding: '12px 16px', backgroundColor: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: '4px', fontSize: '13px', color: '#c0392b', marginBottom: '20px' }}>
                {state.error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={pending} style={{
                backgroundColor: pending ? '#26A69A' : '#00897B', color: '#FFFFFF',
                padding: '10px 24px', border: 'none', borderRadius: '4px',
                fontSize: '13px', fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer',
                fontFamily: "'Poppins', Calibri, Arial, sans-serif",
              }}>
                {pending ? 'Creating…' : 'Create Client'}
              </button>
              <Link href="/admin/clients" style={{ padding: '10px 20px', border: '1px solid #DDDDDD', borderRadius: '4px', fontSize: '13px', color: '#555555', textDecoration: 'none' }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
