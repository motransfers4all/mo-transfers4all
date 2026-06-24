import { Link } from 'react-router-dom'

const translations = {
  en: {
    desc: 'Private transfer services in Athens and Attica by Marjus Oruci. Reliable, professional and always on time.',
    nav: 'Navigation', contact: 'Contact', legal: 'Legal',
    links: [
      { label: 'Book Now', href: '#booking' },
      { label: 'Our Fleet', href: '#fleet' },
      { label: 'Rates', href: '#prices' },
      { label: 'Services', href: '#services' },
    ],
    rights: 'All rights reserved.',
    payment: 'Payment: POS · IRIS · Cash'
  },
  gr: {
    desc: 'Ιδιωτικές μεταφορές στην Αθήνα και Αττική από τον Marjus Oruci. Αξιοπιστία και επαγγελματισμός σε κάθε διαδρομή.',
    nav: 'Πλοήγηση', contact: 'Επικοινωνία', legal: 'Νομικά',
    links: [
      { label: 'Κράτηση', href: '#booking' },
      { label: 'Ο Στόλος', href: '#fleet' },
      { label: 'Τιμές', href: '#prices' },
      { label: 'Υπηρεσίες', href: '#services' },
    ],
    rights: 'Με επιφύλαξη παντός δικαιώματος.',
    payment: 'Πληρωμή: POS · IRIS · Μετρητά'
  }
}

export default function Footer({ lang }) {
  const t = translations[lang]

  const headingStyle = {
    fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase',
    color: 'var(--gold)', fontWeight: 500, marginBottom: '1rem', display: 'block'
  }
  const linkStyle = {
    color: 'var(--text-muted)', textDecoration: 'none',
    fontSize: '0.78rem', transition: 'color 0.2s', display: 'block', marginBottom: '0.6rem'
  }

  return (
    <footer style={{ background: '#080f17', borderTop: '1px solid var(--border)', padding: '3rem 1.5rem 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>

          {/* Brand */}
          <div>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <img src="/logo.jpg" alt="MO Transfers4all" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--gold)' }}/>
              <div>
                <span style={{ display: 'block', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 600, color: 'var(--white)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>MO Transfers4all</span>
                <span style={{ display: 'block', fontSize: '0.58rem', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Athens</span>
              </div>
            </a>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{t.desc}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>{t.payment}</p>
          </div>

          {/* Navigation */}
          <div>
            <span style={headingStyle}>{t.nav}</span>
            {t.links.map((l, i) => (
              <a key={i} href={l.href} style={linkStyle}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{l.label}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <span style={headingStyle}>{t.contact}</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 2.2 }}>
              <div>Marjus Oruci</div>
              <div>MO Transfers4all Athens</div>
              <div>ΑΦΜ: 122559412</div>
              <a href="tel:+306936475451" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>+30 693 647 5451</a><br/>
              <a href="tel:+306993605070" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>+30 699 360 5070</a><br/>
              <a href="tel:+306979638475" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>+30 697 963 8475</a><br/>
              <a href="mailto:marjoruci@gmail.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>marjoruci@gmail.com</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <span style={headingStyle}>{t.legal}</span>
            <Link to="/privacy" style={linkStyle}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >{lang === 'en' ? 'Privacy Policy' : 'Πολιτική Απορρήτου'}</Link>
            <Link to="/terms" style={linkStyle}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >{lang === 'en' ? 'Terms of Service' : 'Όροι Υπηρεσίας'}</Link>
            <Link to="/login" style={linkStyle}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >Partner Portal</Link>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '1.5rem', borderTop: '1px solid rgba(201,168,76,0.1)',
          display: 'flex', flexWrap: 'wrap', gap: '1rem',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            © 2025 Marjus Oruci · MO Transfers4all Athens. {t.rights}
          </p>
          <a href="https://wa.me/306936475451" target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: '#25d366', fontSize: '0.72rem', textDecoration: 'none'
            }}>
            💬 WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}