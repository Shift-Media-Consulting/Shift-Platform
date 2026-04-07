'use client'

import { useActionState } from 'react'
import { createProjectAction } from '../actions'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const sectors = ['Automotive','Retail','Telecommunications','FMCG','Financial Services','Pharmaceutical','Technology','Fashion','Food & Beverage','Entertainment','Travel & Tourism','Sports','Luxury','Healthcare','Energy','Other']
const projectTypes = ['Film','Social Media','Photo','Activation']
const statuses = ['Setup','Partner Selection','In Production','Post Production','Delivered','Archived']
const consultants = ['Justin Stiebel','Cornelius Roenz']

const inputStyle = { width: '100%', padding: '9px 12px', fontSize: '13px', fontFamily: "'Poppins', Calibri, Arial, sans-serif", border: '1px solid #DDDDDD', borderRadius: '4px', backgroundColor: '#FFFFFF', color: '#111111', outline: 'none', boxSizing: 'border-box' as const }
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 700 as const, color: '#555555', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '6px' }

function NewProjectForm({ clients }: { clients: { id: string; company_name: string }[] }) {
  const [state, formAction, pending] = useActionState(createProjectAction, null)
  const searchParams = useSearchParams()
  const preselectedClientId = searchParams.get('client_id') ?? ''

  return (
    <form action={formAction}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Project Name *</label>
          <input name="project_name" type="text" required style={inputStyle} placeholder="Summer Campaign 2026" />
        </div>
        <div>
          <label style={labelStyle}>Client *</label>
          <select name="client_id" required style={inputStyle} defaultValue={preselectedClientId}>
            <option value="">Select client...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Consultant *</label>
          <select name="consultant" required style={inputStyle}>
            <option value="">Select...</option>
            {consultants.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Sector *</label>
          <select name="sector" required style={inputStyle}>
            <option value="">Select sector...</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select name="status" style={inputStyle} defaultValue="Setup">
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Budget (€)</label>
          <input name="budget" type="number" min="0" step="100" style={inputStyle} placeholder="0" />
        </div>
        <div>
          <label style={labelStyle}>Project Type</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
            {projectTypes.map(t => (
              <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555555', cursor: 'pointer' }}>
                <input type="checkbox" name="project_type" value={t} style={{ accentColor: '#00897B' }} />
                {t}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Buyouts</label>
          <select name="buyouts" style={inputStyle}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #EEEEEE', paddingTop: '20px', marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px' }}>Agency (optional)</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Agency Name</label>
            <input name="agency_name" type="text" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Agency Contact</label>
            <input name="agency_contact" type="text" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Agency Email</label>
            <input name="agency_contact_email" type="email" style={inputStyle} />
          </div>
        </div>
      </div>

      {state?.error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: '4px', fontSize: '13px', color: '#c0392b', marginBottom: '16px' }}>
          {state.error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={pending} style={{ backgroundColor: pending ? '#26A69A' : '#00897B', color: '#FFFFFF', padding: '10px 24px', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer', fontFamily: "'Poppins', Calibri, Arial, sans-serif" }}>
          {pending ? 'Creating...' : 'Create Project'}
        </button>
        <Link href="/admin/projects" style={{ padding: '10px 20px', border: '1px solid #DDDDDD', borderRadius: '4px', fontSize: '13px', color: '#555555', textDecoration: 'none' }}>Cancel</Link>
      </div>
    </form>
  )
}

// Server data fetching wrapper — this page needs to be server rendered for the clients list
// but we use a client component for the form. We export a server component that pre-fetches
// and passes data down.
import { createClient as createServerClient } from '@/lib/supabase/server'

export default async function NewProjectPage() {
  const supabase = await createServerClient()
  const { data: clients } = await supabase.from('clients').select('id, company_name').order('company_name')

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Projects</p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111' }}>New Project</h1>
        </div>
        <Link href="/admin/projects" style={{ fontSize: '13px', color: '#888888', textDecoration: 'none' }}>‹ Back to projects</Link>
      </div>
      <div style={{ maxWidth: '800px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '40px' }}>
          <Suspense fallback={null}>
            <NewProjectForm clients={clients ?? []} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
