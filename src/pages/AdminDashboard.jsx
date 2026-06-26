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
  pending: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  assigned: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80' },
  completed: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
}

const SOURCE_COLORS = {
  website: { bg: 'rgba(201,168,76,0.15)', color: 'var(--gold)' },
  hotel: { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
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
      refresh: '↻ Refresh', noBookings: 'No bookings found.',
      source: 'Source', date: 'Date', time: 'Time', passenger: 'Passenger',
      phone: 'Phone', pickup: 'Pickup', dropoff: 'Drop-off', vehicle: 'Vehicle',
      driver: 'Driver', status: 'Status', actions: 'Actions', view: 'View',
      unassigned: 'Unassigned', signOut: 'Sign Out', enableAlerts: '🔔 Alerts',
      details: 'Booking Details', assignDriver: 'Assign Driver',
      email: 'Email', flight: 'Flight/Ship', notes: 'Notes',
      share: '📤 Share', back: '← Website', loading: 'Loading bookings...',
    },
    gr: {
      title: 'Πίνακας Ελέγχου', total: 'Σύνολο', pending: 'Εκκρεμεί',
      assigned: 'Ανατέθηκε', completed: 'Ολοκληρώθηκε', list: 'Λίστα',
      calendar: 'Ημερολόγιο', allStatus: 'Όλες', allDrivers: 'Όλοι',
      refresh: '↻ Ανανέωση', noBookings: 'Δεν βρέθηκαν κρατήσεις.',
      source: 'Πηγή', date: 'Ημερομηνία', time: 'Ώρα', passenger: 'Επιβάτης',
      phone: 'Τηλέφωνο', pickup: 'Παραλαβή', dropoff: 'Προορισμός', vehicle: 'Όχημα',
      driver: 'Οδηγός', status: 'Κατάσταση', actions: 'Ενέργειες', view: 'Προβολή',
      unassigned: 'Αναθεώρηση', signOut: 'Έξοδος', enableAlerts: '🔔 Ειδοποιήσεις',
      details: 'Λεπτομέρειες Κράτησης', assignDriver: 'Ανάθεση Οδηγού',
      email: 'Email', flight: 'Πτήση/Πλοίο', notes: 'Σημειώσεις',
      share: '📤 Κοινοποίηση', back: '← Ιστοσελίδα', loading: 'Φόρτωση κρατήσεων...',
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
      fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '0.15rem 0.5rem',
      background: colors?.bg || 'rgba(255,255,255,0.1)',
      color: colors?.color || 'var(--text-muted)', display: 'inline-block'
    }
  }

  const btnStyle = (active) => ({
    background: active ? 'var(--gold)' : 'transparent',
    color: active ? 'var(--navy)' : 'var(--text-muted)',
    border: '1px solid var(--border)',
    fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem',
    fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
    padding: '0.4rem 1rem', cursor: 'pointer'
  })

  const selectStyle = {
    background: 'var(--navy-mid)', border: '1px solid var(--border)',
    color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.72rem', padding: '0.4rem 0.8rem', outline: 'none'
  }

  const monthName = currentMonth.toLocaleString(lang === 'gr' ? 'el-GR' : 'en', { month: 'long', year: 'numeric' })
  const dayHeaders = lang === 'gr'
    ? ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem' }}>
      {t.loading}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>

      {/* Header */}
      <div style={{
        background: 'var(--navy-mid)', borderBottom: '1px solid var(--border)',
        padding: '1rem 1.5rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.jpg" alt="MO" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid var(--gold)', objectFit: 'cover' }}/>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'var(--white)', fontWeight: 600 }}>{t.title}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>MO Transfers4all Athens</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {['en','gr'].map(l => (
              <button key={l} onClick={() => { setLang(l); localStorage.setItem('mo-lang', l) }} style={{
                background: lang === l ? 'var(--gold)' : 'transparent',
                color: lang === l ? 'var(--navy)' : 'var(--text-muted)',
                border: 'none', fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.68rem', fontWeight: 600, padding: '0.3rem 0.6rem', cursor: 'pointer'
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={() => Notification.requestPermission()} style={btnStyle(false)}>{t.enableAlerts}</button>
          <a href="/" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'none' }}>{t.back}</a>
          <button onClick={async () => { await signOut(); navigate('/login') }} style={btnStyle(false)}>{t.signOut}</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: t.total, value: bookings.length, color: 'var(--gold)' },
            { label: t.pending, value: bookings.filter(b => b.status === 'pending').length, color: '#fbbf24' },
            { label: t.assigned, value: bookings.filter(b => b.status === 'assigned').length, color: '#4ade80' },
            { label: t.completed, value: bookings.filter(b => b.status === 'completed').length, color: '#94a3b8' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', padding: '1.2rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.3rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            <button style={btnStyle(view === 'list')} onClick={() => setView('list')}>{t.list}</button>
            <button style={btnStyle(view === 'calendar')} onClick={() => setView('calendar')}>{t.calendar}</button>
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
          <button onClick={fetchBookings} style={btnStyle(false)}>{t.refresh}</button>
        </div>

        {/* LIST VIEW */}
        {view === 'list' && (
          <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t.noBookings}</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {[t.source, t.date, t.time, t.passenger, t.phone, t.pickup, t.dropoff, t.vehicle, t.driver, t.status, t.actions].map(h => (
                        <th key={h} style={{ padding: '0.7rem 1rem', textAlign: 'left', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid rgba(201,168,76,0.06)', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.7rem 1rem' }}><span style={tagStyle('source', b.source)}>{b.source}</span></td>
                        <td style={{ padding: '0.7rem 1rem', color: 'var(--cream)', whiteSpace: 'nowrap' }}>{b.date}</td>
                        <td style={{ padding: '0.7rem 1rem', color: 'var(--cream)' }}>{b.time}</td>
                        <td style={{ padding: '0.7rem 1rem', color: 'var(--cream)', whiteSpace: 'nowrap' }}>{b.passenger_name}</td>
                        <td style={{ padding: '0.7rem 1rem' }}><a href={`tel:${b.passenger_phone}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{b.passenger_phone}</a></td>
                        <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.pickup}</td>
                        <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.dropoff}</td>
                        <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{b.vehicle}</td>
                        <td style={{ padding: '0.7rem 1rem' }} onClick={e => e.stopPropagation()}>
                          <select style={{ background: 'var(--navy)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', padding: '0.3rem 0.5rem', outline: 'none' }}
                            value={b.assigned_to || ''}
                            onChange={e => updateBooking(b.id, { assigned_to: e.target.value || null, status: e.target.value ? 'assigned' : 'pending' })}
                          >
                            <option value="">{t.unassigned}</option>
                            {DRIVERS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '0.7rem 1rem' }} onClick={e => e.stopPropagation()}>
                          <select style={{ background: 'var(--navy)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', padding: '0.3rem 0.5rem', outline: 'none' }}
                            value={b.status}
                            onChange={e => updateBooking(b.id, { status: e.target.value })}
                          >
                            <option value="pending">{t.pending}</option>
                            <option value="assigned">{t.assigned}</option>
                            <option value="completed">{t.completed}</option>
                          </select>
                        </td>
                        <td style={{ padding: '0.7rem 1rem' }}>
                          <button onClick={e => { e.stopPropagation(); setSelectedBooking(b) }} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border)', color: 'var(--gold)', fontSize: '0.65rem', padding: '0.25rem 0.6rem', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>{t.view}</button>
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
          <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--cream)', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '1rem' }}>←</button>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--white)', textTransform: 'capitalize' }}>{monthName}</div>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--cream)', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '1rem' }}>→</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '1px' }}>
              {dayHeaders.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, padding: '0.5rem 0' }}>{d}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border)' }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} style={{ background: 'var(--navy)', minHeight: '70px' }}/>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayBookings = getBookingsForDay(day)
                const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear()
                return (
                  <div key={day} onClick={() => { if (dayBookings.length > 0) setSelectedDay({ day, bookings: dayBookings }) }}
                    style={{
                      background: 'var(--navy)', minHeight: '70px', padding: '0.4rem',
                      border: isToday ? '1px solid var(--gold)' : 'none',
                      cursor: dayBookings.length > 0 ? 'pointer' : 'default'
                    }}
                    onMouseEnter={e => { if (dayBookings.length > 0) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--navy)'}
                  >
                    <div style={{ fontSize: '0.75rem', color: isToday ? 'var(--gold)' : 'var(--text-muted)', fontWeight: isToday ? 600 : 400, marginBottom: '0.3rem' }}>{day}</div>
                    {dayBookings.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {dayBookings.slice(0, 2).map(b => (
                          <div key={b.id} style={{
                            width: '100%', height: '6px', borderRadius: '2px',
                            background: b.source === 'website' ? 'var(--gold)' : '#60a5fa',
                            opacity: 0.7
                          }}/>
                        ))}
                        {dayBookings.length > 0 && (
                          <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {dayBookings.length} {lang === 'gr' ? 'κρατήσεις' : 'bookings'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '12px', height: '6px', background: 'var(--gold)', borderRadius: '2px', opacity: 0.7 }}/> {lang === 'gr' ? 'Ιστοσελίδα' : 'Website'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '12px', height: '6px', background: '#60a5fa', borderRadius: '2px', opacity: 0.7 }}/> {lang === 'gr' ? 'Ξενοδοχείο' : 'Hotel'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Day bookings modal */}
      {selectedDay && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(5,12,22,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setSelectedDay(null)}>
          <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', borderTop: '2px solid var(--gold)', padding: '2rem', width: '100%', maxWidth: '480px', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--white)' }}>
                {selectedDay.day} {currentMonth.toLocaleString(lang === 'gr' ? 'el-GR' : 'en', { month: 'long' })}
              </div>
              <button onClick={() => setSelectedDay(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedDay.bookings.map(b => (
                <div key={b.id} onClick={() => { setSelectedBooking(b); setSelectedDay(null) }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '1rem', cursor: 'pointer', borderLeft: `3px solid ${b.source === 'website' ? 'var(--gold)' : '#60a5fa'}` }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--cream)' }}>{b.passenger_name}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--gold)' }}>{b.time}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.pickup} → {b.dropoff}</div>
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 9500, background: 'rgba(5,12,22,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={() => setSelectedBooking(null)}>
          <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', borderTop: '2px solid var(--gold)', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--white)' }}>{t.details}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <span style={tagStyle('source', selectedBooking.source)}>{selectedBooking.source}</span>
                  <span style={tagStyle('status', selectedBooking.status)}>{selectedBooking.status}</span>
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

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
              <div key={label} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, minWidth: '80px', paddingTop: '0.1rem' }}>{label}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--cream)', flex: 1 }}>{value}</div>
              </div>
            ))}

            {/* Assign driver */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: '0.6rem' }}>{t.assignDriver}</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {DRIVERS.map(d => (
                  <button key={d.value} onClick={() => updateBooking(selectedBooking.id, { assigned_to: d.value, status: 'assigned' })}
                    style={{
                      background: selectedBooking.assigned_to === d.value ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                      color: selectedBooking.assigned_to === d.value ? 'var(--navy)' : 'var(--cream)',
                      border: '1px solid var(--border)', padding: '0.5rem 1rem',
                      fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                    }}>
                    {d.label}<br/>
                    <span style={{ fontSize: '0.6rem', fontWeight: 400, opacity: 0.7 }}>{d.phone}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div style={{ marginTop: '1.2rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: '0.6rem' }}>{t.status}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['pending', 'assigned', 'completed'].map(s => (
                  <button key={s} onClick={() => updateBooking(selectedBooking.id, { status: s })}
                    style={{
                      background: selectedBooking.status === s ? STATUS_COLORS[s].bg : 'transparent',
                      color: selectedBooking.status === s ? STATUS_COLORS[s].color : 'var(--text-muted)',
                      border: `1px solid ${selectedBooking.status === s ? STATUS_COLORS[s].color : 'var(--border)'}`,
                      padding: '0.4rem 0.8rem', fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
                      textTransform: 'uppercase', cursor: 'pointer'
                    }}>{lang === 'gr' ? { pending: 'Εκκρεμεί', assigned: 'Ανατέθηκε', completed: 'Ολοκληρώθηκε' }[s] : s}</button>
                ))}
              </div>
            </div>

            {/* Share button */}
            <button onClick={() => shareBooking(selectedBooking)} style={{
              width: '100%', marginTop: '1.5rem',
              background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)',
              color: '#25d366', fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase', padding: '0.85rem', cursor: 'pointer'
            }}>{t.share}</button>

          </div>
        </div>
      )}
    </div>
  )
}