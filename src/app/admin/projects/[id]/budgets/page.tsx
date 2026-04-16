import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fmtDate } from '@/lib/utils/format-date'
import { BUDGET_SECTIONS } from '@/lib/budget/positions'

export const metadata = { title: 'Budgets — SHIFT Platform' }

const statusColour: Record<string, string> = {
  'Draft': '#888888',
  'Submitted': '#F39C12',
  'Under Review': '#2980B9',
  'Approved': '#27AE60',
  'Rejected': '#C0392B',
}

function fmtEur(n: number | null): string {
  if (!n || n === 0) return '—'
  return '€\u202f' + Number(n).toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default async function BudgetsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: budgets }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, project_id, project_name, budget')
      .eq('id', id)
      .single(),
    supabase
      .from('budgets')
      .select(`
        id, version, status, director, total_net, submitted_at, created_at,
        production_partners ( company_name, contact_name ),
        budget_line_items ( section_number, amount )
      `)
      .eq('project_id', id)
      .order('submitted_at', { ascending: false }),
  ])

  if (!project) notFound()

  // Build section subtotals per budget for comparison table
  function sectionSubtotals(items: { section_number: number; amount: number }[]) {
    const map: Record<number, number> = {}
    for (const item of items ?? []) {
      map[item.section_number] = (map[item.section_number] ?? 0) + item.amount
    }
    return map
  }

  const clientBudget = project.budget ?? null

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          <Link href="/admin/projects" style={{ color: '#00897B', textDecoration: 'none' }}>Projects</Link>
          {' / '}<Link href={`/admin/projects/${id}`} style={{ color: '#00897B', textDecoration: 'none' }}>{project.project_id}</Link>
          {' / Budgets'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>Production Budgets</h1>
            <p style={{ fontSize: '13px', color: '#888888', marginTop: '4px' }}>{project.project_name}</p>
          </div>
          <Link
            href={`/admin/projects/${id}/budgets/new`}
            style={{ backgroundColor: '#00897B', color: '#FFFFFF', padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            + Add Budget
          </Link>
          {clientBudget && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '2px' }}>Client Budget</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#111111' }}>{fmtEur(clientBudget)}</p>
            </div>
          )}
        </div>
      </div>

      {!budgets?.length ? (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '64px', textAlign: 'center', color: '#888888', fontSize: '14px' }}>
          No budgets submitted yet. Budgets appear here once production partners submit via the bid portal.
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '32px' }}>
            {budgets.map(b => {
              const partner = b.production_partners as any
              const statusC = statusColour[b.status] ?? '#888888'
              const items = (b.budget_line_items ?? []) as { section_number: number; amount: number }[]
              const variance = clientBudget && b.total_net ? b.total_net - clientBudget : null

              return (
                <Link
                  key={b.id}
                  href={`/admin/projects/${id}/budgets/${b.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DDDDDD',
                    borderRadius: '4px',
                    padding: '20px',
                    borderTop: `3px solid ${statusC}`,
                    cursor: 'pointer',
                    transition: 'box-shadow 0.1s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>{partner?.company_name ?? '—'}</p>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: statusC, backgroundColor: statusC + '18', padding: '2px 7px', borderRadius: '3px' }}>
                        {b.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '22px', fontWeight: 700, color: '#111111', marginBottom: '4px' }}>
                      {fmtEur(b.total_net)}
                    </p>
                    {variance !== null && (
                      <p style={{ fontSize: '11px', fontWeight: 700, color: variance > 0 ? '#C0392B' : '#27AE60' }}>
                        {variance > 0 ? '+' : ''}{fmtEur(Math.abs(variance))} vs client budget
                      </p>
                    )}
                    <p style={{ fontSize: '11px', color: '#AAAAAA', marginTop: '8px' }}>
                      {b.director ? `Dir: ${b.director} · ` : ''}{items.length} line items
                    </p>
                    <p style={{ fontSize: '11px', color: '#CCCCCC', marginTop: '4px' }}>
                      {b.submitted_at ? `Submitted ${fmtDate(b.submitted_at)}` : `Created ${fmtDate(b.created_at)}`}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Comparison table */}
          {budgets.length > 1 && (
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #EEEEEE' }}>
                <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111' }}>Section Comparison</h2>
                <p style={{ fontSize: '12px', color: '#888888', marginTop: '2px' }}>Net costs by section across all submitted budgets</p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F6F5F2' }}>
                      <th style={{ padding: '10px 20px', textAlign: 'left', fontWeight: 700, color: '#555555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                        Section
                      </th>
                      {budgets.map(b => {
                        const partner = b.production_partners as any
                        return (
                          <th key={b.id} style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#555555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                            {partner?.company_name ?? '—'}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {BUDGET_SECTIONS.map((section, idx) => {
                      const sectionAmounts = budgets.map(b => {
                        const items = (b.budget_line_items ?? []) as { section_number: number; amount: number }[]
                        return sectionSubtotals(items)[section.number] ?? 0
                      })
                      const hasAny = sectionAmounts.some(a => a > 0)
                      if (!hasAny) return null

                      const min = Math.min(...sectionAmounts.filter(a => a > 0))

                      return (
                        <tr key={section.number} style={{ borderBottom: '1px solid #F5F5F5', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                          <td style={{ padding: '10px 20px', color: '#333333', fontWeight: 600 }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#AAAAAA', marginRight: '8px' }}>
                              {section.number}.
                            </span>
                            {section.name}
                          </td>
                          {sectionAmounts.map((amount, i) => (
                            <td key={i} style={{
                              padding: '10px 16px',
                              textAlign: 'right',
                              fontWeight: amount > 0 ? 700 : 400,
                              color: amount === 0 ? '#DDDDDD' : amount === min ? '#27AE60' : '#111111',
                            }}>
                              {fmtEur(amount)}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                    {/* Totals row */}
                    <tr style={{ borderTop: '2px solid #111111', backgroundColor: '#F6F5F2' }}>
                      <td style={{ padding: '12px 20px', fontWeight: 700, color: '#111111', fontSize: '13px' }}>Total Net</td>
                      {budgets.map(b => (
                        <td key={b.id} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#111111', fontSize: '13px' }}>
                          {fmtEur(b.total_net)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
