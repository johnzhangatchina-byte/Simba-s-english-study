(function () {
  "use strict";

  const STORE = "simba-squad-progress-v1";
  const $app = document.getElementById("app");
  const PLACE_ORDER = [
    ["door", "yard", "window"],
    ["left", "start", "right"],
    ["bag", "table", "radio"],
  ];
  const PLACE_ZH = {
    start: "起点", left: "左边", right: "右边", yard: "院子",
    door: "门", window: "窗户", bag: "背包", table: "桌子",
    radio: "对讲机", team: "小队",
  };
  const STICKER_ICON = {
    radio: "📡", team: "🤝", boot: "🥾", map: "🗺️", door: "🚪", bag: "🎒",
    eye: "👀", help: "🆘", star: "⭐", ear: "👂", walk: "🚶", talk: "🎙️",
    badge: "🏅", scout: "🔭", call: "📢", kit: "🧰", find: "🔍", path: "🛤️",
    pin: "📍", plan: "📋", search: "🧭", light: "🔦", rest: "☕", hero: "🛡️",
    draw: "✏️", check: "✅", brief: "📜", why: "❓", ifthen: "↪️", route: "↔️",
    ask: "💬", room: "🏠", verb: "▶️", design: "🧩", level: "🎯", share: "🤲",
    past: "⏳", story: "📖", five: "5️⃣", dialog: "💭", polite: "🙏",
    mymap: "🗾", rule: "📏", guide: "👉", summary: "📝", change: "🔄",
    intro: "🙋", show: "🎬", again: "🔁", together: "🤗", year: "📅", grad: "🎓",
  };

  let data = null;
  let state = {
    view: "home",
    lesson: null,
    phraseIndex: 0,
    revealZh: false,
    recordings: {},
    lastBlob: null,
    scoreBand: 0,
    taskStep: 0,
    taskFeedback: null,
    parentAuthed: false,
    practice: false,
    banner: "",
    recOn: false,
    recMsg: "",
    recMsgKind: "",
    tipLesson: null,
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }


  function imgBox(src, cls, alt) {
    if (!src) return "";
    return '<div class="' + cls + '"><img src="' + esc(src) + '" alt="' + esc(alt || "") + '" onerror="this.parentNode.style.display=\'none\'"></div>';
  }

  function placeImage(id) {
    if (data && data.places) {
      const pl = data.places.find(function (x) { return x.id === id; });
      if (pl && pl.image) return pl.image;
    }
    return "images/" + id + ".webp";
  }

  function unlockedTips() {
    const p = loadProgress();
    return data.lessons.filter(function (l) { return p.completed[l.id] && l.tip; });
  }

  function tipCard(tip, opts) {
    opts = opts || {};
    let html = "";
    if (tip.titleZh) html += '<p class="tip-title">' + esc(tip.titleZh) + "</p>";
    html += imgBox(tip.image, "tip-art", tip.titleZh || tip.en || "游戏小贴士");
    html += '<div class="bilingual">';
    html += '<p class="en">' + esc(tip.en) + "</p>";
    html += '<p class="zh">' + esc(tip.zh) + "</p></div>";
    html += '<div class="row">';
    html += '<button class="secondary" data-act="play-tip-en">听英语</button>';
    html += '<button class="secondary" data-act="play-tip-zh">听中文</button></div>';
    return html;
  }

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "null") || defaultProgress();
    } catch (e) {
      return defaultProgress();
    }
  }
  function defaultProgress() {
    return { startDate: todayISO(), completed: {}, pin: "", name: "Simba" };
  }
  function saveProgress(p) {
    localStorage.setItem(STORE, JSON.stringify(p));
  }
  function todayISO() {
    const d = new Date();
    const z = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  }

  function nextLesson() {
    const p = loadProgress();
    return data.lessons.find(function (l) { return !p.completed[l.id]; }) || null;
  }
  function completedCount() {
    return Object.keys(loadProgress().completed).length;
  }

  function insecure() {
    return !window.isSecureContext;
  }
  function isFile() {
    return location.protocol === "file:";
  }
  function ua() {
    return navigator.userAgent || "";
  }
  function isWeChat() {
    return /MicroMessenger/i.test(ua());
  }
  function isInAppBrowser() {
    return /MicroMessenger|QQ\/|Weibo|DingTalk|AlipayClient|UCBrowser/i.test(ua());
  }
  function isAppleWebKit() {
    const s = ua();
    if (/iPad|iPhone|iPod/.test(s)) return true;
    if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
    if (/Safari/i.test(s) && !/Chrome|Chromium|Edg|Firefox|Android/i.test(s)) return true;
    return false;
  }

  function isAppleDevice() {
    return isAppleWebKit() || /iPad|iPhone|iPod/i.test(ua());
  }

  async function playFile(src) {
    return new Promise(function (resolve, reject) {
      const a = new Audio(src);
      a.onended = function () { resolve(true); };
      a.onerror = function () { reject(new Error("no file")); };
      a.play().catch(reject);
    });
  }
  function speak(text, lang, rate) {
    return new Promise(function (resolve) {
      if (!window.speechSynthesis) { resolve(false); return; }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang || "en-US";
      u.rate = rate || 0.9;
      u.onend = function () { resolve(true); };
      u.onerror = function () { resolve(false); };
      window.speechSynthesis.speak(u);
    });
  }
  async function playModel(phrase, slow) {
    if (phrase && phrase.audio) {
      try {
        if (slow) {
          const a = new Audio(phrase.audio);
          a.playbackRate = 0.8;
          await new Promise(function (resolve, reject) {
            a.onended = resolve;
            a.onerror = reject;
            a.play().catch(reject);
          });
          return "file";
        }
        await playFile(phrase.audio);
        return "file";
      } catch (e) { /* fallback */ }
    }
    const text = phrase && phrase.en ? phrase.en : String(phrase || "");
    await speak(text, "en-US", slow ? 0.7 : 0.92);
    return "tts";
  }
  async function sayZh(text) {
    await speak(text, "zh-CN", 0.95);
  }

  function polyfillMediaDevices() {
    if (typeof navigator === "undefined") return;
    try {
      if (!navigator.mediaDevices) navigator.mediaDevices = {};
      if (typeof navigator.mediaDevices.getUserMedia === "function") return;
      const legacy = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      if (!legacy) return;
      navigator.mediaDevices.getUserMedia = function (constraints) {
        return new Promise(function (resolve, reject) {
          legacy.call(navigator, constraints, resolve, reject);
        });
      };
    } catch (e) { /* some WebViews freeze if mediaDevices is sealed */ }
  }
  polyfillMediaDevices();

  let mediaStream = null;
  let recorder = null;
  let chunks = [];
  let recMime = "";
  let recStartAt = 0;
  let recStarting = false;
  let recToken = 0;
  let recTimer = null;
  let recAnalyser = null;
  let recAudioCtx = null;
  let recMeterRaf = 0;
  let recHintTimer = 0;
  let pcmChunks = [];
  let pcmPeak = 0;
  let pcmSampleRate = 44100;
  let pcmActive = false;
  let pcmSource = null;
  let pcmNode = null;
  let pcmMute = null;
  let meterPeak = 0;

  const MIC_PERMISSION_MS = 20000;
  const PCM_WORKLET_SRC = [
    "class PcmCaptureProcessor extends AudioWorkletProcessor {",
    "  process(inputs) {",
    "    const ch = inputs[0] && inputs[0][0];",
    "    if (ch && ch.length) {",
    "      const copy = new Float32Array(ch.length);",
    "      copy.set(ch);",
    "      this.port.postMessage(copy, [copy.buffer]);",
    "    }",
    "    return true;",
    "  }",
    "}",
    "registerProcessor('pcm-capture', PcmCaptureProcessor);"
  ].join("\n");

  function unlockAudio() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
      if (!recAudioCtx || recAudioCtx.state === "closed") recAudioCtx = new Ctx();
      if (recAudioCtx.state === "suspended") recAudioCtx.resume().catch(function () {});
      return recAudioCtx;
    } catch (e) {
      return null;
    }
  }

  function withTimeout(promise, ms, code) {
    return new Promise(function (resolve, reject) {
      let settled = false;
      const timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        const err = new Error(code || "timeout");
        err.name = "MicTimeoutError";
        reject(err);
      }, ms);
      promise.then(function (value) {
        if (settled) {
          if (value && typeof value.getTracks === "function") {
            try { value.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
          }
          return;
        }
        settled = true;
        clearTimeout(timer);
        resolve(value);
      }, function (err) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  function pickMimeType() {
    if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") {
      return "";
    }
    const appleFirst = [
      "audio/mp4",
      "audio/mp4;codecs=mp4a.40.2",
      "audio/aac",
      "audio/mpeg"
    ];
    const othersFirst = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg"
    ];
    const list = isAppleWebKit()
      ? appleFirst.concat(othersFirst)
      : othersFirst.concat(appleFirst);
    for (let i = 0; i < list.length; i++) {
      try {
        if (MediaRecorder.isTypeSupported(list[i])) return list[i];
      } catch (e) { /* try next */ }
    }
    return "";
  }

  function normalizeBlobType(type, fallbackChunk) {
    const raw = type || (fallbackChunk && fallbackChunk.type) || "";
    if (/mp4/i.test(raw) || /aac/i.test(raw) || /mpeg/i.test(raw)) return "audio/mp4";
    if (/webm/i.test(raw)) return "audio/webm";
    if (/ogg/i.test(raw)) return "audio/ogg";
    if (/wav/i.test(raw)) return "audio/wav";
    if (raw) return raw.split(";")[0];
    return isAppleWebKit() ? "audio/mp4" : "audio/webm";
  }

  function recSupportError() {
    polyfillMediaDevices();
    if (isFile() || !window.isSecureContext) return "insecure";
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") return "no-mic-api";
    const canWav = !!(window.AudioContext || window.webkitAudioContext);
    if (typeof MediaRecorder === "undefined" && !canWav) return "no-recorder";
    return "";
  }

  function recErrorMessage(err) {
    const name = (err && err.name) || "";
    const msg = (err && err.message) || String(err || "");
    const inApp = isInAppBrowser();
    const inAppHint = inApp
      ? (isWeChat()
        ? "如果是在微信里打开的，请点右上角「···」，选择「在 Safari 中打开」或「在浏览器中打开」，再试一次。"
        : "请用手机自带的 Safari（苹果）或 Chrome（安卓）打开本课，不要停在微信或其他 App 的内置窗口里。")
      : "";
    if (msg === "insecure" || name === "SecurityError" || (msg === "no-mic-api" && (isFile() || insecure()))) {
      return "这一页不是安全的打开方式，浏览器不允许使用麦克风。请用手机浏览器打开本课的 https 网址。电脑上请运行文件夹里的启动脚本，再用浏览器打开 http://localhost:8080。不要直接打开网页文件。";
    }
    if (name === "MicTimeoutError" || msg === "mic-timeout") {
      return "等了比较久，还没有开始录音。如果屏幕上出现了「允许麦克风」，请点「允许」。如果没有出现，或以前点过「不允许」，请点地址栏左边的锁图标或「AA」按钮，把本网站的麦克风改成「允许」，然后刷新页面，再点「开始录音」。苹果手机也可以到「设置 → Safari → 麦克风」里打开。 " + inAppHint;
    }
    if (msg === "no-mic-api" || msg === "no-recorder" || name === "NotSupportedError") {
      return "这台浏览器还不能录音。" + (inApp
        ? inAppHint
        : "苹果手机和平板请用 Safari，安卓请用 Chrome，打开本课再试。");
    }
    if (name === "NotAllowedError" || name === "PermissionDeniedError" || /permission/i.test(msg)) {
      return "还没有允许本页使用麦克风，所以没能录音。请家长帮忙：如果刚刚弹出过「允许麦克风」，请点允许。如果以前点过不允许，请点地址栏左边的锁图标或「AA」按钮，把本网站的麦克风改成「允许」，然后刷新页面。苹果手机也可以到「设置 → Safari → 麦克风」里打开。 " + inAppHint;
    }
    if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      return "没有找到麦克风。请检查手机或平板的麦克风是否可用，或者换一台设备再试。";
    }
    if (name === "NotReadableError" || name === "TrackStartError") {
      return "麦克风好像被别的应用占用了。请关掉正在录音的其他应用，再回到这一页试试。";
    }
    if (name === "OverconstrainedError") {
      return "这台设备的麦克风暂时没法启动。请再试一次，或换用 Safari（苹果）或 Chrome（安卓）。";
    }
    if (name === "AbortError") {
      return "录音被中断了。请再点一次「开始录音」。";
    }
    return "录音没能开始。" + (inAppHint || "请再试一次。如果还不行，请用 Safari（苹果）或 Chrome（安卓）打开本课。");
  }

  function encodeWav(chunks, sampleRate) {
    let total = 0;
    for (let i = 0; i < chunks.length; i++) total += chunks[i].length;
    const rate = sampleRate || 44100;
    const buffer = new ArrayBuffer(44 + total * 2);
    const view = new DataView(buffer);
    function writeStr(offset, s) {
      for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
    }
    writeStr(0, "RIFF");
    view.setUint32(4, 36 + total * 2, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, rate, true);
    view.setUint32(28, rate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
    view.setUint32(40, total * 2, true);
    let idx = 44;
    for (let c = 0; c < chunks.length; c++) {
      const samples = chunks[c];
      for (let i = 0; i < samples.length; i++, idx += 2) {
        let s = samples[i];
        if (s > 1) s = 1;
        else if (s < -1) s = -1;
        view.setInt16(idx, s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff), true);
      }
    }
    return new Blob([buffer], { type: "audio/wav" });
  }

  function chooseCaptureBlob(mediaBlob, wavBlob, info) {
    info = info || {};
    const peak = info.peak || 0;
    const meterPeakValue = info.meterPeak || 0;
    const elapsed = info.elapsed || 0;
    const spoke = !!(info.spoke || peak >= 0.045 || meterPeakValue >= 0.15);

    function mediaThin(blob) {
      return !blob || !blob.size || blob.size < 80;
    }
    function wavHasAudio(blob) {
      return !!(blob && blob.size > 44 + 320);
    }

    const wavOk = wavHasAudio(wavBlob);
    if (mediaThin(mediaBlob) && wavOk) return wavBlob;
    if (!mediaThin(mediaBlob) && mediaBlob.size >= 200) return mediaBlob;
    if (wavOk) return wavBlob;
    if (spoke && wavBlob && wavBlob.size > 44) return wavBlob;
    if (spoke && mediaBlob && mediaBlob.size > 0) return mediaBlob;
    if (elapsed < 400 && !spoke) return null;
    if (!mediaThin(mediaBlob)) return mediaBlob;
    return null;
  }

  async function getMicStream() {
    polyfillMediaDevices();
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
      throw new Error("no-mic-api");
    }
    const tries = [
      { audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } },
      { audio: true }
    ];
    let lastErr = null;
    for (let i = 0; i < tries.length; i++) {
      try {
        return await withTimeout(navigator.mediaDevices.getUserMedia(tries[i]), MIC_PERMISSION_MS, "mic-timeout");
      } catch (e) {
        lastErr = e;
        const name = (e && e.name) || "";
        const msg = (e && e.message) || "";
        if (name === "MicTimeoutError" || msg === "mic-timeout") throw e;
        if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") throw e;
      }
    }
    throw lastErr || new Error("no-mic-api");
  }

  function releaseStream() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(function (t) { t.stop(); });
      mediaStream = null;
    }
  }

  function resetPcm() {
    pcmChunks = [];
    pcmPeak = 0;
    pcmActive = false;
    meterPeak = 0;
  }

  function pushPcm(float32) {
    if (!float32 || !float32.length) return;
    pcmChunks.push(float32);
    for (let i = 0; i < float32.length; i++) {
      const v = Math.abs(float32[i]);
      if (v > pcmPeak) pcmPeak = v;
    }
    if (pcmPeak > meterPeak) meterPeak = pcmPeak;
    updateMeterFromPeak(pcmPeak);
  }

  function updateMeterFromPeak(peak) {
    const el = $app.querySelector(".meter-fill");
    if (el) el.style.width = Math.min(100, Math.round((peak || 0) * 160)) + "%";
  }

  function connectSilent(ctx, node) {
    pcmMute = ctx.createGain();
    pcmMute.gain.value = 0;
    node.connect(pcmMute);
    pcmMute.connect(ctx.destination);
  }

  async function startWorkletCapture(ctx, source) {
    const blob = new Blob([PCM_WORKLET_SRC], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    try {
      await ctx.audioWorklet.addModule(url);
    } finally {
      URL.revokeObjectURL(url);
    }
    const node = new AudioWorkletNode(ctx, "pcm-capture");
    node.port.onmessage = function (ev) {
      if (pcmNode !== node || !pcmActive) return;
      if (ev && ev.data) pushPcm(ev.data);
    };
    source.connect(node);
    connectSilent(ctx, node);
    pcmNode = node;
  }

  function startScriptProcessorCapture(ctx, source) {
    const proc = (ctx.createScriptProcessor || ctx.createJavaScriptNode).call(ctx, 4096, 1, 1);
    proc.onaudioprocess = function (ev) {
      if (!pcmActive || pcmNode !== proc) return;
      const input = ev.inputBuffer.getChannelData(0);
      const copy = new Float32Array(input.length);
      copy.set(input);
      pushPcm(copy);
    };
    source.connect(proc);
    connectSilent(ctx, proc);
    pcmNode = proc;
  }

  async function startPcmCapture(stream) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx || !stream) return false;
    try {
      if (!recAudioCtx || recAudioCtx.state === "closed") recAudioCtx = new Ctx();
      if (recAudioCtx.state === "suspended") {
        try { await recAudioCtx.resume(); } catch (e) {}
      }
      pcmSampleRate = recAudioCtx.sampleRate || 44100;
      pcmSource = recAudioCtx.createMediaStreamSource(stream);
      if (recAudioCtx.audioWorklet && typeof recAudioCtx.audioWorklet.addModule === "function") {
        try {
          await startWorkletCapture(recAudioCtx, pcmSource);
          pcmActive = true;
          return true;
        } catch (e) {
          try { if (pcmSource) pcmSource.disconnect(); } catch (e2) {}
          try { if (pcmNode) pcmNode.disconnect(); } catch (e2) {}
          try { if (pcmMute) pcmMute.disconnect(); } catch (e2) {}
          pcmNode = null;
          pcmMute = null;
          pcmSource = recAudioCtx.createMediaStreamSource(stream);
        }
      }
      startScriptProcessorCapture(recAudioCtx, pcmSource);
      pcmActive = true;
      return true;
    } catch (e) {
      pcmActive = false;
      return false;
    }
  }

  function stopPcmCapture() {
    pcmActive = false;
    let wav = null;
    if (pcmChunks.length) {
      try { wav = encodeWav(pcmChunks, pcmSampleRate); } catch (e) { wav = null; }
    }
    try { if (pcmSource) pcmSource.disconnect(); } catch (e) {}
    try { if (pcmNode) pcmNode.disconnect(); } catch (e) {}
    try { if (pcmMute) pcmMute.disconnect(); } catch (e) {}
    pcmSource = null;
    pcmNode = null;
    pcmMute = null;
    pcmChunks = [];
    return wav;
  }

  function startMeterFallback(stream) {
    if (!stream || pcmActive) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!recAudioCtx || recAudioCtx.state === "closed") recAudioCtx = new Ctx();
      if (recAudioCtx.state === "suspended") recAudioCtx.resume().catch(function () {});
      const src = recAudioCtx.createMediaStreamSource(stream);
      recAnalyser = recAudioCtx.createAnalyser();
      recAnalyser.fftSize = 256;
      src.connect(recAnalyser);
      pcmSource = src;
      const data = new Uint8Array(recAnalyser.fftSize);
      const tick = function () {
        if (!state.recOn || !recAnalyser) return;
        recAnalyser.getByteTimeDomainData(data);
        let peak = 0;
        for (let i = 0; i < data.length; i++) {
          const v = Math.abs(data[i] - 128) / 128;
          if (v > peak) peak = v;
        }
        if (peak > meterPeak) meterPeak = peak;
        updateMeterFromPeak(peak);
        recMeterRaf = requestAnimationFrame(tick);
      };
      recMeterRaf = requestAnimationFrame(tick);
    } catch (e) { /* meter is optional */ }
  }

  function stopMeter() {
    if (recMeterRaf) {
      cancelAnimationFrame(recMeterRaf);
      recMeterRaf = 0;
    }
    recAnalyser = null;
    const el = $app.querySelector(".meter-fill");
    if (el && !state.recOn) el.style.width = "0%";
  }

  function clearRecHintTimer() {
    if (recHintTimer) {
      clearTimeout(recHintTimer);
      recHintTimer = 0;
    }
  }

  async function startMediaRecorder(stream) {
    if (typeof MediaRecorder === "undefined") return null;
    chunks = [];
    recMime = pickMimeType();
    let rec;
    try {
      rec = recMime
        ? new MediaRecorder(stream, { mimeType: recMime })
        : new MediaRecorder(stream);
    } catch (e) {
      rec = new MediaRecorder(stream);
    }
    recMime = rec.mimeType || recMime;
    rec._chunks = chunks;
    rec.ondataavailable = function (ev) {
      if (ev.data && ev.data.size) rec._chunks.push(ev.data);
    };
    await new Promise(function (resolve, reject) {
      let settled = false;
      const ok = function () {
        if (settled) return;
        settled = true;
        resolve();
      };
      const fail = function (err) {
        if (settled) return;
        settled = true;
        reject(err || new Error("recorder-start"));
      };
      rec.onerror = function (ev) {
        fail((ev && ev.error) || new Error("recorder-error"));
      };
      rec.onstart = ok;
      try {
        rec.start(200);
      } catch (e) {
        try { rec.start(); } catch (e2) { fail(e2); return; }
      }
      setTimeout(function () {
        if (rec && rec.state === "recording") ok();
      }, 250);
      setTimeout(function () {
        if (settled) return;
        if (rec && rec.state === "recording") ok();
        else fail(new Error("recorder-start"));
      }, 2000);
    });
    return rec;
  }

  async function startRec() {
    const support = recSupportError();
    if (support) throw new Error(support);
    releaseStream();
    resetPcm();
    stopMeter();
    unlockAudio();
    mediaStream = await getMicStream();
    const pcmPromise = startPcmCapture(mediaStream);
    let rec = null;
    let recErr = null;
    try {
      rec = await startMediaRecorder(mediaStream);
    } catch (e) {
      recErr = e;
      rec = null;
    }
    recorder = rec;
    let pcmOk = false;
    try { pcmOk = await pcmPromise; } catch (e) { pcmOk = false; }
    if (!recorder && !pcmOk) {
      releaseStream();
      throw recErr || new Error("no-recorder");
    }
    if (!pcmOk) startMeterFallback(mediaStream);
    recStartAt = Date.now();
  }

  function stopMediaRecorder() {
    return new Promise(function (resolve) {
      const rec = recorder;
      if (!rec) {
        resolve(null);
        return;
      }
      let settled = false;
      const finish = function () {
        if (settled) return;
        settled = true;
        const recChunks = rec._chunks || chunks;
        const type = normalizeBlobType(rec.mimeType || recMime, recChunks[0]);
        const blob = recChunks.length ? new Blob(recChunks, { type: type }) : null;
        if (recorder === rec) recorder = null;
        resolve(blob && blob.size ? blob : null);
      };
      rec.onstop = finish;
      rec.onerror = function () { finish(); };
      try {
        if (rec.state === "recording" || rec.state === "paused") {
          try {
            if (typeof rec.requestData === "function") rec.requestData();
          } catch (e) { /* some browsers throw */ }
          rec.stop();
        } else {
          finish();
        }
      } catch (e) {
        finish();
      }
      setTimeout(finish, 1500);
    });
  }

  function stopRec() {
    return new Promise(function (resolve) {
      const elapsed = Math.max(0, Date.now() - recStartAt);
      stopMeter();
      stopMediaRecorder().then(function (mediaBlob) {
        const wavBlob = stopPcmCapture();
        const peak = Math.max(pcmPeak, meterPeak);
        releaseStream();
        if (recAudioCtx) {
          try { recAudioCtx.close(); } catch (e) {}
          recAudioCtx = null;
        }
        resolve({
          mediaBlob: mediaBlob && mediaBlob.size ? mediaBlob : null,
          wavBlob: wavBlob && wavBlob.size ? wavBlob : null,
          peak: peak,
          meterPeak: meterPeak,
          elapsed: elapsed
        });
      });
    });
  }

  function stopRecTimer() {
    if (recTimer) {
      clearInterval(recTimer);
      recTimer = null;
    }
  }

  function startRecTimer() {
    stopRecTimer();
    recTimer = setInterval(function () {
      const el = $app.querySelector(".mic");
      if (!el || !state.recOn) return;
      const sec = Math.max(1, Math.round((Date.now() - recStartAt) / 1000));
      el.textContent = "正在录音 " + sec + " 秒，再点一下结束";
    }, 250);
  }

  function cancelRec() {
    recToken += 1;
    recStarting = false;
    state.recOn = false;
    clearRecHintTimer();
    stopRecTimer();
    stopMeter();
    stopPcmCapture();
    stopMediaRecorder();
    releaseStream();
    if (recAudioCtx) {
      try { recAudioCtx.close(); } catch (e) {}
      recAudioCtx = null;
    }
  }

  function playBlob(blob) {
    return new Promise(function (resolve) {
      if (!blob) { resolve(); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("audio");
      a.preload = "auto";
      a.playsInline = true;
      a.setAttribute("playsinline", "playsinline");
      a.src = url;
      const done = function () {
        URL.revokeObjectURL(url);
        if (a.parentNode) a.parentNode.removeChild(a);
        resolve();
      };
      a.onended = done;
      a.onerror = done;
      document.body.appendChild(a);
      const p = a.play();
      if (p && typeof p.catch === "function") p.catch(done);
    });
  }

  function primeAudio(blob) {
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("audio");
    a.preload = "auto";
    a.playsInline = true;
    a.setAttribute("playsinline", "playsinline");
    a.src = url;
    document.body.appendChild(a);
    const release = function () {
      URL.revokeObjectURL(url);
      if (a.parentNode) a.parentNode.removeChild(a);
    };
    return { audio: a, url: url, release: release };
  }

  async function playCompare(phrase, blob) {
    const primed = primeAudio(blob);
    if (primed) {
      try {
        primed.audio.muted = true;
        const p = primed.audio.play();
        if (p && typeof p.then === "function") await p;
        primed.audio.pause();
        primed.audio.currentTime = 0;
        primed.audio.muted = false;
      } catch (e) {
        primed.audio.muted = false;
      }
    }
    await playModel(phrase);
    await new Promise(function (r) { setTimeout(r, 280); });
    if (!primed) return;
    await new Promise(function (resolve) {
      primed.audio.onended = function () { primed.release(); resolve(); };
      primed.audio.onerror = function () { primed.release(); resolve(); };
      const p = primed.audio.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () { primed.release(); resolve(); });
      }
    });
  }

  function setOpeningMicUi() {
    const mic = $app.querySelector(".mic");
    if (mic) {
      mic.classList.remove("rec");
      mic.textContent = "正在打开麦克风…";
    }
    const hint = $app.querySelector(".rec-msg");
    if (hint) {
      hint.className = "rec-msg";
      hint.textContent = "如果弹出「允许麦克风」，请点允许。";
    }
    clearRecHintTimer();
    recHintTimer = setTimeout(function () {
      if (!recStarting || state.recOn) return;
      const late = $app.querySelector(".rec-msg");
      if (late) {
        late.className = "rec-msg";
        late.textContent = "还在等待你允许麦克风。请在弹出的窗口里点「允许」。如果没有弹出窗口，请点地址栏的锁或「AA」，把麦克风改成允许。";
      }
    }, 8000);
  }

  async function toggleRec() {
    if (state.recOn) {
      recStarting = true;
      stopRecTimer();
      stopMeter();
      const result = await stopRec();
      state.recOn = false;
      recStarting = false;
      const spoke = (result.peak || 0) >= 0.045 || (result.meterPeak || 0) >= 0.15;
      const blob = chooseCaptureBlob(result.mediaBlob, result.wavBlob, {
        peak: result.peak,
        meterPeak: result.meterPeak,
        elapsed: result.elapsed,
        spoke: spoke
      });
      if (!blob) {
        state.scoreBand = state.lastBlob ? state.scoreBand : 0;
        state.recMsg = state.lastBlob
          ? "这次没录上，刚才录好的还留着。请再点「开始录音」，靠近麦克风把整句话说完，再点一次结束。"
          : "这次没录上。请点「开始录音」，靠近麦克风，把整句话说完，再点一次结束。";
        state.recMsgKind = "err";
      } else {
        state.lastBlob = blob;
        const lesson = state.lesson;
        const ph = lesson && lesson.phrases[state.phraseIndex];
        if (ph) state.recordings[ph.id] = blob;
        state.scoreBand = await scoreBlob(blob);
        state.recMsg = state.scoreBand
          ? "已录好！可以点「听我的」，或点「对比听听」先听示范再听自己的。"
          : "已录好！可以点「听我的」或「对比听听」。";
        state.recMsgKind = "ok";
      }
      render();
      return;
    }
    if (recStarting) return;
    const token = ++recToken;
    recStarting = true;
    polyfillMediaDevices();
    unlockAudio();
    setOpeningMicUi();
    try {
      await startRec();
      clearRecHintTimer();
      if (token !== recToken) {
        await stopRec();
        recStarting = false;
        return;
      }
      state.recOn = true;
      recStarting = false;
      state.recMsg = "正在录音。把整句话说完，再点一次橙色按钮结束。";
      state.recMsgKind = "";
      render();
      startRecTimer();
    } catch (err) {
      clearRecHintTimer();
      if (token !== recToken) {
        recStarting = false;
        return;
      }
      recStarting = false;
      state.recOn = false;
      stopMeter();
      try { await stopRec(); } catch (e2) { releaseStream(); recorder = null; }
      state.recMsg = recErrorMessage(err);
      state.recMsgKind = "err";
      render();
    }
  }

  async function beginSpeakCapture() {
    polyfillMediaDevices();
    unlockAudio();
    if (state.recOn || recStarting) return;
    await toggleRec();
  }

  function inAppBrowserHint() {
    if (!isInAppBrowser()) return "";
    if (isAppleDevice()) {
      return "检测到你在微信或其他 App 里打开了本课。苹果手机请点右上角「···」，选择「在 Safari 中打开」。iOS 微信内置窗口常常完全不给网页用麦克风，必须用 Safari。安卓微信有时可以录，但用系统浏览器更稳。";
    }
    return "检测到你在微信或其他 App 里打开了本课。请点右上角「···」，选择「在浏览器中打开」。在内置窗口里录音经常不稳，用系统浏览器更可靠。";
  }

  function inAppBannerHtml() {
    // iOS WeChat (MicroMessenger) webviews often block getUserMedia entirely.
    // This is a static GitHub Pages site, so we cannot add WeChat JS-SDK (no appId).
    // Ask families to open the page in Safari. Android WeChat sometimes works; still try recording.
    if (!isInAppBrowser()) return "";
    return '<div class="banner inapp-banner"><p>' + esc(inAppBrowserHint()) +
      '</p><button type="button" class="copy-link" data-act="copy-link">复制链接</button></div>';
  }

  function copyPageLink() {
    const url = String(location.href || "");
    const done = function (ok) {
      const btn = $app.querySelector("[data-act='copy-link']");
      if (!btn) return;
      btn.textContent = ok ? "已复制" : "复制失败，请手动选中地址栏";
      setTimeout(function () {
        if (btn && $app.contains(btn)) btn.textContent = "复制链接";
      }, 1800);
    };
    const fallback = function () {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "readonly");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        done(!!ok);
      } catch (e) {
        done(false);
      }
    };
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(url).then(function () { done(true); }, fallback);
    } else {
      fallback();
    }
  }

  async function scoreBlob(blob) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return 0;
      const ctx = new Ctx();
      if (ctx.state === "suspended") {
        try { await ctx.resume(); } catch (e) {}
      }
      const raw = await blob.arrayBuffer();
      const copy = raw.slice(0);
      const buf = await new Promise(function (resolve, reject) {
        let settled = false;
        const ok = function (b) { if (!settled) { settled = true; resolve(b); } };
        const bad = function (e) { if (!settled) { settled = true; reject(e || new Error("decode")); } };
        try {
          const maybe = ctx.decodeAudioData(copy, ok, bad);
          if (maybe && typeof maybe.then === "function") maybe.then(ok, bad);
        } catch (e) { bad(e); }
      });
      const ch = buf.getChannelData(0);
      let sum = 0, peak = 0, voiced = 0;
      for (let i = 0; i < ch.length; i++) {
        const v = Math.abs(ch[i]);
        sum += v;
        if (v > peak) peak = v;
        if (v > 0.02) voiced++;
      }
      const dur = buf.duration;
      const avg = sum / ch.length;
      ctx.close();
      if (dur < 0.3 || avg < 0.008 || voiced < 200) return 1;
      if (dur > 0.6 && avg > 0.02) return 3;
      return 2;
    } catch (e) {
      return 0;
    }
  }

  function bandLabel(n) {
    if (n >= 3) return "太棒了";
    if (n === 2) return "很接近";
    if (n === 1) return "再试一次";
    return "";
  }

  function speakCue() {
    if (state.recOn) return "正在录音。把整句话说完，再点一次橙色按钮结束。";
    if (state.scoreBand) return bandLabel(state.scoreBand);
    if (state.lastBlob) return "已录好。可以点「听我的」或「对比听听」。";
    return "点一下开始录音，把整句话说完，再点一下结束";
  }

  function setBanner() {
    if (isFile()) {
      state.banner = "你现在是直接打开了网页文件。在这种模式下，多数浏览器不允许录音，离线缓存也可能无法启用。请用「启动脚本」在电脑上打开 http://localhost:8080，或把文件夹放到支持 HTTPS 的静态网站上，手机和平板才能录音。听示范（系统朗读或第一周音频）通常仍可用。";
    } else if (insecure()) {
      state.banner = "当前页面不是安全环境（需要 https 或 localhost）。录音功能可能不可用。听示范仍可进行。";
    } else {
      state.banner = "";
    }
  }

  function render() {
    if (state.view === "today" && window.TodayLesson && typeof window.TodayLesson.render === "function") {
      window.TodayLesson.render();
      bind();
      if (typeof window.TodayLesson.afterRender === "function") window.TodayLesson.afterRender();
      return;
    }
    document.body.classList.remove("today-open");
    if (!data) return;
    const p = loadProgress();
    const lesson = state.lesson;
    let html = "";
    if (state.banner) html += '<div class="banner">' + esc(state.banner) + "</div>";
    if (state.view === "home" || state.view === "speak") html += inAppBannerHtml();

    if (state.view === "home") {
      const next = nextLesson();
      const done = completedCount();
      const total = data.lessons.length;
      const pct = Math.round((done / total) * 100);
      html += '<div class="top"><div class="brand">小队电台英语</div>' +
        '<button class="icon-btn" data-act="parent">家长角</button></div>';
      html += '<div class="hero">';
      if (!next) {
        html += "<h1>一年的课都完成了</h1><p class=\"sub\">Simba 可以随时回来复习任何一课，也可以再看游戏小贴士。</p>";
      } else {
        html += imgBox(next.image, "hero-art", next.titleZh);
        html += "<h1>" + esc(next.titleZh) + "</h1>";
        html += '<p class="sub">第 ' + next.week + " 周 · " + esc(next.dayZh) + " · 大约 10 到 15 分钟</p>";
        html += '<p class="meta">先听五句话，再说，再做一个小任务。完成后可解锁今日游戏小贴士。不打开游戏。</p>';
        html += '<button class="primary" data-act="start">开始今天的任务</button>';
      }
      html += '<button class="secondary" data-act="today-lesson">打开今日动画课</button>';
      html += '<div class="progress-bar"><span style="width:' + pct + '%"></span></div>';
      html += '<p class="meta">已完成 ' + done + " / " + total + " 课</p></div>";
      const stickers = Object.values(p.completed).map(function (c) { return c.sticker; }).filter(Boolean);
      const uniq = [];
      stickers.forEach(function (s) { if (uniq.indexOf(s) < 0) uniq.push(s); });
      html += '<div class="card" style="margin-top:16px"><h2>本课贴纸</h2><div class="stickers">';
      if (!uniq.length) html += '<p class="sub">上完第一课就会出现第一枚贴纸。</p>';
      uniq.slice(-16).forEach(function (s) {
        html += '<div class="chip" title="' + esc(s) + '">' + (STICKER_ICON[s] || "⭐") + "</div>";
      });
      html += "</div></div>";
      const tipsN = unlockedTips().length;
      html += '<div class="card" style="margin-top:16px"><h2>游戏小贴士</h2>';
      html += '<p class="sub">完成当天的学习任务后，会解锁一条游戏或设计小贴士。</p>';
      html += '<p class="meta">已解锁 ' + tipsN + " 条</p>";
      html += '<button class="secondary" data-act="tips">打开贴士菜单</button></div>';
      html += '<button class="ghost" data-act="notice">关于这门课</button>';
    } else if (state.view === "notice") {
      html += '<div class="top"><button class="icon-btn" data-act="home">返回</button><div class="brand">说明</div></div>';
      html += '<div class="card"><h2>给家长</h2>';
      html += '<p class="sub">这是英语听说练习页，只用小队、地图和沟通用语。中国区 App Store 上《三角洲行动》当前为 18+，本课不打开该游戏，也不增加游戏时间。</p>';
      html += '<p class="sub">一年约 60 到 90 小时，加上学校英语，可以从较弱的三年级起点明显进步、敢开口，但不会变得流利，也到不了稳固的 A2。</p>';
      html += '<p class="note">本页没有账号、没有服务器。进度保存在这台设备的浏览器里。</p></div>';
    } else if (state.view === "intro" && lesson) {
      html += '<div class="top"><button class="icon-btn" data-act="home">返回</button><div class="brand">第 ' + lesson.week + " 周</div></div>";
      html += '<div class="card">';
      html += imgBox(lesson.image, "intro-art", lesson.titleZh);
      html += "<h1>" + esc(lesson.titleZh) + "</h1>";
      html += '<p class="sub">' + esc(lesson.introZh) + "</p>";
      html += '<button class="primary" data-act="go-listen">开始听</button></div>';
    } else if ((state.view === "listen" || state.view === "speak") && lesson) {
      const ph = lesson.phrases[state.phraseIndex];
      const n = lesson.phrases.length;
      html += '<div class="top"><button class="icon-btn" data-act="home">返回</button><div class="brand">' +
        (state.view === "listen" ? "听" : "说") + " " + (state.phraseIndex + 1) + " / " + n + "</div></div>";
      html += '<div class="dots">';
      for (let i = 0; i < n; i++) {
        html += '<span class="dot' + (i === state.phraseIndex ? " on" : (i < state.phraseIndex ? " done" : "")) + '"></span>';
      }
      html += "</div><div class=\"card\">";
      html += imgBox(ph.image, "phrase-art", ph.en);
      html += '<p class="phrase">' + esc(ph.en) + "</p>";
      html += '<p class="zh">' + (state.revealZh ? esc(ph.zh) : "点「中文」看意思") + "</p>";
      html += '<p class="cue">' + esc(ph.cue || "") + "</p>";
      if (state.view === "listen") {
        html += '<button class="horn" data-act="play">听示范</button>';
        html += '<div class="row"><button class="secondary" data-act="slow">慢速</button>';
        html += '<button class="secondary" data-act="zh">中文</button></div>';
        html += '<button class="primary" data-act="to-speak">我听完了，开始说</button>';
      } else {
        html += '<div class="signal">';
        for (let b = 1; b <= 3; b++) {
          html += '<i class="bar s' + b + (state.scoreBand >= b ? " on" : "") + '"></i>';
        }
        html += "</div>";
        html += '<p class="cue">' + esc(speakCue()) + "</p>";
        html += '<div class="level-meter" aria-hidden="true"><span class="meter-fill"></span></div>';
        if (state.recOn) html += '<p class="rec-live" role="status">正在录音</p>';
        html += '<button type="button" class="mic' + (state.recOn ? " rec" : "") + '" data-act="mic"' +
          (state.recOn ? ' aria-pressed="true"' : ' aria-pressed="false"') + ">" +
          (state.recOn ? "正在录音，再点一下结束" : "开始录音") + "</button>";
        if (state.recMsg) {
          html += '<p class="rec-msg' + (state.recMsgKind === "ok" ? " ok" : (state.recMsgKind === "err" ? " err" : "")) + '">' +
            esc(state.recMsg) + "</p>";
        }
        html += '<div class="row"><button class="secondary" data-act="play"' + (state.recOn ? " disabled" : "") + ">听示范</button>";
        html += '<button class="secondary" data-act="mine"' + (state.lastBlob && !state.recOn ? "" : " disabled") + ">听我的</button>";
        html += '<button class="secondary" data-act="compare"' + (state.lastBlob && !state.recOn ? "" : " disabled") + ">对比听听</button></div>";
        html += '<button class="primary" data-act="next-phrase"' + (state.recOn ? " disabled" : "") + ">下一句</button>";
      }
      html += "</div>";
    } else if (state.view === "task" && lesson) {
      html += '<div class="top"><button class="icon-btn" data-act="home">返回</button><div class="brand">小任务</div></div>';
      html += '<div class="card"><h2>' + esc((lesson.task && lesson.task.promptZh) || "做个小任务") + "</h2>";
      if (lesson.type === "map") {
        const steps = lesson.task.steps || [];
        const step = steps[state.taskStep];
        if (!step) {
          html += '<p class="sub">地图任务完成了。</p><button class="primary" data-act="finish">领取贴纸</button>';
        } else {
          html += imgBox(step.image, "phrase-art", step.en);
          html += '<p class="phrase">' + esc(step.en) + "</p>";
          html += '<p class="zh">' + (state.revealZh ? esc(step.zh) : "") + "</p>";
          html += '<button class="horn" data-act="play-step">再听指令</button>';
          if (step.place === "team") {
            html += '<button class="choice' + (state.taskFeedback === "ok" ? " ok" : state.taskFeedback === "bad" ? " bad" : "") +
              '" data-place="team">小队</button>';
          }
          html += '<div class="grid3">';
          PLACE_ORDER.flat().forEach(function (id) {
            const on = state.taskFeedback === "ok" && step.place === id ? " on" : "";
            const bad = state.taskFeedback === "bad" && state.badPlace === id ? " bad" : "";
            html += '<button class="cell' + on + bad + '" data-place="' + id + '"><img src="' + esc(placeImage(id)) + '" alt="">' + esc(PLACE_ZH[id]) + "</button>";
          });
          html += "</div>";
          html += '<button class="ghost" data-act="zh">看中文</button>';
        }
      } else {
        const ph = lesson.phrases;
        const target = ph[state.taskStep] || ph[0];
        const options = quizOptions(lesson, target);
        if (state.taskStep >= ph.length) {
          html += '<p class="sub">任务完成了。</p><button class="primary" data-act="finish">领取贴纸</button>';
        } else {
          html += '<p class="sub">先听，再选意思对的那一张。</p>';
          html += '<button class="horn" data-act="play-quiz">听句子</button>';
          options.forEach(function (opt) {
            const cls = state.taskFeedback && opt.id === target.id && state.taskFeedback === "ok" ? " ok" :
              (state.taskFeedback === "bad" && state.badId === opt.id ? " bad" : "");
            html += '<button class="choice' + cls + '" data-pick="' + esc(opt.id) + '">' + esc(opt.zh) + "</button>";
          });
        }
      }
      html += "</div>";
    } else if (state.view === "sticker" && lesson) {
      const icon = STICKER_ICON[lesson.sticker] || "⭐";
      const unlocked = !!(loadProgress().completed[lesson.id]);
      html += '<div class="top"><button class="icon-btn" data-act="home">返回</button><div class="brand">任务完成</div></div>';
      html += '<div class="card" style="text-align:center">';
      html += '<div class="sticker-art small">' + icon + "</div>";
      html += "<h1>任务完成</h1>";
      if (unlocked && lesson.tip) {
        html += '<p class="reward-flag">今日游戏小贴士已解锁</p>';
        html += tipCard(lesson.tip);
        html += '<button class="primary" data-act="tips">打开贴士菜单</button>';
        html += '<button class="secondary" data-act="home">回到首页</button>';
      } else {
        html += '<p class="sub">这次是练习。完成正式任务后，才能解锁今日游戏小贴士。</p>';
        html += '<button class="primary" data-act="home">回到首页</button>';
      }
      html += "</div>";
    } else if (state.view === "tips") {
      const list = unlockedTips();
      html += '<div class="top"><button class="icon-btn" data-act="home">返回</button><div class="brand">游戏小贴士</div></div>';
      html += '<div class="card"><h2>已解锁的贴士</h2>';
      html += '<p class="sub">完成当天学习任务后才会出现在这里。还没做的课，贴士先保密。</p></div>';
      if (!list.length) {
        html += '<p class="empty-tips">还没有解锁的贴士。先完成今天的任务吧。</p>';
      } else {
        html += '<div class="list">';
        list.slice().reverse().forEach(function (l) {
          html += '<button class="item tip-item" data-tip="' + esc(l.id) + '">';
          html += '<img src="' + esc(l.tip.image) + '" alt="">';
          html += '<span class="meta-wrap"><strong>' + esc(l.tip.titleZh) + "</strong>";
          html += "<small>第 " + l.week + " 周 · " + esc(l.dayZh) + " · " + esc(l.titleZh) + "</small></span></button>";
        });
        html += "</div>";
      }
    } else if (state.view === "tip-detail" && state.tipLesson) {
      const tl = state.tipLesson;
      html += '<div class="top"><button class="icon-btn" data-act="tips">返回</button><div class="brand">游戏小贴士</div></div>';
      html += '<div class="card" style="text-align:center">';
      html += '<p class="meta">第 ' + tl.week + " 周 · " + esc(tl.dayZh) + "</p>";
      html += tipCard(tl.tip);
      html += "</div>";
    } else if (state.view === "parent") {
      html += '<div class="top"><button class="icon-btn" data-act="home">返回</button><div class="brand">家长角</div></div>';
      if (!state.parentAuthed) {
        html += '<div class="card"><h2>输入家长密码</h2>';
        html += '<p class="sub">第一次使用请先设定 4 位数字密码。</p>';
        html += '<div class="field"><label>4 位数字</label><input id="pin" inputmode="numeric" maxlength="4" autocomplete="off"></div>';
        html += '<button class="primary" data-act="pin-ok">' + (p.pin ? "打开" : "设定并打开") + "</button></div>";
      } else {
        const done = completedCount();
        html += '<div class="card"><h2>学习进度</h2>';
        html += '<p class="sub">已完成 ' + done + " / " + data.lessons.length + " 课。进度只存在这台设备的浏览器里。</p>";
        html += '<p class="note">《三角洲行动》中国区 App Store 当前为 18+。本课不打开游戏，也不增加游戏时间。</p></div>';
        html += '<div class="card" style="margin-top:12px"><h2>挑一课练习</h2><div class="list">';
        const weeks = [];
        for (let w = 1; w <= 52; w++) {
          const ls = data.lessons.filter(function (l) { return l.week === w; });
          const c = ls.filter(function (l) { return p.completed[l.id]; }).length;
          weeks.push({ w: w, c: c, title: ls[0].titleZh.replace(/（.*）/, ""), phase: ls[0].phase });
        }
        weeks.forEach(function (w) {
          html += '<button class="item" data-week="' + w.w + '"><span>第 ' + w.w + " 周 · " + esc(w.title) +
            '</span><small>' + w.c + "/7</small></button>";
        });
        html += "</div></div>";
        html += '<button class="ghost" data-act="reset">清除本机进度（需再确认）</button>';
      }
    } else if (state.view === "weeklist") {
      const w = state.weekOpen;
      const ls = data.lessons.filter(function (l) { return l.week === w; });
      html += '<div class="top"><button class="icon-btn" data-act="parent-back">返回</button><div class="brand">第 ' + w + " 周</div></div>";
      html += '<div class="list">';
      ls.forEach(function (l) {
        const done = loadProgress().completed[l.id];
        html += '<button class="item" data-open="' + esc(l.id) + '"><span>' + esc(l.dayZh + " · " + l.titleZh) +
          "</span><small>" + (done ? "已完成" : "未完成") + "</small></button>";
      });
      html += "</div>";
    }

    $app.innerHTML = html;
    bind();
  }

  function quizOptions(lesson, target) {
    const pool = lesson.phrases.slice();
    const opts = [target];
    data.lessons[Math.max(0, data.lessons.indexOf(lesson) - 1)].phrases.forEach(function (p) {
      if (p.zh !== target.zh) pool.push(p);
    });
    pool.forEach(function (p) {
      if (opts.length < 3 && p.zh !== target.zh && !opts.some(function (o) { return o.zh === p.zh; })) opts.push(p);
    });
    return opts.sort(function () { return Math.random() - 0.5; });
  }

  function bind() {
    $app.querySelectorAll("[data-act]").forEach(function (btn) {
      if (btn.getAttribute("data-act") === "mic") return;
      btn.addEventListener("click", function () {
        unlockAudio();
        onAct(btn.getAttribute("data-act"));
      });
    });
    const mic = $app.querySelector(".mic");
    if (mic) {
      mic.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        unlockAudio();
        toggleRec();
      });
      mic.addEventListener("contextmenu", function (ev) { ev.preventDefault(); });
    }
    $app.querySelectorAll("[data-place]").forEach(function (btn) {
      btn.addEventListener("click", function () { onPlace(btn.getAttribute("data-place")); });
    });
    $app.querySelectorAll("[data-pick]").forEach(function (btn) {
      btn.addEventListener("click", function () { onPick(btn.getAttribute("data-pick")); });
    });
    $app.querySelectorAll("[data-week]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.view = "weeklist";
        state.weekOpen = Number(btn.getAttribute("data-week"));
        state.parentAuthed = true;
        render();
      });
    });
    $app.querySelectorAll("[data-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const les = data.lessons.find(function (l) { return l.id === btn.getAttribute("data-open"); });
        if (les) openLesson(les, true);
      });
    });
    $app.querySelectorAll("[data-tip]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-tip");
        const les = unlockedTips().find(function (l) { return l.id === id; });
        if (les) {
          state.tipLesson = les;
          state.view = "tip-detail";
          render();
        }
      });
    });
  }

  function openLesson(lesson, practice) {
    cancelRec();
    state.lesson = lesson;
    state.practice = !!practice;
    state.phraseIndex = 0;
    state.revealZh = false;
    state.recordings = {};
    state.lastBlob = null;
    state.scoreBand = 0;
    state.recMsg = "";
    state.recMsgKind = "";
    state.taskStep = 0;
    state.taskFeedback = null;
    state.view = "intro";
    render();
    sayZh(lesson.introZh);
  }

  function finishLesson() {
    const p = loadProgress();
    if (!state.practice) {
      p.completed[state.lesson.id] = { at: todayISO(), sticker: state.lesson.sticker };
      saveProgress(p);
    }
    state.view = "sticker";
    render();
    if (!state.practice) sayZh("任务完成。今天的游戏小贴士已解锁。");
    else sayZh("练习完成。");
  }

  async function onAct(act) {
    const lesson = state.lesson;
    if (act === "today-lesson") {
      if (window.TodayLesson && typeof window.TodayLesson.start === "function") window.TodayLesson.start();
      return;
    }
    if (state.view === "today" && window.TodayLesson && typeof window.TodayLesson.onAct === "function") {
      const handled = window.TodayLesson.onAct(act);
      if (handled !== false) return;
    }
    if (act === "home") { cancelRec(); state.view = "home"; state.parentAuthed = false; state.tipLesson = null; setBanner(); render(); return; }
    if (act === "tips") { state.view = "tips"; state.tipLesson = null; render(); return; }
    if (act === "play-tip-en") {
      const tip = (state.view === "tip-detail" && state.tipLesson ? state.tipLesson.tip : (lesson && lesson.tip));
      if (tip) await speak(tip.en, "en-US", 0.92);
      return;
    }
    if (act === "play-tip-zh") {
      const tip = (state.view === "tip-detail" && state.tipLesson ? state.tipLesson.tip : (lesson && lesson.tip));
      if (tip) await sayZh(tip.zh);
      return;
    }
    if (act === "notice") { state.view = "notice"; render(); return; }
    if (act === "parent") { state.view = "parent"; state.parentAuthed = false; render(); return; }
    if (act === "parent-back") { state.view = "parent"; state.parentAuthed = true; render(); return; }
    if (act === "start") {
      const n = nextLesson();
      if (n) openLesson(n, false);
      return;
    }
    if (act === "go-listen") { state.view = "listen"; render(); playModel(lesson.phrases[0]); return; }
    if (act === "play") { await playModel(lesson.phrases[state.phraseIndex]); return; }
    if (act === "slow") { await playModel(lesson.phrases[state.phraseIndex], true); return; }
    if (act === "zh") { state.revealZh = !state.revealZh; render(); return; }
    if (act === "to-speak") {
      cancelRec();
      state.view = "speak";
      state.lastBlob = null;
      state.scoreBand = 0;
      state.recMsg = "";
      state.recMsgKind = "";
      render();
      beginSpeakCapture();
      return;
    }
    if (act === "copy-link") {
      copyPageLink();
      return;
    }
    if (act === "mine") { if (state.lastBlob) await playBlob(state.lastBlob); return; }
    if (act === "compare") {
      if (state.lastBlob) await playCompare(lesson.phrases[state.phraseIndex], state.lastBlob);
      return;
    }
    if (act === "next-phrase") {
      cancelRec();
      if (state.phraseIndex < lesson.phrases.length - 1) {
        state.phraseIndex += 1;
        state.revealZh = false;
        state.lastBlob = null;
        state.scoreBand = 0;
        state.recMsg = "";
        state.recMsgKind = "";
        state.view = "listen";
        render();
        playModel(lesson.phrases[state.phraseIndex]);
      } else {
        state.view = "task";
        state.taskStep = 0;
        state.taskFeedback = null;
        state.revealZh = false;
        render();
        if (lesson.type === "map" && lesson.task.steps && lesson.task.steps[0]) {
          playModel(lesson.task.steps[0]);
        } else if (lesson.phrases[0]) {
          playModel(lesson.phrases[0]);
        }
      }
      return;
    }
    if (act === "play-step") {
      const step = lesson.task.steps[state.taskStep];
      if (step) await playModel(step);
      return;
    }
    if (act === "play-quiz") {
      await playModel(lesson.phrases[state.taskStep]);
      return;
    }
    if (act === "finish") { finishLesson(); return; }
    if (act === "pin-ok") {
      const input = document.getElementById("pin");
      const val = (input && input.value || "").replace(/\D/g, "").slice(0, 4);
      const p = loadProgress();
      if (!p.pin) {
        if (val.length !== 4) { alert("请输入 4 位数字。"); return; }
        p.pin = val;
        saveProgress(p);
        state.parentAuthed = true;
        render();
        return;
      }
      if (val === p.pin) { state.parentAuthed = true; render(); }
      else alert("密码不正确。");
      return;
    }
    if (act === "reset") {
      if (confirm("确定清除这台设备上的学习进度吗？录音和贴纸也会被清掉。")) {
        saveProgress(defaultProgress());
        state.parentAuthed = true;
        render();
      }
    }
  }

  function onPlace(place) {
    const step = state.lesson.task.steps[state.taskStep];
    if (!step) return;
    const ok = place === step.place || (step.place === "team" && place === "team");
    if (ok) {
      state.taskFeedback = "ok";
      render();
      setTimeout(function () {
        state.taskStep += 1;
        state.taskFeedback = null;
        state.revealZh = false;
        render();
        const next = state.lesson.task.steps[state.taskStep];
        if (next) playModel(next);
      }, 700);
    } else {
      state.taskFeedback = "bad";
      state.badPlace = place;
      render();
      playModel(step);
      setTimeout(function () { state.taskFeedback = null; render(); }, 800);
    }
  }

  function onPick(id) {
    const target = state.lesson.phrases[state.taskStep];
    if (!target) return;
    if (id === target.id) {
      state.taskFeedback = "ok";
      render();
      setTimeout(function () {
        state.taskStep += 1;
        state.taskFeedback = null;
        render();
        if (state.lesson.phrases[state.taskStep]) playModel(state.lesson.phrases[state.taskStep]);
      }, 700);
    } else {
      state.taskFeedback = "bad";
      state.badId = id;
      render();
      playModel(target);
      setTimeout(function () { state.taskFeedback = null; render(); }, 800);
    }
  }

  async function boot() {
    polyfillMediaDevices();
    setBanner();
    try {
      const res = await fetch("data/curriculum.json");
      data = await res.json();
    } catch (e) {
      if (window.TodayLesson && typeof window.TodayLesson.start === "function") {
        window.TodayLesson.start();
        return;
      }
      $app.innerHTML = '<div class="banner">没有读到课程数据。请不要只用双击打开单个文件：请先运行文件夹里的启动脚本，再用浏览器打开 http://localhost:8080 。如果是从网站打开，请确认 data/curriculum.json 和网页在一起。</div>';
      return;
    }
    if ("serviceWorker" in navigator && window.isSecureContext) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
    if (window.TodayLesson && typeof window.TodayLesson.start === "function") {
      window.TodayLesson.start();
    } else {
      render();
    }
  }

  window.SimbaSquad = {
    getState: function () { return state; },
    render: render,
    cancelRec: cancelRec,
    beginSpeakCapture: beginSpeakCapture,
    toggleRec: toggleRec,
    playModel: playModel,
    sayZh: sayZh,
    speak: speak,
    unlockAudio: unlockAudio,
    playBlob: playBlob,
    playCompare: playCompare,
    inAppBannerHtml: inAppBannerHtml,
    setBanner: setBanner,
    speakCue: speakCue,
    esc: esc,
    loadProgress: loadProgress,
    goYearCourse: function () {
      cancelRec();
      document.body.classList.remove("today-open");
      state.view = "home";
      state.parentAuthed = false;
      state.tipLesson = null;
      setBanner();
      if (!data) {
        $app.innerHTML = '<div class="banner">全年课程数据还没有打开。请刷新一次，或确认 data/curriculum.json 和网页在一起。</div>' +
          '<div class="card"><button class="primary" data-act="today-lesson">返回今日动画课</button></div>';
        bind();
        return;
      }
      render();
    }
  };

  boot();
})();
