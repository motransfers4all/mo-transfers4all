const translations = {
  en: {
    tag: 'Where We Go',
    title: 'Popular',
    titleEm: 'Destinations',
    sub: 'From Athens airport to the most breathtaking corners of Greece — we take you there safely and comfortably.',
    from: 'from',
    book: 'Book →',
    anywhere: 'Don\'t see your destination? We go anywhere in Greece — use the booking form below.',
    destinations: [
      {
        id: 'airport',
        name: 'Athens Airport',
        desc: 'Fast, reliable transfers to and from Athens International Airport. We monitor your flight and wait if you\'re delayed.',
        price: '€50',
        wide: true,
        photo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80',
        pickup: 'Athens International Airport',
        dropoff: 'Athens City Centre'
      },
      {
        id: 'meteora',
        name: 'Meteora',
        desc: 'Ancient monasteries perched on towering rocks — one of Greece\'s most extraordinary sights.',
        price: '€425',
        photo: 'https://images.unsplash.com/photo-1601985705806-5b9a2d30ce18?w=800&q=80',
        pickup: 'Athens International Airport',
        dropoff: 'Meteora, Kalabaka'
      },
      {
        id: 'sounio',
        name: 'Cape Sounio',
        desc: 'Temple of Poseidon at sunset. A 45-minute drive from Athens along the Attic Riviera.',
        price: '€61',
        photo: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
        pickup: 'Athens Centre',
        dropoff: 'Sounio, Greece'
      },
      {
        id: 'kalamata',
        name: 'Kalamata',
        desc: 'Peloponnese coast, olive groves and crystal clear waters. A scenic 3.5-hour drive from Athens.',
        price: '€318',
        photo: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800&q=80',
        pickup: 'Athens International Airport',
        dropoff: 'Kalamata, Greece'
      },
      {
        id: 'patra',
        name: 'Patra',
        desc: 'Gateway to the Ionian islands. Greece\'s third largest city with a famous carnival and stunning bridge.',
        price: '€285',
        photo: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
        pickup: 'Athens International Airport',
        dropoff: 'Patra, Greece'
      },
      {
        id: 'piraeus',
        name: 'Piraeus Port',
        desc: 'Catch your ferry or cruise ship. We\'ll get you there with time to spare.',
        price: '€66',
        photo: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=800&q=80',
        pickup: 'Athens International Airport',
        dropoff: 'Piraeus Port, Athens'
      },
    ]
  },
  gr: {
    tag: 'Προορισμοί',
    title: 'Δημοφιλείς',
    titleEm: 'Προορισμοί',
    sub: 'Από το αεροδρόμιο της Αθήνας μέχρι τις πιο εντυπωσιακές γωνιές της Ελλάδας — σας πάμε εκεί με ασφάλεια και άνεση.',
    from: 'από',
    book: 'Κράτηση →',
    anywhere: 'Δεν βλέπετε τον προορισμό σας; Πηγαίνουμε παντού στην Ελλάδα — χρησιμοποιήστε τη φόρμα κράτησης.',
    destinations: [
      {
        id: 'airport',
        name: 'Αεροδρόμιο Αθήνας',
        desc: 'Γρήγορες, αξιόπιστες μεταφορές από και προς το ΔΑΑ. Παρακολουθούμε την πτήση σας και περιμένουμε αν καθυστερήσετε.',
        price: '€50',
        wide: true,
        photo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80',
        pickup: 'Athens International Airport',
        dropoff: 'Athens City Centre'
      },
      {
        id: 'meteora',
        name: 'Μετέωρα',
        desc: 'Αρχαία μοναστήρια σε επιβλητικούς βράχους — ένα από τα πιο εκπληκτικά θεάματα της Ελλάδας.',
        price: '€425',
        photo: 'https://images.unsplash.com/photo-1601985705806-5b9a2d30ce18?w=800&q=80',
        pickup: 'Athens International Airport',
        dropoff: 'Meteora, Kalabaka'
      },
      {
        id: 'sounio',
        name: 'Ακρωτήριο Σούνιο',
        desc: 'Ναός Ποσειδώνα στο ηλιοβασίλεμα. 45 λεπτά από την Αθήνα κατά μήκος της Αττικής Ριβιέρας.',
        price: '€61',
        photo: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
        pickup: 'Athens Centre',
        dropoff: 'Sounio, Greece'
      },
      {
        id: 'kalamata',
        name: 'Καλαμάτα',
        desc: 'Παράκτια Πελοπόννησος, ελαιώνες και κρυστάλλινα νερά. Γραφική διαδρομή 3,5 ωρών από Αθήνα.',
        price: '€318',
        photo: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800&q=80',
        pickup: 'Athens International Airport',
        dropoff: 'Kalamata, Greece'
      },
      {
        id: 'patra',
        name: 'Πάτρα',
        desc: 'Πύλη για τα Ιόνια νησιά. Τρίτη μεγαλύτερη πόλη της Ελλάδας με φημισμένο καρναβάλι.',
        price: '€285',
        photo: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
        pickup: 'Athens International Airport',
        dropoff: 'Patra, Greece'
      },
      {
        id: 'piraeus',
        name: 'Λιμάνι Πειραιά',
        desc: 'Προλάβετε το ferry ή το κρουαζιερόπλοιό σας. Σας φτάνουμε εκεί με άνεση χρόνου.',
        price: '€66',
        photo: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=800&q=80',
        pickup: 'Athens International Airport',
        dropoff: 'Piraeus Port, Athens'
      },
    ]
  }
}

export default function Destinations({ lang, onSelect }) {
  const t = translations[lang]

  const wide = t.destinations.find(d => d.wide)
  const rest = t.destinations.filter(d => !d.wide)

  const Card = ({ dest, isWide }) => (
    <div
      onClick={() => { onSelect(dest.pickup, dest.dropoff); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) }}
      style={{
        position: 'relative', borderRadius: '10px', overflow: 'hidden',
        cursor: 'pointer', gridColumn: isWide ? 'span 2' : 'span 1',
        aspectRatio: isWide ? 'unset' : '3/4',
        minHeight: isWide ? '280px' : 'unset'
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('${dest.photo}')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transition: 'transform 0.6s ease'
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,37,64,0.82) 0%, rgba(10,37,64,0.2) 55%, transparent 100%)'
      }}/>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.4rem' }}>
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: isWide ? '1.55rem' : '1.2rem',
          fontWeight: 600, color: '#fff', lineHeight: 1.2, marginBottom: '0.3rem'
        }}>{dest.name}</div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: '0.8rem' }}>{dest.desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#7ab3d9', fontWeight: 600,
            background: 'rgba(10,37,64,0.65)', padding: '0.28rem 0.7rem',
            borderRadius: '20px', backdropFilter: 'blur(4px)'
          }}>{t.from} {dest.price}</span>
          <span style={{
            fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#fff', opacity: 0.85
          }}>{t.book}</span>
        </div>
      </div>
    </div>
  )

  return (
    <section id="destinations" style={{ padding: '88px 1.5rem', background: 'var(--blue-deep)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag" style={{ color: '#7ab3d9' }}>{t.tag}</span>
          <h2 className="section-title" style={{ color: '#fff' }}>
            {t.title} <em style={{ color: '#7ab3d9' }}>{t.titleEm}</em>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.75rem' }}>{t.sub}</p>
          <div className="blue-line" style={{ background: 'linear-gradient(90deg,#7ab3d9,rgba(122,179,217,0.2))' }}/>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .dest-grid { grid-template-columns: 1fr !important; }
            .dest-grid > div[style*="span 2"] { grid-column: span 1 !important; aspect-ratio: 16/9 !important; min-height: unset !important; }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .dest-grid { grid-template-columns: repeat(2,1fr) !important; }
          }
        `}</style>

        <div className="reveal dest-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.2rem' }}>
          <Card dest={wide} isWide={true}/>
          {rest.map(d => <Card key={d.id} dest={d} isWide={false}/>)}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
          {t.anywhere}
        </p>
      </div>
    </section>
  )
}