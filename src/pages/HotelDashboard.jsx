import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrentUser, signOut } from '../lib/auth'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

function AutocompleteInput({ placeholder, value, onChange }) {
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const timer = useRef(null)

  const handleInput = (e) => {
    const val = e.target.value
    onChange(val)
    clearTimeout(timer.current)
    if (val.length < 3) { setResults([]); setOpen(false); return }
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?country=gr&language=en&limit=5&access_token=${MAPBOX_TOKEN}`)
        const data = await res.json()
        setResults(data.features || [])
        setOpen(true)
      } catch { setOpen(false) }
    }, 300)
  }

  return (
    <div style={{ position: 'relative' }}>
      <input type="text" value={value} placeholder={placeholder}
        onChange={handleInput}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(201,168,76,0.2)',
          color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.85rem', padding: '0.8rem 1rem', outline: 'none'
        }}
      />
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5000,
          background: 'var(--navy-mid)', border: '1px solid var(--border)',
          borderTop: 'none', maxHeight: '200px', overflowY: 'auto'
        }}>
          {results.map((f, i) => {
            const main = f.text
            const sub = f.place_name.replace(f.text + ', ', '')
            return (
              <div key={i} onMouseDown={() => { onChange(f.place_name); setOpen(false) }}
                style={{
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

export default function HotelDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(null)
  const [form, setForm] = useState({
    passenger_name: '', passenger_phone: '', passenger_email: '',
    pickup: '', dropoff: '', date: '', time: '',
    vehicle: '', notes: '', flight_number: ''
  })

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u)
      fetchBookings()
    })
  }, [])

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('source', 'hotel')
      .order('date', { ascending: true })
    setBookings(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)

    const { error } = await supabase.from('bookings').insert([{
      ...form, source: 'hotel', status: 'pending'
    }])

    if (error) {
      setMsg({ type: 'error', text: 'Error: ' + error.message })
    } else {
      setMsg({ type: 'success', text: '✅ Booking submitted successfully.' })
      setForm({ passenger_name: '', passenger_phone: '', passenger_email: '', pickup: '', dropoff: '', date: '', time: '', vehicle: '', notes: '', flight_number: '' })
      fetchBookings()
    }
    setSubmitting(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.2)',
    color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.85rem', padding: '0.8rem 1rem', outline: 'none'
  }
  const labelStyle = {
    display: 'block', fontSize: '0.62rem', letterSpacing: '0.2em',
    textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: '0.4rem'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>

      {/* Header */}
      <div style={{
        background: 'var(--navy-mid)', borderBottom: '1px solid var(--border)',
        padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.jpg" alt="MO" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid var(--gold)', objectFit: 'cover' }}/>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'var(--white)', fontWeight: 600 }}>Hotel Portal</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>MO Transfers4all Athens</div>
          </div>
        </div>
        <button onClick={handleSignOut} style={{
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--text-muted)', fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.7rem', letterSpacing: '0.1em', padding: '0.4rem 1rem',
          cursor: 'pointer', textTransform: 'uppercase'
        }}>Sign Out</button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Submit Booking */}
        <div style={{
          background: 'var(--navy-mid)', border: '1px solid var(--border)',
          borderTop: '2px solid var(--gold)', padding: '2rem', marginBottom: '2.5rem'
        }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem',
            fontWeight: 300, color: 'var(--white)', marginBottom: '1.5rem'
          }}>Submit New Booking</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1.2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>

              <div>
                <label style={labelStyle}>Passenger Name *</label>
                <input required style={inputStyle} value={form.passenger_name}
                  onChange={e => setForm({...form, passenger_name: e.target.value})} placeholder="John Smith"/>
              </div>

              <div>
                <label style={labelStyle}>Phone / WhatsApp *</label>
                <input required style={inputStyle} type="tel" value={form.passenger_phone}
                  onChange={e => setForm({...form, passenger_phone: e.target.value})} placeholder="+30 6xx xxx xxxx"/>
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" value={form.passenger_email}
                  onChange={e => setForm({...form, passenger_email: e.target.value})} placeholder="passenger@email.com"/>
              </div>

              <div>
                <label style={labelStyle}>Vehicle *</label>
                <select required style={{...inputStyle, appearance: 'none'}}
                  value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})}>
                  <option value="">— Select —</option>
                  <option value="Taxi (1-4 Επιβάτες)">Taxi — 1 to 4 Passengers</option>
                  <option value="Van (5-9 Επιβάτες)">Van — 5 to 9 Passengers</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Pickup Location *</label>
                <AutocompleteInput placeholder="Airport / Hotel / Address"
                  value={form.pickup} onChange={val => setForm({...form, pickup: val})}/>
              </div>

              <div>
                <label style={labelStyle}>Drop-off Location *</label>
                <AutocompleteInput placeholder="Destination"
                  value={form.dropoff} onChange={val => setForm({...form, dropoff: val})}/>
              </div>

              <div>
                <label style={labelStyle}>Date *</label>
                <input required style={inputStyle} type="date" value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}/>
              </div>

              <div>
                <label style={labelStyle}>Time *</label>
                <input required style={inputStyle} type="time" value={form.time}
                  onChange={e => setForm({...form, time: e.target.value})}/>
              </div>

              <div>
                <label style={labelStyle}>Flight / Ship Number</label>
                <input style={inputStyle} value={form.flight_number}
                  onChange={e => setForm({...form, flight_number: e.target.value})} placeholder="e.g. A3 601"/>
              </div>

              <div>
                <label style={labelStyle}>Notes</label>
                <input style={inputStyle} value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})} placeholder="Special requests..."/>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" disabled={submitting} style={{
                  width: '100%', background: 'var(--gold)', color: 'var(--navy)',
                  border: 'none', padding: '1rem',
                  fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem',
                  fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1
                }}>{submitting ? 'Submitting...' : 'Submit Booking'}</button>
              </div>

            </div>
          </form>

          {msg && (
            <div style={{
              marginTop: '1rem', padding: '0.75rem', fontSize: '0.8rem',
              color: msg.type === 'success' ? '#4ade80' : '#f87171',
              background: msg.type === 'success' ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
              border: `1px solid ${msg.type === 'success' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`
            }}>{msg.text}</div>
          )}
        </div>

        {/* Bookings Table */}
        <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', padding: '2rem' }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem',
            fontWeight: 300, color: 'var(--white)', marginBottom: '1.5rem'
          }}>Submitted Bookings</h2>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Loading...</div>
          ) : bookings.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No bookings submitted yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Date', 'Time', 'Passenger', 'Phone', 'Pickup', 'Drop-off', 'Vehicle', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '0.6rem 1rem', textAlign: 'left',
                        fontSize: '0.62rem', letterSpacing: '0.15em',
                        textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--cream)' }}>{b.date}</td>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--cream)' }}>{b.time}</td>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--cream)' }}>{b.passenger_name}</td>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--cream)' }}>{b.passenger_phone}</td>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)' }}>{b.pickup}</td>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)' }}>{b.dropoff}</td>
                      <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)' }}>{b.vehicle}</td>
                      <td style={{ padding: '0.7rem 1rem' }}>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
                          textTransform: 'uppercase', padding: '0.2rem 0.6rem',
                          background: b.status === 'pending' ? 'rgba(251,191,36,0.15)' : b.status === 'assigned' ? 'rgba(74,222,128,0.15)' : 'rgba(148,163,184,0.15)',
                          color: b.status === 'pending' ? '#fbbf24' : b.status === 'assigned' ? '#4ade80' : '#94a3b8'
                        }}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}