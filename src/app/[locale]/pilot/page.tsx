import { setRequestLocale, getMessages } from 'next-intl/server'
import { getTranslations as getMeta } from 'next-intl/server'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import PilotClient from './PilotClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getMeta({ locale, namespace: 'Pilot.Meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'de' ? '/pilot' : '/en/pilot',
      languages: { 'de-DE': '/pilot', 'en': '/en/pilot', 'x-default': '/pilot' },
    },
  }
}

export default async function PilotPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()
  const P = (messages as any).Pilot
  // ProductSlide subhead — context-specific phrase, overrides the shared heading from ProductSlide messages
  const productSlideSubhead = (messages as any).ProductSlide?.heading ?? 'After the Pilot, where it makes sense.'

  return (
    <>
      <Nav />
      <PilotClient
        hero={P.Hero}
        definition={P.Definition}
        projectTypes={P.ProjectTypes}
        timeline={P.Timeline}
        scope={P.Scope}
        deliverables={P.Deliverables}
        closing={P.Closing}
        request={P.Request}
        productSlideSubhead={productSlideSubhead}
      />
      <Footer />
    </>
  )
}
