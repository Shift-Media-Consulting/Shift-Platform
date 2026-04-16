'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BudgetBuilder, { type BudgetBuilderHandle, type BudgetFormState } from '@/components/budget/BudgetBuilder'
import { BUDGET_POSITIONS, BUDGET_SECTIONS } from '@/lib/budget/positions'

const BUCKET = 'bid-documents'

interface Partner {
  id: string
  company_name: string
  contact_name: string
}

async function uploadCreative(
  supabase: ReturnType<typeof createClient>,
  file: File,
  partnerId: string,
): Promise<string | null> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${partnerId}/creative-admin-${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })
  if (error) return null
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

function buildLineItems(budgetId: string, formState: BudgetFormState) {
  const items: object[] = []
  for (const pos of BUDGET_POSITIONS) {
    const entry = formState[pos.code]
    if (!entry) continue
    const q = parseFloat(entry.quantity) || 0
    const d = parseFloat(entry.days) || 1
    const r = parseFloat(entry.rate) || 0
    if (q === 0 || r === 0) continue
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

export default function AddBudgetForm({
  projectId,
  partners,
  preselectedPartnerId,
}: {
  projectId: string
  partners: Partner[]
  preselectedPartnerId?: string
}) {
  const [partnerId, setPartnerId] = useState(preselectedPartnerId ?? partners[0]?.id ?? '')
  const [director, setDirector] = useState('')
  const [version, setVersion] = useState('V1')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const budgetBuilderRef = useRef<BudgetBuilderHandle>(null)
  const creativeRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const draftKey = `shift_admin_budget_draft_${projectId}_${partnerId}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const budgetData = budgetBuilderRef.current?.getData() ?? {}
    const totalNet = budgetBuilderRef.current?.getTotal() ?? 0
    const creativeFile = creativeRef.current?.files?.[0] ?? null

    if (!partnerId) {
      setError('Please select a production partner.')
      return
    }

    setSubmitting(true)
    setError('')

    const supabase = createClient()

    // Upload creative if provided
    let creativeUrl: string | null = null
    if (creativeFile) {
      creativeUrl = await uploadCreative(supabase, creativeFile, partnerId)
      if (!creativeUrl) {
        setError('Creative treatment upload failed. Please try again.')
        setSubmitting(false)
        return
      }
    }

    // Create bids record if we have a creative treatment
    if (creativeUrl) {
      const { error: bidErr } = await supabase
        .from('bids')
        .insert({
          project_id: projectId,
          partner_id: partnerId,
          creative_url: creativeUrl,
        })
      if (bidErr) {
        setError(bidErr.message)
        setSubmitting(false)
        return
      }
    }

    // Create budget record
    const { data: budget, error: budgetErr } = await supabase
      .from('budgets')
      .insert({
        project_id: projectId,
        partner_id: partnerId,
        version,
        status: 'Submitted',
        director: director || null,
        notes: notes || null,
        total_net: Math.round(totalNet * 100) / 100,
        submitted_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (budgetErr || !budget) {
      setError(budgetErr?.message ?? 'Failed to save budget.')
      setSubmitting(false)
      return
    }

    // Insert line items
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

    // Mark partner bid as submitted
    await supabase
      .from('production_partners')
      .update({ bid_submitted: true })
      .eq('id', partnerId)

    // Clear draft
    try { localStorage.removeItem(draftKey) } catch {}

    router.push(`/admin/projects/${projectId}/budgets`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Meta fields */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '20px' }}>Budget Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={lbl}>Production Partner *</label>
            <select
              value={partnerId}
              onChange={e => setPartnerId(e.target.value)}
              required
              style={inp}
            >
              <option value="">Select partner…</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>
                  {p.company_name}{p.contact_name && p.contact_name !== 'Internal' ? ` (${p.contact_name})` : ''}
                </option>
              ))}
            </select>
            {partners.length === 0 && (
              <p style={{ fontSize: '11px', color: '#C0392B', marginTop: '4px' }}>
                No partners added to this project yet. Add partners first via the Partners tab.
              </p>
            )}
          </div>
          <div>
            <label style={lbl}>Version</label>
            <select value={version} onChange={e => setVersion(e.target.value)} style={inp}>
              {['V1', 'V2', 'V3', 'V4', 'V5'].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Director <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input
              type="text"
              value={director}
              onChange={e => setDirector(e.target.value)}
              placeholder="Director name"
              style={inp}
            />
          </div>
          <div>
            <label style={lbl}>Notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any notes…"
              style={inp}
            />
          </div>

          {/* Creative treatment upload */}
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #EEEEEE', paddingTop: '16px' }}>
            <label style={lbl}>
              Creative Treatment{' '}
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional — PDF, PPT, Keynote, Word, ZIP)</span>
            </label>
            <input
              ref={creativeRef}
              type="file"
              accept=".pdf,.ppt,.pptx,.key,.doc,.docx,.zip"
              style={{ ...inp, cursor: 'pointer', padding: '7px 12px' }}
            />
            <p style={{ fontSize: '11px', color: '#888888', marginTop: '4px' }}>
              If provided, a bid record will be created alongside this budget so it appears in the Bid Review page.
            </p>
          </div>
        </div>
      </div>

      {/* Budget builder */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>Line Items</h2>
        <p style={{ fontSize: '12px', color: '#888888', marginBottom: '20px' }}>
          Fill in only the positions relevant to this project. Zero rows are ignored. All figures should be <strong>net</strong>, excluding VAT and production markup.
        </p>
        <BudgetBuilder ref={budgetBuilderRef} draftKey={draftKey} />
      </div>

      {error && (
        <div style={{ padding: '10px 14px', backgroundColor: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: '4px', fontSize: '13px', color: '#c0392b', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={submitting || partners.length === 0}
          style={{
            backgroundColor: submitting ? '#26A69A' : '#00897B',
            color: '#FFFFFF',
            padding: '11px 28px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: submitting || partners.length === 0 ? 'not-allowed' : 'pointer',
            fontFamily: "'Poppins', Calibri, Arial, sans-serif",
          }}
        >
          {submitting ? 'Saving…' : 'Save Budget ›'}
        </button>
      </div>
    </form>
  )
}
