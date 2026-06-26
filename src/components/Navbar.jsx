import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const translations = {
  en: { book: 'Book Now', fleet: 'Fleet', services: 'Services', prices: 'Rates', destinations: 'Destinations' },
  gr: { book: 'Κράτηση', fleet: 'Στόλος', services: 'Υπηρεσίες', prices: 'Τιμές', destinations: 'Προορισμοί' }
}

export default function Navbar({ lang, setLang }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = translations[lang]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    background: 'rgba(255,255,255,0.97)',
    borderBottom: '1px solid var(--border)',
    backdropFilter: 'blur(14px)',
    boxShadow: scrolled ? '0 2px 18px rgba(15,52,96,0.1)' : '0 2px 18px rgba(15,52,96,0.07)',
    padding: '0 1.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '68px', transition: 'box-shadow 0.3s'
  }

  const linkStyle = {
    color: 'var(--text-mid)', fontSize: '0.73rem', letterSpacing: '0.08em',
    textTransform: 'uppercase', fontWeight: 500, transition: 'color 0.2s'
  }

  return (
    <>
      <nav style={navStyle}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.jpg" alt="MO Transfers4all" style={{
            width: '46px', height: '46px', borderRadius: '50%',
            objectFit: 'cover', border: '2px solid var(--blue-bright)', flexShrink: 0
          }}/>
          <div>
            <span style={{ display: 'block', fontFamily: 'Playfair Display, serif', fontSize: '0.98rem', fontWeight: 600, color: 'var(--blue-deep)', letterSpacing: '0.04em' }}>MO Transfers4all</span>
            <span style={{ display: 'block', fontSize: '0.56rem', color: 'var(--blue-bright)', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>Athens · Greece</span>
          </div>
        </a>

        {/* Desktop links */}
        <ul style={{ display: window.innerWidth >= 768 ? 'flex' : 'none', listStyle: 'none', gap: '2rem' }}>
          {[['#destinations', t.destinations], ['#booking', t.book], ['#fleet', t.fleet], ['#prices', t.prices], ['#services', t.services]].map(([href, label]) => (
            <li key={href}>
              <a href={href} style={linkStyle}
                onMouseEnter={e => e.target.style.color = 'var(--blue-deep)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-mid)'}
              >{label}</a>
            </li>
          ))}
          <li><Link to="/login" style={{ ...linkStyle, color: 'var(--blue-bright)' }}>Portal</Link></li>
        </ul>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
            {['en', 'gr'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                background: lang === l ? 'var(--blue-deep)' : 'transparent',
                color: lang === l ? '#fff' : 'var(--text-mid)',
                border: 'none', fontFamily: 'Inter, sans-serif',
                fontSize: '0.67rem', fontWeight: 600, letterSpacing: '0.08em',
                padding: '0.28rem 0.62rem', cursor: 'pointer', textTransform: 'uppercase'
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <a href="#booking" style={{
            display: window.innerWidth >= 768 ? 'inline-flex' : 'none',
            alignItems: 'center', background: 'var(--blue-deep)', color: '#fff',
            padding: '0.48rem 1.1rem', borderRadius: '4px',
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>{t.book}</a>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            display: window.innerWidth >= 768 ? 'none' : 'flex',
            flexDirection: 'column', gap: '5px',
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px'
          }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: '22px', height: '2px', background: 'var(--blue-deep)' }}/>)}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '68px', left: 0, right: 0,
          background: '#fff', borderBottom: '1px solid var(--border)',
          padding: '1.5rem', zIndex: 999,
          display: 'flex', flexDirection: 'column', gap: '1rem',
          boxShadow: '0 8px 24px rgba(15,52,96,0.1)'
        }}>
          {[['#destinations', t.destinations], ['#booking', t.book], ['#fleet', t.fleet], ['#prices', t.prices], ['#services', t.services]].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--text-dark)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              {label}
            </a>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: 'var(--blue-bright)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Portal</Link>
        </div>
      )}
    </>
  )
}