const translations = {
  en: {
    tag: 'Our Vehicles', title: 'Premium', titleEm: 'Fleet',
    taxiName: 'Executive Taxi', taxiCap: '1 – 4 Passengers',
    taxiDesc: 'Premium sedans for individuals and small groups. Perfect for airport transfers, business meetings and city travel.',
    vanName: 'Luxury Van', vanCap: '5 – 9 Passengers',
    vanDesc: 'Spacious premium vans for families, groups and corporate teams. Generous luggage capacity and superior comfort.',
    features1: ['Climate control', 'Free Wi-Fi on board', 'Meet & greet service', 'Bottled water included'],
    features2: ['Extra luggage capacity', 'Panoramic windows', 'USB charging ports', 'Child seats available']
  },
  gr: {
    tag: 'Τα Οχήματά Μας', title: 'Premium', titleEm: 'Στόλος',
    taxiName: 'Executive Taxi', taxiCap: '1 – 4 Επιβάτες',
    taxiDesc: 'Premium sedan για άτομα και μικρές ομάδες. Ιδανικό για μεταφορές αεροδρομίου, επαγγελματικές συναντήσεις και αστικά ταξίδια.',
    vanName: 'Luxury Van', vanCap: '5 – 9 Επιβάτες',
    vanDesc: 'Ευρύχωρα premium van για οικογένειες, ομάδες και εταιρικές αποστολές. Μεγάλη χωρητικότητα αποσκευών και ανώτερη άνεση.',
    features1: ['Κλιματισμός', 'Δωρεάν Wi-Fi', 'Υπηρεσία υποδοχής', 'Εμφιαλωμένο νερό'],
    features2: ['Μεγάλη χωρητικότητα αποσκευών', 'Πανοραμικά παράθυρα', 'Θύρες φόρτισης USB', 'Διαθέσιμα παιδικά καθίσματα']
  }
}

function FleetCard({ icon, name, cap, desc, features, photo }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      background: 'rgba(255,255,255,0.02)',
      overflow: 'hidden',
      transition: 'transform 0.3s, border-color 0.3s'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* Photo placeholder */}
      <div style={{
        height: '200px', position: 'relative', overflow: 'hidden',
        background: photo ? `url(${photo}) center/cover no-repeat` : 'linear-gradient(135deg, var(--navy-light), var(--navy-mid))',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {!photo && <span style={{ fontSize: '4rem', opacity: 0.3 }}>{icon}</span>}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(13,27,42,0.8) 0%, transparent 60%)'
        }}/>
        <div style={{
          position: 'absolute', bottom: '1rem', left: '1.5rem',
          fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--gold)', fontWeight: 500
        }}>{cap}</div>
      </div>

      <div style={{ padding: '1.8rem' }}>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.4rem', fontWeight: 400, color: 'var(--white)', marginBottom: '0.75rem'
        }}>{name}</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.2rem' }}>{desc}</p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {features.map((f, i) => (
            <li key={i} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.5rem' }}>✦</span> {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Fleet({ lang }) {
  const t = translations[lang]

  return (
    <section id="fleet" style={{ padding: '80px 1.5rem', background: 'var(--navy)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title} <em>{t.titleEm}</em></h2>
          <div className="gold-line"/>
        </div>
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <FleetCard
            icon="🚖" name={t.taxiName} cap={t.taxiCap}
            desc={t.taxiDesc} features={t.features1}
            photo="/taxi-photo.jpg"
          />
          <FleetCard
            icon="🚐" name={t.vanName} cap={t.vanCap}
            desc={t.vanDesc} features={t.features2}
            photo="/van-photo.jpg"
          />
        </div>
      </div>
    </section>
  )
}