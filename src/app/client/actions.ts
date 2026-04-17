'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function setPreviewClientAction(formData: FormData) {
  const clientId = formData.get('clientId') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/client'
  const cookieStore = await cookies()
  if (clientId) {
    cookieStore.set('shift_preview_client', clientId, { path: '/', maxAge: 60 * 60 * 24 })
  } else {
    cookieStore.delete('shift_preview_client')
  }
  redirect(redirectTo)
}
