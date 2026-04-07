'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BidSubmitForm({ partnerId, projectId }: { partnerId: string; projectId: string }) {
  const [creativeUrl, setCreativeUrl] = useState('')
  const [budgetUrl, setBudgetUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!creativeUrl && !budgetUrl) {
      setError('Please provide at least one document URL or upload.')
      return
    }
    setUploading(true)
    setError('')

    const supabase = createClient()
    const { error: bidErr } = await supabase.from('bids').insert({
      project_id: projectId,
      partner_id: partnerId,
      creative_url: creativeUrl || null,
      budget_url: budgetUrl || null,
      consultant_notes: notes || null,
    })

    if (bidErr) { setError(bidErr.message); setUploading(false); return }

    await supabase.from('production_partners').update({ bid_submitted: true }).eq('id', partnerId)
    setSubmitted(true)
    setUploading(false)
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <span style={{ fontSize: '40px', color: '#00897B', display: 'block', marginBottom: '16px' }}>✓</span>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111111', marginBottom: '8px' }}>Bid submitted.</h2>
        <p style={{ fontSize: '14px', color: '#888888' }}>Thank you. The SHIFT MEDIA team will be in touch.</p>
      </div>
    )
  }

  const inputStyle = { width: '100%', padding: '9px 12px', fontSize: '13px', fontFamily: "'Poppins', Calibri, Arial, sans-serif", border: '1px solid #DDDDDD', borderRadius: '4px', backgroundColor: '#FFFFFF', color: '#111111', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 700 as const, color: '#555555', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '6px' }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Creative Treatment URL</label>
          <input type="url" value={creativeUrl} onChange={e => setCreativeUrl(e.target.value)} style={inputStyle} placeholder="https://we.tl/... or Google Drive link" />
          <p style={{ fontSize: '11px', color: '#888888', marginTop: '4px' }}>WeTransfer, Google Drive, Dropbox, or any accessible link</p>
        </div>
        <div>
          <label style={labelStyle}>Budget Document URL</label>
          <input type="url" value={budgetUrl} onChange={e => setBudgetUrl(e.target.value)} style={inputStyle} placeholder="https://we.tl/... or Google Drive link" />
        </div>
        <div>
          <label style={labelStyle}>Additional Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Any additional context or questions for the SHIFT team..." />
        </div>
      </div>

      {error && <div style={{ padding: '10px 14px', backgroundColor: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: '4px', fontSize: '13px', color: '#c0392b', marginTop: '16px' }}>{error}</div>}

      <button type="submit" disabled={uploading} style={{ marginTop: '24px', width: '100%', backgroundColor: uploading ? '#26A69A' : '#00897B', color: '#FFFFFF', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: "'Poppins', Calibri, Arial, sans-serif" }}>
        {uploading ? 'Submitting...' : 'Submit Bid ›'}
      </button>
    </form>
  )
}
