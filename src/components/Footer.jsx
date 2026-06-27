import { Link } from 'react-router-dom'

const translations = {
  en: {
    desc: 'Private transfers across Athens and Attica, run by Marjus Oruci. Honest prices, real punctuality, no fuss.',
    payment: 'POS · IRIS · Cash',
    nav: 'Navigate', contact: 'Contact', legal: 'Legal',
    links: [
      { label: 'Destinations', href: '#destinations' },
      { label: 'Book a Transfer', href: '#booking' },
      { label: 'The Vehicles', href: '#fleet' },
      { label: 'Rates', href: '#prices' },
      { label: 'Services', href: '#services' },
    ],
    rights: 'All rights reserved.',
    partnerPortal: 'Partner Portal',
  },
  gr: {
    desc: 'Ιδιωτικές μεταφορές στην Αθήνα και Αττική από τον Marjus Oruci. Τίμιες τιμές, πραγματική ακρίβεια.',
    payment: 'POS · IRIS · Μετρητά',
    nav: 'Πλοήγηση', contact: 'Επικοινωνία', legal: 'Νομικά',
    links: [
      { label: 'Προορισμοί', href: '#destinations' },
      { label: 'Κράτηση', href: '#booking' },
      { label: 'Οχήματα', href: '#fleet' },
      { label: 'Τιμές', href: '#prices' },
      { label: 'Υπηρεσίες', href: '#services' },
    ],
    rights: 'Με επιφύλαξη παντός δικαιώματος.',
    partnerPortal: 'Πύλη Συνεργατών',
  }
}

export default function Footer({ lang }) {
  const t = translations[lang]
  const year = new Date().getFullYear()

  const headingStyle = {
    display: 'block', fontSize: '0.62rem', letterSpacing: '0.2em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
    fontWeight: 600, marginBottom: '1rem'
  }

  const linkStyle = {
    display: 'block', color: 'rgba(255,255,255,0.52)',
    textDecoration: 'none', fontSize: '0.78rem',
    marginBottom: '0.6rem', transition: 'color 0.2s'
  }

  return (
    <footer style={{ background: 'var(--blue-deep)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 1.5rem 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gap: '2.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '2rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/logo.jpg" alt="MO" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.2)' }}/>
              <div>
                <span style={{ display: 'block', fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 600, color: '#fff' }}>MO Transfers4all</span>
                <span style={{ display: 'block', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Athens</span>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>{t.desc}</p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.75rem' }}>{t.payment}</p>
          </div>

          {/* Navigation */}
          <div>
            <span style={headingStyle}>{t.nav}</span>
            {t.links.map((l, i) => (
              <a key={i} href={l.href} style={linkStyle}
                onMouseEnter={e => e.target.style.color = '#7ab3d9'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.52)'}
              >{l.label}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <span style={headingStyle}>{t.contact}</span>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.52)', lineHeight: 2.2 }}>
              <div style={{ color: 'rgba(255,255,255,0.78)', fontWeight: 500, marginBottom: '0.2rem' }}>Marjus Oruci</div>
              <div>ΑΦΜ: 122559412</div>
              <a href="tel:+306936475451" style={{ color: 'rgba(255,255,255,0.52)', textDecoration: 'none', display: 'block' }}>+30 693 647 5451</a>
              <a href="tel:+306993605070" style={{ color: 'rgba(255,255,255,0.52)', textDecoration: 'none', display: 'block' }}>+30 699 360 5070</a>
              <a href="tel:+306979638475" style={{ color: 'rgba(255,255,255,0.52)', textDecoration: 'none', display: 'block' }}>+30 697 963 8475</a>
              <a href="mailto:marjoruci@gmail.com" style={{ color: '#7ab3d9', textDecoration: 'none' }}>marjoruci@gmail.com</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <span style={headingStyle}>{t.legal}</span>
            <Link to="/privacy" style={linkStyle}
              onMouseEnter={e => e.target.style.color = '#7ab3d9'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.52)'}
            >{lang === 'en' ? 'Privacy Policy' : 'Πολιτική Απορρήτου'}</Link>
            <Link to="/terms" style={linkStyle}
              onMouseEnter={e => e.target.style.color = '#7ab3d9'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.52)'}
            >{lang === 'en' ? 'Terms of Service' : 'Όροι Υπηρεσίας'}</Link>
            <Link to="/login" style={{ ...linkStyle, color: '#7ab3d9' }}>{t.partnerPortal}</Link>
          </div>

        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexWrap: 'wrap', gap: '1rem',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>
            © {year} Marjus Oruci · MO Transfers4all Athens. {t.rights}
          </p>
          <a href="https://wa.me/306936475451" target="_blank" rel="noopener noreferrer"
            style={{ color: '#7ab3d9', fontSize: '0.72rem', textDecoration: 'none' }}>
            💬 WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}