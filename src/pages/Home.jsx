import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import BookingForm from '../components/BookingForm.jsx'
import Fleet from '../components/Fleet.jsx'
import Prices from '../components/Prices.jsx'
import Services from '../components/Services.jsx'
import Destinations from '../components/Destinations.jsx'
import Footer from '../components/Footer.jsx'
import WhatsAppButton from '../components/WhatsAppButton.jsx'
import CookieConsent from '../components/CookieConsent.jsx'

export default function Home() {
  const [lang, setLang] = useState(() => localStorage.getItem('mo-lang') || 'en')
  const [prefill, setPrefill] = useState({ pickup: '', dropoff: '' })

  useEffect(() => {
    localStorage.setItem('mo-lang', lang)
  }, [lang])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar lang={lang} setLang={setLang}/>
      <Hero lang={lang}/>
      <Services lang={lang}/>
      <Destinations lang={lang} onSelect={(pickup, dropoff) => setPrefill({ pickup, dropoff })}/>
      <BookingForm lang={lang} prefillPickup={prefill.pickup} prefillDropoff={prefill.dropoff}/>
      <Fleet lang={lang}/>
      <Prices lang={lang}/>
      <Footer lang={lang}/>
      <WhatsAppButton lang={lang}/>
      <CookieConsent lang={lang}/>
    </>
  )
}
