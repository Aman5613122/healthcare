/* eslint-disable no-restricted-globals */
// RAGA.AI Healthcare Platform - Service Worker
// Handles push notifications and background sync

const CACHE_NAME = 'raga-healthcare-v1';
const urlsToCache = ['/', '/index.html', '/static/js/main.chunk.js'];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New healthcare alert',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    tag: data.tag || 'healthcare-notification',
    requireInteraction: data.critical || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'RAGA.AI Alert', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/dashboard';
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        const client = clients.find((c) => c.url.includes(self.location.origin));
        if (client) {
          client.focus();
          client.navigate(urlToOpen);
        } else {
          self.clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Background sync for patient data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-patient-data') {
    event.waitUntil(
      // In production, this would sync offline patient data
      Promise.resolve()
    );
  }
});

// Periodic background sync (for scheduled notifications)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-critical-patients') {
    event.waitUntil(
      // In production, fetch and check critical patient statuses
      Promise.resolve()
    );
  }
});