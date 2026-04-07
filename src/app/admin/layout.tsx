import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import LogoutButton from './logout-button'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F6F5F2',
      fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: '56px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #DDDDDD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 40px',
          gap: '16px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '13px', color: '#555555' }}>
            {profile.full_name || user.email}
          </span>
          <LogoutButton />
        </header>
        {/* Page content */}
        <main style={{ flex: 1, padding: '40px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
