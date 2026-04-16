'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { analyzeBid } from '@/lib/claude/analyze-bid'

export async function saveBidNotesAction(
  bidId: string,
  projectId: string,
  notes: string,
  recommendation: string,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('bids')
    .update({
      consultant_notes: notes || null,
      shift_recommendation: recommendation || null,
    })
    .eq('id', bidId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/projects/${projectId}/bids`)
}

export async function approveBidAction(
  bidId: string,
  partnerId: string,
  projectId: string,
  approved: boolean,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await Promise.all([
    supabase.from('bids').update({ approved_for_client: approved }).eq('id', bidId),
    supabase.from('production_partners').update({ bid_approved: approved }).eq('id', partnerId),
  ])

  revalidatePath(`/admin/projects/${projectId}/bids`)
}

export async function analyzeBidAction(
  bidId: string,
  budgetId: string,
  projectId: string,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Fetch budget + line items + partner
  const { data: budget } = await supabase
    .from('budgets')
    .select('total_net, director, production_partners(company_name), budget_line_items(*)')
    .eq('id', budgetId)
    .single()

  if (!budget) throw new Error('Budget not found')

  const partner = budget.production_partners as any
  const lineItems = ((budget.budget_line_items ?? []) as any[]).map(item => ({
    section_name: item.section_name,
    name: item.name,
    quantity: item.quantity,
    days: item.days,
    rate: item.rate,
    amount: item.amount,
  }))

  const result = await analyzeBid({
    partnerName: partner?.company_name ?? 'Unknown',
    director: budget.director,
    totalNet: budget.total_net ?? 0,
    lineItems,
  })

  if ('error' in result) throw new Error(result.error)

  const { error } = await supabase
    .from('bids')
    .update({
      ai_summary: result.summary,
      ai_flags: result.flags,
    })
    .eq('id', bidId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/projects/${projectId}/bids`)
}
