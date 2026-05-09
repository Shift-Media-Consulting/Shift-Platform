import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getTranslations as getMeta } from 'next-intl/server'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import ContactClient from './ContactClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getMeta({ locale, namespace: 'Contact.Meta' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'de' ? '/contact' : '/en/contact',
      languages: { 'de-DE': '/contact', 'en': '/en/contact', 'x-default': '/contact' },
    },
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <Nav />
      <ContactClient />
      <Footer />
    </>
  )
}
