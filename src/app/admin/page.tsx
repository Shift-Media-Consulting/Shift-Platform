import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './logout-button'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?to=/admin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || !['shift_admin', 'super_admin'].includes(profile.role)) {
    redirect('/login?to=/admin')
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#F6F5F2',
      fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    }}>
      {/* Top nav */}
      <nav style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #DDDDDD',
        padding: '0 56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '16px' }}>
          <span style={{ fontWeight: 700 }}>SHIFT</span>
          <span style={{ color: '#00897B', fontWeight: 700 }}>.</span>
          <span style={{ fontWeight: 400 }}>MEDIA</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#555555' }}>
            {profile.full_name || user.email}
          </span>
          <LogoutButton />
        </div>
      </nav>

      {/* Content */}
      <div style={{ padding: '48px 56px' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#00897B',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            Dashboard
          </span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111111', marginBottom: '4px' }}>
          Welcome back.
        </h1>
        <p style={{ fontSize: '14px', color: '#888888', marginBottom: '48px' }}>
          Platform is live. Database connected. Ready to build.
        </p>

        {/* Placeholder cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { label: 'Clients', value: '0', note: 'No clients yet' },
            { label: 'Active Projects', value: '0', note: 'No projects yet' },
            { label: 'Pending Actions', value: '0', note: 'All clear' },
          ].map(card => (
            <div key={card.label} style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #DDDDDD',
              borderRadius: '4px',
              borderLeft: '4px solid #00897B',
              padding: '24px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#888888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#111111', marginBottom: '4px' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '12px', color: '#888888' }}>{card.note}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
