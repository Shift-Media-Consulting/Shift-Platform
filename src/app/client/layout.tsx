import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from '../admin/logout-button'
import PreviewBanner from './PreviewBanner'
import { getEffectiveClientId } from '@/lib/client-preview'

const ADMIN_ROLES = ['super_admin', 'shift_admin']

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?to=/client')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, client_id')
    .eq('id', user.id)
    .single()

  const isAdmin = ADMIN_ROLES.includes(profile?.role ?? '')
  const isClient = profile?.role === 'client'

  // Only allow clients and admins
  if (!profile || (!isClient && !isAdmin)) redirect('/login?to=/client')

  // For admin preview: fetch all clients for selector + resolve selected client
  let previewClients: { id: string; company_name: string }[] = []
  let selectedClientId: string | null = null
  let selectedClientName: string | null = null

  if (isAdmin) {
    const effectiveClientId = await getEffectiveClientId(profile.client_id, profile.role)
    selectedClientId = effectiveClientId

    const { data: allClients } = await supabase
      .from('clients')
      .select('id, company_name')
      .order('company_name')
    previewClients = allClients ?? []

    if (selectedClientId) {
      selectedClientName = previewClients.find(c => c.id === selectedClientId)?.company_name ?? null
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F5F2', fontFamily: "'Poppins', Calibri, Arial, sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Admin preview banner */}
      {isAdmin && (
        <PreviewBanner
          clients={previewClients}
          selectedClientId={selectedClientId}
          selectedClientName={selectedClientName}
        />
      )}

      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #DDDDDD', padding: '0 40px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontSize: '16px' }}>
            <span style={{ fontWeight: 700, color: '#111111' }}>SHIFT</span>
            <span style={{ fontWeight: 700, color: '#00897B' }}>.</span>
            <span style={{ fontWeight: 400, color: '#111111' }}>MEDIA</span>
          </span>
          {[
            { href: '/client', label: 'Dashboard' },
            { href: '/client/projects', label: 'Projects' },
            { href: '/client/buyouts', label: 'Buyouts' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ fontSize: '13px', color: '#555555', textDecoration: 'none', fontWeight: 400 }}>
              {item.label}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#555555' }}>
            {isAdmin ? (selectedClientName ?? 'No client selected') : (profile.full_name || user.email)}
          </span>
          {!isAdmin && <LogoutButton />}
        </div>
      </header>

      <main style={{ flex: 1, padding: '40px' }}>
        {isAdmin && !selectedClientId ? (
          <div style={{ textAlign: 'center', padding: '80px 40px' }}>
            <p style={{ fontSize: '28px', marginBottom: '12px' }}>👆</p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#111111', marginBottom: '8px' }}>Select a client to preview</p>
            <p style={{ fontSize: '13px', color: '#888888' }}>Use the dropdown in the preview banner above to choose which client's view to preview.</p>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
