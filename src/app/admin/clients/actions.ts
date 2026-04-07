'use server'

import { createClient } from '@/lib/supabase/server'
import { syncClientToNotion } from '@/lib/notion/sync-client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function generateClientId(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `CLT-${year}-${rand}`
}

export async function createClientAction(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const company_name = formData.get('company_name') as string
  const client_type = formData.get('client_type') as string
  const main_contact = formData.get('main_contact') as string
  const email = formData.get('email') as string
  const address = formData.get('address') as string
  const sector = formData.get('sector') as string

  if (!company_name || !client_type || !main_contact || !email || !address || !sector) {
    return { error: 'All fields are required.' }
  }

  const client_id = generateClientId()

  const { data, error } = await supabase
    .from('clients')
    .insert({ client_id, company_name, client_type, main_contact, email, address, sector })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // Notion sync (non-blocking)
  syncClientToNotion({ company_name, client_id, sector, client_type, main_contact, email })
    .catch(console.error)

  revalidatePath('/admin/clients')
  redirect(`/admin/clients/${data.id}`)
}

export async function updateClientAction(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const id = formData.get('id') as string
  const company_name = formData.get('company_name') as string
  const client_type = formData.get('client_type') as string
  const main_contact = formData.get('main_contact') as string
  const email = formData.get('email') as string
  const address = formData.get('address') as string
  const sector = formData.get('sector') as string

  const { error } = await supabase
    .from('clients')
    .update({ company_name, client_type, main_contact, email, address, sector })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/admin/clients/${id}`)
  revalidatePath('/admin/clients')
  return { success: true }
}
