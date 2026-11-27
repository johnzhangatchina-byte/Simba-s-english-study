#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const vm = require("vm");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "js", "app.js");
const src = fs.readFileSync(appPath, "utf8");

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

function extractFn(name) {
  const starts = ["  function " + name + "(", "  async function " + name + "("];
  let start = -1;
  for (const p of starts) {
    start = src.indexOf(p);
    if (start !== -1) break;
  }
  if (start === -1) fail("missing function " + name);
  const brace = src.indexOf("{", start);
  let depth = 0;
  for (let i = brace; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  fail("unclosed function " + name);
}

const check = spawnSync(process.execPath, ["--check", appPath], { encoding: "utf8" });
if (check.status !== 0) fail("syntax: " + (check.stderr || check.stdout));

const swCheck = spawnSync(process.execPath, ["--check", path.join(root, "sw.js")], { encoding: "utf8" });
if (swCheck.status !== 0) fail("sw syntax: " + (swCheck.stderr || swCheck.stdout));

// Source invariants
[
  'const STORE = "simba-squad-progress-v1";',
  "function pickMimeType(",
  "function toggleRec(",
  "function recErrorMessage(",
  "function polyfillMediaDevices(",
  "function encodeWav(",
  "function chooseCaptureBlob(",
  "function beginSpeakCapture(",
  "audio/mp4",
  "audio/mp4;codecs=mp4a.40.2",
  "audio/aac",
  "audio/webm;codecs=opus",
  "开始录音",
  "对比听听",
  "复制链接",
  "在 Safari 中打开",
  "在浏览器中打开",
  "mic-timeout",
  "正在打开麦克风",
  "rec.start(200)",
  "requestData",
  "audioWorklet",
  "createScriptProcessor",
  "audio/wav",
].forEach(function (needle) {
  if (src.indexOf(needle) === -1) fail("app.js missing: " + needle);
});
["按住说话", "pointerdown", "pointerleave", "松开结束"].forEach(function (needle) {
  if (src.indexOf(needle) !== -1) fail("app.js still contains old hold-to-talk: " + needle);
});

const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
if (sw.indexOf('const VERSION = "simba-squad-v7";') === -1) fail("sw.js VERSION is not v7");

const curriculum = JSON.parse(fs.readFileSync(path.join(root, "data", "curriculum.json"), "utf8"));
assert.strictEqual(curriculum.cacheVersion, "simba-squad-v7");
assert.strictEqual(curriculum.lessons.length, 364);
assert.strictEqual(curriculum.lessons[0].id, "p1-w01-mon");
assert.strictEqual(curriculum.lessons[363].id, "p4-w52-sun");
const ids = curriculum.lessons.map(function (l) { return l.id; });
assert.strictEqual(ids.length, new Set(ids).size, "duplicate lesson ids");

const css = fs.readFileSync(path.join(root, "css", "app.css"), "utf8");
["recpulse", "level-meter", "rec-msg", ".mic.rec", "inapp-banner", "rec-live", "copy-link"].forEach(function (n) {
  if (css.indexOf(n) === -1) fail("css missing " + n);
});
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (indexHtml.indexOf("mobile-web-app-capable") === -1) fail("index.html missing mobile-web-app-capable");
if (indexHtml.indexOf("favicon.ico") === -1) fail("index.html missing favicon.ico");
if (!fs.existsSync(path.join(root, "favicon.ico"))) fail("favicon.ico file missing");

if (indexHtml.indexOf("css/today.css") === -1) fail("index.html missing css/today.css");
if (indexHtml.indexOf("js/today.js") === -1) fail("index.html missing js/today.js");
if (!fs.existsSync(path.join(root, "css", "today.css"))) fail("css/today.css missing");
if (!fs.existsSync(path.join(root, "js", "today.js"))) fail("js/today.js missing");
const todayJs = fs.readFileSync(path.join(root, "js", "today.js"), "utf8");
["Hello! My name is Simba.", "I am nine years old.", "How are you?", "I'm fine, thank you.", "What is this?", "I like it.", "Goodbye, Simba!", "beginSpeakCapture", "我听完了，开始说", "听我的", "speakCue"].forEach(function (n) {
  if (todayJs.indexOf(n) === -1) fail("today.js missing: " + n);
});
if (sw.indexOf("./css/today.css") === -1 || sw.indexOf("./js/today.js") === -1) fail("sw.js missing today assets");
if (sw.indexOf("./images/today/s1-wave.webp") === -1) fail("sw.js missing today images");
[
  "intro.webp","s1-idle.webp","s1-wave.webp","s2-idle.webp","s2-proud.webp",
  "s3-idle.webp","s3-greet.webp","s4-idle.webp","s4-ok.webp","s5-idle.webp",
  "s5-point.webp","s6-idle.webp","s6-like.webp","s7-idle.webp","s7-bye.webp"
].forEach(function (name) {
  if (!fs.existsSync(path.join(root, "images", "today", name))) fail("missing today image " + name);
});

if (indexHtml.indexOf("css/game.css") === -1) fail("index.html missing css/game.css");
if (indexHtml.indexOf("js/game.js") === -1) fail("index.html missing js/game.js");
if (!fs.existsSync(path.join(root, "css", "game.css"))) fail("css/game.css missing");
if (!fs.existsSync(path.join(root, "js", "game.js"))) fail("js/game.js missing");
const gameJs = fs.readFileSync(path.join(root, "js", "game.js"), "utf8");
["My name is Simba.", "I'm ready.", "We are a team.", "This is my friend.", "How are you?", "beginSpeakCapture", "我听完了，开始说", "听我的", "对比听听", "audio/p1-w01-tue-0-my-name-is-simba.mp3"].forEach(function (n) {
  if (gameJs.indexOf(n) === -1) fail("game.js missing: " + n);
});
if (gameJs.indexOf("威龙") !== -1) fail("game.js must not use official operator names");
if (sw.indexOf("./css/game.css") === -1 || sw.indexOf("./js/game.js") === -1) fail("sw.js missing game assets");
if (sw.indexOf("./images/game/camp-map.webp") === -1) fail("sw.js missing game images");
[
  "camp-map.webp","simba-idle.webp","simba-talk.webp","simba-wave.webp","simba-point.webp",
  "simba-pointout.webp","simba-ready.webp","simba-thumbs.webp",
  "simba-walk-1.webp","simba-walk-2.webp","simba-walk-3.webp","simba-walk-4.webp",
  "nilo-idle.webp","nilo-talk.webp","reed-idle.webp","reed-thumbs.webp"
].forEach(function (name) {
  if (!fs.existsSync(path.join(root, "images", "game", name))) fail("missing game image " + name);
});

function makeSandbox(opts) {
  opts = opts || {};
  const supported = opts.supported || [];
  const navigator = {
    userAgent: opts.ua || "",
    platform: opts.platform || "Win32",
    maxTouchPoints: opts.maxTouchPoints || 0,
    mediaDevices: opts.noMedia ? undefined : { getUserMedia: function () {} },
  };
  const sandbox = {
    navigator: navigator,
    window: {
      isSecureContext: opts.secure !== false,
      MediaRecorder: opts.noRecorder ? undefined : {
        isTypeSupported: function (t) { return supported.indexOf(t) !== -1; },
      },
      AudioContext: opts.noAudio ? undefined : function () {},
      webkitAudioContext: opts.noAudio ? undefined : function () {},
    },
    location: { protocol: opts.protocol || "https:" },
    MediaRecorder: opts.noRecorder ? undefined : {
      isTypeSupported: function (t) { return supported.indexOf(t) !== -1; },
    },
  };
  sandbox.window.navigator = navigator;
  sandbox.console = console;
  sandbox.Blob = Blob;
  sandbox.ArrayBuffer = ArrayBuffer;
  sandbox.DataView = DataView;
  sandbox.Uint8Array = Uint8Array;
  sandbox.Float32Array = Float32Array;
  sandbox.Math = Math;
  const fns = [
    "isFile", "insecure", "ua", "isWeChat", "isInAppBrowser", "isAppleWebKit",
    "isAppleDevice", "pickMimeType", "normalizeBlobType", "recSupportError", "recErrorMessage",
    "polyfillMediaDevices", "encodeWav", "chooseCaptureBlob",
  ].map(extractFn).join("\n");
  // insecure and isFile exist in source and are used by recSupportError
  vm.runInNewContext(fns, sandbox, { filename: "app.js-extract" });
  return sandbox;
}

// iOS Safari often claims webm is supported but mp4 is the reliable type
const ios = makeSandbox({
  ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  platform: "iPhone",
  supported: ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mp4;codecs=mp4a.40.2", "audio/aac"],
});
assert.strictEqual(ios.isAppleWebKit(), true);
assert.strictEqual(ios.pickMimeType(), "audio/mp4");

// iPadOS reports as MacIntel
const ipad = makeSandbox({
  ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  platform: "MacIntel",
  maxTouchPoints: 5,
  supported: ["audio/webm", "audio/mp4"],
});
assert.strictEqual(ipad.isAppleWebKit(), true);
assert.strictEqual(ipad.pickMimeType(), "audio/mp4");

// Android Chrome prefers webm/opus
const chrome = makeSandbox({
  ua: "Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  supported: ["audio/webm;codecs=opus", "audio/webm", "audio/ogg"],
});
assert.strictEqual(chrome.isAppleWebKit(), false);
assert.strictEqual(chrome.pickMimeType(), "audio/webm;codecs=opus");

// Safari desktop (no webm)
const safari = makeSandbox({
  ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  platform: "MacIntel",
  supported: ["audio/mp4", "audio/mp4;codecs=mp4a.40.2", "audio/aac"],
});
assert.strictEqual(safari.pickMimeType(), "audio/mp4");

// No supported types
const none = makeSandbox({
  ua: "Mozilla/5.0 (Linux; Android 13) Chrome/120.0.0.0",
  supported: [],
});
assert.strictEqual(none.pickMimeType(), "");

// Blob type normalization
assert.strictEqual(ios.normalizeBlobType("audio/mp4;codecs=mp4a.40.2"), "audio/mp4");
assert.strictEqual(ios.normalizeBlobType("", { type: "audio/mp4" }), "audio/mp4");
assert.strictEqual(chrome.normalizeBlobType("audio/webm;codecs=opus"), "audio/webm");
assert.strictEqual(ios.normalizeBlobType(""), "audio/mp4");
assert.strictEqual(chrome.normalizeBlobType(""), "audio/webm");

// Error messages
const denied = ios.recErrorMessage({ name: "NotAllowedError", message: "" });
assert(denied.indexOf("允许") !== -1 && denied.indexOf("麦克风") !== -1, denied);

const wechat = makeSandbox({
  ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 MicroMessenger/8.0.0",
  platform: "iPhone",
  supported: ["audio/mp4"],
});
assert.strictEqual(wechat.isWeChat(), true);
const wechatMsg = wechat.recErrorMessage({ name: "NotAllowedError", message: "" });
assert(wechatMsg.indexOf("微信") !== -1, wechatMsg);
assert(wechatMsg.indexOf("Safari") !== -1, wechatMsg);

const insecure = makeSandbox({ protocol: "file:", secure: false, ua: "Mozilla/5.0 Chrome/120" });
assert.strictEqual(insecure.isFile(), true);
assert.strictEqual(insecure.recSupportError(), "insecure");
const insecureMsg = insecure.recErrorMessage(new Error("insecure"));
assert(insecureMsg.indexOf("https") !== -1, insecureMsg);

const noRec = makeSandbox({ ua: "Mozilla/5.0 Chrome/120", noRecorder: true, noAudio: true });
assert.strictEqual(noRec.recSupportError(), "no-recorder");
const noRecMsg = noRec.recErrorMessage(new Error("no-recorder"));
assert(noRecMsg.indexOf("不能录音") !== -1, noRecMsg);

const wavOnly = makeSandbox({ ua: "Mozilla/5.0 Chrome/120", noRecorder: true });
assert.strictEqual(wavOnly.recSupportError(), "", "WAV fallback should satisfy support when AudioContext exists");

const timeoutMsg = chrome.recErrorMessage({ name: "MicTimeoutError", message: "mic-timeout" });
assert(timeoutMsg.indexOf("允许") !== -1 && timeoutMsg.indexOf("麦克风") !== -1, timeoutMsg);

const notFound = chrome.recErrorMessage({ name: "NotFoundError", message: "" });
assert(notFound.indexOf("没有找到麦克风") !== -1, notFound);

const busy = chrome.recErrorMessage({ name: "NotReadableError", message: "" });
assert(busy.indexOf("占用") !== -1, busy);

// Simulated MediaRecorder: start(timeslice) throws, fallback start() works
function FakeRecorder(stream, opts) {
  this.mimeType = (opts && opts.mimeType) || "audio/mp4";
  this.state = "inactive";
  this._chunks = [];
  this.ondataavailable = null;
  this.onstart = null;
  this.onstop = null;
  this.onerror = null;
}
FakeRecorder.prototype.start = function (timeslice) {
  if (timeslice) throw new Error("timeslice not supported");
  this.state = "recording";
  const self = this;
  setTimeout(function () { if (self.onstart) self.onstart(); }, 0);
};
FakeRecorder.prototype.requestData = function () {
  if (this.ondataavailable) this.ondataavailable({ data: new Blob([new Uint8Array(200)], { type: this.mimeType }) });
};
FakeRecorder.prototype.stop = function () {
  const self = this;
  this.state = "inactive";
  setTimeout(function () { if (self.onstop) self.onstop(); }, 0);
};

(async function () {
  const rec = new FakeRecorder(null, { mimeType: "audio/mp4" });
  let started = false;
  try {
    rec.start(200);
  } catch (e) {
    rec.start();
  }
  await new Promise(function (resolve) {
    rec.onstart = function () { started = true; resolve(); };
    setTimeout(resolve, 50);
  });
  assert(started, "fallback start() should fire onstart");
  const chunks = [];
  rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
  rec.requestData();
  const blob = await new Promise(function (resolve) {
    rec.onstop = function () {
      const type = "audio/mp4";
      resolve(chunks.length ? new Blob(chunks, { type: type }) : null);
    };
    rec.stop();
  });
  assert(blob && blob.size >= 80, "saved blob should be large enough to keep");
  assert.strictEqual(blob.type, "audio/mp4");

  // short/empty MediaRecorder take can be rescued by a WAV fallback
  const tiny = new Blob([new Uint8Array(10)], { type: "audio/mp4" });
  assert(tiny.size < 80, "tiny blob should be below keep threshold");

  const sandbox = makeSandbox({ ua: "Mozilla/5.0 Chrome/120", supported: ["audio/webm"] });
  const tone = [new Float32Array(800)];
  for (let i = 0; i < tone[0].length; i++) tone[0][i] = Math.sin(i / 8) * 0.4;
  const wav = sandbox.encodeWav(tone, 16000);
  assert(wav && wav.type === "audio/wav", "encodeWav should return audio/wav");
  assert(wav.size === 44 + 800 * 2, "encodeWav size should be header plus 16-bit samples");
  const bytes = new Uint8Array(await wav.arrayBuffer());
  const ascii = String.fromCharCode.apply(null, bytes.slice(0, 12));
  assert.strictEqual(ascii.slice(0, 4), "RIFF");
  assert.strictEqual(ascii.slice(8, 12), "WAVE");

  const empty = new Blob([], { type: "audio/mp4" });
  const chosenWav = sandbox.chooseCaptureBlob(tiny, wav, { peak: 0.2, elapsed: 900, spoke: true });
  assert.strictEqual(chosenWav, wav, "prefer playable WAV over tiny MediaRecorder blob");
  const goodMr = new Blob([new Uint8Array(400)], { type: "audio/webm" });
  const chosenMr = sandbox.chooseCaptureBlob(goodMr, wav, { peak: 0.2, elapsed: 900, spoke: true });
  assert.strictEqual(chosenMr, goodMr, "prefer a solid MediaRecorder blob when it is large enough");
  const bothFail = sandbox.chooseCaptureBlob(empty, null, { peak: 0, elapsed: 200, spoke: false });
  assert.strictEqual(bothFail, null, "both empty should yield null so the previous take is kept");
  const shortButSpoke = sandbox.chooseCaptureBlob(tiny, wav, { peak: 0.2, elapsed: 280, spoke: true });
  assert.strictEqual(shortButSpoke, wav, "keep a short take if the child clearly spoke");

  // polyfill getUserMedia from webkitGetUserMedia
  const legacyCalls = [];
  const legacyNav = {
    webkitGetUserMedia: function (constraints, ok, fail) {
      legacyCalls.push(constraints);
      ok("stream-ok");
    }
  };
  const poly = { navigator: legacyNav, window: { navigator: legacyNav }, Promise: Promise };
  const polySrc = extractFn("polyfillMediaDevices") + "\npolyfillMediaDevices();";
  vm.runInNewContext(polySrc, poly, { filename: "polyfill-test" });
  assert(typeof poly.navigator.mediaDevices.getUserMedia === "function", "polyfill should install getUserMedia");
  const stream = await poly.navigator.mediaDevices.getUserMedia({ audio: true });
  assert.strictEqual(stream, "stream-ok");
  assert.strictEqual(legacyCalls.length, 1);

  // already-present getUserMedia must be left alone
  const existing = function () { return Promise.resolve("keep-me"); };
  const keepNav = { mediaDevices: { getUserMedia: existing }, webkitGetUserMedia: function () {} };
  const keep = { navigator: keepNav, window: { navigator: keepNav }, Promise: Promise };
  vm.runInNewContext(polySrc, keep, { filename: "polyfill-keep" });
  assert.strictEqual(keep.navigator.mediaDevices.getUserMedia, existing);

  console.log("smoke_recorder: all checks passed");
})().catch(function (err) {
  console.error(err);
  process.exit(1);
});
