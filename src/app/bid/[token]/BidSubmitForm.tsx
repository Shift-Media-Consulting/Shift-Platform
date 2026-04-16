'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import BudgetBuilder, { type BudgetBuilderHandle, type BudgetFormState } from '@/components/budget/BudgetBuilder'
import { BUDGET_POSITIONS, BUDGET_SECTIONS } from '@/lib/budget/positions'

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

// Build budget_line_items rows from form state
function buildLineItems(
  budgetId: string,
  formState: BudgetFormState,
): object[] {
  const items: object[] = []

  for (const pos of BUDGET_POSITIONS) {
    const entry = formState[pos.code]
    if (!entry) continue

    const q = parseFloat(entry.quantity) || 0
    const d = parseFloat(entry.days) || 1
    const r = parseFloat(entry.rate) || 0

    if (q === 0 || r === 0) continue  // skip zero rows

    const amount = q * (d === 0 ? 1 : d) * r
    const section = BUDGET_SECTIONS.find(s => s.number === pos.section)!

    items.push({
      budget_id: budgetId,
      section_number: pos.section,
      section_name: section.name,
      position_code: pos.code,
      name: pos.name,
      quantity: q,
      days: d,
      rate: r,
      amount: Math.round(amount * 100) / 100,
      notes: entry.notes || null,
      sort_order: BUDGET_POSITIONS.indexOf(pos),
    })
  }

  return items
}

export default function BidSubmitForm({
  partnerId,
  projectId,
}: {
  partnerId: string
  projectId: string
}) {
  const [director, setDirector] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'creative' | 'budget'>('creative')
  const creativeRef = useRef<HTMLInputElement>(null)
  const budgetBuilderRef = useRef<BudgetBuilderHandle>(null)
  const draftKey = `shift_budget_draft_${partnerId}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const creativeFile = creativeRef.current?.files?.[0] ?? null
    const budgetData = budgetBuilderRef.current?.getData() ?? {}
    const totalNet = budgetBuilderRef.current?.getTotal() ?? 0

    if (!creativeFile && totalNet === 0) {
      setError('Please upload a creative treatment or enter at least one budget item.')
      return
    }

    setSubmitting(true)
    setError('')

    const supabase = createClient()

    // 1. Upload creative treatment if provided
    const creativeUrl = creativeFile
      ? await uploadFile(supabase, creativeFile, partnerId, 'creative')
      : null

    if (creativeFile && !creativeUrl) {
      setError('Creative treatment upload failed. Please try again.')
      setSubmitting(false)
      return
    }

    // 2. Create bids record
    const { data: bid, error: bidErr } = await supabase
      .from('bids')
      .insert({
        project_id: projectId,
        partner_id: partnerId,
        creative_url: creativeUrl,
      })
      .select('id')
      .single()

    if (bidErr || !bid) {
      setError(bidErr?.message ?? 'Failed to submit bid. Please try again.')
      setSubmitting(false)
      return
    }

    // 3. Create budget record
    const { data: budget, error: budgetErr } = await supabase
      .from('budgets')
      .insert({
        project_id: projectId,
        partner_id: partnerId,
        version: 'V1',
        status: 'Submitted',
        director: director || null,
        notes: notes || null,
        total_net: Math.round(totalNet * 100) / 100,
        submitted_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (budgetErr || !budget) {
      setError(budgetErr?.message ?? 'Failed to save budget. Please try again.')
      setSubmitting(false)
      return
    }

    // 4. Insert non-zero line items
    const lineItems = buildLineItems(budget.id, budgetData)
    if (lineItems.length > 0) {
      const { error: liErr } = await supabase
        .from('budget_line_items')
        .insert(lineItems)

      if (liErr) {
        setError(liErr.message)
        setSubmitting(false)
        return
      }
    }

    // 5. Mark partner as submitted
    await supabase
      .from('production_partners')
      .update({ bid_submitted: true })
      .eq('id', partnerId)

    // 6. Clear draft from localStorage
    try { localStorage.removeItem(draftKey) } catch {}

    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ fontSize: '48px', color: '#00897B', marginBottom: '16px' }}>✓</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111111', marginBottom: '8px' }}>
          Bid submitted.
        </h2>
        <p style={{ fontSize: '14px', color: '#888888', lineHeight: 1.6 }}>
          Thank you. The SHIFT MEDIA team will review your bid and be in touch.
        </p>
      </div>
    )
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    color: '#555555',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '6px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '13px',
    fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    border: '1px solid #DDDDDD',
    borderRadius: '4px',
    backgroundColor: '#FFFFFF',
    color: '#111111',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #EEEEEE', marginBottom: '32px', gap: '0' }}>
        {(['creative', 'budget'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 24px',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: "'Poppins', Calibri, Arial, sans-serif",
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #00897B' : '2px solid transparent',
              marginBottom: '-2px',
              cursor: 'pointer',
              color: activeTab === tab ? '#00897B' : '#888888',
              textTransform: 'capitalize',
              letterSpacing: '0.3px',
            }}
          >
            {tab === 'creative' ? 'Creative Treatment' : 'Production Budget'}
          </button>
        ))}
      </div>

      {/* ── Creative Treatment ── */}
      {activeTab === 'creative' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={labelStyle}>Creative Treatment</label>
            <input
              ref={creativeRef}
              type="file"
              accept=".pdf,.ppt,.pptx,.key,.doc,.docx,.zip"
              style={{ ...inputStyle, cursor: 'pointer' }}
            />
            <p style={{ fontSize: '11px', color: '#888888', marginTop: '4px' }}>
              PDF, PowerPoint, Keynote, Word or ZIP — max 50 MB
            </p>
          </div>

          <div>
            <label style={labelStyle}>Director</label>
            <input
              type="text"
              value={director}
              onChange={e => setDirector(e.target.value)}
              placeholder="Director name"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Additional Notes{' '}
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                (optional)
              </span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', cursor: 'text' }}
              placeholder="Any additional context or questions for the SHIFT team…"
            />
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: '#111111',
              color: '#FFFFFF',
              padding: '10px 24px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Poppins', Calibri, Arial, sans-serif",
            }}
          >
            Next: Production Budget ›
          </button>
        </div>
      )}

      {/* ── Budget Builder ── */}
      {activeTab === 'budget' && (
        <div>
          <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.7, marginBottom: '24px' }}>
            Enter your production budget below. Fill in only the positions relevant to this project
            — zero rows are ignored. All figures should be <strong>net</strong>, excluding VAT and your
            production markup. Your progress saves automatically to this browser.
          </p>
          <BudgetBuilder ref={budgetBuilderRef} draftKey={draftKey} />
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{
          padding: '10px 14px',
          backgroundColor: '#fdf0ef',
          border: '1px solid #f5c6c2',
          borderRadius: '4px',
          fontSize: '13px',
          color: '#c0392b',
          marginTop: '20px',
        }}>
          {error}
        </div>
      )}

      {/* ── Submit ── */}
      <div style={{ marginTop: '32px', borderTop: '1px solid #EEEEEE', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '12px', color: '#AAAAAA' }}>
          Submit when both sections are complete.
        </p>
        <button
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: submitting ? '#26A69A' : '#00897B',
            color: '#FFFFFF',
            padding: '12px 32px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontFamily: "'Poppins', Calibri, Arial, sans-serif",
          }}
        >
          {submitting ? 'Submitting…' : 'Submit Bid ›'}
        </button>
      </div>
    </form>
  )
}
