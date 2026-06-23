import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const translations = {
  en: { book: 'Book Now', fleet: 'Fleet', services: 'Services', prices: 'Rates', privacy: 'Privacy' },
  gr: { book: 'Κράτηση', fleet: 'Στόλος', services: 'Υπηρεσίες', prices: 'Τιμές', privacy: 'Απόρρητο' }
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

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(13,27,42,0.97)' : 'rgba(13,27,42,0.92)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '70px', transition: 'background 0.3s'
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="/logo.jpg" alt="MO Transfers4all" style={{
            width: '52px', height: '52px', borderRadius: '50%',
            objectFit: 'cover', border: '2px solid var(--gold)'
          }}/>
          <div>
            <span style={{ display: 'block', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', fontWeight: 600, color: 'var(--white)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>MO Transfers4all</span>
            <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Athens · Greece</span>
          </div>
        </a>

        <ul style={{ display: 'none', listStyle: 'none', gap: '2rem', ...(window.innerWidth >= 768 ? { display: 'flex' } : {}) }}>
          {[['#booking', t.book], ['#fleet', t.fleet], ['#prices', t.prices], ['#services', t.services]].map(([href, label]) => (
            <li key={href}>
              <a href={href} style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{label}</a>
            </li>
          ))}
          <li><Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>Portal</Link></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {['en', 'gr'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                background: lang === l ? 'var(--gold)' : 'transparent',
                color: lang === l ? 'var(--navy)' : 'var(--text-muted)',
                border: 'none', fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
                padding: '0.3rem 0.6rem', cursor: 'pointer', textTransform: 'uppercase'
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            display: window.innerWidth >= 768 ? 'none' : 'flex',
            flexDirection: 'column', gap: '5px',
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px'
          }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: '22px', height: '1.5px', background: 'var(--cream)' }}/>)}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: '70px', left: 0, right: 0,
          background: 'var(--navy-mid)', borderBottom: '1px solid var(--border)',
          padding: '1.5rem', zIndex: 999,
          display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          {[['#booking', t.book], ['#fleet', t.fleet], ['#prices', t.prices], ['#services', t.services]].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--cream)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {label}
            </a>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: 'var(--gold)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Portal</Link>
        </div>
      )}
    </>
  )
}