const translations = {
  en: {
    tag: 'What We Offer', title: 'Our', titleEm: 'Services',
    items: [
      { icon: '✈️', name: 'Airport Transfers', desc: 'Athens International Airport pickups and drop-offs with real-time flight monitoring.' },
      { icon: '🏛️', name: 'City & Sightseeing', desc: 'Explore Athens and Attica in comfort and style, at your own pace.' },
      { icon: '🚢', name: 'Port Transfers', desc: 'Piraeus port transfers for cruise passengers and ferry connections.' },
      { icon: '💼', name: 'Corporate', desc: 'Discreet, professional service for business executives and corporate events.' },
      { icon: '🌊', name: 'Coastal Routes', desc: 'Sounio, Varkiza, Vouliagmeni, Glyfada — the Attic Riviera at its finest.' },
      { icon: '🕐', name: '24/7 Available', desc: 'Early morning flights, late night arrivals — we are always ready for you.' },
    ]
  },
  gr: {
    tag: 'Τι Προσφέρουμε', title: 'Οι', titleEm: 'Υπηρεσίες Μας',
    items: [
      { icon: '✈️', name: 'Αεροδρόμιο', desc: 'Μεταφορές ΔΑΑ με παρακολούθηση πτήσης σε πραγματικό χρόνο.' },
      { icon: '🏛️', name: 'Αστικές & Τουριστικές', desc: 'Εξερευνήστε Αθήνα και Αττική με άνεση και στυλ.' },
      { icon: '🚢', name: 'Λιμάνι Πειραιά', desc: 'Μεταφορές λιμανιού Πειραιά για κρουαζιερόπλοια και ferry.' },
      { icon: '💼', name: 'Εταιρικές', desc: 'Διακριτική, επαγγελματική υπηρεσία για στελέχη και εταιρικές εκδηλώσεις.' },
      { icon: '🌊', name: 'Παράκτιες Διαδρομές', desc: 'Σούνιο, Βάρκιζα, Βουλιαγμένη, Γλυφάδα — η Αττική Ριβιέρα.' },
      { icon: '🕐', name: '24/7 Διαθέσιμοι', desc: 'Πρωινές πτήσεις, βραδινές αφίξεις — πάντα εκεί όταν μας χρειάζεστε.' },
    ]
  }
}

export default function Services({ lang }) {
  const t = translations[lang]

  return (
    <section id="services" style={{ padding: '80px 1.5rem', background: 'var(--navy-mid)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title} <em>{t.titleEm}</em></h2>
          <div className="gold-line"/>
        </div>
        <div style={{
          display: 'grid', gap: '1px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          border: '1px solid var(--border)'
        }}>
          {t.items.map((item, i) => (
            <div key={i} style={{
              padding: '2rem 1.5rem', textAlign: 'center',
              borderRight: '1px solid var(--border)',
              transition: 'background 0.3s', cursor: 'default'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{item.icon}</div>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.15rem', fontWeight: 400,
                color: 'var(--white)', marginBottom: '0.5rem'
              }}>{item.name}</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}