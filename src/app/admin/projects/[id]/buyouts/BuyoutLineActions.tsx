'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { updateBuyoutStatusAction, deleteBuyoutLineItemAction } from './actions'

const STATUSES = ['Active', 'Pending Renewal', 'Renewed', 'Expired']

export default function BuyoutLineActions({ item, projectId }: { item: { id: string; talent_name: string; status: string }; projectId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (status: string) => {
    startTransition(async () => {
      await updateBuyoutStatusAction(item.id, projectId, status)
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (!confirm(`Delete buyout for "${item.talent_name}"?`)) return
    startTransition(async () => {
      await deleteBuyoutLineItemAction(item.id, projectId)
      router.refresh()
    })
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <select
        value={item.status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isPending}
        style={{
          fontSize: '11px', padding: '3px 6px',
          border: '1px solid #DDDDDD', borderRadius: '3px',
          color: '#555555', cursor: 'pointer', backgroundColor: '#FFFFFF',
        }}
      >
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <button
        onClick={handleDelete}
        disabled={isPending}
        style={{ fontSize: '11px', color: '#C0392B', background: 'none', border: 'none', cursor: 'pointer', padding: '0', opacity: isPending ? 0.5 : 1 }}
      >
        Delete
      </button>
    </div>
  )
}
