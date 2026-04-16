'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { saveBidNotesAction, approveBidAction, analyzeBidAction } from './actions'

const partnerStatusColour: Record<string, string> = {
  'Long List': '#888888', 'Short List': '#F39C12', 'Approached': '#2980B9',
  'Pitch': '#8E44AD', 'Awarded': '#27AE60', 'Not Awarded': '#C0392B',
}

function fmtEur(n: number | null): string {
  if (!n) return '—'
  return '€\u202f' + Number(n).toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

interface Props {
  projectId: string
  partner: {
    id: string
    company_name: string
    status: string
    bid_approved: boolean
  }
  bid: {
    id: string
    creative_url: string | null
    ai_summary: string | null
    ai_flags: string[]
    consultant_notes: string | null
    shift_recommendation: string | null
    approved_for_client: boolean
  } | null
  budget: {
    id: string
    total_net: number | null
    director: string | null
    version: string
  } | null
  isShift: boolean
}

export default function BidReviewCard({ projectId, partner, bid, budget, isShift }: Props) {
  const [notes, setNotes] = useState(bid?.consultant_notes ?? '')
  const [recommendation, setRecommendation] = useState(bid?.shift_recommendation ?? '')
  const [approved, setApproved] = useState(bid?.approved_for_client ?? false)
  const [savedMsg, setSavedMsg] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const statusC = partnerStatusColour[partner.status] ?? '#888888'
  const hasAI = !!(bid?.ai_summary)

  async function handleSaveNotes() {
    if (!bid) return
    setError('')
    startTransition(async () => {
      try {
        await saveBidNotesAction(bid.id, projectId, notes, recommendation)
        setSavedMsg('Saved')
        setTimeout(() => setSavedMsg(''), 2000)
      } catch (e: any) {
        setError(e.message)
      }
    })
  }

  async function handleApprove() {
    if (!bid) return
    const next = !approved
    setApproved(next)
    setError('')
    startTransition(async () => {
      try {
        await approveBidAction(bid.id, partner.id, projectId, next)
      } catch (e: any) {
        setApproved(!next) // revert
        setError(e.message)
      }
    })
  }

  async function handleAnalyze() {
    if (!bid || !budget) return
    setError('')
    startTransition(async () => {
      try {
        await analyzeBidAction(bid.id, budget.id, projectId)
      } catch (e: any) {
        setError(e.message)
      }
    })
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '8px 10px', fontSize: '13px',
    fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    border: '1px solid #DDDDDD', borderRadius: '4px',
    backgroundColor: '#FFFFFF', color: '#111111', outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: isShift ? '2px solid #00897B' : '1px solid #DDDDDD',
      borderRadius: '4px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid #EEEEEE',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: isShift ? '#E8F5F3' : '#FAFAFA',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111111' }}>
              {partner.company_name}
              {isShift && <span style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', marginLeft: '8px' }}>INTERNAL</span>}
            </h2>
            <span style={{ fontSize: '11px', fontWeight: 700, color: statusC, backgroundColor: statusC + '18', padding: '2px 7px', borderRadius: '3px' }}>
              {partner.status}
            </span>
          </div>
          {budget?.director && (
            <p style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>Dir: {budget.director}</p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {budget && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Total Net</p>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#111111' }}>{fmtEur(budget.total_net)}</p>
            </div>
          )}
          {/* Approve toggle */}
          <button
            onClick={handleApprove}
            disabled={isPending || !bid}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: "'Poppins', Calibri, Arial, sans-serif",
              backgroundColor: approved ? '#27AE60' : '#FFFFFF',
              color: approved ? '#FFFFFF' : '#888888',
              border: `1px solid ${approved ? '#27AE60' : '#DDDDDD'}`,
              borderRadius: '4px',
              cursor: isPending || !bid ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {approved ? '✓ Approved for client' : 'Approve for client'}
          </button>
        </div>
      </div>

      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Links */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {bid?.creative_url ? (
              <a
                href={bid.creative_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', fontWeight: 700, color: '#2980B9', textDecoration: 'none', padding: '6px 12px', border: '1px solid #2980B9', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                📄 Creative Treatment
              </a>
            ) : (
              <span style={{ fontSize: '12px', color: '#AAAAAA', padding: '6px 12px', border: '1px solid #EEEEEE', borderRadius: '4px' }}>
                No creative treatment
              </span>
            )}
            {budget && (
              <Link
                href={`/admin/projects/${projectId}/budgets/${budget.id}`}
                style={{ fontSize: '12px', fontWeight: 700, color: '#00897B', textDecoration: 'none', padding: '6px 12px', border: '1px solid #00897B', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                📊 Budget Detail ({budget.version})
              </Link>
            )}
          </div>

          {/* AI Analysis */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#555555', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px' }}>AI Budget Analysis</p>
            {hasAI ? (
              <div>
                <div style={{ padding: '12px 14px', backgroundColor: '#E8F5F3', borderRadius: '4px', marginBottom: '10px' }}>
                  <p style={{ fontSize: '13px', color: '#111111', lineHeight: 1.6 }}>{bid!.ai_summary}</p>
                </div>
                {bid!.ai_flags?.length > 0 && (
                  <div>
                    {bid!.ai_flags.map((flag, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', flexShrink: 0 }}>⚠</span>
                        <p style={{ fontSize: '12px', color: '#555555', lineHeight: 1.5 }}>{flag}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={handleAnalyze}
                  disabled={isPending || !budget}
                  style={{ marginTop: '8px', fontSize: '11px', color: '#888888', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'Poppins', Calibri, Arial, sans-serif" }}
                >
                  {isPending ? 'Analysing…' : '↻ Re-analyse'}
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '12px', color: '#888888', marginBottom: '10px' }}>
                  {budget ? 'Run AI analysis to generate a budget summary and flag potential issues.' : 'No budget submitted yet.'}
                </p>
                {budget && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isPending}
                    style={{
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: "'Poppins', Calibri, Arial, sans-serif",
                      backgroundColor: isPending ? '#26A69A' : '#00897B',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isPending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isPending ? 'Analysing…' : '✦ Analyse Budget'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right column — consultant review */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#555555', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>SHIFT Recommendation</p>
            <select
              value={recommendation}
              onChange={e => setRecommendation(e.target.value)}
              style={{ ...inp, marginBottom: '10px' }}
            >
              <option value="">— Not set —</option>
              <option value="Recommend">✓ Recommend</option>
              <option value="Neutral">Neutral</option>
              <option value="Don't Recommend">✗ Don't Recommend</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#555555', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Consultant Notes
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Internal notes, observations, red flags…"
              style={{ ...inp, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleSaveNotes}
              disabled={isPending || !bid}
              style={{
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: "'Poppins', Calibri, Arial, sans-serif",
                backgroundColor: '#111111',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: isPending || !bid ? 'not-allowed' : 'pointer',
              }}
            >
              {isPending ? 'Saving…' : 'Save Notes'}
            </button>
            {savedMsg && <span style={{ fontSize: '12px', color: '#27AE60', fontWeight: 700 }}>✓ {savedMsg}</span>}
          </div>

          {error && (
            <p style={{ fontSize: '12px', color: '#C0392B' }}>{error}</p>
          )}

          {!bid && (
            <p style={{ fontSize: '12px', color: '#AAAAAA', fontStyle: 'italic' }}>
              This partner hasn't submitted a bid yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
