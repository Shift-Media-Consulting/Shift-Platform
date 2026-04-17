import { cookies } from 'next/headers'

export const PREVIEW_COOKIE = 'shift_preview_client'

export async function getEffectiveClientId(
  profileClientId: string | null | undefined,
  profileRole: string,
): Promise<string | null> {
  if (profileRole === 'client') return profileClientId ?? null
  // Admin/super_admin: read preview cookie
  const cookieStore = await cookies()
  return cookieStore.get(PREVIEW_COOKIE)?.value ?? null
}

export async function isAdminPreview(profileRole: string): Promise<boolean> {
  return profileRole === 'shift_admin' || profileRole === 'super_admin'
}
