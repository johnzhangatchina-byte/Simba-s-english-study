const VERSION = "simba-squad-v1";
const PRECACHE = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/app.js",
  "./data/curriculum.json",
  "./manifest.webmanifest",
  "./audio/p1-w01-fri-0-hello.mp3",
  "./audio/p1-w01-fri-1-nice-to-meet-you.mp3",
  "./audio/p1-w01-fri-2-let-s-go-together.mp3",
  "./audio/p1-w01-mon-0-hello.mp3",
  "./audio/p1-w01-mon-1-my-name-is-simba.mp3",
  "./audio/p1-w01-mon-2-i-m-ready.mp3",
  "./audio/p1-w01-sat-0-hello-team.mp3",
  "./audio/p1-w01-sat-1-i-m-ready.mp3",
  "./audio/p1-w01-sat-2-let-s-go-together.mp3",
  "./audio/p1-w01-sun-0-hello.mp3",
  "./audio/p1-w01-sun-1-i-m-ready.mp3",
  "./audio/p1-w01-sun-2-let-s-go-together.mp3",
  "./audio/p1-w01-thu-0-we-are-a-team.mp3",
  "./audio/p1-w01-thu-1-nice-to-meet-you.mp3",
  "./audio/p1-w01-thu-2-let-s-go-together.mp3",
  "./audio/p1-w01-tue-0-my-name-is-simba.mp3",
  "./audio/p1-w01-tue-1-i-m-ready.mp3",
  "./audio/p1-w01-tue-2-we-are-a-team.mp3",
  "./audio/p1-w01-wed-0-i-m-ready.mp3",
  "./audio/p1-w01-wed-1-we-are-a-team.mp3",
  "./audio/p1-w01-wed-2-nice-to-meet-you.mp3",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) { return cache.addAll(PRECACHE); }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (!res || res.status !== 200 || res.type === "opaque") return res;
        const copy = res.clone();
        caches.open(VERSION).then(function (cache) { cache.put(req, copy); });
        return res;
      }).catch(function () {
        if (req.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 503, statusText: "Offline" });
      });
    })
  );
});
