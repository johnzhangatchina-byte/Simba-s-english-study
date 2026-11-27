const VERSION = "simba-squad-v6";
const PRECACHE = [
  "./",
  "./index.html",
  "./favicon.ico",
  "./css/app.css",
  "./css/today.css",
  "./js/app.js",
  "./js/today.js",
  "./data/curriculum.json",
  "./images/today/intro.webp",
  "./images/today/s1-idle.webp",
  "./images/today/s1-wave.webp",
  "./images/today/s2-idle.webp",
  "./images/today/s2-proud.webp",
  "./images/today/s3-idle.webp",
  "./images/today/s3-greet.webp",
  "./images/today/s4-idle.webp",
  "./images/today/s4-ok.webp",
  "./images/today/s5-idle.webp",
  "./images/today/s5-point.webp",
  "./images/today/s6-idle.webp",
  "./images/today/s6-like.webp",
  "./images/today/s7-idle.webp",
  "./images/today/s7-bye.webp",
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
  "./images/agree.webp",
  "./images/ask.webp",
  "./images/bag-door.webp",
  "./images/bag-red.webp",
  "./images/bag.webp",
  "./images/boots.webp",
  "./images/bridge.webp",
  "./images/call.webp",
  "./images/camp.webp",
  "./images/clock.webp",
  "./images/come.webp",
  "./images/compass.webp",
  "./images/count.webp",
  "./images/design.webp",
  "./images/door.webp",
  "./images/down.webp",
  "./images/fair.webp",
  "./images/flag.webp",
  "./images/flashlight.webp",
  "./images/found.webp",
  "./images/friends.webp",
  "./images/go.webp",
  "./images/hello.webp",
  "./images/help.webp",
  "./images/hill.webp",
  "./images/home.webp",
  "./images/idea.webp",
  "./images/kit.webp",
  "./images/landmark.webp",
  "./images/lantern.webp",
  "./images/left.webp",
  "./images/level.webp",
  "./images/light.webp",
  "./images/listen.webp",
  "./images/look.webp",
  "./images/map-blue.webp",
  "./images/map.webp",
  "./images/meet.webp",
  "./images/name.webp",
  "./images/notebook.webp",
  "./images/path.webp",
  "./images/pencil.webp",
  "./images/pin.webp",
  "./images/plan.webp",
  "./images/practice.webp",
  "./images/question.webp",
  "./images/radio.webp",
  "./images/ready.webp",
  "./images/report.webp",
  "./images/rest.webp",
  "./images/right.webp",
  "./images/roles.webp",
  "./images/room.webp",
  "./images/rules.webp",
  "./images/safe.webp",
  "./images/search.webp",
  "./images/share.webp",
  "./images/sign.webp",
  "./images/speak.webp",
  "./images/star.webp",
  "./images/start.webp",
  "./images/stop.webp",
  "./images/story.webp",
  "./images/sun.webp",
  "./images/table-radio.webp",
  "./images/table.webp",
  "./images/team.webp",
  "./images/thank.webp",
  "./images/turn.webp",
  "./images/up.webp",
  "./images/wait.webp",
  "./images/walk.webp",
  "./images/water.webp",
  "./images/window.webp",
  "./images/yard.webp",
  "./images/year.webp"
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
