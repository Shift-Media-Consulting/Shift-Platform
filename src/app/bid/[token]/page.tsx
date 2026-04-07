import { createClient } from '@/lib/supabase/server'
import BidSubmitForm from './BidSubmitForm'
import type { PageProps } from 'next/types'

export const metadata = { title: 'Submit Bid — SHIFT.MEDIA' }

export default async function BidPortalPage(props: PageProps<'/bid/[token]'>) {
  const { token } = await props.params
  const supabase = await createClient()

  const { data: partner } = await supabase
    .from('production_partners')
    .select('*, projects(project_name, project_id, clients(company_name))')
    .eq('portal_token', token)
    .single()

  if (!partner || partner.bid_submitted) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', Calibri, Arial, sans-serif" }}>
        <div style={{ textAlign: 'center', color: '#FFFFFF' }}>
          <span style={{ fontSize: '40px', color: '#00897B', display: 'block', marginBottom: '16px' }}>›</span>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
            {partner?.bid_submitted ? 'Bid already submitted.' : 'Invalid or expired link.'}
          </h1>
          <p style={{ fontSize: '14px', color: '#888888' }}>
            {partner?.bid_submitted ? 'Your bid has already been received. Thank you.' : 'Please contact SHIFT.MEDIA for a new link.'}
          </p>
        </div>
      </main>
    )
  }

  const project = partner.projects as any
  const client = project?.clients as any

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F6F5F2', fontFamily: "'Poppins', Calibri, Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: '#111111', padding: '0 56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '16px' }}>
          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>SHIFT</span>
          <span style={{ fontWeight: 700, color: '#00897B' }}>.</span>
          <span style={{ fontWeight: 400, color: '#FFFFFF' }}>MEDIA</span>
        </span>
        <span style={{ fontSize: '12px', color: '#555555' }}>Production Partner Portal</span>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#00897B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Bid Submission</p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111111', marginBottom: '4px' }}>
            {project?.project_name ?? 'Production Project'}
          </h1>
          {client?.company_name && (
            <p style={{ fontSize: '14px', color: '#888888' }}>Client: {client.company_name}</p>
          )}
          <p style={{ fontSize: '14px', color: '#888888' }}>Submitting as: {partner.company_name}</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '4px', padding: '40px' }}>
          <p style={{ fontSize: '13px', color: '#555555', lineHeight: 1.7, marginBottom: '32px' }}>
            Please submit your creative treatment and budget using the form below. Both documents are required. Your submission will be reviewed by the SHIFT MEDIA team before being presented to the client.
          </p>
          <BidSubmitForm partnerId={partner.id} projectId={partner.project_id} />
        </div>
      </div>
    </main>
  )
}
