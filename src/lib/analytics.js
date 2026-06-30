// Thin wrapper around gtag so call sites don't need to guard against
// window.gtag being unavailable (e.g. consent denied, ad-blocker, SSR).
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
