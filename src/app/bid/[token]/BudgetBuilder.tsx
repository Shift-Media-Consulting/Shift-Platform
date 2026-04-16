'use client'

import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import {
  BUDGET_SECTIONS,
  BUDGET_POSITIONS,
  calcAmount,
  type BudgetPosition,
} from '@/lib/budget/positions'

// ── Types ────────────────────────────────────────────────────

export interface LineItemInput {
  quantity: string
  days: string
  rate: string
  notes: string
}

export type BudgetFormState = Record<string, LineItemInput>  // keyed by position code

export interface BudgetBuilderHandle {
  getData: () => BudgetFormState
  getTotal: () => number
}

interface Props {
  draftKey: string  // for localStorage persistence
}

// ── Helpers ──────────────────────────────────────────────────

const empty = (): LineItemInput => ({ quantity: '', days: '', rate: '', notes: '' })

function parseNum(s: string): number {
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}

function calcLine(item: LineItemInput): number {
  const q = parseNum(item.quantity)
  const d = parseNum(item.days)
  const r = parseNum(item.rate)
  if (q === 0 || r === 0) return 0
  return calcAmount(q, d === 0 ? 1 : d, r)
}

function fmtEur(n: number): string {
  if (n === 0) return '—'
  return '€\u202f' + n.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// ── Styles ───────────────────────────────────────────────────

const S = {
  input: {
    width: '100%',
    padding: '6px 8px',
    fontSize: '13px',
    fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    border: '1px solid #DDDDDD',
    borderRadius: '3px',
    backgroundColor: '#FAFAFA',
    color: '#111111',
    outline: 'none',
    textAlign: 'right' as const,
    boxSizing: 'border-box' as const,
  },
  notesInput: {
    width: '100%',
    padding: '6px 8px',
    fontSize: '12px',
    fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    border: '1px solid #DDDDDD',
    borderRadius: '3px',
    backgroundColor: '#FAFAFA',
    color: '#555555',
    outline: 'none',
    textAlign: 'left' as const,
    boxSizing: 'border-box' as const,
  },
}

// ── Component ─────────────────────────────────────────────────

const BudgetBuilder = forwardRef<BudgetBuilderHandle, Props>(({ draftKey }, ref) => {
  const [formState, setFormState] = useState<BudgetFormState>({})
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([1]))

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved) setFormState(JSON.parse(saved))
    } catch {}
  }, [draftKey])

  // Save draft on every change
  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(formState))
    } catch {}
  }, [formState, draftKey])

  // Expose getData to parent via ref
  useImperativeHandle(ref, () => ({
    getData: () => formState,
    getTotal: () => {
      let total = 0
      for (const item of Object.values(formState)) {
        total += calcLine(item)
      }
      return total
    },
  }))

  function updateField(code: string, field: keyof LineItemInput, value: string) {
    setFormState(prev => ({
      ...prev,
      [code]: { ...(prev[code] ?? empty()), [field]: value },
    }))
  }

  function toggleSection(n: number) {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  // Group positions by section
  const bySection = useMemo(() => {
    const map = new Map<number, BudgetPosition[]>()
    for (const s of BUDGET_SECTIONS) map.set(s.number, [])
    for (const p of BUDGET_POSITIONS) map.get(p.section)?.push(p)
    return map
  }, [])

  // Section subtotals
  const sectionTotals = useMemo(() => {
    const totals: Record<number, number> = {}
    for (const s of BUDGET_SECTIONS) {
      let total = 0
      for (const pos of bySection.get(s.number) ?? []) {
        const item = formState[pos.code]
        if (item) total += calcLine(item)
      }
      totals[s.number] = total
    }
    return totals
  }, [formState, bySection])

  const grandTotal = useMemo(
    () => Object.values(sectionTotals).reduce((a, b) => a + b, 0),
    [sectionTotals]
  )

  const colW = { name: '42%', qty: '10%', days: '10%', rate: '13%', amount: '14%', notes: '11%' }

  return (
    <div>
      {/* Column header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `${colW.name} ${colW.qty} ${colW.days} ${colW.rate} ${colW.amount} ${colW.notes}`,
        gap: '6px',
        padding: '0 0 8px',
        borderBottom: '2px solid #111111',
        marginBottom: '4px',
      }}>
        {['Position', 'Qty', 'Days', 'Rate (€)', 'Amount (€)', 'Notes'].map(h => (
          <span key={h} style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {h}
          </span>
        ))}
      </div>

      {/* Sections */}
      {BUDGET_SECTIONS.map(section => {
        const positions = bySection.get(section.number) ?? []
        const isOpen = openSections.has(section.number)
        const subtotal = sectionTotals[section.number]
        const hasValues = subtotal > 0

        return (
          <div key={section.number} style={{ borderBottom: '1px solid #EEEEEE' }}>
            {/* Section header — clickable */}
            <button
              type="button"
              onClick={() => toggleSection(section.number)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Poppins', Calibri, Arial, sans-serif",
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  backgroundColor: hasValues ? '#00897B' : '#AAAAAA',
                  padding: '2px 7px',
                  borderRadius: '3px',
                  letterSpacing: '0.3px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}>
                  {section.number}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>
                  {section.name}
                </span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {hasValues && (
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#00897B' }}>
                    {fmtEur(subtotal)}
                  </span>
                )}
                <span style={{ fontSize: '11px', color: '#AAAAAA' }}>{isOpen ? '▲' : '▼'}</span>
              </span>
            </button>

            {/* Position rows */}
            {isOpen && (
              <div style={{ paddingBottom: '12px' }}>
                {positions.map(pos => {
                  const item = formState[pos.code] ?? empty()
                  const amount = calcLine(item)

                  return (
                    <div
                      key={pos.code}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `${colW.name} ${colW.qty} ${colW.days} ${colW.rate} ${colW.amount} ${colW.notes}`,
                        gap: '6px',
                        alignItems: 'center',
                        padding: '4px 0',
                        backgroundColor: amount > 0 ? '#F6FFF8' : 'transparent',
                        borderRadius: '3px',
                        marginBottom: '2px',
                      }}
                    >
                      {/* Name */}
                      <div style={{ paddingLeft: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#333333' }}>{pos.name}</span>
                        {pos.hint && (
                          <span style={{ fontSize: '10px', color: '#AAAAAA', display: 'block' }}>
                            {pos.hint}
                          </span>
                        )}
                      </div>

                      {/* Qty */}
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={item.quantity}
                        onChange={e => updateField(pos.code, 'quantity', e.target.value)}
                        style={S.input}
                      />

                      {/* Days */}
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="1"
                        value={item.days}
                        onChange={e => updateField(pos.code, 'days', e.target.value)}
                        style={S.input}
                      />

                      {/* Rate */}
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={item.rate}
                        onChange={e => updateField(pos.code, 'rate', e.target.value)}
                        style={S.input}
                      />

                      {/* Amount (calculated) */}
                      <div style={{
                        textAlign: 'right',
                        fontSize: '13px',
                        fontWeight: amount > 0 ? 700 : 400,
                        color: amount > 0 ? '#111111' : '#CCCCCC',
                        paddingRight: '4px',
                      }}>
                        {fmtEur(amount)}
                      </div>

                      {/* Notes */}
                      <input
                        type="text"
                        placeholder="note"
                        value={item.notes}
                        onChange={e => updateField(pos.code, 'notes', e.target.value)}
                        style={S.notesInput}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Grand total */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0 0',
        borderTop: '2px solid #111111',
        marginTop: '8px',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Total Net Budget
        </span>
        <span style={{ fontSize: '20px', fontWeight: 700, color: grandTotal > 0 ? '#00897B' : '#CCCCCC' }}>
          {grandTotal > 0 ? fmtEur(grandTotal) : '—'}
        </span>
      </div>

      {/* Legend */}
      <p style={{ fontSize: '11px', color: '#AAAAAA', marginTop: '12px', lineHeight: 1.6 }}>
        Amount = Qty × Days × Rate. Leave Days blank for non-day-rate items (treated as 1 day).
        All figures are net, excluding VAT and production markup.
        <br />
        Your draft is auto-saved to this browser. It will be cleared on submission.
      </p>
    </div>
  )
})

BudgetBuilder.displayName = 'BudgetBuilder'

export default BudgetBuilder
