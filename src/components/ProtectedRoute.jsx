import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../lib/auth'

export default function ProtectedRoute({ children, requiredRole }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  // Still loading
  if (user === undefined) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--navy)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1.2rem', color: 'var(--gold)', letterSpacing: '0.2em'
        }}>Loading...</div>
      </div>
    )
  }

  // Not logged in
  if (!user) return <Navigate to="/login" replace/>

  // Wrong role
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'admin') return <Navigate to="/admin" replace/>
    if (user.role === 'hotel') return <Navigate to="/hotel" replace/>
  }

  return children
}