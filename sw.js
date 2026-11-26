const VERSION = "simba-squad-v2";
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
  "./images/agree.svg",
  "./images/ask.svg",
  "./images/bag-door.svg",
  "./images/bag-red.svg",
  "./images/bag.svg",
  "./images/boots.svg",
  "./images/bridge.svg",
  "./images/call.svg",
  "./images/camp.svg",
  "./images/clock.svg",
  "./images/come.svg",
  "./images/compass.svg",
  "./images/count.svg",
  "./images/design.svg",
  "./images/door.svg",
  "./images/down.svg",
  "./images/fair.svg",
  "./images/flag.svg",
  "./images/flashlight.svg",
  "./images/found.svg",
  "./images/friends.svg",
  "./images/go.svg",
  "./images/hello.svg",
  "./images/help.svg",
  "./images/hill.svg",
  "./images/home.svg",
  "./images/idea.svg",
  "./images/kit.svg",
  "./images/landmark.svg",
  "./images/lantern.svg",
  "./images/left.svg",
  "./images/level.svg",
  "./images/light.svg",
  "./images/listen.svg",
  "./images/look.svg",
  "./images/map-blue.svg",
  "./images/map.svg",
  "./images/meet.svg",
  "./images/name.svg",
  "./images/notebook.svg",
  "./images/path.svg",
  "./images/pencil.svg",
  "./images/pin.svg",
  "./images/plan.svg",
  "./images/practice.svg",
  "./images/question.svg",
  "./images/radio.svg",
  "./images/ready.svg",
  "./images/report.svg",
  "./images/rest.svg",
  "./images/right.svg",
  "./images/roles.svg",
  "./images/room.svg",
  "./images/rules.svg",
  "./images/safe.svg",
  "./images/search.svg",
  "./images/share.svg",
  "./images/sign.svg",
  "./images/speak.svg",
  "./images/star.svg",
  "./images/start.svg",
  "./images/stop.svg",
  "./images/story.svg",
  "./images/sun.svg",
  "./images/table-radio.svg",
  "./images/table.svg",
  "./images/team.svg",
  "./images/thank.svg",
  "./images/turn.svg",
  "./images/up.svg",
  "./images/wait.svg",
  "./images/walk.svg",
  "./images/water.svg",
  "./images/window.svg",
  "./images/yard.svg",
  "./images/year.svg"
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
