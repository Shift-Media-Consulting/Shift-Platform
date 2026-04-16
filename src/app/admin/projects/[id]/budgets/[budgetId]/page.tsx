import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fmtDate } from '@/lib/utils/format-date'
import { BUDGET_SECTIONS } from '@/lib/budget/positions'
import BudgetStatusActions from './BudgetStatusActions'
import PrintButton from './PrintButton'

export const metadata = { title: 'Budget Detail — SHIFT Platform' }

function fmtEur(n: number | null | undefined): string {
  if (n == null || n === 0) return '—'
  return '€\u202f' + Number(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtNum(n: number | null | undefined): string {
  if (n == null || n === 0) return '—'
  return Number(n).toLocaleString('de-DE', { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })
}

const statusColour: Record<string, string> = {
  'Draft': '#888888',
  'Submitted': '#F39C12',
  'Under Review': '#2980B9',
  'Approved': '#27AE60',
  'Rejected': '#C0392B',
}

export default async function BudgetDetailPage({
  params,
}: {
  params: Promise<{ id: string; budgetId: string }>
}) {
  const { id, budgetId } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: budget }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, project_id, project_name, budget')
      .eq('id', id)
      .single(),
    supabase
      .from('budgets')
      .select(`
        *,
        production_partners ( company_name, contact_name, contact_email ),
        budget_line_items ( * )
      `)
      .eq('id', budgetId)
      .single(),
  ])

  if (!project || !budget) notFound()

  const partner = budget.production_partners as any
  const lineItems = ((budget.budget_line_items ?? []) as any[]).sort(
    (a, b) => a.sort_order - b.sort_order
  )

  // Group line items by section
  const bySectionNumber = new Map<number, any[]>()
  for (const item of lineItems) {
    if (!bySectionNumber.has(item.section_number)) {
      bySectionNumber.set(item.section_number, [])
    }
    bySectionNumber.get(item.section_number)!.push(item)
  }

  // Section subtotals
  const sectionTotals = new Map<number, number>()
  for (const [sn, items] of bySectionNumber) {
    sectionTotals.set(sn, items.reduce((a: number, b: any) => a + Number(b.amount), 0))
  }

  const clientBudget = project.budget ?? null
  const variance = clientBudget && budget.total_net ? budget.total_net - clientBudget : null
  const statusC = statusColour[budget.status] ?? '#888888'

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          <Link href="/admin/projects" style={{ color: '#00897B', textDecoration: 'none' }}>Projects</Link>
          {' / '}<Link href={`/admin/projects/${id}`} style={{ color: '#00897B', textDecoration: 'none' }}>{project.project_id}</Link>
          {' / '}<Link href={`/admin/projects/${id}/budgets`} style={{ color: '#00897B', textDecoration: 'none' }}>Budgets</Link>
          {' / '}{partner?.company_name}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111111' }}>{partner?.company_name}</h1>
            <p style={{ fontSize: '13px', color: '#888888', marginTop: '2px' }}>
              {project.project_name}
              {budget.director ? ` · Dir: ${budget.director}` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PrintButton />
            <span style={{ fontSize: '12px', fontWeight: 700, color: statusC, backgroundColor: statusC + '18', padding: '6px 14px', borderRadius: '4px' }}>
              {budget.status}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          {
            label: 'Total Net Budget',
            value: fmtEur(budget.total_net),
            sub: 'excl. VAT & markup',
            highlight: true,
          },
          {
            label: 'Client Budget',
            value: clientBudget ? fmtEur(clientBudget) : '—',
            sub: 'approved by client',
          },
          {
            label: 'Variance',
            value: variance != null ? (variance > 0 ? '+' : '') + fmtEur(Math.abs(variance)) : '—',
            sub: variance != null ? (variance > 0 ? 'over client budget' : 'under client budget') : 'no client budget set',
            colour: variance != null ? (variance > 0 ? '#C0392B' : '#27AE60') : '#888888',
          },
          {
            label: 'Line Items',
            value: String(lineItems.length),
            sub: `across ${bySectionNumber.size} sections`,
          },
        ].map(card => (
          <div key={card.label} style={{
            backgroundColor: '#FFFFFF',
            border: card.highlight ? '1px solid #00897B' : '1px solid #DDDDDD',
            borderRadius: '4px',
            padding: '16px 20px',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>{card.label}</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: card.colour ?? (card.highlight ? '#00897B' : '#111111'), marginBottom: '2px' }}>{card.value}</p>
            <p style={{ fontSize: '11px', color: '#AAAAAA' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* LEFT — Line items by section */}
        <div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Section summary + detail */}
            {BUDGET_SECTIONS.map(section => {
              const items = bySectionNumber.get(section.number) ?? []
              if (items.length === 0) return null
              const subtotal = sectionTotals.get(section.number) ?? 0
              const pct = budget.total_net > 0 ? (subtotal / budget.total_net) * 100 : 0

              return (
                <div key={section.number} style={{ borderBottom: '1px solid #EEEEEE' }}>
                  {/* Section header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 24px',
                    backgroundColor: '#FAFAFA',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 700, color: '#FFFFFF',
                        backgroundColor: '#00897B', padding: '2px 7px', borderRadius: '3px',
                        minWidth: '18px', textAlign: 'center',
                      }}>
                        {section.number}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>
                        {section.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#AAAAAA' }}>({items.length} items)</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#111111' }}>
                        {fmtEur(subtotal)}
                      </span>
                      <span style={{ fontSize: '11px', color: '#AAAAAA', marginLeft: '8px' }}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Line items */}
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F6F5F2' }}>
                        <th style={{ padding: '8px 24px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#AAAAAA', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Position</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '10px', fontWeight: 700, color: '#AAAAAA', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Qty</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '10px', fontWeight: 700, color: '#AAAAAA', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Days</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '10px', fontWeight: 700, color: '#AAAAAA', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Rate</th>
                        <th style={{ padding: '8px 24px', textAlign: 'right', fontSize: '10px', fontWeight: 700, color: '#AAAAAA', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item: any) => (
                        <tr key={item.id} style={{ borderTop: '1px solid #F5F5F5' }}>
                          <td style={{ padding: '10px 24px' }}>
                            <span style={{ fontSize: '12px', color: '#333333' }}>{item.name}</span>
                            {item.notes && (
                              <span style={{ fontSize: '11px', color: '#AAAAAA', display: 'block' }}>
                                {item.notes}
                              </span>
                            )}
                            <span style={{ fontSize: '10px', color: '#CCCCCC' }}>{item.position_code}</span>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555555' }}>{fmtNum(item.quantity)}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555555' }}>{fmtNum(item.days)}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '12px', color: '#555555' }}>{fmtEur(item.rate)}</td>
                          <td style={{ padding: '10px 24px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#111111' }}>{fmtEur(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })}

            {/* Grand total row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 24px',
              backgroundColor: '#111111',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Net Budget
              </span>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#00897B' }}>
                {fmtEur(budget.total_net)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — Info & actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Section breakdown pie-style bar */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '20px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '16px' }}>Section Breakdown</h2>
            {BUDGET_SECTIONS.map(section => {
              const subtotal = sectionTotals.get(section.number) ?? 0
              if (subtotal === 0) return null
              const pct = budget.total_net > 0 ? (subtotal / budget.total_net) * 100 : 0

              return (
                <div key={section.number} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '11px', color: '#555555' }}>{section.name}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#111111' }}>
                      {fmtEur(subtotal)}
                    </span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: '#F0F0F0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: '#00897B',
                      borderRadius: '2px',
                      opacity: 0.6 + (pct / 100) * 0.4,
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Partner info */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '20px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '16px' }}>Submission Info</h2>
            {[
              { label: 'Company', value: partner?.company_name ?? '—' },
              { label: 'Contact', value: partner?.contact_name ?? '—' },
              { label: 'Email', value: partner?.contact_email ?? '—' },
              { label: 'Director', value: budget.director ?? '—' },
              { label: 'Version', value: budget.version },
              { label: 'Status', value: budget.status },
              { label: 'Submitted', value: budget.submitted_at ? fmtDate(budget.submitted_at) : '—' },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '1px' }}>{row.label}</p>
                <p style={{ fontSize: '13px', color: '#111111' }}>{row.value}</p>
              </div>
            ))}
          </div>

          {/* Status actions */}
          <BudgetStatusActions budgetId={budgetId} currentStatus={budget.status} />

          {/* Notes */}
          {budget.notes && (
            <div style={{ backgroundColor: '#E8F5F3', border: '1px solid #B2DFDB', borderRadius: '4px', padding: '16px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#00695C', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>Notes from Partner</p>
              <p style={{ fontSize: '13px', color: '#111111', lineHeight: 1.6 }}>{budget.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
