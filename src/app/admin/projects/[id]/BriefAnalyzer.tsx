'use client'

import { useActionState } from 'react'
import { analyzeBriefAction } from '../actions'

export default function BriefAnalyzer({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState(analyzeBriefAction, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="project_id" value={projectId} />
      <textarea
        name="brief_text"
        rows={6}
        placeholder="Paste brief text here to analyse..."
        style={{
          width: '100%', padding: '12px', fontSize: '13px',
          fontFamily: "'Poppins', Calibri, Arial, sans-serif",
          border: '1px solid #DDDDDD', borderRadius: '4px',
          backgroundColor: '#FAFAFA', color: '#111111', outline: 'none',
          resize: 'vertical', boxSizing: 'border-box', marginBottom: '12px',
        }}
      />
      {state?.error && (
        <div style={{ padding: '10px 14px', backgroundColor: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: '4px', fontSize: '13px', color: '#c0392b', marginBottom: '12px' }}>
          {state.error}
        </div>
      )}
      {state && 'success' in state && (
        <div style={{ padding: '14px 16px', backgroundColor: '#E8F5F3', border: '1px solid #A5D6A7', borderRadius: '4px', marginBottom: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00695C', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Analysis complete</p>
          {'flags' in state && state.flags && state.flags.length > 0 && (
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#888888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Flags</p>
              {(state.flags as string[]).map((flag: string, i: number) => (
                <p key={i} style={{ fontSize: '13px', color: '#555555', marginBottom: '4px' }}>⚠ {flag}</p>
              ))}
            </div>
          )}
        </div>
      )}
      <button type="submit" disabled={pending} style={{
        backgroundColor: pending ? '#26A69A' : '#00897B', color: '#FFFFFF',
        padding: '9px 20px', border: 'none', borderRadius: '4px',
        fontSize: '13px', fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer',
        fontFamily: "'Poppins', Calibri, Arial, sans-serif",
      }}>
        {pending ? 'Analysing...' : 'Analyse with Claude ›'}
      </button>
    </form>
  )
}
