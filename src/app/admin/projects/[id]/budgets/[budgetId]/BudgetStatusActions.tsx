'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const STATUSES = ['Submitted', 'Under Review', 'Approved', 'Rejected'] as const
type BudgetStatus = typeof STATUSES[number]

const statusColour: Record<string, string> = {
  'Submitted': '#F39C12',
  'Under Review': '#2980B9',
  'Approved': '#27AE60',
  'Rejected': '#C0392B',
}

export default function BudgetStatusActions({
  budgetId,
  currentStatus,
}: {
  budgetId: string
  currentStatus: string
}) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function setStatus(status: BudgetStatus) {
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase
      .from('budgets')
      .update({ status })
      .eq('id', budgetId)
    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false)
    router.refresh()
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '20px' }}>
      <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '14px' }}>Update Status</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {STATUSES.filter(s => s !== currentStatus).map(status => (
          <button
            key={status}
            disabled={saving}
            onClick={() => setStatus(status)}
            style={{
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: "'Poppins', Calibri, Arial, sans-serif",
              backgroundColor: statusColour[status] + '18',
              border: `1px solid ${statusColour[status]}44`,
              borderRadius: '4px',
              color: statusColour[status],
              cursor: saving ? 'not-allowed' : 'pointer',
              textAlign: 'left',
            }}
          >
            Mark as {status} ›
          </button>
        ))}
      </div>
      {error && (
        <p style={{ fontSize: '12px', color: '#C0392B', marginTop: '10px' }}>{error}</p>
      )}
    </div>
  )
}
