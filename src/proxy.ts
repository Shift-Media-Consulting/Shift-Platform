import createNextIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

// i18n middleware — handles locale routing for marketing pages
const intlMiddleware = createNextIntlMiddleware(routing)

// Paths handled by Supabase auth (admin / client-facing portals)
const AUTH_PATHS = /^\/(admin|auth|bid|client|partner|login)/

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Auth-gated routes ──────────────────────────────────────────────
  if (AUTH_PATHS.test(pathname)) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Public within auth paths: /login itself, /bid/*, /api/*
    const isPublicAuthPath =
      pathname === '/login' ||
      pathname.startsWith('/bid/') ||
      pathname.startsWith('/api/')

    if (!user && !isPublicAuthPath) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }

    return supabaseResponse
  }

  // ── Marketing routes — run next-intl locale middleware ─────────────
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|_next/data|favicon.ico|logo-mark\\.svg|wordmark.*\\.svg|.*\\.(?:png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
