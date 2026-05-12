'use client'

import dynamic from 'next/dynamic'

// ── Active intro ──────────────────────────────────────────────────────────────
// Glass version (current). To revert, swap the import below back to
// './IntroAnimation' (original is also preserved at IntroAnimation.backup.tsx).
const IntroAnimation = dynamic(() => import('./IntroAnimation'), { ssr: false })

export default function IntroWrapper() {
  return <IntroAnimation />
}
