const translations = {
  en: {
    tag: 'What We Offer', title: 'Our', titleEm: 'Services',
    items: [
      { icon: '✈️', name: 'Airport Transfers', desc: 'We track your flight, meet you at arrivals, and wait if you\'re held up at customs.' },
      { icon: '🚢', name: 'Port & Ferries', desc: 'Piraeus transfers for cruise passengers, island ferry connections and cargo pickups.' },
      { icon: '🏛️', name: 'Sightseeing', desc: 'Acropolis, Plaka, Cape Sounio — explore at your own pace with a driver who knows the city.' },
      { icon: '💼', name: 'Corporate', desc: 'Quiet, punctual and professional. Suitable for clients, executives and business events.' },
      { icon: '🌊', name: 'Coastal Routes', desc: 'The Attic Riviera from Glyfada to Sounio — beaches, resorts and waterside restaurants.' },
      { icon: '🕐', name: 'Any Hour', desc: '5am departures, midnight arrivals. Just book ahead and we\'ll be there.' },
    ]
  },
  gr: {
    tag: 'Τι Προσφέρουμε', title: 'Οι', titleEm: 'Υπηρεσίες Μας',
    items: [
      { icon: '✈️', name: 'Αεροδρόμιο', desc: 'Παρακολουθούμε την πτήση σας, σας παραλαμβάνουμε και περιμένουμε αν καθυστερήσετε.' },
      { icon: '🚢', name: 'Λιμάνι & Ferry', desc: 'Μεταφορές Πειραιά για κρουαζιερόπλοια και ferry προς τα νησιά.' },
      { icon: '🏛️', name: 'Αξιοθέατα', desc: 'Ακρόπολη, Πλάκα, Σούνιο — εξερευνήστε με έναν οδηγό που ξέρει την πόλη.' },
      { icon: '💼', name: 'Εταιρικές', desc: 'Διακριτική, επαγγελματική υπηρεσία για στελέχη και εταιρικές εκδηλώσεις.' },
      { icon: '🌊', name: 'Παράκτιες Διαδρομές', desc: 'Αττική Ριβιέρα από Γλυφάδα ως Σούνιο — παραλίες, θέρετρα, εστιατόρια.' },
      { icon: '🕐', name: 'Οποιαδήποτε Ώρα', desc: 'Αναχωρήσεις στις 5 πρωί, αφίξεις τα μεσάνυχτα. Κλείστε θέση και θα είμαστε εκεί.' },
    ]
  }
}

export default function Services({ lang }) {
  const t = translations[lang]

  return (
    <section id="services" style={{ padding: '88px 1.5rem', background: 'var(--blue-deep)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag" style={{ color: '#7ab3d9' }}>{t.tag}</span>
          <h2 className="section-title" style={{ color: '#fff' }}>{t.title} <em style={{ color: '#7ab3d9' }}>{t.titleEm}</em></h2>
          <div className="blue-line" style={{ background: 'linear-gradient(90deg,#7ab3d9,rgba(122,179,217,0.2))' }}/>
        </div>
        <div className="reveal" style={{
          display: 'grid', gap: '1px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {t.items.map((item, i) => (
            <div key={i} style={{
              padding: '2rem 1.5rem', textAlign: 'center',
              background: 'var(--blue-deep)', transition: 'background 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-mid)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--blue-deep)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{item.name}</div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}