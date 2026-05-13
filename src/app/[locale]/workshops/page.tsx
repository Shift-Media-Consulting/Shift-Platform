import { setRequestLocale, getMessages } from 'next-intl/server'
import { getTranslations as getMeta } from 'next-intl/server'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import WorkshopsClient from './WorkshopsClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getMeta({ locale, namespace: 'Workshops.Meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'de' ? '/workshops' : '/en/workshops',
      languages: { 'de-DE': '/workshops', 'en': '/en/workshops', 'x-default': '/workshops' },
    },
  }
}

export default async function WorkshopsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()
  const W = (messages as any).Workshops

  type Workshop = {
    id: string; name: string; hook: string;
    why: string; what: string; outcome: string;
    duration: string; cta: string;
  }
  type TierData = {
    id: string; name: string; tagline: string;
    description: string; followup: string;
    workshops: Workshop[];
  }

  const tiers: TierData[] = [
    { id: 'strategy',   ...W.Strategy },
    { id: 'diagnostic', ...W.Diagnostic },
    { id: 'practice',   ...W.Practice },
    { id: 'leadership', ...W.Leadership },
  ]

  const productSlideSubhead: string = W.ProductSlideSubhead ?? 'After the Workshop, where it makes sense.'

  const workshopsSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Production Workshops',
    provider: { '@type': 'Organization', name: 'Shift Media GbR', url: 'https://shift-media.io' },
    description: 'Focused working sessions for brand, agency, and production teams on production strategy, cost control, operations, and leadership. Delivered in Hamburg or on location.',
    serviceType: 'Production Advisory Workshop',
    areaServed: { '@type': 'Place', name: 'Germany, Europe' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(workshopsSchema) }} />
      <Nav />
      <WorkshopsClient
        hero={W.Hero}
        tierNav={W.TierNav}
        tiers={tiers}
        deliverables={W.Deliverables}
        closing={W.Closing}
        request={W.Request}
        productSlideSubhead={productSlideSubhead}
      />
      <Footer />
    </>
  )
}
