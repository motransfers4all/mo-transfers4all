import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('Auth error: ' + error.message)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError) throw new Error('Profile error: ' + profileError.message)

    if (profile.role === 'admin') navigate('/admin')
    else if (profile.role === 'hotel') navigate('/hotel')

  } catch (err) {
    setError(err.message)
  }
  setLoading(false)
}

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--navy)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img src="/logo.jpg" alt="MO Transfers4all" style={{
            width: '80px', height: '80px', borderRadius: '50%',
            objectFit: 'cover', border: '2px solid var(--gold)',
            marginBottom: '1rem'
          }}/>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.3rem', fontWeight: 600, color: 'var(--white)',
            letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>MO Transfers4all</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.25rem' }}>Partner Portal</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--navy-mid)',
          border: '1px solid var(--border)',
          borderTop: '2px solid var(--gold)',
          padding: '2.5rem 2rem'
        }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.5rem', fontWeight: 300, color: 'var(--white)',
            marginBottom: '0.5rem'
          }}>Sign In</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Enter your credentials to access the booking portal.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{
                display: 'block', fontSize: '0.62rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: '0.4rem'
              }}>Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem', padding: '0.8rem 1rem', outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block', fontSize: '0.62rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: '0.4rem'
              }}>Password</label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem', padding: '0.8rem 1rem', outline: 'none'
                }}
              />
            </div>

            {error && (
              <div style={{
                marginBottom: '1rem', padding: '0.75rem',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                color: '#f87171', fontSize: '0.78rem'
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', background: 'var(--gold)', color: 'var(--navy)',
              border: 'none', padding: '1rem',
              fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem',
              fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  )
}