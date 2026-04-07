'use client'

import { useActionState } from 'react'
import { addBuyoutLineItemAction } from './actions'

const MEDIA_TYPES = ['TV', 'Digital', 'Cinema', 'OOH', 'Radio', 'Print', 'Social']
const TERRITORIES = ['DE', 'AT', 'CH', 'DACH', 'EU', 'Worldwide']
const TALENT_TYPES = ['Actor', 'Model', 'Voice', 'Influencer', 'Celebrity', 'Musician', 'Athlete', 'Other']

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: '13px',
  fontFamily: "'Poppins', Calibri, Arial, sans-serif",
  border: '1px solid #DDDDDD', borderRadius: '4px',
  backgroundColor: '#FAFAFA', color: '#111111', outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: '10px', fontWeight: 700, color: '#888888',
  letterSpacing: '0.5px', textTransform: 'uppercase',
  display: 'block', marginBottom: '4px',
}

export default function AddBuyoutForm({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState(addBuyoutLineItemAction, null)

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <input type="hidden" name="project_id" value={projectId} />

      <div>
        <label style={labelStyle}>Talent Name *</label>
        <input name="talent_name" required style={inputStyle} placeholder="e.g. Anna Müller" />
      </div>

      <div>
        <label style={labelStyle}>Role / Character</label>
        <input name="role" style={inputStyle} placeholder="e.g. Lead Actor" />
      </div>

      <div>
        <label style={labelStyle}>Talent Type *</label>
        <select name="talent_type" required style={inputStyle}>
          <option value="">Select type…</option>
          {TALENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={labelStyle}>Rights Start</label>
          <input name="rights_start" type="date" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Rights End *</label>
          <input name="rights_end" type="date" required style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Buyout Fee (€) *</label>
        <input name="buyout_fee" type="number" min="0" step="0.01" required style={inputStyle} placeholder="0.00" />
      </div>

      <div>
        <label style={labelStyle}>Media Types</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
          {MEDIA_TYPES.map(m => (
            <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#555555', cursor: 'pointer' }}>
              <input type="checkbox" name="media_types" value={m} />
              {m}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Territories</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
          {TERRITORIES.map(t => (
            <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#555555', cursor: 'pointer' }}>
              <input type="checkbox" name="territories" value={t} />
              {t}
            </label>
          ))}
        </div>
      </div>

      {state?.error && (
        <div style={{ padding: '10px 14px', backgroundColor: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: '4px', fontSize: '13px', color: '#c0392b' }}>
          {state.error}
        </div>
      )}
      {state && 'success' in state && (
        <div style={{ padding: '10px 14px', backgroundColor: '#E8F5F3', border: '1px solid #A5D6A7', borderRadius: '4px', fontSize: '13px', color: '#00695C' }}>
          Line item added.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          backgroundColor: pending ? '#26A69A' : '#00897B', color: '#FFFFFF',
          padding: '9px 20px', border: 'none', borderRadius: '4px',
          fontSize: '13px', fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer',
          fontFamily: "'Poppins', Calibri, Arial, sans-serif",
        }}
      >
        {pending ? 'Adding…' : 'Add Line Item'}
      </button>
    </form>
  )
}
