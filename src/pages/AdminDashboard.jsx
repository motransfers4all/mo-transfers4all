import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrentUser, signOut } from '../lib/auth'

const DRIVERS = [
  { value: 'marjus', label: 'Marjus', phone: '+30 693 647 5451' },
  { value: 'martin', label: 'Martin', phone: '+30 699 360 5070' },
  { value: 'roland', label: 'Roland', phone: '+30 697 963 8475' },
]

const STATUS_COLORS = {
  pending:   { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', dot: '#fbbf24' },
  assigned:  { bg: 'rgba(74,222,128,0.15)',  color: '#4ade80', dot: '#4ade80' },
  completed: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', dot: '#94a3b8' },
}

const SOURCE_COLORS = {
  website: { bg: 'rgba(201,168,76,0.15)',  color: '#c9a84c' },
  hotel:   { bg: 'rgba(96,165,250,0.15)',  color: '#60a5fa' },
}

const playNotification = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch(e) {}
}

const showBrowserNotification = (booking) => {
  if (!('Notification' in window)) return
  const send = () => new Notification('🚖 Νέα Κράτηση!', {
    body: `${booking.passenger_name} · ${booking.pickup} → ${booking.dropoff}`,
    icon: '/logo.jpg'
  })
  if (Notification.permission === 'granted') send()
  else if (Notification.permission !== 'denied') Notification.requestPermission().then(p => { if (p === 'granted') send() })
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [view, setView] = useState('list')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDriver, setFilterDriver] = useState('all')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const [lang, setLang] = useState(localStorage.getItem('mo-lang') || 'en')

  const t = {
    en: {
      title: 'Admin Dashboard', total: 'Total', pending: 'Pending',
      assigned: 'Assigned', completed: 'Completed', list: 'List',
      calendar: 'Calendar', allStatus: 'All Status', allDrivers: 'All Drivers',
      refresh: 'Refresh', noBookings: 'No bookings found.',
      source: 'Source', date: 'Date', time: 'Time', passenger: 'Passenger',
      phone: 'Phone', pickup: 'Pickup', dropoff: 'Drop-off', vehicle: 'Vehicle',
      driver: 'Driver', status: 'Status', actions: 'Actions', view: 'View',
      unassigned: 'Unassigned', signOut: 'Sign Out', enableAlerts: 'Alerts',
      details: 'Booking Details', assignDriver: 'Assign Driver',
      email: 'Email', flight: 'Flight/Ship', notes: 'Notes',
      share: 'Share via WhatsApp', back: 'Website', loading: 'Loading bookings...',
    },
    gr: {
      title: 'Πίνακας Ελέγχου', total: 'Σύνολο', pending: 'Εκκρεμεί',
      assigned: 'Ανατέθηκε', completed: 'Ολοκληρώθηκε', list: 'Λίστα',
      calendar: 'Ημερολόγιο', allStatus: 'Όλες', allDrivers: 'Όλοι',
      refresh: 'Ανανέωση', noBookings: 'Δεν βρέθηκαν κρατήσεις.',
      source: 'Πηγή', date: 'Ημερομηνία', time: 'Ώρα', passenger: 'Επιβάτης',
      phone: 'Τηλέφωνο', pickup: 'Παραλαβή', dropoff: 'Προορισμός', vehicle: 'Όχημα',
      driver: 'Οδηγός', status: 'Κατάσταση', actions: 'Ενέργειες', view: 'Προβολή',
      unassigned: 'Αναθεώρηση', signOut: 'Έξοδος', enableAlerts: 'Ειδοποιήσεις',
      details: 'Λεπτομέρειες Κράτησης', assignDriver: 'Ανάθεση Οδηγού',
      email: 'Email', flight: 'Πτήση/Πλοίο', notes: 'Σημειώσεις',
      share: 'Κοινοποίηση WhatsApp', back: 'Ιστοσελίδα', loading: 'Φόρτωση κρατήσεων...',
    }
  }[lang]

  useEffect(() => {
    const init = async () => {
      const u = await getCurrentUser()
      if (!u || u.role !== 'admin') { navigate('/login'); return }

      const { data, error } = await supabase
        .from('bookings').select('*').order('date', { ascending: true })
      if (!error) setBookings(data || [])
      setLoading(false)

      const channel = supabase
        .channel('bookings-realtime')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'bookings' },
          (payload) => {
            setBookings(prev => [...prev, payload.new])
            playNotification()
            showBrowserNotification(payload.new)
          }
        )
        .subscribe()

      const interval = setInterval(async () => {
        const { data } = await supabase.from('bookings').select('*').order('date', { ascending: true })
        if (data) setBookings(data)
      }, 60000)

      return () => { supabase.removeChannel(channel); clearInterval(interval) }
    }
    init()
  }, [])

  const fetchBookings = async () => {
    const { data } = await supabase.from('bookings').select('*').order('date', { ascending: true })
    if (data) setBookings(data)
  }

  const updateBooking = async (id, updates) => {
    const { error } = await supabase.from('bookings').update(updates).eq('id', id)
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
      if (selectedBooking?.id === id) setSelectedBooking(prev => ({ ...prev, ...updates }))
    }
  }

  const shareBooking = (b) => {
    const driver = DRIVERS.find(d => d.value === b.assigned_to)
    const dateObj = new Date(b.date)
    const dayName = dateObj.toLocaleDateString('el-GR', { weekday: 'long' })
    const dayNum = dateObj.getDate()
    const monthName = dateObj.toLocaleDateString('el-GR', { month: 'long' })
    const text =
      `${b.pickup} → ${b.dropoff}\n` +
      `${b.passenger_name}\n` +
      (b.flight_number ? `Πτήση ${b.flight_number}\n` : '') +
      `${dayName} ${dayNum} ${monthName} ${b.time}\n` +
      `${b.vehicle}\n` +
      (b.notes ? `${b.notes}\n` : '') +
      `${b.passenger_phone}` +
      (driver ? `\n\nΟδηγός: ${driver.label} ${driver.phone}` : '')
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const filtered = bookings.filter(b => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false
    if (filterDriver !== 'all' && b.assigned_to !== filterDriver) return false
    return true
  })

  const { firstDay, daysInMonth } = (() => {
    const y = currentMonth.getFullYear(), m = currentMonth.getMonth()
    return { firstDay: new Date(y, m, 1).getDay(), daysInMonth: new Date(y, m + 1, 0).getDate() }
  })()

  const getBookingsForDay = (day) => {
    const y = currentMonth.getFullYear()
    const m = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return bookings.filter(b => b.date === `${y}-${m}-${d}`)
  }

  const tagStyle = (type, value) => {
    const colors = type === 'status' ? STATUS_COLORS[value] : SOURCE_COLORS[value]
    return {
      fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', padding: '0.2rem 0.55rem',
      background: colors?.bg || 'rgba(255,255,255,0.08)',
      color: colors?.color || '#94a3b8',
      borderRadius: '2px', display: 'inline-block',
      border: `1px solid ${colors?.color ? colors.color + '30' : 'transparent'}`
    }
  }

  const monthName = currentMonth.toLocaleString(lang === 'gr' ? 'el-GR' : 'en', { month: 'long', year: 'numeric' })
  const dayHeaders = lang === 'gr'
    ? ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const navy = '#050c16'
  const navyMid = '#0a1729'
  const navyCard = '#0d1f38'
  const gold = '#c9a84c'
  const border = 'rgba(201,168,76,0.12)'
  const textMuted = 'rgba(255,255,255,0.38)'
  const textLight = 'rgba(255,255,255,0.65)'
  const cream = '#f0e6d0'

  const btnPrimary = {
    background: `linear-gradient(135deg, ${gold}, #b8932e)`,
    color: navy, border: 'none', borderRadius: '2px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.68rem',
    fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '0.45rem 1.1rem', cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(201,168,76,0.25)'
  }

  const btnGhost = {
    background: 'rgba(255,255,255,0.05)',
    color: textLight, border: `1px solid ${border}`, borderRadius: '2px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.68rem',
    fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
    padding: '0.45rem 1rem', cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s'
  }

  const selectStyle = {
    background: 'rgba(255,255,255,0.06)', border: `1px solid ${border}`,
    color: cream, fontFamily: 'Inter, sans-serif',
    fontSize: '0.72rem', padding: '0.45rem 0.85rem',
    outline: 'none', borderRadius: '2px', cursor: 'pointer'
  }

  const inlineSelectStyle = {
    background: navyCard, border: `1px solid ${border}`,
    color: cream, fontFamily: 'Inter, sans-serif',
    fontSize: '0.68rem', padding: '0.28rem 0.5rem',
    outline: 'none', borderRadius: '2px', cursor: 'pointer'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.8rem', color: gold, marginBottom: '0.75rem' }}>MO Transfers4all</div>
        <div style={{ fontSize: '0.72rem', color: textMuted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{t.loading}</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: navy, fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .admin-tr:hover td { background: rgba(255,255,255,0.025) !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: navyMid,
        borderBottom: `1px solid ${border}`,
        padding: '0 1.5rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            padding: '2px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${gold}, #2980b9)`
          }}>
            <img src="/logo.jpg" alt="MO" style={{
              width: '38px', height: '38px', borderRadius: '50%',
              border: `2px solid ${navy}`, objectFit: 'cover', display: 'block'
            }}/>
          </div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.05rem', color: '#ffffff', fontWeight: 600, letterSpacing: '0.02em' }}>{t.title}</div>
            <div style={{ fontSize: '0.6rem', color: textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>MO Transfers4all · Athens</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Lang toggle */}
          <div style={{ display: 'flex', borderRadius: '3px', overflow: 'hidden', border: `1px solid ${border}` }}>
            {['en','gr'].map(l => (
              <button key={l} onClick={() => { setLang(l); localStorage.setItem('mo-lang', l) }} style={{
                background: lang === l ? gold : 'transparent',
                color: lang === l ? navy : textMuted,
                border: 'none', fontFamily: 'Inter, sans-serif',
                fontSize: '0.62rem', fontWeight: 700, padding: '0.32rem 0.65rem',
                cursor: 'pointer', letterSpacing: '0.08em'
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={() => Notification.requestPermission()} style={btnGhost}>
            🔔 {t.enableAlerts}
          </button>
          <a href="/" style={{
            fontSize: '0.68rem', color: textMuted, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.45rem 0.85rem', border: `1px solid ${border}`,
            borderRadius: '2px', transition: 'color 0.2s'
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            {t.back}
          </a>
          <button onClick={async () => { await signOut(); navigate('/login') }} style={btnGhost}>{t.signOut}</button>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: t.total, value: bookings.length, color: gold, icon: '📋' },
            { label: t.pending, value: bookings.filter(b => b.status === 'pending').length, color: '#fbbf24', icon: '⏳' },
            { label: t.assigned, value: bookings.filter(b => b.status === 'assigned').length, color: '#4ade80', icon: '✓' },
            { label: t.completed, value: bookings.filter(b => b.status === 'completed').length, color: '#94a3b8', icon: '◉' },
          ].map(s => (
            <div key={s.label} style={{
              background: navyCard,
              border: `1px solid ${border}`,
              borderTop: `2px solid ${s.color}30`,
              borderRadius: '3px',
              padding: '1.4rem 1.2rem',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: '1rem', right: '1rem',
                fontSize: '1.1rem', opacity: 0.25
              }}>{s.icon}</div>
              <div style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '2.5rem', color: s.color, lineHeight: 1, fontWeight: 600
              }}>{s.value}</div>
              <div style={{
                fontSize: '0.6rem', color: textMuted,
                letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '0.4rem'
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex', gap: '0.75rem', marginBottom: '1.25rem',
          flexWrap: 'wrap', alignItems: 'center',
          padding: '1rem 1.25rem',
          background: navyCard, border: `1px solid ${border}`, borderRadius: '3px'
        }}>
          {/* View toggle */}
          <div style={{ display: 'flex', borderRadius: '3px', overflow: 'hidden', border: `1px solid ${border}` }}>
            {[['list', t.list], ['calendar', t.calendar]].map(([v, label]) => (
              <button key={v} style={{
                background: view === v ? gold : 'transparent',
                color: view === v ? navy : textMuted,
                border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.68rem',
                fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '0.45rem 1.1rem', cursor: 'pointer'
              }} onClick={() => setView(v)}>{label}</button>
            ))}
          </div>

          <select style={selectStyle} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">{t.allStatus}</option>
            <option value="pending">{t.pending}</option>
            <option value="assigned">{t.assigned}</option>
            <option value="completed">{t.completed}</option>
          </select>

          <select style={selectStyle} value={filterDriver} onChange={e => setFilterDriver(e.target.value)}>
            <option value="all">{t.allDrivers}</option>
            {DRIVERS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>

          <button onClick={fetchBookings} style={{
            ...btnGhost,
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {t.refresh}
          </button>

          <div style={{ marginLeft: 'auto', fontSize: '0.68rem', color: textMuted }}>
            {filtered.length} {lang === 'gr' ? 'κρατήσεις' : 'bookings'}
          </div>
        </div>

        {/* LIST VIEW */}
        {view === 'list' && (
          <div style={{
            background: navyCard, border: `1px solid ${border}`, borderRadius: '3px',
            overflow: 'hidden'
          }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: textMuted, fontSize: '0.84rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem', opacity: 0.4 }}>📋</div>
                {t.noBookings}
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: `1px solid ${border}` }}>
                      {[t.source, t.date, t.time, t.passenger, t.phone, t.pickup, t.dropoff, t.vehicle, t.driver, t.status, t.actions].map(h => (
                        <th key={h} style={{
                          padding: '0.75rem 1rem', textAlign: 'left',
                          fontSize: '0.58rem', letterSpacing: '0.18em',
                          textTransform: 'uppercase', color: gold,
                          fontWeight: 700, whiteSpace: 'nowrap'
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b, idx) => (
                      <tr key={b.id} className="admin-tr" style={{ borderBottom: `1px solid ${border}` }}>
                        <td style={{ padding: '0.75rem 1rem' }}><span style={tagStyle('source', b.source)}>{b.source}</span></td>
                        <td style={{ padding: '0.75rem 1rem', color: cream, whiteSpace: 'nowrap', fontWeight: 500 }}>{b.date}</td>
                        <td style={{ padding: '0.75rem 1rem', color: gold, fontWeight: 600 }}>{b.time}</td>
                        <td style={{ padding: '0.75rem 1rem', color: cream, whiteSpace: 'nowrap', fontWeight: 500 }}>{b.passenger_name}</td>
                        <td style={{ padding: '0.75rem 1rem' }}><a href={`tel:${b.passenger_phone}`} style={{ color: textLight, textDecoration: 'none' }}>{b.passenger_phone}</a></td>
                        <td style={{ padding: '0.75rem 1rem', color: textMuted, maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.pickup}</td>
                        <td style={{ padding: '0.75rem 1rem', color: textMuted, maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.dropoff}</td>
                        <td style={{ padding: '0.75rem 1rem', color: textMuted, whiteSpace: 'nowrap' }}>{b.vehicle}</td>
                        <td style={{ padding: '0.75rem 1rem' }} onClick={e => e.stopPropagation()}>
                          <select style={inlineSelectStyle}
                            value={b.assigned_to || ''}
                            onChange={e => updateBooking(b.id, { assigned_to: e.target.value || null, status: e.target.value ? 'assigned' : 'pending' })}
                          >
                            <option value="">{t.unassigned}</option>
                            {DRIVERS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }} onClick={e => e.stopPropagation()}>
                          <select style={inlineSelectStyle}
                            value={b.status}
                            onChange={e => updateBooking(b.id, { status: e.target.value })}
                          >
                            <option value="pending">{t.pending}</option>
                            <option value="assigned">{t.assigned}</option>
                            <option value="completed">{t.completed}</option>
                          </select>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <button onClick={e => { e.stopPropagation(); setSelectedBooking(b) }}
                            style={{
                              background: `rgba(201,168,76,0.12)`,
                              border: `1px solid rgba(201,168,76,0.3)`,
                              color: gold, fontSize: '0.62rem', padding: '0.28rem 0.7rem',
                              cursor: 'pointer', borderRadius: '2px',
                              fontFamily: 'Inter, sans-serif', fontWeight: 600,
                              letterSpacing: '0.08em', textTransform: 'uppercase'
                            }}>{t.view}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CALENDAR VIEW */}
        {view === 'calendar' && (
          <div style={{ background: navyCard, border: `1px solid ${border}`, borderRadius: '3px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                style={{ ...btnGhost, padding: '0.5rem 1rem', fontSize: '1rem' }}>←</button>
              <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.4rem', color: '#ffffff', textTransform: 'capitalize', letterSpacing: '0.03em' }}>{monthName}</div>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                style={{ ...btnGhost, padding: '0.5rem 1rem', fontSize: '1rem' }}>→</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '1px' }}>
              {dayHeaders.map(d => (
                <div key={d} style={{
                  textAlign: 'center', fontSize: '0.6rem',
                  letterSpacing: '0.12em', color: gold, fontWeight: 700,
                  padding: '0.6rem 0', textTransform: 'uppercase'
                }}>{d}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} style={{ background: 'rgba(0,0,0,0.15)', minHeight: '72px', borderRadius: '2px' }}/>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayBookings = getBookingsForDay(day)
                const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear()
                return (
                  <div key={day} onClick={() => { if (dayBookings.length > 0) setSelectedDay({ day, bookings: dayBookings }) }}
                    style={{
                      background: isToday ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.025)',
                      minHeight: '72px', padding: '0.5rem',
                      border: isToday ? `1px solid ${gold}40` : '1px solid transparent',
                      cursor: dayBookings.length > 0 ? 'pointer' : 'default',
                      borderRadius: '2px', transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => { if (dayBookings.length > 0) e.currentTarget.style.background = 'rgba(201,168,76,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = isToday ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.025)' }}
                  >
                    <div style={{
                      fontSize: '0.72rem', fontWeight: isToday ? 700 : 400,
                      color: isToday ? gold : textMuted, marginBottom: '0.3rem'
                    }}>{day}</div>
                    {dayBookings.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {dayBookings.slice(0, 3).map(b => (
                          <div key={b.id} style={{
                            height: '4px', borderRadius: '2px',
                            background: b.source === 'website' ? gold : '#60a5fa', opacity: 0.8
                          }}/>
                        ))}
                        <div style={{ fontSize: '0.56rem', color: textMuted, marginTop: '2px' }}>
                          {dayBookings.length}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: `1px solid ${border}` }}>
              {[['Website', gold], [lang === 'gr' ? 'Ξενοδοχείο' : 'Hotel', '#60a5fa']].map(([label, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', color: textMuted }}>
                  <div style={{ width: '16px', height: '4px', background: color, borderRadius: '2px', opacity: 0.8 }}/>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Day bookings modal */}
      {selectedDay && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(5,12,22,0.88)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }} onClick={() => setSelectedDay(null)}>
          <div style={{
            background: navyCard, border: `1px solid ${border}`,
            borderTop: `2px solid ${gold}`, borderRadius: '3px',
            padding: '2rem', width: '100%', maxWidth: '500px',
            maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.4rem', color: '#ffffff' }}>
                {selectedDay.day} {currentMonth.toLocaleString(lang === 'gr' ? 'el-GR' : 'en', { month: 'long' })}
              </div>
              <button onClick={() => setSelectedDay(null)} style={{
                background: 'rgba(255,255,255,0.06)', border: `1px solid ${border}`,
                color: textMuted, width: '32px', height: '32px', borderRadius: '50%',
                fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {selectedDay.bookings.map(b => (
                <div key={b.id} onClick={() => { setSelectedBooking(b); setSelectedDay(null) }}
                  style={{
                    background: 'rgba(255,255,255,0.03)', border: `1px solid ${border}`,
                    borderRadius: '2px', padding: '1rem 1.1rem', cursor: 'pointer',
                    borderLeft: `3px solid ${b.source === 'website' ? gold : '#60a5fa'}`,
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: cream }}>{b.passenger_name}</span>
                    <span style={{ fontSize: '0.82rem', color: gold, fontWeight: 600 }}>{b.time}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: textMuted }}>{b.pickup} → {b.dropoff}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={tagStyle('source', b.source)}>{b.source}</span>
                    <span style={tagStyle('status', b.status)}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking detail modal */}
      {selectedBooking && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9500,
          background: 'rgba(5,12,22,0.88)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }} onClick={() => setSelectedBooking(null)}>
          <div style={{
            background: navyCard, border: `1px solid ${border}`,
            borderTop: `2px solid ${gold}`, borderRadius: '3px',
            padding: '2rem', width: '100%', maxWidth: '540px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>{t.details}</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={tagStyle('source', selectedBooking.source)}>{selectedBooking.source}</span>
                  <span style={tagStyle('status', selectedBooking.status)}>{selectedBooking.status}</span>
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{
                background: 'rgba(255,255,255,0.06)', border: `1px solid ${border}`,
                color: textMuted, width: '32px', height: '32px', borderRadius: '50%',
                fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '1.5rem' }}>
              {[
                [t.passenger, selectedBooking.passenger_name],
                [t.phone, selectedBooking.passenger_phone],
                [t.email, selectedBooking.passenger_email || '—'],
                [t.date, selectedBooking.date],
                [t.time, selectedBooking.time],
                [t.pickup, selectedBooking.pickup],
                [t.dropoff, selectedBooking.dropoff],
                [t.vehicle, selectedBooking.vehicle],
                [t.flight, selectedBooking.flight_number || '—'],
                [t.notes, selectedBooking.notes || '—'],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex', gap: '1rem', padding: '0.65rem 0',
                  borderBottom: `1px solid ${border}`
                }}>
                  <div style={{
                    fontSize: '0.6rem', letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: gold,
                    fontWeight: 700, minWidth: '88px', paddingTop: '0.1rem', flexShrink: 0
                  }}>{label}</div>
                  <div style={{ fontSize: '0.84rem', color: cream, lineHeight: 1.5 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Assign driver */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{
                fontSize: '0.6rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: '0.65rem'
              }}>{t.assignDriver}</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {DRIVERS.map(d => (
                  <button key={d.value}
                    onClick={() => updateBooking(selectedBooking.id, { assigned_to: d.value, status: 'assigned' })}
                    style={{
                      background: selectedBooking.assigned_to === d.value
                        ? `linear-gradient(135deg, ${gold}, #b8932e)` : 'rgba(255,255,255,0.04)',
                      color: selectedBooking.assigned_to === d.value ? navy : cream,
                      border: `1px solid ${selectedBooking.assigned_to === d.value ? gold : border}`,
                      borderRadius: '2px', padding: '0.55rem 1rem',
                      fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
                      fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s'
                    }}>
                    {d.label}
                    <div style={{ fontSize: '0.58rem', fontWeight: 400, opacity: 0.75, marginTop: '2px' }}>{d.phone}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                fontSize: '0.6rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: '0.65rem'
              }}>{t.status}</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['pending', 'assigned', 'completed'].map(s => {
                  const c = STATUS_COLORS[s]
                  const active = selectedBooking.status === s
                  return (
                    <button key={s} onClick={() => updateBooking(selectedBooking.id, { status: s })}
                      style={{
                        background: active ? c.bg : 'transparent',
                        color: active ? c.color : textMuted,
                        border: `1px solid ${active ? c.color + '60' : border}`,
                        borderRadius: '2px', padding: '0.4rem 0.9rem',
                        fontFamily: 'Inter, sans-serif', fontSize: '0.65rem',
                        fontWeight: 700, letterSpacing: '0.12em',
                        textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s'
                      }}>
                      {active && <span style={{ marginRight: '0.3rem', fontSize: '0.5rem' }}>●</span>}
                      {lang === 'gr' ? { pending: 'Εκκρεμεί', assigned: 'Ανατέθηκε', completed: 'Ολοκληρώθηκε' }[s] : s}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Share button */}
            <button onClick={() => shareBooking(selectedBooking)} style={{
              width: '100%',
              background: 'rgba(37,211,102,0.08)',
              border: '1px solid rgba(37,211,102,0.3)',
              borderRadius: '2px',
              color: '#25d366', fontFamily: 'Inter, sans-serif',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '0.9rem', cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.08)'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {t.share}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
