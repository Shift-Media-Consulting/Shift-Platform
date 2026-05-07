import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,   // hello@shift-media.io
    pass: process.env.GMAIL_PASS,   // Google App Password (16 chars, no spaces)
  },
})

// ─── Internal notification email ──────────────────────────────────────────────

function internalEmail(data: {
  firstName: string
  lastName: string
  email: string
  company: string
  roles: string[]
  topics: string[]
  message: string
}) {
  const { firstName, lastName, email, company, roles, topics, message } = data

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 20px 10px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(17,17,17,0.45);white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#111111;vertical-align:top;">${value}</td>
    </tr>
    <tr><td colspan="2" style="border-bottom:1px solid rgba(17,17,17,0.08);font-size:0;height:0;line-height:0;">&nbsp;</td></tr>`

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0efec;">
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#f0efec;">
<tr><td align="center" style="padding:40px 20px;">

  <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse:collapse;max-width:600px;width:100%;">

    <!-- Header -->
    <tr>
      <td style="background:#004d40;border-radius:8px 8px 0 0;padding:28px 36px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(246,245,242,0.55);">shift.media — New enquiry</td>
            <td align="right" style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.18em;color:rgba(246,245,242,0.35);">${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Name banner -->
    <tr>
      <td style="background:#003d33;padding:20px 36px 22px;">
        <div style="font-family:Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;color:#f6f5f2;letter-spacing:-0.01em;">${firstName} ${lastName}</div>
        <div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:rgba(246,245,242,0.55);margin-top:4px;">${company} &nbsp;·&nbsp; <a href="mailto:${email}" style="color:rgba(246,245,242,0.55);text-decoration:underline;">${email}</a></div>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="background:#ffffff;padding:32px 36px 8px;border-left:1px solid rgba(17,17,17,0.08);border-right:1px solid rgba(17,17,17,0.08);">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
          ${row('Role', roles.length ? roles.join(', ') : '—')}
          ${row('Topics', topics.length ? topics.join(', ') : '—')}
          ${row('Message', message.replace(/\n/g, '<br>'))}
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="background:#ffffff;padding:24px 36px 32px;border-left:1px solid rgba(17,17,17,0.08);border-right:1px solid rgba(17,17,17,0.08);">
        <a href="mailto:${email}?subject=Re: Your enquiry to shift.media" style="display:inline-block;padding:14px 28px;background:#004d40;color:#f6f5f2;font-family:Helvetica,Arial,sans-serif;font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;">Reply to ${firstName} ›</a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f0efec;border:1px solid rgba(17,17,17,0.08);border-top:none;border-radius:0 0 8px 8px;padding:20px 36px;">
        <p style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.18em;color:rgba(17,17,17,0.35);margin:0;">Submitted via the contact form at shift-media.io</p>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`
}

// ─── Auto-reply email ─────────────────────────────────────────────────────────

function autoReplyEmail(firstName: string) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0efec;">
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#f0efec;">
<tr><td align="center" style="padding:40px 20px;">

  <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse:collapse;max-width:600px;width:100%;">

    <!-- Header -->
    <tr>
      <td style="background:#004d40;border-radius:8px 8px 0 0;padding:0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td width="72" style="padding:28px 0 28px 32px;vertical-align:middle;">
              <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:#003d33;border-radius:4px;width:48px;height:48px;">
                <tr>
                  <td align="center" valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-weight:500;font-size:15px;color:#f6f5f2;letter-spacing:0.04em;">SM</td>
                </tr>
              </table>
            </td>
            <td style="padding:28px 32px 28px 16px;vertical-align:middle;">
              <div style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(246,245,242,0.55);">shift.media</div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:13px;color:rgba(246,245,242,0.40);margin-top:3px;">Independent production consultancy</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Hero -->
    <tr>
      <td style="background:#003d33;padding:36px 36px 32px;">
        <p style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(246,245,242,0.40);margin:0 0 16px;">— Message received</p>
        <h1 style="font-family:Helvetica,Arial,sans-serif;font-weight:700;font-size:32px;line-height:1.05;letter-spacing:-0.02em;color:#f6f5f2;margin:0 0 16px;">We'll be in touch,<br>${firstName}.</h1>
        <p style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:17px;line-height:1.55;color:rgba(246,245,242,0.70);margin:0;">One of the three founders will read your message personally and reply within 24 hours, Monday to Friday.</p>
      </td>
    </tr>

    <!-- What happens next -->
    <tr>
      <td style="background:#ffffff;padding:36px 36px 8px;border-left:1px solid rgba(17,17,17,0.08);border-right:1px solid rgba(17,17,17,0.08);">
        <p style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.40);margin:0 0 24px;">— What happens next</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">

          <tr>
            <td width="32" valign="top" style="padding:0 16px 28px 0;">
              <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:#004d40;border-radius:50%;width:28px;height:28px;">
                <tr><td align="center" valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;color:#f6f5f2;">01</td></tr>
              </table>
            </td>
            <td valign="top" style="padding:0 0 28px;">
              <div style="font-family:Helvetica,Arial,sans-serif;font-weight:600;font-size:14px;color:#111111;margin-bottom:4px;">We read your message</div>
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:rgba(17,17,17,0.60);">No auto-routing, no junior team. One of the three founders reads it directly.</div>
            </td>
          </tr>

          <tr>
            <td width="32" valign="top" style="padding:0 16px 28px 0;">
              <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:#004d40;border-radius:50%;width:28px;height:28px;">
                <tr><td align="center" valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;color:#f6f5f2;">02</td></tr>
              </table>
            </td>
            <td valign="top" style="padding:0 0 28px;">
              <div style="font-family:Helvetica,Arial,sans-serif;font-weight:600;font-size:14px;color:#111111;margin-bottom:4px;">We reply in writing within 24 hours</div>
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:rgba(17,17,17,0.60);">An honest read on whether we are the right people to help — and which of us you would be working with.</div>
            </td>
          </tr>

          <tr>
            <td width="32" valign="top" style="padding:0 16px 28px 0;">
              <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:#004d40;border-radius:50%;width:28px;height:28px;">
                <tr><td align="center" valign="middle" style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;color:#f6f5f2;">03</td></tr>
              </table>
            </td>
            <td valign="top" style="padding:0 0 28px;">
              <div style="font-family:Helvetica,Arial,sans-serif;font-weight:600;font-size:14px;color:#111111;margin-bottom:4px;">A forty-five minute conversation</div>
              <div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:rgba(17,17,17,0.60);">No pitch deck. No agenda. Just a real conversation about your production operation.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>

    <!-- Promise card -->
    <tr>
      <td style="background:#ffffff;padding:0 36px 36px;border-left:1px solid rgba(17,17,17,0.08);border-right:1px solid rgba(17,17,17,0.08);">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#f7f6f3;border-radius:8px;border:1px solid rgba(17,17,17,0.08);">
          <tr>
            <td style="padding:24px 28px;">
              <p style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(17,17,17,0.35);margin:0 0 10px;">— The promise</p>
              <p style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:18px;line-height:1.4;color:rgba(17,17,17,0.80);margin:0;">If we are not the right people to help, we will tell you — and point you in the right direction.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f0efec;border:1px solid rgba(17,17,17,0.08);border-top:none;border-radius:0 0 8px 8px;padding:24px 36px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.18em;color:rgba(17,17,17,0.35);">
              <a href="https://shift-media.io" style="color:rgba(17,17,17,0.35);text-decoration:none;">shift-media.io</a>
              &nbsp;·&nbsp; Hamburg, DE
            </td>
            <td align="right" style="font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:10px;letter-spacing:0.18em;color:rgba(17,17,17,0.25);">shift.media GmbH</td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, company, roles = [], topics = [], message } = body

    if (!firstName || !lastName || !email || !company || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await Promise.all([
      // 1. Internal notification
      transporter.sendMail({
        from: '"shift.media" <justin@shift-media.io>',
        to: 'hello@shift-media.io',
        replyTo: email,
        subject: `New enquiry — ${firstName} ${lastName}, ${company}`,
        html: internalEmail({ firstName, lastName, email, company, roles, topics, message }),
      }),

      // 2. Auto-reply to submitter
      transporter.sendMail({
        from: '"shift.media" <justin@shift-media.io>',
        to: email,
        subject: `We've received your message — shift.media`,
        html: autoReplyEmail(firstName),
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] email error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
