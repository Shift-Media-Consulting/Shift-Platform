'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function ensureShiftPartnerAction(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check if SHIFT MEDIA already exists as a partner on this project
  const { data: existing } = await supabase
    .from('production_partners')
    .select('id')
    .eq('project_id', projectId)
    .eq('company_name', 'SHIFT MEDIA')
    .single()

  if (existing) {
    redirect(`/admin/projects/${projectId}/budgets/new?partner=${existing.id}`)
  }

  // Create SHIFT MEDIA as a partner (no portal token — uses admin UI)
  const { data: created, error } = await supabase
    .from('production_partners')
    .insert({
      project_id: projectId,
      company_name: 'SHIFT MEDIA',
      contact_name: 'Internal',
      contact_email: 'internal@shift-media.org',
      status: 'Pitch',
    })
    .select('id')
    .single()

  if (error || !created) throw new Error(error?.message ?? 'Failed to create SHIFT partner')

  redirect(`/admin/projects/${projectId}/budgets/new?partner=${created.id}`)
}
