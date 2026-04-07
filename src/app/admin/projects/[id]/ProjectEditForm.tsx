'use client'

import { useActionState } from 'react'
import { updateProjectAction } from '../actions'

const sectors = ['Automotive','Retail','Telecommunications','FMCG','Financial Services','Pharmaceutical','Technology','Fashion','Food & Beverage','Entertainment','Travel & Tourism','Sports','Luxury','Healthcare','Energy','Other']
const projectTypes = ['Film','Social Media','Photo','Activation']
const statuses = ['Setup','Partner Selection','In Production','Post Production','Delivered','Archived']
const consultants = ['Justin Stiebel','Cornelius Roenz']

const inputStyle = { width: '100%', padding: '9px 12px', fontSize: '13px', fontFamily: "'Poppins', Calibri, Arial, sans-serif", border: '1px solid #DDDDDD', borderRadius: '4px', backgroundColor: '#FFFFFF', color: '#111111', outline: 'none', boxSizing: 'border-box' as const }
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 700 as const, color: '#555555', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '6px' }

export default function ProjectEditForm({ project, clients }: { project: any; clients: { id: string; company_name: string }[] }) {
  const [state, formAction, pending] = useActionState(updateProjectAction, null)
  const currentTypes: string[] = project.project_type ?? []

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={project.id} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Project Name</label>
          <input name="project_name" type="text" defaultValue={project.project_name} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Consultant</label>
          <select name="consultant" defaultValue={project.consultant} style={inputStyle}>
            {consultants.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select name="status" defaultValue={project.status} style={inputStyle}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Sector</label>
          <select name="sector" defaultValue={project.sector} style={inputStyle}>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Budget (€)</label>
          <input name="budget" type="number" min="0" step="100" defaultValue={project.budget ?? ''} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Project Types</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
            {projectTypes.map(t => (
              <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555555', cursor: 'pointer' }}>
                <input type="checkbox" name="project_type" value={t} defaultChecked={currentTypes.includes(t)} style={{ accentColor: '#00897B' }} />
                {t}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Buyouts</label>
          <select name="buyouts" defaultValue={project.buyouts ? 'true' : 'false'} style={inputStyle}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Agency Name</label>
          <input name="agency_name" type="text" defaultValue={project.agency_name ?? ''} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Agency Contact</label>
          <input name="agency_contact" type="text" defaultValue={project.agency_contact ?? ''} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Agency Email</label>
          <input name="agency_contact_email" type="email" defaultValue={project.agency_contact_email ?? ''} style={inputStyle} />
        </div>
      </div>

      {state?.error && <div style={{ padding: '10px 14px', backgroundColor: '#fdf0ef', border: '1px solid #f5c6c2', borderRadius: '4px', fontSize: '13px', color: '#c0392b', marginBottom: '12px' }}>{state.error}</div>}
      {state?.success && <div style={{ padding: '10px 14px', backgroundColor: '#eafaf1', border: '1px solid #a9dfbf', borderRadius: '4px', fontSize: '13px', color: '#1e8449', marginBottom: '12px' }}>Saved.</div>}

      <button type="submit" disabled={pending} style={{ backgroundColor: pending ? '#26A69A' : '#00897B', color: '#FFFFFF', padding: '9px 20px', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer', fontFamily: "'Poppins', Calibri, Arial, sans-serif" }}>
        {pending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
