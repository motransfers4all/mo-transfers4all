const translations = {
  en: {
    tag: 'Transparent Pricing', title: 'Our', titleEm: 'Rates',
    route: 'Route', taxi: 'Taxi (€)', van: 'Van (€)', notes: 'Notes',
    onRequest: 'On request', footnote: '🌙 Night rate applies between midnight and 05:00. All prices are fixed and include tolls. Payment: POS · IRIS · Cash.',
    airport: '✈️ Airport', coastal: '🌊 Coastal & Day Trips', port: '🚢 Port', local: '🏙️ Local',
    routes: {
      airport: [
        { route: 'Centre → Airport', taxi: '€50', van: '€95', note: '—' },
        { route: 'Centre → Airport', taxi: '€65', van: '€115', note: '🌙 00:00–05:00', night: true },
        { route: 'Airport → Centre', taxi: '€50', van: '€95', note: '—' },
        { route: 'Airport → Centre', taxi: '€65', van: '€115', note: '🌙 00:00–05:00', night: true },
      ],
      coastal: [
        { route: 'Centre → Sounio', taxi: '€95', van: 'On request', note: '+€25/hr' },
        { route: 'Centre → Lavrio', taxi: '€80', van: 'On request', note: '—' },
        { route: 'Centre → Rafina', taxi: '€50', van: 'On request', note: '—' },
        { route: 'Centre → Vouliagmeni', taxi: '€35', van: 'On request', note: '—' },
        { route: 'Centre → Varkiza', taxi: '€40', van: 'On request', note: '—' },
        { route: 'Centre → Glyfada', taxi: '€25', van: 'On request', note: '—' },
        { route: 'Centre → Parnitha Cable Car', taxi: '€45', van: 'On request', note: '—' },
      ],
      port: [
        { route: 'Centre → Piraeus', taxi: '€30', van: 'On request', note: '—' },
        { route: 'Piraeus → Centre', taxi: '€35', van: 'On request', note: '—' },
      ],
      local: [
        { route: 'Local trips within Athens', taxi: '€15', van: 'On request', note: '—' },
      ]
    }
  },
  gr: {
    tag: 'Τιμοκατάλογος', title: 'Οι', titleEm: 'Τιμές Μας',
    route: 'Διαδρομή', taxi: 'Taxi (€)', van: 'Van (€)', notes: 'Σημειώσεις',
    onRequest: 'Κατόπιν συνεννόησης', footnote: '🌙 Νυχτερινή τaρίφα μεταξύ μεσανύχτων και 05:00. Όλες οι τιμές είναι σταθερές και περιλαμβάνουν διόδια. Πληρωμή: POS · IRIS · Μετρητά.',
    airport: '✈️ Αεροδρόμιο', coastal: '🌊 Παράκτιες & Ημερήσιες', port: '🚢 Λιμάνι', local: '🏙️ Τοπικές',
    routes: {
      airport: [
        { route: 'Κέντρο → Αεροδρόμιο', taxi: '€50', van: '€95', note: '—' },
        { route: 'Κέντρο → Αεροδρόμιο', taxi: '€65', van: '€115', note: '🌙 00:00–05:00', night: true },
        { route: 'Αεροδρόμιο → Κέντρο', taxi: '€50', van: '€95', note: '—' },
        { route: 'Αεροδρόμιο → Κέντρο', taxi: '€65', van: '€115', note: '🌙 00:00–05:00', night: true },
      ],
      coastal: [
        { route: 'Κέντρο → Σούνιο', taxi: '€95', van: 'Κατόπιν συνεννόησης', note: '+€25/hr' },
        { route: 'Κέντρο → Λαύριο', taxi: '€80', van: 'Κατόπιν συνεννόησης', note: '—' },
        { route: 'Κέντρο → Ραφήνα', taxi: '€50', van: 'Κατόπιν συνεννόησης', note: '—' },
        { route: 'Κέντρο → Βουλιαγμένη', taxi: '€35', van: 'Κατόπιν συνεννόησης', note: '—' },
        { route: 'Κέντρο → Βάρκιζα', taxi: '€40', van: 'Κατόπιν συνεννόησης', note: '—' },
        { route: 'Κέντρο → Γλυφάδα', taxi: '€25', van: 'Κατόπιν συνεννόησης', note: '—' },
        { route: 'Κέντρο → Τελεφερίκ Παρνήθας', taxi: '€45', van: 'Κατόπιν συνεννόησης', note: '—' },
      ],
      port: [
        { route: 'Κέντρο → Πειραιάς', taxi: '€30', van: 'Κατόπιν συνεννόησης', note: '—' },
        { route: 'Πειραιάς → Κέντρο', taxi: '€35', van: 'Κατόπιν συνεννόησης', note: '—' },
      ],
      local: [
        { route: 'Τοπικές διαδρομές Αθήνας', taxi: '€15', van: 'Κατόπιν συνεννόησης', note: '—' },
      ]
    }
  }
}

export default function Prices({ lang }) {
  const t = translations[lang]

  const allRows = [
    { cat: t.airport, rows: t.routes.airport },
    { cat: t.coastal, rows: t.routes.coastal },
    { cat: t.port, rows: t.routes.port },
    { cat: t.local, rows: t.routes.local },
  ]

  return (
    <section id="prices" style={{ padding: '88px 1.5rem', background: '#fff' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title} <em>{t.titleEm}</em></h2>
          <div className="blue-line"/>
        </div>

        <div className="reveal" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--blue-mist)', borderBottom: '2px solid var(--border)' }}>
                {[t.route, t.taxi, t.van, t.notes].map((h, i) => (
                  <th key={i} style={{
                    padding: '0.9rem 1.2rem', textAlign: 'left',
                    fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'var(--blue-deep)', fontWeight: 700, whiteSpace: 'nowrap'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRows.map(({ cat, rows }) => (
                <>
                  <tr key={cat}>
                    <td colSpan={4} style={{
                      background: 'var(--blue-mist)', color: 'var(--blue-mid)',
                      fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                      padding: '0.6rem 1.2rem', fontWeight: 600,
                      borderBottom: '1px solid var(--border)'
                    }}>{cat}</td>
                  </tr>
                  {rows.map((row, i) => (
                    <tr key={i} style={{
                      borderBottom: '1px solid var(--border)',
                      borderLeft: row.night ? '3px solid var(--blue-bright)' : 'none',
                      background: row.night ? 'var(--blue-mist)' : '#fff',
                      transition: 'background 0.2s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-mist)'}
                      onMouseLeave={e => e.currentTarget.style.background = row.night ? 'var(--blue-mist)' : '#fff'}
                    >
                      <td style={{ padding: '0.85rem 1.2rem', color: 'var(--text-dark)', fontWeight: 400 }}>{row.route}</td>
                      <td style={{ padding: '0.85rem 1.2rem', color: 'var(--blue-deep)', fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 600 }}>{row.taxi}</td>
                      <td style={{ padding: '0.85rem 1.2rem', color: row.van.includes('€') ? 'var(--blue-deep)' : 'var(--text-light)', fontFamily: row.van.includes('€') ? 'Playfair Display, serif' : 'inherit', fontSize: row.van.includes('€') ? '1.05rem' : '0.78rem', fontStyle: row.van.includes('€') ? 'normal' : 'italic', fontWeight: row.van.includes('€') ? 600 : 400 }}>{row.van}</td>
                      <td style={{ padding: '0.85rem 1.2rem', color: 'var(--text-light)', fontSize: '0.72rem' }}>{row.note}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>

          <div style={{
            fontSize: '0.72rem', color: 'var(--text-mid)',
            marginTop: '1.2rem', padding: '0.8rem 1rem',
            borderLeft: '3px solid var(--blue-bright)',
            background: 'var(--blue-mist)', borderRadius: '0 6px 6px 0', lineHeight: 1.7
          }}>{t.footnote}</div>
        </div>
      </div>
    </section>
  )
}