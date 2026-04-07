'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('to') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    if (data.user) {
      window.location.href = redirectTo
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    fontFamily: "'Poppins', Calibri, Arial, sans-serif",
    border: '1px solid #DDDDDD',
    borderRadius: '4px',
    backgroundColor: '#FFFFFF',
    color: '#111111',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700 as const,
    color: '#555555',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    marginBottom: '6px',
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@shift-media.org"
          required
          style={inputStyle}
          autoComplete="email"
        />
      </div>

      <div style={{ marginBottom: '28px' }}>
        <label style={labelStyle}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          style={inputStyle}
          autoComplete="current-password"
        />
      </div>

      {error && (
        <div style={{
          fontSize: '13px',
          color: '#c0392b',
          marginBottom: '20px',
          padding: '10px 12px',
          backgroundColor: '#fdf0ef',
          border: '1px solid #f5c6c2',
          borderRadius: '4px',
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '11px',
          backgroundColor: loading ? '#26A69A' : '#00897B',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 700,
          fontFamily: "'Poppins', Calibri, Arial, sans-serif",
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: '0.3px',
        }}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
