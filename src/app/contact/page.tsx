import type { Metadata } from 'next'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact — shift.media',
  description: 'Get in touch. An honest conversation about whether and how we can help.',
}

export default function ContactPage() {
  return (
    <>
      <Nav />
      <ContactClient />
      <Footer />
    </>
  )
}
