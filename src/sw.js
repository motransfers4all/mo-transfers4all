import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Injected at build time by vite-plugin-pwa (injectManifest strategy)
precacheAndRoute(self.__WB_MANIFEST)

// Keep the same Supabase runtime caching behavior as before
registerRoute(
  ({ url }) => url.hostname.endsWith('.supabase.co'),
  new NetworkFirst({
    cacheName: 'supabase-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 300 })
    ]
  })
)

// --- Push notifications ---
// Fires even when the PWA is fully closed, as long as the OS has the
// service worker registered (Android Chrome + iOS 16.4+ home-screen PWAs).
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = { title: 'New Booking', body: event.data ? event.data.text() : '' }
  }

  const title = data.title || 'New Booking — MO Transfers4all'
  const options = {
    body: data.body || 'A new booking has arrived.',
    icon: '/logo.jpg',
    badge: '/favicon-32.png',
    data: { url: data.url || '/admin' },
    tag: data.tag || 'booking',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200]
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Clicking the notification focuses an open admin tab, or opens a new one.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/admin'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
})
