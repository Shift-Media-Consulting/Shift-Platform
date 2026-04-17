'use client'

import { usePathname } from 'next/navigation'
import { setPreviewClientAction } from './actions'

interface Client {
  id: string
  company_name: string
}

export default function PreviewBanner({
  clients,
  selectedClientId,
  selectedClientName,
}: {
  clients: Client[]
  selectedClientId: string | null
  selectedClientName: string | null
}) {
  const pathname = usePathname()

  return (
    <div style={{
      backgroundColor: '#1A1A2E',
      borderBottom: '2px solid #00897B',
      padding: '0 40px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: "'Poppins', Calibri, Arial, sans-serif",
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, color: '#00897B',
          letterSpacing: '1px', textTransform: 'uppercase',
          backgroundColor: '#00897B18', padding: '3px 8px', borderRadius: '3px', border: '1px solid #00897B44',
        }}>
          Admin Preview
        </span>
        <span style={{ fontSize: '12px', color: '#888888' }}>Viewing as client:</span>

        {/* Client selector */}
        <form action={setPreviewClientAction} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="hidden" name="redirectTo" value="/client" />
          <select
            name="clientId"
            defaultValue={selectedClientId ?? ''}
            onChange={e => {
              const form = e.currentTarget.form
              if (form) form.requestSubmit()
            }}
            style={{
              fontSize: '12px', fontWeight: 700, color: '#FFFFFF',
              backgroundColor: '#2A2A3E', border: '1px solid #444466',
              borderRadius: '4px', padding: '4px 8px',
              fontFamily: "'Poppins', Calibri, Arial, sans-serif",
              cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="" disabled>Select client…</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.company_name}</option>
            ))}
          </select>
        </form>

        {selectedClientName && (
          <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 700 }}>
            — {selectedClientName}
          </span>
        )}
      </div>

      {/* Back to admin */}
      <a
        href="/admin"
        style={{
          fontSize: '12px', fontWeight: 700, color: '#00897B',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px',
        }}
      >
        ‹ Back to Admin
      </a>
    </div>
  )
}
