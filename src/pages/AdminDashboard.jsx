import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrentUser, signOut } from '../lib/auth'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const u = await getCurrentUser()
      if (!u || u.role !== 'admin') {
        navigate('/login')
        return
      }
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true })
      if (!error) setBookings(data || [])
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
      Loading...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', padding: '2rem', color: 'var(--cream)' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--gold)', marginBottom: '1rem' }}>Admin Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{bookings.length} bookings found</p>
      <button onClick={() => { signOut(); navigate('/login') }} style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Sign Out</button>
    </div>
  )
}