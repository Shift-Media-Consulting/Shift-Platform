import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from '../admin/logout-button'

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?to=/client')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, client_id')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'client') redirect('/login?to=/client')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F5F2', fontFamily: "'Poppins', Calibri, Arial, sans-serif" }}>
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #DDDDDD', padding: '0 40px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontSize: '16px' }}>
            <span style={{ fontWeight: 700, color: '#111111' }}>SHIFT</span>
            <span style={{ fontWeight: 700, color: '#00897B' }}>.</span>
            <span style={{ fontWeight: 400, color: '#111111' }}>MEDIA</span>
          </span>
          {[{ href: '/client', label: 'Dashboard' }, { href: '/client/projects', label: 'Projects' }, { href: '/client/buyouts', label: 'Buyouts' }].map(item => (
            <Link key={item.href} href={item.href} style={{ fontSize: '13px', color: '#555555', textDecoration: 'none', fontWeight: 400 }}>{item.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: '#555555' }}>{profile.full_name || user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <main style={{ padding: '40px' }}>{children}</main>
    </div>
  )
}
