/* Hexagon offline */
const CACHE = "mads-hexagon-v3";
const FILES = [
  "404.html",
  "assets/GLTFLoader-CkUDLmR8.js",
  "assets/StudioCanvas-D6qV8owW.js",
  "assets/index-B4sxJC2t.js",
  "assets/index-DTHpodY1.css",
  "assets/three-vrm.module-CNnGxn9E.js",
  "assets/three.core-DtjtRha-.js",
  "brand/floor-marble.jpg",
  "brand/hoodie-logo.jpg",
  "brand/mads-logo.jpg",
  "brand/mads-logo.svg",
  "brand/studio-floor.jpg",
  "brand/studio-steel.jpg",
  "brand/studio-wall.jpg",
  "favicon.svg",
  "icon-192.png",
  "icon-512.png",
  "index.html",
  "manifest.webmanifest",
  "models/female.vrm",
  "og.jpg",
  "samples/color-field.jpg",
  "samples/night-harbor.jpg",
  "samples/portrait-gaze.jpg",
  "samples/still-life.jpg",
  "sw.js",
  "textures/fleece.jpg",
  "textures/floor.jpg",
  "textures/head.jpg",
  "textures/hoodie.jpg",
  "textures/wall.jpg",
  "x-banner.jpg"
];

const SCOPE = self.registration.scope;

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.allSettled(FILES.map((f) => cache.add(new URL(f, SCOPE))));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    if (url.hostname.includes("fonts.g") || url.hostname.includes("gstatic")) {
      event.respondWith(cacheFirst(req));
    }
    return;
  }
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
    return;
  }
  event.respondWith(cacheFirst(req));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request, { ignoreSearch: true });
  if (hit) return hit;
  const fresh = await fetch(request);
  if (fresh.ok) cache.put(request, fresh.clone());
  return fresh;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch {
    const hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    return (await cache.match(new URL("index.html", SCOPE))) || Response.error();
  }
}
