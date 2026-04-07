'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addPartnerAction(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const project_id = formData.get('project_id') as string
  const company_name = formData.get('company_name') as string
  const contact_name = formData.get('contact_name') as string
  const contact_email = formData.get('contact_email') as string
  const creative_name = formData.get('creative_name') as string

  if (!company_name || !contact_name || !contact_email) {
    return { error: 'Company, contact name and email are required.' }
  }

  // Generate a secure portal token
  const portal_token = crypto.randomUUID()
  const portal_token_expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days

  const { error } = await supabase.from('production_partners').insert({
    project_id, company_name, contact_name, contact_email,
    creative_name: creative_name || null,
    portal_token, portal_token_expires_at,
  })

  if (error) return { error: error.message }

  revalidatePath(`/admin/projects/${project_id}/partners`)
  return { success: true }
}

export async function updatePartnerStatusAction(partnerId: string, projectId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('production_partners').update({ status }).eq('id', partnerId)
  revalidatePath(`/admin/projects/${projectId}/partners`)
}

export async function removePartnerAction(partnerId: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('production_partners').delete().eq('id', partnerId)
  revalidatePath(`/admin/projects/${projectId}/partners`)
}
