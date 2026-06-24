const translations = {
  en: {
    tag: 'Transparent Pricing', title: 'Our', titleEm: 'Rates',
    route: 'Route', taxi: 'Taxi (€)', van: 'Van (€)', notes: 'Notes',
    onRequest: 'On request', nightRate: '🌙 00:00 – 05:00',
    footnote: '🌙 Night rate applies between midnight and 05:00. All prices are fixed and include tolls. Payment accepted via POS or IRIS.',
    airport: '✈️ Airport', coastal: '🌊 Coastal & Day Trips',
    port: '🚢 Port', local: '🏙️ Local',
    routes: {
      airport: [
        { route: 'Centre → Airport', taxi: '€50', van: '€95', note: '—' },
        { route: 'Centre → Airport', taxi: '€65', van: '€115', note: '🌙 00:00 – 05:00', night: true },
        { route: 'Airport → Centre', taxi: '€50', van: '€95', note: '—' },
        { route: 'Airport → Centre', taxi: '€65', van: '€115', note: '🌙 00:00 – 05:00', night: true },
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
    onRequest: 'Κατόπιν συνεννόησης', nightRate: '🌙 00:00 – 05:00',
    footnote: '🌙 Νυχτερινή τaρίφα ισχύει μεταξύ μεσανύχτων και 05:00. Όλες οι τιμές είναι σταθερές και περιλαμβάνουν διόδια. Πληρωμή μέσω POS ή IRIS.',
    airport: '✈️ Αεροδρόμιο', coastal: '🌊 Παράκτιες & Ημερήσιες',
    port: '🚢 Λιμάνι', local: '🏙️ Τοπικές',
    routes: {
      airport: [
        { route: 'Κέντρο → Αεροδρόμιο', taxi: '€50', van: '€95', note: '—' },
        { route: 'Κέντρο → Αεροδρόμιο', taxi: '€65', van: '€115', note: '🌙 00:00 – 05:00', night: true },
        { route: 'Αεροδρόμιο → Κέντρο', taxi: '€50', van: '€95', note: '—' },
        { route: 'Αεροδρόμιο → Κέντρο', taxi: '€65', van: '€115', note: '🌙 00:00 – 05:00', night: true },
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

function CatHeader({ label }) {
  return (
    <tr>
      <td colSpan={4} style={{
        background: 'rgba(255,255,255,0.02)',
        color: 'var(--text-muted)', fontSize: '0.62rem',
        letterSpacing: '0.25em', textTransform: 'uppercase',
        padding: '0.6rem 1.2rem', fontWeight: 500,
        borderBottom: '1px solid var(--border)'
      }}>{label}</td>
    </tr>
  )
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
    <section id="prices" style={{ padding: '80px 1.5rem', background: 'var(--navy-mid)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title} <em>{t.titleEm}</em></h2>
          <div className="gold-line"/>
        </div>

        <div className="reveal" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(201,168,76,0.12)', borderBottom: '1px solid var(--border)' }}>
                {[t.route, t.taxi, t.van, t.notes].map((h, i) => (
                  <th key={i} style={{
                    padding: '0.9rem 1.2rem', textAlign: 'left',
                    fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--gold)', fontWeight: 600, whiteSpace: 'nowrap'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRows.map(({ cat, rows }) => (
                <>
                  <CatHeader key={cat} label={cat}/>
                  {rows.map((row, i) => (
                    <tr key={i} style={{
                      borderBottom: '1px solid rgba(201,168,76,0.08)',
                      borderLeft: row.night ? '2px solid var(--gold)' : 'none',
                      background: row.night ? 'rgba(201,168,76,0.04)' : 'transparent'
                    }}>
                      <td style={{ padding: '0.85rem 1.2rem', color: 'var(--cream)' }}>{row.route}</td>
                      <td style={{ padding: '0.85rem 1.2rem', color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem' }}>{row.taxi}</td>
                      <td style={{ padding: '0.85rem 1.2rem', color: row.van.includes('€') ? 'var(--gold)' : 'var(--text-muted)', fontFamily: row.van.includes('€') ? 'Cormorant Garamond, serif' : 'inherit', fontSize: row.van.includes('€') ? '1.05rem' : '0.75rem', fontStyle: row.van.includes('€') ? 'normal' : 'italic' }}>{row.van}</td>
                      <td style={{ padding: '0.85rem 1.2rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>{row.note}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>

          <p style={{
            fontSize: '0.72rem', color: 'var(--text-muted)',
            marginTop: '1.2rem', padding: '0.8rem 1rem',
            borderLeft: '2px solid var(--gold)',
            background: 'rgba(201,168,76,0.04)', lineHeight: 1.7
          }}>{t.footnote}</p>
        </div>
      </div>
    </section>
  )
}