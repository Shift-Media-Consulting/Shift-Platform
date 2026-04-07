'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const BUCKET = 'bid-documents'

async function uploadFile(
  supabase: ReturnType<typeof createClient>,
  file: File,
  partnerId: string,
  type: 'creative' | 'budget',
): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${partnerId}/${type}-${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) return null
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export default function BidSubmitForm({ partnerId, projectId }: { partnerId: string; projectId: string }) {
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const creativeRef = useRef<HTMLInputElement>(null)
  const budgetRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const creativeFile = creativeRef.current?.files?.[0] ?? null
    const budgetFile = budgetRef.current?.files?.[0] ?? null

    if (!creativeFile && !budgetFile) {
      setError('Please upload at least one document (creative treatment or budget).')
      return
    }

    setUploading(true)
    setError('')

    const supabase = createClient()

    const [creativeUrl, budgetUrl] = await Promise.all([
      creativeFile ? uploadFile(supabase, creativeFile, partnerId, 'creative') : Promise.resolve(null),
      budgetFile ? uploadFile(supabase, budgetFile, partnerId, 'budget') : Promise.resolve(null),
    ])

    if (creativeFile && !creativeUrl) {
      setError('Creative treatment upload failed. Please try again.')
      setUploading(false)
      return
    }
    if (budgetFile && !budgetUrl) {
      setError('Budget document upload failed. Please try again.')
      setUploading(false)
      return
    }

    const { error: bidErr } = await supabase.from('bids').insert({
      project_id: projectId,
      partner_id: partnerId,
      creative_url: creativeUrl,
      budget_url: budgetUrl,
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

  const fileInputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', fontSize: '13px',
    fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    border: '1px solid #DDDDDD', borderRadius: '4px',
    backgroundColor: '#FFFFFF', color: '#111111', outline: 'none',
    boxSizing: 'border-box', cursor: 'pointer',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 700,
    color: '#555555', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px',
  }
  const hintStyle: React.CSSProperties = { fontSize: '11px', color: '#888888', marginTop: '4px' }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div>
          <label style={labelStyle}>Creative Treatment *</label>
          <input
            ref={creativeRef}
            type="file"
            accept=".pdf,.ppt,.pptx,.key,.doc,.docx,.zip"
            style={fileInputStyle}
          />
          <p style={hintStyle}>PDF, PowerPoint, Keynote, Word or ZIP — max 50 MB</p>
        </div>

        <div>
          <label style={labelStyle}>Budget Document *</label>
          <input
            ref={budgetRef}
            type="file"
            accept=".pdf,.xls,.xlsx,.numbers,.csv,.doc,.docx"
            style={fileInputStyle}
          />
          <p style={hintStyle}>PDF, Excel, Numbers or CSV — max 50 MB</p>
        </div>

        <div>
          <label style={labelStyle}>Additional Notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            style={{ ...fileInputStyle, resize: 'vertical', cursor: 'text' }}
            placeholder="Any additional context or questions for the SHIFT team…"
          />
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', backgroundColor: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: '4px', fontSize: '13px', color: '#c0392b', marginTop: '16px' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={uploading}
        style={{
          marginTop: '24px', width: '100%',
          backgroundColor: uploading ? '#26A69A' : '#00897B',
          color: '#FFFFFF', padding: '12px', border: 'none', borderRadius: '4px',
          fontSize: '14px', fontWeight: 700,
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontFamily: "'Poppins', Calibri, Arial, sans-serif",
        }}
      >
        {uploading ? 'Uploading & submitting…' : 'Submit Bid ›'}
      </button>
    </form>
  )
}
