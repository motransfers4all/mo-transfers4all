const translations = {
  en: {
    eyebrow: 'Premium Transfer Services',
    title1: 'Athens',
    title2: 'Elite',
    title3: 'Transfers',
    sub: 'Luxury private transfers across Athens, Attica & beyond. Punctuality, discretion, and excellence in every journey.',
    cta: 'Book Your Transfer',
    scroll: 'Scroll'
  },
  gr: {
    eyebrow: 'Υπηρεσίες Premium Μεταφοράς',
    title1: 'Athens',
    title2: 'Elite',
    title3: 'Transfers',
    sub: 'Πολυτελείς ιδιωτικές μεταφορές στην Αθήνα, Αττική & πέρα από αυτήν. Ακρίβεια, διακριτικότητα και αριστεία σε κάθε διαδρομή.',
    cta: 'Κάντε Κράτηση',
    scroll: 'Κύλιση'
  }
}

export default function Hero({ lang }) {
  const t = translations[lang]

  return (
    <section style={{
      minHeight: '100vh', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '100px 1.5rem 60px'
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%), linear-gradient(160deg, #0d1b2a 0%, #0a1520 40%, #0d1b2a 100%)'
      }}/>

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}/>

      {/* Photo placeholder — replace with real Athens photo later */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        background: 'url(/athens-hero.jpg) center/cover no-repeat'
      }}/>

      {/* Circles */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        width: '600px', height: '600px', opacity: 0.06,
        border: '1px solid var(--gold)', borderRadius: '50%'
      }}/>

      {/* Content */}
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '760px' }}>
        <div style={{
          fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase',
          color: 'var(--gold)', fontWeight: 500, marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'
        }}>
          <span style={{ display: 'block', width: '40px', height: '1px', background: 'var(--gold)', opacity: 0.5 }}/>
          {t.eyebrow}
          <span style={{ display: 'block', width: '40px', height: '1px', background: 'var(--gold)', opacity: 0.5 }}/>
        </div>

        {/* Logo image in hero */}
        <img src="/logo.jpg" alt="MO Transfers4all" style={{
          width: 'clamp(100px, 22vw, 160px)',
          height: 'clamp(100px, 22vw, 160px)',
          borderRadius: '50%', objectFit: 'cover',
          border: '2px solid var(--gold)',
          boxShadow: '0 0 60px rgba(201,168,76,0.2)',
          marginBottom: '1.5rem'
        }}/>

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
          fontWeight: 700, color: 'var(--white)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: '1rem', textShadow: '0 2px 20px rgba(201,168,76,0.3)'
        }}>
          MO Transfers4all <em style={{ color: 'var(--gold)', fontStyle: 'italic', fontWeight: 300 }}>Athens</em>
        </h2>

        <p style={{
          fontSize: '0.82rem', letterSpacing: '0.1em',
          color: 'var(--text-muted)', marginBottom: '2.5rem',
          maxWidth: '480px', margin: '0 auto 2.5rem'
        }}>{t.sub}</p>

        <a href="#booking" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
          background: 'var(--gold)', color: 'var(--navy)',
          padding: '0.85rem 2.2rem',
          fontSize: '0.72rem', letterSpacing: '0.2em', fontWeight: 600,
          textTransform: 'uppercase', textDecoration: 'none',
          transition: 'all 0.3s'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >{t.cta}</a>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        color: 'var(--text-muted)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase'
      }}>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--gold), transparent)' }}/>
        {t.scroll}
      </div>
    </section>
  )
}