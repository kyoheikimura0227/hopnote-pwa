/* Service Worker (sw.js) - オフライン対応 ＆ プリキャッシュ */
const CACHE_NAME = 'hopnote-pwa-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  'https://cdn.tailwindcss.com' // Tailwind CSS CDNもキャッシュしてオフライン動作を維持
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] アセットをキャッシュ中...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// アクティベート時に古いキャッシュを破棄
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] 旧キャッシュ削除中:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// キャッシュファースト / ネットワークフォールバック戦略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          // 外部Tailwindなどの動的取得も、安全のためにキャッシュに追加
          if (event.request.url.startsWith('http') && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      }).catch(() => {
        // オフライン時のHTMLフォールバック
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});