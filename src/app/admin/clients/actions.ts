'use server'

import { createClient } from '@/lib/supabase/server'
import { syncClientToNotion } from '@/lib/notion/sync-client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const BUCKET = 'client-logos'

function generateClientId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `CLT-${rand}`
}

async function uploadLogo(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  filename: string,
): Promise<string | null> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { contentType: file.type, upsert: true })
  if (error) return null
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
  return data.publicUrl
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
  const other_contacts = (formData.get('other_contacts') as string) || null

  if (!company_name || !client_type || !main_contact || !email || !address || !sector) {
    return { error: 'Company name, type, main contact, email, address and sector are required.' }
  }

  const client_id = generateClientId()

  // Handle logo upload
  let logo_url: string | null = null
  const logoFile = formData.get('logo') as File | null
  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split('.').pop() ?? 'png'
    logo_url = await uploadLogo(supabase, logoFile, `${client_id}.${ext}`)
  }

  const { data, error } = await supabase
    .from('clients')
    .insert({ client_id, company_name, client_type, main_contact, email, address, sector, other_contacts, logo_url })
    .select('id')
    .single()

  if (error) return { error: error.message }

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
  const other_contacts = (formData.get('other_contacts') as string) || null
  const existing_logo_url = (formData.get('existing_logo_url') as string) || null

  // Handle logo upload — keep existing if no new file
  let logo_url = existing_logo_url
  const logoFile = formData.get('logo') as File | null
  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split('.').pop() ?? 'png'
    const uploaded = await uploadLogo(supabase, logoFile, `${id}.${ext}`)
    if (uploaded) logo_url = uploaded
  }

  const { error } = await supabase
    .from('clients')
    .update({ company_name, client_type, main_contact, email, address, sector, other_contacts, logo_url })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/admin/clients/${id}`)
  revalidatePath('/admin/clients')
  return { success: true }
}
