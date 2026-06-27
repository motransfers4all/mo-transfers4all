import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useGoogleAutocomplete } from '../lib/useGooglePlaces'
const translations = {
  en: {
    tag: 'Reservations', title: 'Book Your', titleEm: 'Transfer',
    asideTitle: 'Simple, transparent booking.',
    asideSub: 'Enter your route below and we\'ll confirm your transfer promptly. Fixed prices, no hidden fees, no surprises.',
    perks: [
      { icon: '✈️', label: 'Flight Monitoring', desc: 'We track your flight and adapt to any delays automatically.' },
      { icon: '💳', label: 'Flexible Payment', desc: 'Pay by card, IRIS or cash directly to the driver.' },
      { icon: '🔒', label: 'Data Privacy', desc: 'Your data is used only for this booking and deleted after your transfer.' },
    ],
    name: 'Full Name *', phone: 'Phone / WhatsApp *', email: 'Email *',
    pickup: 'Pickup Location *', dropoff: 'Drop-off Location *',
    date: 'Date *', time: 'Time *', vehicle: 'Vehicle *',
    notes: 'Flight Number / Notes',
    taxi: 'Taxi — 1 to 4 Passengers', van: 'Van — 5 to 9 Passengers',
    select: '— Select vehicle —',
    privacy: '🔒 Your personal data is used exclusively for this booking and permanently deleted after your transfer.',
    submit: 'Send Booking Request', sending: 'Sending...',
    success: '✅ Booking sent! We will contact you shortly.',
    error: '❌ An error occurred. Please call us directly.',
    pickupPh: 'Airport / Hotel / Address',
    dropoffPh: 'Your destination',
  },
  gr: {
    tag: 'Κρατήσεις', title: 'Κλείστε', titleEm: 'Θέση',
    asideTitle: 'Απλή, διαφανής κράτηση.',
    asideSub: 'Συμπληρώστε τη διαδρομή σας και θα επιβεβαιώσουμε τη μεταφορά σας άμεσα. Σταθερές τιμές, χωρίς κρυφές χρεώσεις.',
    perks: [
      { icon: '✈️', label: 'Παρακολούθηση Πτήσης', desc: 'Παρακολουθούμε την πτήση σας και προσαρμοζόμαστε αυτόματα σε καθυστερήσεις.' },
      { icon: '💳', label: 'Ευέλικτη Πληρωμή', desc: 'Πληρωμή με κάρτα, IRIS ή μετρητά απευθείας στον οδηγό.' },
      { icon: '🔒', label: 'Απόρρητο Δεδομένων', desc: 'Τα δεδομένα σας χρησιμοποιούνται μόνο για αυτή την κράτηση και διαγράφονται μετά.' },
    ],
    name: 'Ονοματεπώνυμο *', phone: 'Τηλέφωνο / WhatsApp *', email: 'Email *',
    pickup: 'Σημείο Παραλαβής *', dropoff: 'Προορισμός *',
    date: 'Ημερομηνία *', time: 'Ώρα *', vehicle: 'Όχημα *',
    notes: 'Αριθμός Πτήσης / Σημειώσεις',
    taxi: 'Ταξί — 1 έως 4 Επιβάτες', van: 'Van — 5 έως 9 Επιβάτες',
    select: '— Επιλογή οχήματος —',
    privacy: '🔒 Τα προσωπικά σας δεδομένα χρησιμοποιούνται αποκλειστικά για αυτή την κράτηση και διαγράφονται μετά τη μεταφορά.',
    submit: 'Αποστολή Αιτήματος', sending: 'Αποστολή...',
    success: '✅ Η κράτηση στάλθηκε! Θα επικοινωνήσουμε σύντομα.',
    error: '❌ Παρουσιάστηκε σφάλμα. Παρακαλώ καλέστε μας.',
    pickupPh: 'Αεροδρόμιο / Ξενοδοχείο / Διεύθυνση',
    dropoffPh: 'Ο προορισμός σας',
  }
}

function AutocompleteInput({ placeholder, value, onChange }) {
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const timer = useRef(null)
  const { getPredictions } = useGoogleAutocomplete()

  const handleInput = (e) => {
    const val = e.target.value
    onChange(val)
    clearTimeout(timer.current)
    if (val.length < 2) { setResults([]); setOpen(false); return }
    timer.current = setTimeout(() => {
      getPredictions(val, (predictions) => {
        setResults(predictions)
        setOpen(predictions.length > 0)
      })
    }, 300)
  }

  const inputStyle = {
    width: '100%', padding: '0.72rem 1rem',
    border: `1px solid ${focused ? 'var(--blue-bright)' : 'var(--border)'}`,
    borderRadius: '6px', fontFamily: 'Inter, sans-serif',
    fontSize: '0.84rem', color: 'var(--text-dark)', background: '#fff',
    outline: 'none', boxShadow: focused ? '0 0 0 3px rgba(41,128,185,0.1)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text" value={value} placeholder={placeholder}
        onChange={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); setTimeout(() => setOpen(false), 200) }}
        style={inputStyle}
      />
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5000,
          background: '#fff', border: '1px solid var(--border)', borderTop: 'none',
          borderRadius: '0 0 6px 6px', maxHeight: '220px', overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(15,52,96,0.1)'
        }}>
          {results.map((f, i) => {
            const main = f.structured_formatting.main_text
            const sub = f.structured_formatting.secondary_text
            return (
              <div key={i} onMouseDown={() => { onChange(f.description); setOpen(false) }}
                style={{ padding: '0.7rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: '0.78rem' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-mist)'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ fontWeight: 500, color: 'var(--text-dark)' }}>📍 {main}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-light)' }}>{sub}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function BookingForm({ lang, prefillPickup, prefillDropoff }) {
  const t = translations[lang]
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    pickup: prefillPickup || '', dropoff: prefillDropoff || '',
    date: '', time: '', vehicle: '', notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [focused, setFocused] = useState({})

  const inputStyle = (field) => ({
    width: '100%', padding: '0.72rem 1rem',
    border: `1px solid ${focused[field] ? 'var(--blue-bright)' : 'var(--border)'}`,
    borderRadius: '6px', fontFamily: 'Inter, sans-serif',
    fontSize: '0.84rem', color: 'var(--text-dark)', background: '#fff',
    outline: 'none', boxShadow: focused[field] ? '0 0 0 3px rgba(41,128,185,0.1)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s', WebkitAppearance: 'none'
  })

  const labelStyle = {
    fontSize: '0.7rem', color: 'var(--blue-deep)',
    fontWeight: 600, letterSpacing: '0.04em', display: 'block', marginBottom: '0.38rem'
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
      setMsg({ type: 'error', text: err.message || t.error })
    }
    setLoading(false)
  }

  return (
    <section id="booking" style={{ padding: '88px 1.5rem', background: 'var(--off-white)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">{t.tag}</span>
          <h2 className="section-title">{t.title} <em>{t.titleEm}</em></h2>
          <div className="blue-line"/>
        </div>

        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '3rem', alignItems: 'start' }}>

          {/* Aside */}
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.55rem', fontWeight: 600, color: 'var(--blue-deep)', lineHeight: 1.25, marginBottom: '1rem' }}>{t.asideTitle}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.8, marginBottom: '1.8rem' }}>{t.asideSub}</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {t.perks.map((p, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.55 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--blue-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>{p.icon}</div>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--blue-deep)', display: 'block', fontSize: '0.78rem', marginBottom: '0.1rem' }}>{p.label}</span>
                    {p.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form card */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '10px', padding: '2.4rem 2rem' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>

                <div>
                  <label style={labelStyle}>{t.name}</label>
                  <input required style={inputStyle('name')} value={form.name} placeholder="John Smith"
                    onChange={e => setForm({...form, name: e.target.value})}
                    onFocus={() => setFocused({...focused, name: true})}
                    onBlur={() => setFocused({...focused, name: false})}/>
                </div>

                <div>
                  <label style={labelStyle}>{t.phone}</label>
                  <input required style={inputStyle('phone')} type="tel" value={form.phone} placeholder="+30 6xx xxx xxxx"
                    onChange={e => setForm({...form, phone: e.target.value})}
                    onFocus={() => setFocused({...focused, phone: true})}
                    onBlur={() => setFocused({...focused, phone: false})}/>
                </div>

                <div>
                  <label style={labelStyle}>{t.email}</label>
                  <input required style={inputStyle('email')} type="email" value={form.email} placeholder="your@email.com"
                    onChange={e => setForm({...form, email: e.target.value})}
                    onFocus={() => setFocused({...focused, email: true})}
                    onBlur={() => setFocused({...focused, email: false})}/>
                </div>

                <div>
                  <label style={labelStyle}>{t.vehicle}</label>
                  <select required style={inputStyle('vehicle')} value={form.vehicle}
                    onChange={e => setForm({...form, vehicle: e.target.value})}
                    onFocus={() => setFocused({...focused, vehicle: true})}
                    onBlur={() => setFocused({...focused, vehicle: false})}>
                    <option value="">{t.select}</option>
                    <option value="Taxi (1-4 Επιβάτες)">{t.taxi}</option>
                    <option value="Van (5-9 Επιβάτες)">{t.van}</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>{t.pickup}</label>
                  <AutocompleteInput placeholder={t.pickupPh} value={form.pickup} onChange={val => setForm({...form, pickup: val})}/>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>{t.dropoff}</label>
                  <AutocompleteInput placeholder={t.dropoffPh} value={form.dropoff} onChange={val => setForm({...form, dropoff: val})}/>
                </div>

                <div>
                  <label style={labelStyle}>{t.date}</label>
                  <input required style={inputStyle('date')} type="date" value={form.date}
                    onChange={e => setForm({...form, date: e.target.value})}
                    onFocus={() => setFocused({...focused, date: true})}
                    onBlur={() => setFocused({...focused, date: false})}/>
                </div>

                <div>
                  <label style={labelStyle}>{t.time}</label>
                  <input required style={inputStyle('time')} type="time" value={form.time}
                    onChange={e => setForm({...form, time: e.target.value})}
                    onFocus={() => setFocused({...focused, time: true})}
                    onBlur={() => setFocused({...focused, time: false})}/>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>{t.notes}</label>
                  <input style={inputStyle('notes')} value={form.notes} placeholder="e.g. A3 601, large luggage..."
                    onChange={e => setForm({...form, notes: e.target.value})}
                    onFocus={() => setFocused({...focused, notes: true})}
                    onBlur={() => setFocused({...focused, notes: false})}/>
                </div>

              </div>

              <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', lineHeight: 1.6, borderLeft: '2px solid var(--blue-bright)', padding: '0.75rem 1rem', background: 'var(--blue-mist)', borderRadius: '0 6px 6px 0', marginBottom: '1.2rem' }}>
                {t.privacy} <a href="/privacy" style={{ color: 'var(--blue-bright)' }}>Privacy Policy</a>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', background: 'var(--blue-deep)', color: '#fff',
                border: 'none', padding: '1rem', borderRadius: '6px',
                fontFamily: 'Inter, sans-serif', fontSize: '0.78rem',
                fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
                boxShadow: '0 4px 18px rgba(15,52,96,0.24)', transition: 'all 0.2s'
              }}>{loading ? t.sending : t.submit}</button>

              {msg && (
                <div style={{
                  marginTop: '1rem', padding: '0.75rem', textAlign: 'center',
                  fontSize: '0.8rem', borderRadius: '6px',
                  color: msg.type === 'success' ? '#16a34a' : '#dc2626',
                  background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>{msg.text}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}