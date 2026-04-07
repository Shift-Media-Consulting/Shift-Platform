'use client'

import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        fontSize: '12px',
        fontWeight: 700,
        color: '#888888',
        background: 'none',
        border: '1px solid #DDDDDD',
        borderRadius: '4px',
        padding: '6px 14px',
        cursor: 'pointer',
        fontFamily: "'Poppins', Calibri, Arial, sans-serif",
        letterSpacing: '0.3px',
      }}
    >
      Sign out
    </button>
  )
}
