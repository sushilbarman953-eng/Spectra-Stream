const STATIC_CACHE = "spectra-static-v2";

const PRECACHE_ASSETS = [
  "/",
  "/downloads",
  "/me",
  "/manifest.json",
  "/icons/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Do NOT intercept or synthesize 408s for TMDB or external images. Let native network handle them directly.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    request.destination === "image" ||
    url.hostname.includes("tmdb.org") ||
    url.hostname.includes("unsplash.com") ||
    url.hostname.includes("myanimelist.net") ||
    url.origin.includes("vidlink") ||
    url.origin.includes("vidsrc")
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        return cached || caches.match("/");
      })
    );
  }
});
