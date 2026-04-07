'use server'

import { createClient } from '@/lib/supabase/server'
import { syncProjectToNotion } from '@/lib/notion/sync-client'
import { analyzeBrief } from '@/lib/claude/analyze-brief'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function generateProjectId(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `PRJ-${year}-${rand}`
}

export async function createProjectAction(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const project_name = formData.get('project_name') as string
  const client_id = formData.get('client_id') as string
  const consultant = formData.get('consultant') as string
  const sector = formData.get('sector') as string
  const project_type = formData.getAll('project_type') as string[]
  const status = (formData.get('status') as string) || 'Setup'
  const budget = formData.get('budget') ? parseFloat(formData.get('budget') as string) : null
  const agency_name = formData.get('agency_name') as string
  const agency_contact = formData.get('agency_contact') as string
  const agency_contact_email = formData.get('agency_contact_email') as string
  const buyouts = formData.get('buyouts') === 'true'

  if (!project_name || !client_id || !consultant || !sector) {
    return { error: 'Project name, client, consultant and sector are required.' }
  }

  const project_id = generateProjectId()

  const { data, error } = await supabase
    .from('projects')
    .insert({
      project_id, project_name, client_id, consultant, sector,
      project_type, status, budget, agency_name, agency_contact,
      agency_contact_email, buyouts,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // Get client name for Notion sync
  const { data: clientData } = await supabase
    .from('clients')
    .select('company_name')
    .eq('id', client_id)
    .single()

  syncProjectToNotion({
    project_name, project_id, status,
    client_name: clientData?.company_name ?? '',
  }).catch(console.error)

  revalidatePath('/admin/projects')
  redirect(`/admin/projects/${data.id}`)
}

export async function updateProjectAction(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const id = formData.get('id') as string
  const project_name = formData.get('project_name') as string
  const consultant = formData.get('consultant') as string
  const sector = formData.get('sector') as string
  const status = formData.get('status') as string
  const budget = formData.get('budget') ? parseFloat(formData.get('budget') as string) : null
  const agency_name = formData.get('agency_name') as string
  const agency_contact = formData.get('agency_contact') as string
  const agency_contact_email = formData.get('agency_contact_email') as string
  const project_type = formData.getAll('project_type') as string[]
  const buyouts = formData.get('buyouts') === 'true'

  const { error } = await supabase
    .from('projects')
    .update({ project_name, consultant, sector, status, budget, agency_name, agency_contact, agency_contact_email, project_type, buyouts })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/admin/projects/${id}`)
  revalidatePath('/admin/projects')
  return { success: true }
}

export async function analyzeBriefAction(_prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const project_id = formData.get('project_id') as string
  const brief_text = formData.get('brief_text') as string

  if (!brief_text?.trim()) return { error: 'Please paste brief text to analyze.' }

  const result = await analyzeBrief(brief_text)

  if ('error' in result) return { error: result.error }

  // Save summary back to project
  await supabase
    .from('projects')
    .update({ brief_summary: result.summary })
    .eq('id', project_id)

  revalidatePath(`/admin/projects/${project_id}`)
  return { success: true, ...result }
}

export async function updateProjectStatusAction(projectId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('projects').update({ status }).eq('id', projectId)
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath('/admin/projects')
}
