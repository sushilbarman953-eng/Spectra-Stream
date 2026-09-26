const STATIC_CACHE = "spectra-static-v1";
const DYNAMIC_CACHE = "spectra-dynamic-v1";
const IMAGE_CACHE = "spectra-images-v1";

const PRECACHE_ASSETS = [
  "/",
  "/downloads",
  "/me",
  "/manifest.json",
  "/icons/icon.svg"
];

// Install: Cache essential shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Purge obsolete caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Strategy dispatcher
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass non-GET requests and external embeds
  if (request.method !== "GET" || url.origin.includes("vidlink") || url.origin.includes("vidsrc")) {
    return;
  }

  // 1. TMDB and external images: Cache-first with dynamic fallback
  if (request.destination === "image" || url.hostname.includes("image.tmdb.org")) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const networkRes = await fetch(request);
          if (networkRes.status === 200) {
            cache.put(request, networkRes.clone());
          }
          return networkRes;
        } catch {
          return new Response("", { status: 408, statusText: "Offline Image Unavailable" });
        }
      })
    );
    return;
  }

  // 2. Navigation routes: Network-first falling back to cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          const resClone = networkRes.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, resClone));
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match("/downloads");
        })
    );
    return;
  }

  // 3. Static scripts & CSS: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkRes) => {
          if (networkRes.status === 200) {
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, networkRes.clone()));
          }
          return networkRes;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
