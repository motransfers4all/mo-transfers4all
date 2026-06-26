import { useState } from 'react'

const CONTACTS = [
  { name: 'Marjus', phone: '306936475451' },
  { name: 'Martin', phone: '306993605070' },
  { name: 'Roland', phone: '306979638475' },
]

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 8000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>

      {/* Contact options */}
      {open && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
          animation: 'fadeUp 0.2s ease both'
        }}>
          {CONTACTS.map(c => (
            <a key={c.phone} href={`https://wa.me/${c.phone}`} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'var(--navy-mid)', border: '1px solid var(--border)',
                padding: '0.6rem 1rem', textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#25d366'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{
                width: '32px', height: '32px', background: '#25d366',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem', flexShrink: 0
              }}>💬</div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--cream)' }}>{c.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>+{c.phone.replace('30', '30 ').replace(/(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3')}</div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Main button */}
      <button onClick={() => setOpen(!open)} style={{
        width: '58px', height: '58px', background: '#25d366',
        borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.45)', cursor: 'pointer',
        transition: 'transform 0.25s, box-shadow 0.25s',
        animation: 'wa-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 1.5s both'
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.6)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.45)' }}
        aria-label="Contact on WhatsApp"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: 'white' }}>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '30px', height: '30px', fill: 'white' }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </button>

      <style>{`
        @keyframes wa-pop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}