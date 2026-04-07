import { Suspense } from 'react'
import LoginForm from './login-form'

export const metadata = {
  title: 'Login — SHIFT.MEDIA',
}

export default function LoginPage() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#F6F5F2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>

        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            fontSize: '28px',
            letterSpacing: '-0.5px',
            color: '#111111',
          }}>
            <span style={{ fontWeight: 700 }}>SHIFT</span>
            <span style={{ color: '#00897B', fontWeight: 700 }}>.</span>
            <span style={{ fontWeight: 400 }}>MEDIA</span>
          </span>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          border: '1px solid #DDDDDD',
          overflow: 'hidden',
        }}>
          {/* Teal bar */}
          <div style={{ height: '3px', backgroundColor: '#00897B' }} />

          <div style={{ padding: '40px 36px' }}>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#111111',
              marginBottom: '8px',
            }}>
              Sign in
            </h1>
            <p style={{
              fontSize: '13px',
              color: '#888888',
              marginBottom: '32px',
            }}>
              Access the SHIFT platform
            </p>

            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: '#888888',
          marginTop: '24px',
        }}>
          SHIFT.MEDIA · Hamburg
        </p>
      </div>
    </main>
  )
}
