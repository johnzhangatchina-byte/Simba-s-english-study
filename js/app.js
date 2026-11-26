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

  let mediaStream = null;
  let recorder = null;
  let chunks = [];

  async function startRec() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("no-mic-api");
    }
    if (!window.isSecureContext) throw new Error("insecure");
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks = [];
    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : (MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "");
    recorder = mime ? new MediaRecorder(mediaStream, { mimeType: mime }) : new MediaRecorder(mediaStream);
    recorder.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
    recorder.start();
  }
  function stopRec() {
    return new Promise(function (resolve) {
      if (!recorder) { resolve(null); return; }
      recorder.onstop = function () {
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        if (mediaStream) {
          mediaStream.getTracks().forEach(function (t) { t.stop(); });
          mediaStream = null;
        }
        recorder = null;
        resolve(blob);
      };
      if (recorder.state !== "inactive") recorder.stop();
      else resolve(null);
    });
  }
  function playBlob(blob) {
    return new Promise(function (resolve) {
      const url = URL.createObjectURL(blob);
      const a = new Audio(url);
      a.onended = function () { URL.revokeObjectURL(url); resolve(); };
      a.onerror = function () { URL.revokeObjectURL(url); resolve(); };
      a.play().catch(function () { URL.revokeObjectURL(url); resolve(); });
    });
  }

  async function scoreBlob(blob) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
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
    if (!data) return;
    const p = loadProgress();
    const lesson = state.lesson;
    let html = "";
    if (state.banner) html += '<div class="banner">' + esc(state.banner) + "</div>";

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
        html += '<p class="cue">' + esc(bandLabel(state.scoreBand) || "按住下面的按钮说话，松开就结束") + "</p>";
        html += '<button class="mic' + (state.recOn ? " rec" : "") + '" data-act="mic">' +
          (state.recOn ? "正在录音，松开结束" : "按住说话") + "</button>";
        html += '<div class="row"><button class="secondary" data-act="play">听示范</button>';
        html += '<button class="secondary" data-act="mine"' + (state.lastBlob ? "" : " disabled") + ">听我的</button></div>";
        html += '<button class="primary" data-act="next-phrase">下一句</button>';
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
      btn.addEventListener("click", function () { onAct(btn.getAttribute("data-act")); });
    });
    const mic = $app.querySelector(".mic");
    if (mic) {
      const start = async function (ev) {
        ev.preventDefault();
        if (state.recOn) return;
        try {
          await startRec();
          state.recOn = true;
          mic.classList.add("rec");
          mic.textContent = "正在录音，松开结束";
        } catch (err) {
          state.banner = isFile() || insecure()
            ? "这里无法使用麦克风。请通过 http://localhost:8080 或 HTTPS 打开后再试。"
            : "没有拿到麦克风权限。请在浏览器设置里允许本页使用麦克风。";
          render();
        }
      };
      const end = async function (ev) {
        ev.preventDefault();
        if (!state.recOn) return;
        const blob = await stopRec();
        state.recOn = false;
        if (blob && blob.size > 80) {
          state.lastBlob = blob;
          const lesson = state.lesson;
          const ph = lesson.phrases[state.phraseIndex];
          state.recordings[ph.id] = blob;
          state.scoreBand = await scoreBlob(blob);
        }
        render();
      };
      mic.addEventListener("pointerdown", start);
      mic.addEventListener("pointerup", end);
      mic.addEventListener("pointercancel", end);
      mic.addEventListener("pointerleave", function (ev) { if (state.recOn) end(ev); });
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
    state.lesson = lesson;
    state.practice = !!practice;
    state.phraseIndex = 0;
    state.revealZh = false;
    state.recordings = {};
    state.lastBlob = null;
    state.scoreBand = 0;
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
    if (act === "home") { state.view = "home"; state.parentAuthed = false; state.tipLesson = null; setBanner(); render(); return; }
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
    if (act === "to-speak") { state.view = "speak"; state.lastBlob = null; state.scoreBand = 0; render(); return; }
    if (act === "mine") { if (state.lastBlob) await playBlob(state.lastBlob); return; }
    if (act === "next-phrase") {
      if (state.phraseIndex < lesson.phrases.length - 1) {
        state.phraseIndex += 1;
        state.revealZh = false;
        state.lastBlob = null;
        state.scoreBand = 0;
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
    setBanner();
    try {
      const res = await fetch("data/curriculum.json");
      data = await res.json();
    } catch (e) {
      $app.innerHTML = '<div class="banner">没有读到课程数据。请不要只用双击打开单个文件：请先运行文件夹里的启动脚本，再用浏览器打开 http://localhost:8080 。如果是从网站打开，请确认 data/curriculum.json 和网页在一起。</div>';
      return;
    }
    if ("serviceWorker" in navigator && window.isSecureContext) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
    render();
  }

  boot();
})();
