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

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [view, setView] = useState('list') // 'list' or 'calendar'
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDriver, setFilterDriver] = useState('all')
  const [currentMonth, setCurrentMonth] = useState(new Date())

const playNotification = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.setValueAtTime(880, ctx.currentTime)
    oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.2)
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.4)
  } catch(e) {
    console.warn('Audio not supported:', e)
  }
}

const showNotification = (booking) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🚖 Νέα Κράτηση!', {
      body: `${booking.passenger_name} · ${booking.pickup} → ${booking.dropoff}`,
      icon: '/logo.jpg'
    })
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') showNotification(booking)
    })
  }
}

  useEffect(() => {
  getCurrentUser().then(u => {
    if (!u || u.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchBookings()

    // Real-time subscription
    const channel = supabase
      .channel('bookings-changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        (payload) => {
          setBookings(prev => [...prev, payload.new])
          playNotification()
          showNotification(payload.new)
        }
      )
      .subscribe()

    // Auto refresh every 60 seconds
    const interval = setInterval(fetchBookings, 60000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  })
}, [])
  const updateBooking = async (id, updates) => {
    const { error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
      if (selectedBooking?.id === id) setSelectedBooking(prev => ({ ...prev, ...updates }))
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const filtered = bookings.filter(b => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false
    if (filterDriver !== 'all' && b.assigned_to !== filterDriver) return false
    return true
  })

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const getBookingsForDay = (day) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    const dateStr = `${year}-${month}-${d}`
    return bookings.filter(b => b.date === dateStr)
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleString('en', { month: 'long', year: 'numeric' })

  const tagStyle = (type, value) => {
    const colors = type === 'status' ? STATUS_COLORS[value] : SOURCE_COLORS[value]
    return {
      fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '0.15rem 0.5rem',
      background: colors?.bg || 'rgba(255,255,255,0.1)',
      color: colors?.color || 'var(--text-muted)',
      display: 'inline-block'
    }
  }

  const btnStyle = (active) => ({
    background: active ? 'var(--gold)' : 'transparent',
    color: active ? 'var(--navy)' : 'var(--text-muted)',
    border: '1px solid var(--border)',
    fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem',
    fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
    padding: '0.4rem 1rem', cursor: 'pointer', transition: 'all 0.2s'
  })

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
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'var(--white)', fontWeight: 600 }}>Admin Dashboard</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>MO Transfers4all Athens</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'none' }}>← Website</a>
          <button onClick={() => Notification.requestPermission()} style={{
  background: 'transparent', border: '1px solid var(--border)',
  color: 'var(--text-muted)', fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.7rem', letterSpacing: '0.1em', padding: '0.4rem 1rem',
  cursor: 'pointer', textTransform: 'uppercase'
}}>🔔 Ειδοποιήσεις</button>
<button onClick={handleSignOut} style={{
  background: 'transparent', border: '1px solid var(--border)',
  color: 'var(--text-muted)', fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.7rem', letterSpacing: '0.1em', padding: '0.4rem 1rem',
  cursor: 'pointer', textTransform: 'uppercase'
}}>Έξοδος</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total', value: bookings.length, color: 'var(--gold)' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: '#fbbf24' },
            { label: 'Assigned', value: bookings.filter(b => b.status === 'assigned').length, color: '#4ade80' },
            { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: '#94a3b8' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--navy-mid)', border: '1px solid var(--border)',
              padding: '1.2rem', textAlign: 'center'
            }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.3rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            <button style={btnStyle(view === 'list')} onClick={() => setView('list')}>List</button>
            <button style={btnStyle(view === 'calendar')} onClick={() => setView('calendar')}>Calendar</button>
          </div>
          <select style={{
            background: 'var(--navy-mid)', border: '1px solid var(--border)',
            color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.72rem', padding: '0.4rem 0.8rem', outline: 'none'
          }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
          </select>
          <select style={{
            background: 'var(--navy-mid)', border: '1px solid var(--border)',
            color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.72rem', padding: '0.4rem 0.8rem', outline: 'none'
          }} value={filterDriver} onChange={e => setFilterDriver(e.target.value)}>
            <option value="all">All Drivers</option>
            {DRIVERS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <button onClick={fetchBookings} style={{
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text-muted)', fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.7rem', padding: '0.4rem 0.8rem', cursor: 'pointer'
          }}>↻ Refresh</button>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>Loading bookings...</div>
        ) : (
          <>
            {/* LIST VIEW */}
            {view === 'list' && (
              <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)' }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>No bookings found.</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          {['Source', 'Date', 'Time', 'Passenger', 'Phone', 'Pickup', 'Drop-off', 'Vehicle', 'Driver', 'Status', 'Actions'].map(h => (
                            <th key={h} style={{
                              padding: '0.7rem 1rem', textAlign: 'left',
                              fontSize: '0.6rem', letterSpacing: '0.15em',
                              textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600,
                              whiteSpace: 'nowrap'
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(b => (
                          <tr key={b.id} style={{
                            borderBottom: '1px solid rgba(201,168,76,0.06)',
                            cursor: 'pointer'
                          }}
                            onClick={() => setSelectedBooking(b)}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '0.7rem 1rem' }}><span style={tagStyle('source', b.source)}>{b.source}</span></td>
                            <td style={{ padding: '0.7rem 1rem', color: 'var(--cream)', whiteSpace: 'nowrap' }}>{b.date}</td>
                            <td style={{ padding: '0.7rem 1rem', color: 'var(--cream)' }}>{b.time}</td>
                            <td style={{ padding: '0.7rem 1rem', color: 'var(--cream)', whiteSpace: 'nowrap' }}>{b.passenger_name}</td>
                            <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)' }}>
                              <a href={`tel:${b.passenger_phone}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{b.passenger_phone}</a>
                            </td>
                            <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.pickup}</td>
                            <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.dropoff}</td>
                            <td style={{ padding: '0.7rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{b.vehicle}</td>
                            <td style={{ padding: '0.7rem 1rem' }} onClick={e => e.stopPropagation()}>
                              <select style={{
                                background: 'var(--navy)', border: '1px solid var(--border)',
                                color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
                                fontSize: '0.7rem', padding: '0.3rem 0.5rem', outline: 'none'
                              }}
                                value={b.assigned_to || ''}
                                onChange={e => updateBooking(b.id, { assigned_to: e.target.value || null, status: e.target.value ? 'assigned' : 'pending' })}
                              >
                                <option value="">Unassigned</option>
                                {DRIVERS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                              </select>
                            </td>
                            <td style={{ padding: '0.7rem 1rem' }} onClick={e => e.stopPropagation()}>
                              <select style={{
                                background: 'var(--navy)', border: '1px solid var(--border)',
                                color: 'var(--cream)', fontFamily: 'Montserrat, sans-serif',
                                fontSize: '0.7rem', padding: '0.3rem 0.5rem', outline: 'none'
                              }}
                                value={b.status}
                                onChange={e => updateBooking(b.id, { status: e.target.value })}
                              >
                                <option value="pending">Pending</option>
                                <option value="assigned">Assigned</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                            <td style={{ padding: '0.7rem 1rem' }}>
                              <button onClick={e => { e.stopPropagation(); setSelectedBooking(b) }} style={{
                                background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border)',
                                color: 'var(--gold)', fontSize: '0.65rem', padding: '0.25rem 0.6rem',
                                cursor: 'pointer', fontFamily: 'Montserrat, sans-serif'
                              }}>View</button>
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
                {/* Month navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--cream)', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '1rem' }}>←</button>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--white)' }}>{monthName}</div>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--cream)', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '1rem' }}>→</button>
                </div>

                {/* Day headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '1px' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--gold)', fontWeight: 600, padding: '0.5rem 0' }}>{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border)' }}>
                  {/* Empty cells */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ background: 'var(--navy)', minHeight: '80px' }}/>
                  ))}
                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dayBookings = getBookingsForDay(day)
                    const isToday = new Date().getDate() === day &&
                      new Date().getMonth() === currentMonth.getMonth() &&
                      new Date().getFullYear() === currentMonth.getFullYear()
                    return (
                      <div key={day} style={{
                        background: 'var(--navy)', minHeight: '80px', padding: '0.4rem',
                        border: isToday ? '1px solid var(--gold)' : 'none'
                      }}>
                        <div style={{
                          fontSize: '0.75rem', color: isToday ? 'var(--gold)' : 'var(--text-muted)',
                          fontWeight: isToday ? 600 : 400, marginBottom: '0.3rem'
                        }}>{day}</div>
                        {dayBookings.map(b => (
                          <div key={b.id} onClick={() => setSelectedBooking(b)}
                            style={{
                              fontSize: '0.6rem', padding: '0.2rem 0.4rem',
                              marginBottom: '0.2rem', cursor: 'pointer',
                              background: b.source === 'website' ? 'rgba(201,168,76,0.2)' : 'rgba(96,165,250,0.2)',
                              color: b.source === 'website' ? 'var(--gold)' : '#60a5fa',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              borderLeft: `2px solid ${b.source === 'website' ? 'var(--gold)' : '#60a5fa'}`
                            }}>
                            {b.time} {b.passenger_name}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    <div style={{ width: '12px', height: '12px', background: 'rgba(201,168,76,0.2)', borderLeft: '2px solid var(--gold)' }}/>
                    Website booking
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    <div style={{ width: '12px', height: '12px', background: 'rgba(96,165,250,0.2)', borderLeft: '2px solid #60a5fa' }}/>
                    Hotel booking
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(5,12,22,0.85)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }} onClick={() => setSelectedBooking(null)}>
          <div style={{
            background: 'var(--navy-mid)', border: '1px solid var(--border)',
            borderTop: '2px solid var(--gold)', padding: '2rem',
            width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--white)', fontWeight: 400 }}>Booking Details</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <span style={tagStyle('source', selectedBooking.source)}>{selectedBooking.source}</span>
                  <span style={tagStyle('status', selectedBooking.status)}>{selectedBooking.status}</span>
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{
                background: 'transparent', border: 'none', color: 'var(--text-muted)',
                fontSize: '1.2rem', cursor: 'pointer'
              }}>✕</button>
            </div>

            {[
              ['Passenger', selectedBooking.passenger_name],
              ['Phone', selectedBooking.passenger_phone],
              ['Email', selectedBooking.passenger_email || '—'],
              ['Date', selectedBooking.date],
              ['Time', selectedBooking.time],
              ['Pickup', selectedBooking.pickup],
              ['Drop-off', selectedBooking.dropoff],
              ['Vehicle', selectedBooking.vehicle],
              ['Flight/Ship', selectedBooking.flight_number || '—'],
              ['Notes', selectedBooking.notes || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, minWidth: '80px', paddingTop: '0.1rem' }}>{label}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--cream)', flex: 1 }}>{value}</div>
              </div>
            ))}

            {/* Assign driver */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: '0.6rem' }}>Assign Driver</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {DRIVERS.map(d => (
                  <button key={d.value} onClick={() => updateBooking(selectedBooking.id, { assigned_to: d.value, status: 'assigned' })}
                    style={{
                      background: selectedBooking.assigned_to === d.value ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
                      color: selectedBooking.assigned_to === d.value ? 'var(--navy)' : 'var(--cream)',
                      border: '1px solid var(--border)', padding: '0.5rem 1rem',
                      fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                    {d.label}<br/>
                    <span style={{ fontSize: '0.6rem', fontWeight: 400, opacity: 0.7 }}>{d.phone}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div style={{ marginTop: '1.2rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500, marginBottom: '0.6rem' }}>Status</div>
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
                    }}>{s}</button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}