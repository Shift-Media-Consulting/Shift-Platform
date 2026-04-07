'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getOrCreateBuyoutProject(supabase: Awaited<ReturnType<typeof createClient>>, projectId: string): Promise<string | null> {
  const { data: existing } = await supabase
    .from('buyout_projects')
    .select('id')
    .eq('project_id', projectId)
    .maybeSingle()

  if (existing) return existing.id

  const { data: project } = await supabase
    .from('projects')
    .select('client_id, project_id')
    .eq('id', projectId)
    .single()

  if (!project) return null

  const year = new Date().getFullYear()
  const suffix = String(Math.floor(1000 + Math.random() * 9000))
  const buyout_project_id = `BUY-${year}-${suffix}`

  const { data: created } = await supabase
    .from('buyout_projects')
    .insert({ project_id: projectId, client_id: project.client_id, buyout_project_id })
    .select('id')
    .single()

  return created?.id ?? null
}

export async function addBuyoutLineItemAction(_prev: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const project_id = formData.get('project_id') as string
  const talent_name = formData.get('talent_name') as string
  const role = formData.get('role') as string
  const talent_type = formData.get('talent_type') as string
  const rights_start = formData.get('rights_start') as string
  const rights_end = formData.get('rights_end') as string
  const buyout_fee = formData.get('buyout_fee') as string
  const media_types = formData.getAll('media_types') as string[]
  const territories = formData.getAll('territories') as string[]

  if (!talent_name || !talent_type || !rights_end || !buyout_fee) {
    return { error: 'Talent name, type, rights end date and fee are required.' }
  }

  const buyoutProjectId = await getOrCreateBuyoutProject(supabase, project_id)
  if (!buyoutProjectId) return { error: 'Failed to initialise buyout project.' }

  const { error } = await supabase.from('buyout_line_items').insert({
    buyout_project_id: buyoutProjectId,
    talent_name,
    role: role || null,
    talent_type,
    rights_start: rights_start || null,
    rights_end,
    buyout_fee: parseFloat(buyout_fee),
    media_types,
    territories,
    status: 'Active',
  })

  if (error) return { error: error.message }

  revalidatePath(`/admin/projects/${project_id}/buyouts`)
  revalidatePath('/admin/buyouts')
  return { success: true }
}

export async function updateBuyoutStatusAction(lineItemId: string, projectId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('buyout_line_items').update({ status }).eq('id', lineItemId)
  revalidatePath(`/admin/projects/${projectId}/buyouts`)
  revalidatePath('/admin/buyouts')
}

export async function deleteBuyoutLineItemAction(lineItemId: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('buyout_line_items').delete().eq('id', lineItemId)
  revalidatePath(`/admin/projects/${projectId}/buyouts`)
  revalidatePath('/admin/buyouts')
}
