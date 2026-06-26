import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY

const translations = {
  en: {
    tag: 'Reservations', title: 'Book Your', titleEm: 'Journey',
    name: 'Full Name *', phone: 'Phone / WhatsApp *', email: 'Email *',
    pickup: 'Pickup Location *', dropoff: 'Drop-off Location *',
    date: 'Date *', time: 'Time *', vehicle: 'Vehicle Type *',
    notes: 'Flight Number / Notes', notesPlaceholder: 'Flight number, special requests...',
    taxi: 'Taxi — 1 to 4 Passengers', van: 'Van — 5 to 9 Passengers',
    select: '— Select —',
    privacy: '🔒 Your personal data is used exclusively for this booking and permanently deleted after your transfer.',
    submit: 'Send Booking Request', sending: 'Sending...',
    success: '✅ Your booking was sent successfully! We will contact you shortly.',
    error: '❌ An error occurred. Please contact us by phone.',
    pickupPlaceholder: 'Airport / Hotel / Address',
    dropoffPlaceholder: 'Destination'
  },
  gr: {
    tag: 'Κρατήσεις', title: 'Κλείστε', titleEm: 'Θέση',
    name: 'Ονοματεπώνυμο *', phone: 'Τηλέφωνο / WhatsApp *', email: 'Email *',
    pickup: 'Σημείο Παραλαβής *', dropoff: 'Σημείο Αποβίβασης *',
    date: 'Ημερομηνία *', time: 'Ώρα *', vehicle: 'Τύπος Οχήματος *',
    notes: 'Αριθμός Πτήσης / Σημειώσεις', notesPlaceholder: 'Αριθμός πτήσης, ειδικές απαιτήσεις...',
    taxi: 'Ταξί — 1 έως 4 Επιβάτες', van: 'Van — 5 έως 9 Επιβάτες',
    select: '— Επιλογή —',
    privacy: '🔒 Τα προσωπικά σας δεδομένα χρησιμοποιούνται αποκλειστικά για αυτή την κράτηση και διαγράφονται μετά τη μεταφορά.',
    submit: 'Αποστολή Αιτήματος', sending: 'Αποστολή...',
    success: '✅ Η κράτησή σας στάλθηκε! Θα επικοινωνήσουμε σύντομα.',
    error: '❌ Παρουσιάστηκε σφάλμα. Παρακαλώ επικοινωνήστε τηλεφωνικά.',
    pickupPlaceholder: 'Αεροδρόμιο / Ξενοδοχείο / Διεύθυνση',
    dropoffPlaceholder: 'Προορισμός'
  }
}

function AutocompleteInput({ placeholder, value, onChange, onSelect }) {
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timer = useRef(null)

  const handleInput = (e) => {
    const val = e.target.value
    onChange(val)
    clearTimeout(timer.current)
    if (val.length < 3) { setResults([]); setOpen(false); return }
    setLoading(true)
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(val)}&filter=countrycode:gr&bias=proximity:23.7275,37.9838&lang=en&limit=5&apiKey=${GEOAPIFY_KEY}`)
        const data = await res.json()
        setResults(data.features || [])
        setOpen(true)
      } catch { setOpen(false) }
      setLoading(false)
    }, 300)
  }

  const handleSelect = (feature) => {
    const formatted = feature.properties.formatted
    onChange(formatted)
    onSelect(formatted)
    setOpen(false)
    setResults([])
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text" value={value} placeholder={placeholder}
        onChange={handleInput}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)',
          color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.85rem', fontWeight: 300, padding: '0.8rem 1rem',
          outline: 'none', width: '100%'
        }}
      />
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5000,
          background: 'var(--navy-mid)', border: '1px solid var(--border)',
          borderTop: 'none', maxHeight: '220px', overflowY: 'auto'
        }}>
          {results.map((f, i) => {
            const p = f.properties
            const main = p.name || p.street || p.formatted.split(',')[0]
            const sub = p.formatted.replace(main + ', ', '')
            return (
              <div key={i} onMouseDown={() => handleSelect(f)} style={{
                padding: '0.7rem 1rem', cursor: 'pointer',
                borderBottom: '1px solid rgba(201,168,76,0.08)',
                fontSize: '0.78rem', color: 'var(--cream)'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontWeight: 500 }}>📍 {main}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{sub}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function BookingForm({ lang }) {
  const t = translations[lang]
  const [form, setForm] = useState({
    name: '', phone: '', email: '', pickup: '', dropoff: '',
    date: '', time: '', vehicle: '', notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)',
    color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.85rem', fontWeight: 300, padding: '0.8rem 1rem',
    outline: 'none', width: '100%'
  }
  const labelStyle = {
    fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
    color: 'var(--gold)', fontWeight: 500, display: 'block', marginBottom: '0.4rem'
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setMsg(null)

  try {
    const { error } = await supabase.from('bookings').insert([{
      source: 'website',
      passenger_name: form.name,
      passenger_phone: form.phone,
      passenger_email: form.email,
      pickup: form.pickup,
      dropoff: form.dropoff,
      date: form.date,
      time: form.time,
      vehicle: form.vehicle,
      notes: form.notes,
      status: 'pending'
    }])

    if (error) throw new Error('Booking error: ' + error.message)

    // CallMeBot — fire and forget, dont let it block success
    try {
      const message = `🚖 Νέα Κράτηση — MO Transfers4all\n\n👤 Όνομα: ${form.name}\n📞 Τηλέφωνο: ${form.phone}\n✉️ Email: ${form.email}\n🚗 Όχημα: ${form.vehicle}\n📍 Παραλαβή: ${form.pickup}\n🏁 Προορισμός: ${form.dropoff}\n📅 Ημερομηνία: ${form.date}\n⏰ Ώρα: ${form.time}\n📝 Σημειώσεις: ${form.notes || '—'}`
      const apiKey = import.meta.env.VITE_CALLMEBOT_KEY
      const phone = import.meta.env.VITE_FATHER_PHONE
      if (apiKey && apiKey !== 'PENDING') {
        await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apiKey}`)
      }
    } catch (waErr) {
      console.warn('WhatsApp notification failed:', waErr)
    }

    setMsg({ type: 'success', text: t.success })
    setForm({ name: '', phone: '', email: '', pickup: '', dropoff: '', date: '', time: '', vehicle: '', notes: '' })

  } catch (err) {
    console.error('Booking error:', err)
    setMsg({ type: 'error', text: err.message || t.error })
  }
  setLoading(false)
}

  return (
    <section id="booking" style={{ padding: '80px 1.5rem', background: 'var(--navy-mid)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title} <em>{t.titleEm}</em></h2>
          <div className="gold-line"/>
        </div>

        <div style={{
          maxWidth: '760px', margin: '0 auto',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)', padding: '2.5rem 2rem'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1.2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>

              <div>
                <label style={labelStyle}>{t.name}</label>
                <input required style={inputStyle} value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} placeholder="John Smith"/>
              </div>

              <div>
                <label style={labelStyle}>{t.phone}</label>
                <input required style={inputStyle} type="tel" value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})} placeholder="+30 6xx xxx xxxx"/>
              </div>

              <div>
                <label style={labelStyle}>{t.email}</label>
                <input required style={inputStyle} type="email" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com"/>
              </div>

              <div>
                <label style={labelStyle}>{t.vehicle}</label>
                <select required style={{...inputStyle, appearance: 'none'}}
                  value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})}>
                  <option value="">{t.select}</option>
                  <option value="Taxi (1-4 Επιβάτες)">{t.taxi}</option>
                  <option value="Van (5-9 Επιβάτες)">{t.van}</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>{t.pickup}</label>
                <AutocompleteInput
                  placeholder={t.pickupPlaceholder}
                  value={form.pickup}
                  onChange={val => setForm({...form, pickup: val})}
                  onSelect={val => setForm({...form, pickup: val})}
                />
              </div>

              <div>
                <label style={labelStyle}>{t.dropoff}</label>
                <AutocompleteInput
                  placeholder={t.dropoffPlaceholder}
                  value={form.dropoff}
                  onChange={val => setForm({...form, dropoff: val})}
                  onSelect={val => setForm({...form, dropoff: val})}
                />
              </div>

              <div>
                <label style={labelStyle}>{t.date}</label>
                <input required style={inputStyle} type="date" value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}/>
              </div>

              <div>
                <label style={labelStyle}>{t.time}</label>
                <input required style={inputStyle} type="time" value={form.time}
                  onChange={e => setForm({...form, time: e.target.value})}/>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>{t.notes}</label>
                <textarea style={{...inputStyle, resize: 'vertical', minHeight: '80px'}}
                  value={form.notes} placeholder={t.notesPlaceholder}
                  onChange={e => setForm({...form, notes: e.target.value})}/>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{
                  fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5,
                  padding: '0.8rem 1rem', background: 'rgba(201,168,76,0.05)',
                  borderLeft: '2px solid var(--gold)'
                }}>{t.privacy} <a href="/privacy" style={{ color: 'var(--gold)' }}>Privacy Policy</a></div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" disabled={loading} style={{
                  width: '100%', background: 'var(--gold)', color: 'var(--navy)',
                  border: 'none', padding: '1rem',
                  fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem',
                  fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1
                }}>{loading ? t.sending : t.submit}</button>
              </div>

            </div>
          </form>

          {msg && (
            <div style={{
              marginTop: '1rem', padding: '0.75rem', textAlign: 'center',
              fontSize: '0.8rem',
              color: msg.type === 'success' ? '#4ade80' : '#f87171',
              background: msg.type === 'success' ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
              border: `1px solid ${msg.type === 'success' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`
            }}>{msg.text}</div>
          )}
        </div>
      </div>
    </section>
  )
}