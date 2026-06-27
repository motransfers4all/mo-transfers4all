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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050c16 0%, #0a1e35 40%, #0f3460 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(41,128,185,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}/>

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>

        {/* Logo area */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '4px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c9a84c, #2980b9)',
            marginBottom: '1.2rem'
          }}>
            <img src="/logo.jpg" alt="MO Transfers4all" style={{
              width: '80px', height: '80px', borderRadius: '50%',
              objectFit: 'cover', display: 'block',
              border: '3px solid #050c16'
            }}/>
          </div>
          <div style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '1.5rem', fontWeight: 600, color: '#ffffff',
            letterSpacing: '0.08em'
          }}>MO Transfers4all</div>
          <div style={{
            fontSize: '0.62rem', color: '#c9a84c',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            marginTop: '0.35rem', fontWeight: 600
          }}>Partner Portal · Athens</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderTop: '2px solid #c9a84c',
          borderRadius: '2px',
          padding: '2.5rem 2.25rem',
          boxShadow: '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '1.6rem', fontWeight: 300, color: '#ffffff',
            marginBottom: '0.4rem', letterSpacing: '0.02em'
          }}>Welcome back</h2>
          <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Sign in to access your booking portal.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block', fontSize: '0.6rem', letterSpacing: '0.22em',
                textTransform: 'uppercase', color: '#c9a84c',
                fontWeight: 600, marginBottom: '0.5rem'
              }}>Email Address</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '2px',
                  color: '#f0e6d0',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.88rem',
                  padding: '0.85rem 1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.6)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(201,168,76,0.25)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{
                display: 'block', fontSize: '0.6rem', letterSpacing: '0.22em',
                textTransform: 'uppercase', color: '#c9a84c',
                fontWeight: 600, marginBottom: '0.5rem'
              }}>Password</label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '2px',
                  color: '#f0e6d0',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.88rem',
                  padding: '0.85rem 1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.6)'; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(201,168,76,0.25)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {error && (
              <div style={{
                marginBottom: '1.25rem', padding: '0.85rem 1rem',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.25)',
                borderRadius: '2px',
                color: '#f87171', fontSize: '0.78rem', lineHeight: 1.5
              }}>⚠ {error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: loading ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg, #c9a84c, #b8932e)',
              color: '#050c16',
              border: 'none', borderRadius: '2px',
              padding: '1rem',
              fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
              fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s, transform 0.1s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(201,168,76,0.3)'
            }}
              onMouseEnter={e => { if (!loading) e.target.style.opacity = '0.9' }}
              onMouseLeave={e => { e.target.style.opacity = '1' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <a href="/" style={{
            fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)',
            textDecoration: 'none', letterSpacing: '0.05em',
            transition: 'color 0.2s',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Back to main website
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
