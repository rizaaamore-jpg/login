// ============================================
// SERVICE WORKER - SISTEM ABSENSI DIGITAL
// SMK JAKARTA TIMUR 1 - PWA SUPPORT
// ============================================

const CACHE_NAME = 'smk-jaktim1-absensi-v3.0';
const APP_VERSION = '3.0.0';
const CACHE_URLS = [
  // Core files
  './',
  './index.html',
  './style.css',
  './script.js',
  './admin.js',
  './mock-api.js',
  
  // Icons and manifest
  './icon-192x192.png',
  './icon-512x512.png',
  './manifest.json',
  
  // External resources
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  
  // Fallback pages
  './offline.html',
  './404.html'
];

// ================= INSTALL EVENT =================
self.addEventListener('install', (event) => {
  console.log(`📦 Service Worker v${APP_VERSION} installing...`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🗂️ Caching app shell...');
        return cache.addAll(CACHE_URLS)
          .then(() => {
            console.log('✅ App shell cached successfully');
            return self.skipWaiting();
          })
          .catch((error) => {
            console.error('❌ Cache addAll failed:', error);
          });
      })
  );
});

// ================= ACTIVATE EVENT =================
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️ Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      });
    })
  );
});

// ================= FETCH EVENT =================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and Chrome extensions
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle API requests differently
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      networkFirstWithCacheFallback(request)
    );
    return;
  }
  
  // For HTML pages, try network first for fresh content
  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      networkFirstWithCacheFallback(request)
        .catch(() => {
          return caches.match('./offline.html');
        })
    );
    return;
  }
  
  // For CSS, JS, images - Cache first strategy
  event.respondWith(
    cacheFirstWithNetworkFallback(request)
  );
});

// ================= STRATEGIES =================

// Strategy 1: Network first, cache fallback (for dynamic content)
async function networkFirstWithCacheFallback(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Network failed, trying cache...', error);
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache and request is for HTML, return offline page
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match('./offline.html');
    }
    
    throw error;
  }
}

// Strategy 2: Cache first, network fallback (for static assets)
async function cacheFirstWithNetworkFallback(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  // Not in cache, try network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the new response
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('❌ Both cache and network failed:', error);
    
    // Return fallback for images
    if (request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" font-size="8" text-anchor="middle" fill="#666">Image not available</text></svg>',
        {
          headers: { 'Content-Type': 'image/svg+xml' }
        }
      );
    }
    
    throw error;
  }
}

// Update cache in background without blocking
async function updateCacheInBackground(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silently fail - user has cached content anyway
    console.log('Background cache update failed:', error);
  }
}

// ================= BACKGROUND SYNC =================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-presensi') {
    console.log('🔄 Background sync for presensi data');
    event.waitUntil(syncPresensiData());
  }
  
  if (event.tag === 'sync-notifications') {
    console.log('🔄 Background sync for notifications');
    event.waitUntil(syncNotifications());
  }
});

async function syncPresensiData() {
  try {
    // Get pending presensi from IndexedDB or localStorage
    const pendingPresensi = JSON.parse(localStorage.getItem('pendingPresensi') || '[]');
    
    if (pendingPresensi.length > 0) {
      console.log(`📤 Syncing ${pendingPresensi.length} pending presensi...`);
      
      // Here you would send to real server
      // For now, just mark as synced
      pendingPresensi.forEach(presensi => {
        presensi.synced = true;
        presensi.syncedAt = new Date().toISOString();
      });
      
      // Save back to localStorage
      localStorage.setItem('presensiData', JSON.stringify([
        ...JSON.parse(localStorage.getItem('presensiData') || '[]'),
        ...pendingPresensi
      ]));
      
      // Clear pending
      localStorage.removeItem('pendingPresensi');
      
      // Show notification
      self.registration.showNotification('Sinkronisasi Berhasil', {
        body: `${pendingPresensi.length} presensi telah disinkronkan`,
        icon: './icon-192x192.png',
        badge: './icon-192x192.png'
      });
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

async function syncNotifications() {
  try {
    // Sync notifications from server
    // This is a placeholder for real implementation
    console.log('Syncing notifications...');
    
    // Simulate new notification
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotif = {
      id: 'NOT' + Date.now(),
      title: 'Sinkronisasi Selesai',
      message: 'Data telah disinkronkan dengan server',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.unshift(newNotif);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Show notification
    self.registration.showNotification('Notifikasi Baru', {
      body: newNotif.message,
      icon: './icon-192x192.png',
      tag: 'sync-notification'
    });
    
  } catch (error) {
    console.error('Notification sync error:', error);
  }
}

// ================= PUSH NOTIFICATIONS =================
self.addEventListener('push', (event) => {
  console.log('📨 Push notification received:', event);
  
  let data = {
    title: 'Sistem Absensi',
    body: 'Anda memiliki notifikasi baru',
    icon: './icon-192x192.png',
    badge: './icon-192x192.png'
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (error) {
      data.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: data,
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'view',
          title: 'Buka'
        },
        {
          action: 'dismiss',
          title: 'Tutup'
        }
      ]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification.data);
  
  event.notification.close();
  
  const { action } = event;
  
  if (action === 'dismiss') {
    return;
  }
  
  // Default action - open app
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url === self.registration.scope && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if app not open
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// ================= PERIODIC SYNC =================
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-presensi-cache') {
    console.log('🕒 Periodic sync for presensi cache');
    event.waitUntil(updatePresensiCache());
  }
});

async function updatePresensiCache() {
  try {
    // Update today's presensi data
    const today = new Date().toISOString().split('T')[0];
    const presensiResponse = await fetch(`/api/presensi?date=${today}`);
    
    if (presensiResponse.ok) {
      const presensiData = await presensiResponse.json();
      
      // Update cache
      const cache = await caches.open(CACHE_NAME);
      cache.put(`/api/presensi?date=${today}`, new Response(JSON.stringify(presensiData)));
      
      console.log('✅ Presensi cache updated');
    }
  } catch (error) {
    console.log('Periodic sync failed:', error);
  }
}

// ================= OFFLINE DETECTION =================
function isOnline() {
  return self.navigator.onLine;
}

// Listen for online/offline events
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_ONLINE') {
    event.ports[0].postMessage({ isOnline: isOnline() });
  }
});

// ================= CACHE CLEANUP =================
// Clean old presensi cache entries (keep last 7 days)
setInterval(async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const request of requests) {
      if (request.url.includes('/api/presensi?date=')) {
        const match = request.url.match(/date=(\d{4}-\d{2}-\d{2})/);
        if (match) {
          const dateStr = match[1];
          const date = new Date(dateStr);
          
          if (date.getTime() < weekAgo) {
            await cache.delete(request);
            console.log(`🗑️ Deleted old cache: ${request.url}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Cache cleanup error:', error);
  }
}, 24 * 60 * 60 * 1000); // Run daily

// ================= ERROR HANDLING =================
self.addEventListener('error', (error) => {
  console.error('Service Worker error:', error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

// ================= HEALTH CHECK =================
// Simple endpoint to check service worker status
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/sw-health') {
    event.respondWith(
      new Response(JSON.stringify({
        status: 'ok',
        version: APP_VERSION,
        cacheName: CACHE_NAME,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    );
  }
});

console.log(`✅ Service Worker v${APP_VERSION} loaded successfully`);
