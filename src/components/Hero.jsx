import { useState, useEffect } from 'react'

const SLIDES = [
  { url: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1400&q=80', label: 'Acropolis, Athens' },
  { url: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1400&q=80', label: 'Athens by night' },
  { url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80', label: 'Arriving in Greece' },
]

const translations = {
  en: {
    eyebrow: 'Private Transfers · Athens & Attica',
    title1: 'Your Journey,',
    title2: 'Our',
    titleEm: 'Priority.',
    sub: 'Professional private transfers across Athens, Attica and all of Greece. Airport pickups, long-distance routes, sightseeing — always on time, always with care.',
    cta: 'Book a Transfer',
    call: '+30 693 647 5451',
    trust: ['Licensed & Insured', '24/7 Available', 'Fixed Prices', 'Flight Monitoring'],
    stat1: '24/7', stat1label: 'Available',
    stat2: '100%', stat2label: 'Fixed prices · No surprises',
  },
  gr: {
    eyebrow: 'Ιδιωτικές Μεταφορές · Αθήνα & Αττική',
    title1: 'Το Ταξίδι σας,',
    title2: 'Η',
    titleEm: 'Προτεραιότητά μας.',
    sub: 'Επαγγελματικές ιδιωτικές μεταφορές στην Αθήνα, Αττική και σε όλη την Ελλάδα. Αεροδρόμιο, μακρινές διαδρομές, εκδρομές — πάντα στην ώρα μας.',
    cta: 'Κλείστε Θέση',
    call: '+30 693 647 5451',
    trust: ['Αδειοδοτημένοι', 'Διαθέσιμοι 24/7', 'Σταθερές Τιμές', 'Παρακολούθηση Πτήσης'],
    stat1: '24/7', stat1label: 'Διαθέσιμοι',
    stat2: '100%', stat2label: 'Σταθερές τιμές · Χωρίς εκπλήξεις',
  }
}

export default function Hero({ lang }) {
  const t = translations[lang]
  const [idx, setIdx] = useState(0)
  const [label, setLabel] = useState(SLIDES[0].label)
  const [labelVisible, setLabelVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setLabelVisible(false)
      setTimeout(() => {
        setIdx(prev => {
          const next = (prev + 1) % SLIDES.length
          setLabel(SLIDES[next].label)
          return next
        })
        setLabelVisible(true)
      }, 600)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .hero-photo-panel { position: absolute; right: 0; top: 0; bottom: 0; width: calc(100% - 500px); min-width: 280px; overflow: hidden; }
        .hero-text-panel { position: relative; z-index: 2; width: 100%; max-width: 520px; background: #fff; padding: clamp(88px,11vw,126px) clamp(1.5rem,5.5vw,4.5rem) clamp(60px,7vw,88px); display: flex; flex-direction: column; justify-content: center; min-height: 100vh; }
        @media (max-width: 767px) {
          .hero-photo-panel { width: 100%; min-width: unset; }
          .hero-text-panel { background: rgba(255,255,255,0.78); backdrop-filter: blur(1px); max-width: 100%; }
        }
      `}</style>

      {/* Left white panel */}
      <div className="hero-text-panel">
        <div style={{
          fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--blue-bright)', fontWeight: 600, marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.7rem'
        }}>
          <span style={{ display: 'block', width: '26px', height: '2px', background: 'var(--blue-bright)', borderRadius: '1px', flexShrink: 0 }}/>
          {t.eyebrow}
        </div>

        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2.1rem,4.8vw,3.5rem)',
          fontWeight: 700, color: 'var(--blue-deep)',
          lineHeight: 1.13, marginBottom: '1.4rem'
        }}>
          {t.title1}<br/>{t.title2} <em style={{ fontStyle: 'italic', color: 'var(--blue-bright)', fontWeight: 400 }}>{t.titleEm}</em>
        </h1>

        <p style={{
          fontSize: '0.88rem', color: 'var(--text-mid)',
          lineHeight: 1.82, marginBottom: '2.4rem', maxWidth: '400px'
        }}>{t.sub}</p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.4rem' }}>
          <a href="#booking" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--blue-deep)', color: '#fff',
            padding: '0.88rem 1.9rem', borderRadius: '4px',
            fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
            boxShadow: '0 4px 18px rgba(15,52,96,0.24)', transition: 'all 0.3s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-mid)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue-deep)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {t.cta} →
          </a>
          <a href={`tel:${t.call.replace(/\s/g,'')}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            border: '1.5px solid var(--border)', color: 'var(--blue-deep)',
            padding: '0.88rem 1.4rem', borderRadius: '4px',
            fontSize: '0.73rem', fontWeight: 500, transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-bright)'; e.currentTarget.style.color = 'var(--blue-bright)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--blue-deep)' }}
          >
            📞 {t.call}
          </a>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.5rem' }}>
          {t.trust.map(item => (
            <div key={item} style={{ fontSize: '0.7rem', color: 'var(--text-mid)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue-bright)', flexShrink: 0 }}/>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right photo panel */}
      <div className="hero-photo-panel">
        {SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${s.url}')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 1.2s ease'
          }}/>
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg,rgba(255,255,255,0.10) 0%,transparent 20%), linear-gradient(to top,rgba(10,37,64,0.32) 0%,transparent 45%)'
        }}/>

        {/* Stat card */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', right: '2rem',
          background: 'rgba(10,37,64,0.86)', backdropFilter: 'blur(10px)',
          borderRadius: '8px', padding: '1.1rem 1.4rem',
          border: '1px solid rgba(255,255,255,0.11)', minWidth: '200px'
        }}>
          <div style={{ fontSize: '1.7rem', fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{t.stat1}</div>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7ab3d9', marginTop: '0.28rem' }}>{t.stat1label}</div>
          <div style={{ margin: '0.7rem 0', width: '100%', height: '1px', background: 'rgba(255,255,255,0.09)' }}/>
          <div style={{ fontSize: '1.7rem', fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{t.stat2}</div>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7ab3d9', marginTop: '0.28rem' }}>{t.stat2label}</div>
        </div>

        {/* Slide label */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', left: '2rem',
          fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.75)', fontWeight: 500,
          background: 'rgba(10,37,64,0.55)', padding: '0.35rem 0.75rem',
          borderRadius: '20px', backdropFilter: 'blur(6px)',
          opacity: labelVisible ? 1 : 0, transition: 'opacity 0.5s'
        }}>{label}</div>
      </div>
    </section>
  )
}