(function () {
  "use strict";

  const TODAY_LESSON = {
    id: "today-animated",
    titleZh: "今日电台课",
    introZh: "今天我们练习七句话。先看图画，听一听，再说一说。",
    phrases: [
      {
        id: "today-hello",
        en: "Hello! My name is Simba.",
        zh: "你好！我叫辛巴。",
        cue: "挥手，介绍自己",
        sceneZh: "营地电台",
        anim: "wave",
        idle: "images/today/s1-idle.webp",
        gesture: "images/today/s1-wave.webp",
        image: "images/today/s1-wave.webp"
      },
      {
        id: "today-age",
        en: "I am nine years old.",
        zh: "我九岁了。",
        cue: "自豪地介绍自己",
        sceneZh: "队员名牌",
        anim: "proud",
        idle: "images/today/s2-idle.webp",
        gesture: "images/today/s2-proud.webp",
        image: "images/today/s2-proud.webp"
      },
      {
        id: "today-howareyou",
        en: "How are you?",
        zh: "你好吗？",
        cue: "跟队友问好",
        sceneZh: "小路相遇",
        anim: "greet",
        idle: "images/today/s3-idle.webp",
        gesture: "images/today/s3-greet.webp",
        image: "images/today/s3-greet.webp"
      },
      {
        id: "today-fine",
        en: "I'm fine, thank you.",
        zh: "我很好，谢谢。",
        cue: "点头，竖起大拇指",
        sceneZh: "营地一切都好",
        anim: "ok",
        idle: "images/today/s4-idle.webp",
        gesture: "images/today/s4-ok.webp",
        image: "images/today/s4-ok.webp"
      },
      {
        id: "today-what",
        en: "What is this?",
        zh: "这是什么？",
        cue: "指一指桌上的对讲机",
        sceneZh: "桌上的对讲机",
        anim: "point",
        idle: "images/today/s5-idle.webp",
        gesture: "images/today/s5-point.webp",
        image: "images/today/s5-point.webp"
      },
      {
        id: "today-like",
        en: "I like it.",
        zh: "我喜欢它。",
        cue: "拿起对讲机，喜欢它",
        sceneZh: "喜欢这台对讲机",
        anim: "like",
        idle: "images/today/s6-idle.webp",
        gesture: "images/today/s6-like.webp",
        image: "images/today/s6-like.webp"
      },
      {
        id: "today-bye",
        en: "Goodbye, Simba!",
        zh: "再见，辛巴！",
        cue: "在营门口挥手再见",
        sceneZh: "黄昏营门",
        anim: "bye",
        idle: "images/today/s7-idle.webp",
        gesture: "images/today/s7-bye.webp",
        image: "images/today/s7-bye.webp"
      }
    ]
  };

  const today = {
    screen: "intro",
    index: 0,
    phase: "enter",
    mood: "idle",
    alt: false,
    playToken: 0,
    autoKey: -1,
    frameTimer: 0,
    stagePainted: false
  };

  function S() {
    return window.SimbaSquad;
  }

  function esc(s) {
    if (S() && S().esc) return S().esc(s);
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function preload() {
    const urls = ["images/today/intro.webp"];
    TODAY_LESSON.phrases.forEach(function (p) {
      urls.push(p.idle, p.gesture);
    });
    urls.forEach(function (src) {
      if (!src) return;
      const img = new Image();
      img.src = src;
    });
  }

  function stopFrames() {
    if (today.frameTimer) {
      clearInterval(today.frameTimer);
      today.frameTimer = 0;
    }
  }

  function startFrames(ms) {
    stopFrames();
    today.frameTimer = setInterval(function () {
      today.alt = !today.alt;
      const stage = document.querySelector(".today-stage");
      if (stage) stage.classList.toggle("alt", today.alt);
    }, ms || 520);
  }

  function applyMood() {
    const stage = document.querySelector(".today-stage");
    if (!stage) return;
    const ph = TODAY_LESSON.phrases[today.index];
    const mood = today.mood || "idle";
    stage.className = "today-stage mood-" + mood + (today.alt ? " alt" : "");
    if (mood === "idle") {
      stopFrames();
      today.alt = false;
      stage.classList.remove("alt");
    } else if (mood === "talk") {
      startFrames(420);
    } else if (ph) {
      startFrames(mood === "wave" || mood === "bye" ? 480 : 700);
    }
  }

  function cancelPlay() {
    today.playToken += 1;
    stopFrames();
    try {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } catch (e) {}
  }

  function setMood(mood) {
    today.mood = mood;
    applyMood();
  }

  function currentPhrase() {
    return TODAY_LESSON.phrases[today.index];
  }

  function syncLessonState() {
    const api = S();
    if (!api) return;
    const state = api.getState();
    const ph = currentPhrase();
    state.view = "today";
    state.lesson = TODAY_LESSON;
    state.phraseIndex = today.index;
    if (ph && state.recordings && state.recordings[ph.id]) {
      if (!state.lastBlob) state.lastBlob = state.recordings[ph.id];
    }
  }

  function goYear() {
    cancelPlay();
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    document.body.classList.remove("today-open");
    if (api && api.goYearCourse) api.goYearCourse();
  }

  function start(opts) {
    opts = opts || {};
    preload();
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    cancelPlay();
    document.body.classList.add("today-open");
    today.screen = opts.screen || "intro";
    today.index = opts.index || 0;
    today.phase = "enter";
    today.mood = "idle";
    today.alt = false;
    today.autoKey = -1;
    const state = api ? api.getState() : null;
    if (state) {
      state.view = "today";
      state.lesson = TODAY_LESSON;
      state.phraseIndex = today.index;
      state.revealZh = false;
      state.recordings = {};
      state.lastBlob = null;
      state.scoreBand = 0;
      state.recMsg = "";
      state.recMsgKind = "";
      state.recOn = false;
    }
    if (api && api.setBanner) api.setBanner();
    if (!routeFromHash()) {
      if (api && api.render) api.render();
      else render();
    }
  }

  function routeFromHash() {
    const h = String(location.hash || "").replace(/^#/, "");
    if (h === "done") {
      const api = S();
      today.screen = "done";
      today.phase = "done";
      today.mood = "bye";
      today.index = 6;
      today.autoKey = 6;
      today.stagePainted = false;
      if (api && api.getState) {
        const state = api.getState();
        state.view = "today";
        state.lesson = TODAY_LESSON;
        state.phraseIndex = 6;
        state.revealZh = true;
      }
      if (api && api.render) api.render();
      else render();
      return true;
    }
    const m = /^scene-([1-7])$/.exec(h);
    if (!m) return false;
    const idx = parseInt(m[1], 10) - 1;
    const api = S();
    const ph = TODAY_LESSON.phrases[idx];
    today.screen = "scene";
    today.index = idx;
    today.phase = "invite";
    today.mood = ph.anim || "idle";
    today.alt = true;
    today.autoKey = idx;
    today.stagePainted = false;
    if (api && api.getState) {
      const state = api.getState();
      state.view = "today";
      state.lesson = TODAY_LESSON;
      state.phraseIndex = idx;
      state.revealZh = true;
      state.lastBlob = null;
      state.recOn = false;
    }
    if (api && api.render) api.render();
    else render();
    return true;
  }

  function openScene(index, auto) {
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    cancelPlay();
    const n = TODAY_LESSON.phrases.length;
    if (index < 0) index = 0;
    if (index >= n) {
      today.screen = "done";
      today.phase = "done";
      today.autoKey = -1;
      if (api && api.render) api.render();
      return;
    }
    const state = api.getState();
    today.screen = "scene";
    today.index = index;
    today.phase = "enter";
    today.mood = "enter";
    today.alt = false;
    today.stagePainted = false;
    today.autoKey = auto === false ? index : -1;
    state.view = "today";
    state.lesson = TODAY_LESSON;
    state.phraseIndex = index;
    state.revealZh = false;
    state.lastBlob = (state.recordings && state.recordings[TODAY_LESSON.phrases[index].id]) || null;
    state.scoreBand = state.lastBlob ? state.scoreBand : 0;
    if (!state.lastBlob) {
      state.recMsg = "";
      state.recMsgKind = "";
    }
    state.recOn = false;
    if (api.render) api.render();
  }

  function sleep(ms, token) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(token === today.playToken);
      }, ms);
    });
  }

  async function runAutoPlay() {
    const api = S();
    const ph = currentPhrase();
    if (!api || !ph) return;
    const token = ++today.playToken;
    today.phase = "enter";
    setMood("enter");
    if (!(await sleep(720, token))) return;
    if (token !== today.playToken) return;
    today.phase = "en";
    setMood("talk");
    try {
      if (api.unlockAudio) api.unlockAudio();
      await api.playModel(ph);
    } catch (e) {}
    if (token !== today.playToken) return;
    setMood(ph.anim || "gesture");
    today.phase = "zh";
    const state = api.getState();
    state.revealZh = true;
    updatePanel();
    try {
      await api.sayZh(ph.zh);
    } catch (e) {}
    if (token !== today.playToken) return;
    today.phase = "invite";
    setMood(ph.anim || "idle");
    startFrames(ph.anim === "wave" || ph.anim === "bye" ? 520 : 900);
    updatePanel();
  }

  async function replay(slow) {
    const api = S();
    const ph = currentPhrase();
    if (!api || !ph) return;
    if (api.unlockAudio) api.unlockAudio();
    const token = ++today.playToken;
    today.phase = "en";
    const state = api.getState();
    if (state.recOn) return;
    setMood("talk");
    updatePanel();
    try {
      await api.playModel(ph, !!slow);
    } catch (e) {}
    if (token !== today.playToken) return;
    setMood(ph.anim || "gesture");
    if (today.phase === "en") {
      today.phase = state.revealZh || today.phase === "invite" || today.phase === "speak" ? today.phase : "invite";
      if (today.phase === "en") today.phase = "invite";
    }
    startFrames(620);
    updatePanel();
  }

  async function playZh() {
    const api = S();
    const ph = currentPhrase();
    if (!api || !ph) return;
    if (api.unlockAudio) api.unlockAudio();
    const state = api.getState();
    state.revealZh = true;
    updatePanel();
    const token = ++today.playToken;
    setMood(ph.anim || "talk");
    try {
      await api.sayZh(ph.zh);
    } catch (e) {}
    if (token !== today.playToken) return;
    setMood(ph.anim || "idle");
  }

  function skipToInvite() {
    cancelPlay();
    const api = S();
    const ph = currentPhrase();
    const state = api.getState();
    state.revealZh = true;
    today.phase = "invite";
    setMood(ph ? ph.anim : "idle");
    updatePanel();
  }

  function beginSpeak() {
    const api = S();
    if (!api) return;
    cancelPlay();
    const state = api.getState();
    if (state.recOn) return;
    today.phase = "speak";
    state.view = "today";
    state.lesson = TODAY_LESSON;
    state.phraseIndex = today.index;
    if (!state.lastBlob) {
      state.scoreBand = 0;
      state.recMsg = "";
      state.recMsgKind = "";
    }
    updatePanel();
    api.beginSpeakCapture();
  }

  function stageHtml(ph, isIntro) {
    if (isIntro) {
      return '<div class="today-intro-art" data-act="today-start">' +
        '<div class="stage-inner"><img src="images/today/intro.webp" alt="营地与大坝"></div>' +
        '<div class="today-rays"></div>' +
        '<div class="today-dust"><span></span><span></span><span></span><span></span><span></span></div>' +
        "</div>";
    }
    return '<div class="today-stage-wrap"' + (today.screen === "done" ? "" : ' data-act="today-replay" role="button" aria-label="再听一遍"') + '>' +
      ((today.screen !== "done") && (today.phase === "enter" || today.phase === "en" || today.phase === "zh")
        ? '<button type="button" class="today-skip" data-act="today-skip">跳过</button>'
        : "") +
      '<div class="today-stage mood-' + esc(today.mood || "idle") + (today.alt ? " alt" : "") + '">' +
        '<div class="stage-inner">' +
          '<img class="frame idle show" src="' + esc(ph.idle) + '" alt="' + esc(ph.sceneZh) + '">' +
          '<img class="frame gesture" src="' + esc(ph.gesture) + '" alt="">' +
        "</div>" +
        '<div class="today-rays"></div>' +
        '<div class="today-dust"><span></span><span></span><span></span><span></span><span></span></div>' +
        '<div class="today-rings" aria-hidden="true"><i></i><i></i><i></i></div>' +
      "</div>" +
      (today.screen === "done" ? "" : '<div class="today-tap-hint">点图画，再听一遍</div>') +
      "</div>";
  }

  function dotsHtml() {
    const n = TODAY_LESSON.phrases.length;
    let html = '<div class="dots">';
    for (let i = 0; i < n; i++) {
      html += '<span class="dot' + (i === today.index ? " on" : (i < today.index ? " done" : "")) + '"></span>';
    }
    html += "</div>";
    return html;
  }

  function bannerHtml() {
    const api = S();
    let html = "";
    if (!api) return html;
    const state = api.getState();
    if (state.banner) html += '<div class="banner">' + esc(state.banner) + "</div>";
    if (api.inAppBannerHtml) html += api.inAppBannerHtml();
    return html;
  }

  function speakPanel() {
    const api = S();
    const state = api.getState();
    const ph = currentPhrase();
    let html = "";
    html += '<div class="signal">';
    for (let b = 1; b <= 3; b++) {
      html += '<i class="bar s' + b + (state.scoreBand >= b ? " on" : "") + '"></i>';
    }
    html += "</div>";
    html += '<p class="cue">' + esc(api.speakCue()) + "</p>";
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
    const last = today.index >= TODAY_LESSON.phrases.length - 1;
    html += '<button class="primary" data-act="next-phrase"' + (state.recOn ? " disabled" : "") + ">" +
      (last ? "完成今日课" : "下一句") + "</button>";
    return html;
  }

  function listenPanel() {
    const ph = currentPhrase();
    const api = S();
    const state = api.getState();
    let html = "";
    if (today.phase === "en") {
      html += '<p class="cue">正在听英语…也可以点图画再听。</p>';
    } else if (today.phase === "zh") {
      html += '<p class="cue">听听中文意思。</p>';
    } else if (today.phase === "enter") {
      html += '<p class="cue">图画马上开始…</p>';
    } else {
      html += '<p class="cue">' + esc(ph.cue || "先听，再说") + "</p>";
    }
    html += '<button class="horn" data-act="play">再听一遍</button>';
    html += '<div class="row"><button class="secondary" data-act="slow">慢速</button>';
    html += '<button class="secondary" data-act="zh">中文</button></div>';
    html += '<button class="primary" data-act="to-speak">我听完了，开始说</button>';
    return html;
  }

  function panelInner() {
    const api = S();
    const state = api.getState();
    const ph = currentPhrase();
    let html = '<p class="today-kicker">' + esc(ph.sceneZh) + " · " + (today.index + 1) + " / " + TODAY_LESSON.phrases.length + "</p>";
    html += '<p class="phrase">' + esc(ph.en) + "</p>";
    html += '<p class="zh">' + (state.revealZh ? esc(ph.zh) : "先听英语，或点「中文」看意思") + "</p>";
    if (today.phase === "speak") html += speakPanel();
    else html += listenPanel();
    return html;
  }

  function updatePanel() {
    const panel = document.getElementById("today-panel");
    if (!panel || today.screen !== "scene") {
      const api = S();
      if (api && api.render) api.render();
      return;
    }
    panel.innerHTML = panelInner();
    const api = S();
    if (api && api.render) {
      /* Rebind only: call the shared bind via a light render path.
         We re-bind by asking afterRender's parent bind through a custom hook. */
    }
    rebindPanel(panel);
    applyMood();
  }

  function rebindPanel(root) {
    const api = S();
    const wrap = root || document.getElementById("app");
    if (!wrap) return;
    wrap.querySelectorAll("[data-act]").forEach(function (btn) {
      if (btn.getAttribute("data-act") === "mic") return;
      if (btn.getAttribute("data-today-bound") === "1") return;
      btn.setAttribute("data-today-bound", "1");
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (api && api.unlockAudio) api.unlockAudio();
        onAct(btn.getAttribute("data-act"));
      });
    });
    const mic = wrap.querySelector(".mic");
    if (mic && mic.getAttribute("data-today-mic") !== "1") {
      mic.setAttribute("data-today-mic", "1");
      mic.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (api && api.unlockAudio) api.unlockAudio();
        if (api && api.toggleRec) api.toggleRec();
      });
      mic.addEventListener("contextmenu", function (ev) { ev.preventDefault(); });
    }
  }

  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    document.body.classList.add("today-open");
    syncLessonState();
    const api = S();
    const state = api ? api.getState() : { banner: "", revealZh: false, recOn: false };

    if (today.screen === "intro") {
      let html = bannerHtml();
      html += '<div class="today-wrap">';
      html += '<div class="today-top"><div class="brand">小队电台英语</div>';
      html += '<button type="button" class="icon-btn" data-act="today-year">全年课程</button></div>';
      html += stageHtml(null, true);
      html += '<div class="today-panel">';
      html += '<p class="today-kicker">今日动画课</p>';
      html += '<h1 class="today-title">今天练七句话</h1>';
      html += '<p class="sub" style="text-align:center">跟辛巴一起看图、听一听、再说一说。每句话都有自己的画面。</p>';
      html += '<button class="primary" data-act="today-start">开始上课</button>';
      html += '<button class="ghost" data-act="today-year">打开全年课程</button>';
      html += "</div></div>";
      app.innerHTML = html;
      today.stagePainted = false;
      return;
    }

    if (today.screen === "done") {
      let html = bannerHtml();
      html += '<div class="today-wrap today-done">';
      html += '<div class="today-top"><div class="brand">小队电台英语</div>';
      html += '<button type="button" class="icon-btn" data-act="today-year">全年课程</button></div>';
      html += stageHtml(TODAY_LESSON.phrases[6], false);
      html += '<div class="today-panel">';
      html += '<div class="sticker-art">🏅</div>';
      html += '<h1 class="today-title">今日七句都练完了</h1>';
      html += '<p class="sub" style="text-align:center">辛巴说：Goodbye! 明天还可以再打开这一课。全年 364 课也在这里。</p>';
      html += '<button class="primary" data-act="today-again">再练一遍</button>';
      html += '<button class="secondary" data-act="today-year">打开全年课程</button>';
      html += "</div></div>";
      app.innerHTML = html;
      today.mood = "bye";
      today.stagePainted = false;
      return;
    }

    const ph = currentPhrase();
    let html = bannerHtml();
    html += '<div class="today-wrap">';
    html += '<div class="today-top"><div class="brand">今日课 ' + (today.index + 1) + " / " + TODAY_LESSON.phrases.length + "</div>";
    html += '<button type="button" class="icon-btn" data-act="today-year">全年课程</button></div>';
    html += dotsHtml();
    html += stageHtml(ph, false);
    html += '<div class="today-panel" id="today-panel">' + panelInner() + "</div>";
    html += '<div class="today-nav">';
    html += '<button class="secondary" data-act="today-back"' + (today.index === 0 ? " disabled" : "") + ">上一句</button>";
    const last = today.index >= TODAY_LESSON.phrases.length - 1;
    html += '<button class="secondary" data-act="next-phrase">' + (last ? "完成" : "下一句") + "</button>";
    html += "</div></div>";
    app.innerHTML = html;
    const stage = app.querySelector(".today-stage");
    if (stage) stage.setAttribute("data-scene", ph.id);
    today.stagePainted = true;
  }

  function afterRender() {
    applyMood();
    if (today.screen === "scene" && today.phase === "enter" && today.autoKey !== today.index) {
      today.autoKey = today.index;
      runAutoPlay();
    } else if (today.screen === "done") {
      setMood("bye");
      startFrames(520);
    }
  }

  function onAct(act) {
    const api = S();
    const state = api ? api.getState() : null;
    if (act === "today-year") {
      goYear();
      return true;
    }
    if (act === "today-start") {
      openScene(0, true);
      return true;
    }
    if (act === "today-again") {
      start({ screen: "intro" });
      return true;
    }
    if (act === "today-skip") {
      skipToInvite();
      return true;
    }
    if (act === "today-replay" || act === "play") {
      if (state && state.recOn) return true;
      replay(false);
      return true;
    }
    if (act === "slow") {
      if (state && state.recOn) return true;
      replay(true);
      return true;
    }
    if (act === "zh") {
      playZh();
      return true;
    }
    if (act === "to-speak") {
      beginSpeak();
      return true;
    }
    if (act === "today-back") {
      if (state && state.recOn) return true;
      if (today.index > 0) openScene(today.index - 1, true);
      return true;
    }
    if (act === "next-phrase") {
      if (state && state.recOn) return true;
      if (today.index >= TODAY_LESSON.phrases.length - 1) {
        cancelPlay();
        if (api && api.cancelRec) api.cancelRec();
        today.screen = "done";
        today.phase = "done";
        today.mood = "bye";
        today.stagePainted = false;
        if (api && api.render) api.render();
      } else {
        openScene(today.index + 1, true);
      }
      return true;
    }
    if (act === "mine") {
      if (state && state.lastBlob && api.playBlob) api.playBlob(state.lastBlob);
      return true;
    }
    if (act === "compare") {
      const ph = currentPhrase();
      if (state && state.lastBlob && ph && api.playCompare) {
        setMood("talk");
        Promise.resolve(api.playCompare(ph, state.lastBlob)).then(function () {
          setMood(ph.anim || "idle");
        });
      }
      return true;
    }
    if (act === "copy-link") return false;
    return false;
  }

  window.TodayLesson = {
    lesson: TODAY_LESSON,
    start: start,
    render: render,
    afterRender: afterRender,
    onAct: onAct,
    goYear: goYear
  };
})();
