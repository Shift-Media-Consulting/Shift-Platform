import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'shift_admin' || profile?.role === 'super_admin') {
      redirect('/admin')
    } else if (profile?.role === 'client') {
      redirect('/client/dashboard')
    }
  }

  redirect('/login')
}
