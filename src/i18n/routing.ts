import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: {
    mode: 'as-needed', // German at /, English at /en
    prefixes: {
      de: '/',
      en: '/en',
    },
  },
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
