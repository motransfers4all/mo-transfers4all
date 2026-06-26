import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import BookingForm from '../components/BookingForm.jsx'
import Fleet from '../components/Fleet.jsx'
import Prices from '../components/Prices.jsx'
import Services from '../components/Services.jsx'
import Footer from '../components/Footer.jsx'
import WhatsAppButton from '../components/WhatsAppButton.jsx'
import CookieConsent from '../components/CookieConsent.jsx'

export default function Home() {
  const [lang, setLang] = useState(() => localStorage.getItem('mo-lang') || 'en')

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
      <BookingForm lang={lang}/>
      <Fleet lang={lang}/>
      <Prices lang={lang}/>
      <Services lang={lang}/>
      <Footer lang={lang}/>
      <WhatsAppButton/>
      <CookieConsent/>
    </>
  )
}