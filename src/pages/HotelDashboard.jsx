import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrentUser, signOut } from '../lib/auth'
import { useGoogleAutocomplete } from '../lib/useGooglePlaces'

function AutocompleteInput({ placeholder, value, onChange }) {
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
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

  const navy = '#050c16'
  const navyMid = '#0a1729'
  const gold = '#c9a84c'
  const border = 'rgba(201,168,76,0.2)'
  const cream = '#f0e6d0'

  return (
    <div style={{ position: 'relative' }}>
      <input type="text" value={value} placeholder={placeholder}
        onChange={handleInput}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${border}`,
          borderRadius: '2px',
          color: cream, fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem', padding: '0.8rem 1rem', outline: 'none',
          boxSizing: 'border-box', transition: 'border-color 0.2s'
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.55)'}
        onBlurCapture={e => e.target.style.borderColor = border}
      />
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5000,
          background: navyMid, border: `1px solid ${border}`,
          borderTop: 'none', maxHeight: '200px', overflowY: 'auto',
          borderRadius: '0 0 2px 2px', boxShadow: '0 12px 32px rgba(0,0,0,0.4)'
        }}>
          {results.map((f, i) => {
            const main = f.structured_formatting.main_text
            const sub = f.structured_formatting.secondary_text
            return (
              <div key={i} onMouseDown={() => { onChange(f.description); setOpen(false) }}
                style={{
                  padding: '0.7rem 1rem', cursor: 'pointer',
                  borderBottom: `1px solid rgba(201,168,76,0.08)`,
                  fontSize: '0.78rem', color: cream, transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>📍</span> {main}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{sub}</div>
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
      setMsg({ type: 'success', text: 'Booking submitted successfully.' })
      setForm({ passenger_name: '', passenger_phone: '', passenger_email: '', pickup: '', dropoff: '', date: '', time: '', vehicle: '', notes: '', flight_number: '' })
      fetchBookings()
    }
    setSubmitting(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // Design tokens (matching admin)
  const navy = '#050c16'
  const navyMid = '#0a1729'
  const navyCard = '#0d1f38'
  const gold = '#c9a84c'
  const border = 'rgba(201,168,76,0.12)'
  const borderInput = 'rgba(201,168,76,0.22)'
  const textMuted = 'rgba(255,255,255,0.38)'
  const textLight = 'rgba(255,255,255,0.65)'
  const cream = '#f0e6d0'

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${borderInput}`,
    borderRadius: '2px',
    color: cream, fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem', padding: '0.8rem 1rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s'
  }

  const labelStyle = {
    display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em',
    textTransform: 'uppercase', color: gold,
    fontWeight: 700, marginBottom: '0.45rem'
  }

  const STATUS_COLORS = {
    pending:   { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24' },
    assigned:  { bg: 'rgba(74,222,128,0.15)',  color: '#4ade80' },
    completed: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' },
  }

  return (
    <div style={{ minHeight: '100vh', background: navy, fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.5) sepia(1) saturate(3) hue-rotate(10deg); cursor: pointer; }
        select option { background: #0a1729; }
        .hotel-input:focus { border-color: rgba(201,168,76,0.55) !important; }
        .hotel-tr:hover td { background: rgba(255,255,255,0.025) !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: navyMid,
        borderBottom: `1px solid ${border}`,
        padding: '0 1.5rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ padding: '2px', borderRadius: '50%', background: `linear-gradient(135deg, ${gold}, #2980b9)` }}>
            <img src="/logo.jpg" alt="MO" style={{
              width: '38px', height: '38px', borderRadius: '50%',
              border: `2px solid ${navy}`, objectFit: 'cover', display: 'block'
            }}/>
          </div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.05rem', color: '#ffffff', fontWeight: 600 }}>Hotel Portal</div>
            <div style={{ fontSize: '0.6rem', color: textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>MO Transfers4all · Athens</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <a href="/" style={{
            fontSize: '0.68rem', color: textMuted, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.42rem 0.85rem', border: `1px solid ${border}`,
            borderRadius: '2px', transition: 'color 0.2s'
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Website
          </a>
          <button onClick={handleSignOut} style={{
            background: 'transparent', border: `1px solid ${border}`, borderRadius: '2px',
            color: textMuted, fontFamily: 'Inter, sans-serif',
            fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
            padding: '0.42rem 1rem', cursor: 'pointer', textTransform: 'uppercase',
            transition: 'border-color 0.2s, color 0.2s'
          }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Submit Booking Card */}
        <div style={{
          background: navyCard, border: `1px solid ${border}`,
          borderTop: `2px solid ${gold}`, borderRadius: '3px',
          padding: '2.25rem 2rem', marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
        }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.6rem', color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>New Transfer</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '1.65rem', fontWeight: 300, color: '#ffffff', lineHeight: 1.2
            }}>Submit a Booking</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>

              <div>
                <label style={labelStyle}>Passenger Name *</label>
                <input required className="hotel-input" style={inputStyle} value={form.passenger_name}
                  onChange={e => setForm({...form, passenger_name: e.target.value})} placeholder="John Smith"/>
              </div>

              <div>
                <label style={labelStyle}>Phone / WhatsApp *</label>
                <input required className="hotel-input" style={inputStyle} type="tel" value={form.passenger_phone}
                  onChange={e => setForm({...form, passenger_phone: e.target.value})} placeholder="+30 6xx xxx xxxx"/>
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input className="hotel-input" style={inputStyle} type="email" value={form.passenger_email}
                  onChange={e => setForm({...form, passenger_email: e.target.value})} placeholder="passenger@email.com"/>
              </div>

              <div>
                <label style={labelStyle}>Vehicle *</label>
                <select required className="hotel-input"
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                  value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})}>
                  <option value="">— Select vehicle —</option>
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
                <input required className="hotel-input" style={inputStyle} type="date" value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}/>
              </div>

              <div>
                <label style={labelStyle}>Time *</label>
                <input required className="hotel-input" style={inputStyle} type="time" value={form.time}
                  onChange={e => setForm({...form, time: e.target.value})}/>
              </div>

              <div>
                <label style={labelStyle}>Flight / Ship Number</label>
                <input className="hotel-input" style={inputStyle} value={form.flight_number}
                  onChange={e => setForm({...form, flight_number: e.target.value})} placeholder="e.g. A3 601"/>
              </div>

              <div>
                <label style={labelStyle}>Notes</label>
                <input className="hotel-input" style={inputStyle} value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})} placeholder="Special requests..."/>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                {msg && (
                  <div style={{
                    marginBottom: '1rem', padding: '0.85rem 1rem',
                    background: msg.type === 'success' ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
                    border: `1px solid ${msg.type === 'success' ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
                    borderRadius: '2px',
                    color: msg.type === 'success' ? '#4ade80' : '#f87171',
                    fontSize: '0.8rem', lineHeight: 1.5,
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}>
                    {msg.type === 'success' ? '✓' : '⚠'} {msg.text}
                  </div>
                )}
                <button type="submit" disabled={submitting} style={{
                  width: '100%',
                  background: submitting ? 'rgba(201,168,76,0.45)' : `linear-gradient(135deg, ${gold}, #b8932e)`,
                  color: navy, border: 'none', borderRadius: '2px',
                  padding: '1rem',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
                  fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: submitting ? 'none' : '0 4px 20px rgba(201,168,76,0.3)',
                  transition: 'opacity 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}>
                  {submitting ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Submit Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Bookings Table */}
        <div style={{
          background: navyCard, border: `1px solid ${border}`,
          borderTop: `2px solid rgba(96,165,250,0.4)`, borderRadius: '3px',
          overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <div style={{ padding: '1.75rem 2rem', borderBottom: `1px solid ${border}` }}>
            <div style={{ fontSize: '0.6rem', color: '#60a5fa', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>History</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '1.5rem', fontWeight: 300, color: '#ffffff'
            }}>Submitted Bookings</h2>
          </div>

          {loading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: textMuted, fontSize: '0.82rem' }}>Loading...</div>
          ) : bookings.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem', opacity: 0.3 }}>📋</div>
              <div style={{ color: textMuted, fontSize: '0.82rem' }}>No bookings submitted yet.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: `1px solid ${border}` }}>
                    {['Date', 'Time', 'Passenger', 'Phone', 'Pickup', 'Drop-off', 'Vehicle', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '0.72rem 1rem', textAlign: 'left',
                        fontSize: '0.58rem', letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: gold, fontWeight: 700
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} className="hotel-tr" style={{ borderBottom: `1px solid ${border}` }}>
                      <td style={{ padding: '0.78rem 1rem', color: cream, fontWeight: 500, whiteSpace: 'nowrap' }}>{b.date}</td>
                      <td style={{ padding: '0.78rem 1rem', color: gold, fontWeight: 600 }}>{b.time}</td>
                      <td style={{ padding: '0.78rem 1rem', color: cream, fontWeight: 500 }}>{b.passenger_name}</td>
                      <td style={{ padding: '0.78rem 1rem', color: textLight }}>{b.passenger_phone}</td>
                      <td style={{ padding: '0.78rem 1rem', color: textMuted, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.pickup}</td>
                      <td style={{ padding: '0.78rem 1rem', color: textMuted, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.dropoff}</td>
                      <td style={{ padding: '0.78rem 1rem', color: textMuted, whiteSpace: 'nowrap' }}>{b.vehicle}</td>
                      <td style={{ padding: '0.78rem 1rem' }}>
                        <span style={{
                          fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em',
                          textTransform: 'uppercase', padding: '0.22rem 0.6rem',
                          background: STATUS_COLORS[b.status]?.bg || 'rgba(255,255,255,0.08)',
                          color: STATUS_COLORS[b.status]?.color || textMuted,
                          borderRadius: '2px',
                          border: `1px solid ${STATUS_COLORS[b.status]?.color ? STATUS_COLORS[b.status].color + '30' : 'transparent'}`
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

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
