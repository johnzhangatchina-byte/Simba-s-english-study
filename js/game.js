(function () {
  "use strict";

  const CHAR = {
    simba: { id: "simba", name: "辛巴", nameEn: "Simba", role: "小队学员" },
    nilo: { id: "nilo", name: "妮萝", nameEn: "Nilo", role: "电台队长" },
    reed: { id: "reed", name: "里德", nameEn: "Reed", role: "小路侦察员" }
  };

  const POSES = {
    simba: ["idle", "talk", "wave", "point", "pointout", "ready", "thumbs"],
    nilo: ["idle", "talk", "wave", "thumbs"],
    reed: ["idle", "talk", "wave", "thumbs"]
  };

  const SPOTS = {
    start: { x: 62, y: 91, label: "院子" },
    radio: { x: 27, y: 70, label: "电台帐篷" },
    table: { x: 42, y: 82, label: "地图桌" },
    path: { x: 70, y: 74, label: "小路" },
    gate: { x: 84, y: 58, label: "营门" },
    crates: { x: 61, y: 71, label: "箱子" },
    gather: { x: 50, y: 78, label: "集合点" }
  };

  const HOME = { simba: "start", nilo: "radio", reed: "crates" };

  const GAME_LESSON = {
    id: "p1-w01-tue",
    titleZh: "小队集合",
    introZh: "今天是小队集合日。跟着辛巴走过去，和队友说话，再录下这五句话。",
    tip: {
      id: "p1-w01-tue-tip",
      titleZh: "告诉名字",
      en: "Tell the team your name so they know you.",
      zh: "告诉小队你的名字，他们才认识你。"
    },
    sticker: "radio",
    phrases: [
      { id: "p1-w01-tue-p0", en: "My name is Simba.", zh: "我叫 Simba。", cue: "指向自己", audio: "audio/p1-w01-tue-0-my-name-is-simba.mp3" },
      { id: "p1-w01-tue-p1", en: "I'm ready.", zh: "我准备好了。", cue: "举手", audio: "audio/p1-w01-tue-1-i-m-ready.mp3" },
      { id: "p1-w01-tue-p2", en: "We are a team.", zh: "我们是一个小队。", cue: "三人站一起", audio: "audio/p1-w01-tue-2-we-are-a-team.mp3" },
      { id: "p1-w01-tue-p3", en: "This is my friend.", zh: "这是我的朋友。", cue: "介绍身边的人" },
      { id: "p1-w01-tue-p4", en: "How are you?", zh: "你怎么样？", cue: "微笑询问" }
    ]
  };

  const MISSIONS = [
    {
      id: "p1-w01-tue-p0",
      titleZh: "任务 1 · 报到",
      goalZh: "走到电台帐篷，向妮萝介绍自己。",
      hintZh: "点左边的电台帐篷，走到妮萝那里。",
      interactHintZh: "点一下辛巴，介绍你自己。",
      target: "radio",
      npc: "nilo",
      interact: "tap-self",
      pose: "point",
      successPose: "thumbs",
      npcSuccess: "thumbs",
      actionLabel: "介绍自己",
      dialogue: [
        { who: "nilo", text: "欢迎来到小队集合。我是电台队长妮萝。" },
        { who: "nilo", text: "先告诉大家，你叫什么名字？点一点辛巴，介绍你自己。" }
      ]
    },
    {
      id: "p1-w01-tue-p1",
      titleZh: "任务 2 · 准备好",
      goalZh: "走到营门，举手说：我准备好了。",
      hintZh: "点右边的营门，走过去准备出发。",
      interactHintZh: "点「举手」，做出准备好的动作。",
      target: "gate",
      npc: null,
      interact: "raise-hand",
      pose: "ready",
      successPose: "thumbs",
      actionLabel: "举手",
      dialogue: [
        { who: "nilo", text: "营门那边要集合了。走到营门，举手告诉大家：我准备好了。" }
      ]
    },
    {
      id: "p1-w01-tue-p2",
      titleZh: "任务 3 · 我们是小队",
      goalZh: "走到集合点，和队友站在一起。",
      hintZh: "点中间的地图桌，走到集合点。",
      interactHintZh: "点「站在一起」，大家集合。",
      target: "gather",
      npc: "both",
      interact: "gather",
      pose: "wave",
      successPose: "thumbs",
      actionLabel: "站在一起",
      gather: true,
      dialogue: [
        { who: "nilo", text: "很好。现在到桌子这边来，我们站在一起。" },
        { who: "reed", text: "来吧，我们是一个小队。" }
      ]
    },
    {
      id: "p1-w01-tue-p3",
      titleZh: "任务 4 · 介绍朋友",
      goalZh: "走到里德身边，介绍你的朋友。",
      hintZh: "点箱子旁边的里德，走过去。",
      interactHintZh: "点一下里德，介绍你的朋友。",
      target: "crates",
      npc: "reed",
      interact: "tap-npc",
      pose: "pointout",
      successPose: "thumbs",
      npcSuccess: "wave",
      actionLabel: "介绍朋友",
      dialogue: [
        { who: "reed", text: "你好，我是小路侦察员里德。" },
        { who: "nilo", text: "把你的朋友介绍给大家吧。点一下里德。" }
      ]
    },
    {
      id: "p1-w01-tue-p4",
      titleZh: "任务 5 · 关心队友",
      goalZh: "走到妮萝那里，问问她怎么样。",
      hintZh: "再回到电台帐篷，问问妮萝。",
      interactHintZh: "点一下妮萝，问候她。",
      target: "radio",
      npc: "nilo",
      interact: "tap-npc",
      pose: "talk",
      successPose: "thumbs",
      npcSuccess: "wave",
      actionLabel: "问候妮萝",
      dialogue: [
        { who: "nilo", text: "辛巴，来问一问队友：你怎么样？" }
      ]
    }
  ];

  const game = {
    screen: "brief",
    mission: 0,
    phase: "navigate",
    talkLine: 0,
    hintOn: false,
    hintTimer: 0,
    playToken: 0,
    walkTimer: 0,
    walkFrame: 1,
    lastRecKind: "",
    celebrating: false,
    doneFlags: [false, false, false, false, false],
    actors: {
      simba: { x: 62, y: 91, spot: "start", facing: "left", pose: "idle", moving: false },
      nilo: { x: 27, y: 70, spot: "radio", facing: "right", pose: "idle", moving: false },
      reed: { x: 61, y: 71, spot: "crates", facing: "left", pose: "idle", moving: false }
    }
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

  function mission() {
    return MISSIONS[game.mission];
  }

  function phrase() {
    return GAME_LESSON.phrases[game.mission];
  }

  function preload() {
    const urls = ["images/game/camp-map.webp"];
    ["simba", "nilo", "reed"].forEach(function (id) {
      urls.push("images/game/" + id + "-portrait.webp");
      POSES[id].forEach(function (p) { urls.push("images/game/" + id + "-" + p + ".webp"); });
    });
    for (let i = 1; i <= 4; i++) urls.push("images/game/simba-walk-" + i + ".webp");
    urls.forEach(function (src) { const img = new Image(); img.src = src; });
  }

  function cancelPlay() {
    game.playToken += 1;
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  }

  function clearHintTimer() {
    if (game.hintTimer) {
      clearTimeout(game.hintTimer);
      game.hintTimer = 0;
    }
  }

  function armHint() {
    clearHintTimer();
    game.hintOn = false;
    hideHint();
    game.hintTimer = setTimeout(function () {
      if (game.screen !== "play") return;
      if (game.phase !== "navigate" && game.phase !== "interact") return;
      const m = mission();
      if (!m) return;
      game.hintOn = true;
      showHint(game.phase === "navigate" ? m.hintZh : (m.interactHintZh || m.hintZh));
    }, 7000);
  }

  function showHint(text) {
    const map = document.getElementById("game-map-wrap");
    if (!map) return;
    let el = map.querySelector(".game-hint");
    if (!el) {
      el = document.createElement("div");
      el.className = "game-hint";
      map.appendChild(el);
    }
    el.textContent = text;
    el.hidden = false;
  }

  function hideHint() {
    const el = document.querySelector(".game-hint");
    if (el) el.hidden = true;
  }

  function syncLessonState() {
    const api = S();
    if (!api) return;
    const state = api.getState();
    state.view = "game";
    state.lesson = GAME_LESSON;
    state.phraseIndex = game.mission;
    const ph = phrase();
    if (ph && state.recordings && state.recordings[ph.id] && !state.lastBlob) {
      state.lastBlob = state.recordings[ph.id];
    }
  }

  function resetRecForMission() {
    const api = S();
    if (!api) return;
    const state = api.getState();
    const ph = phrase();
    state.view = "game";
    state.lesson = GAME_LESSON;
    state.phraseIndex = game.mission;
    state.revealZh = false;
    state.lastBlob = (ph && state.recordings && state.recordings[ph.id]) || null;
    if (!state.lastBlob) {
      state.scoreBand = 0;
      state.recMsg = "";
      state.recMsgKind = "";
    }
    state.recOn = false;
    game.lastRecKind = "";
  }

  function actorEl(id) {
    return document.querySelector('.game-actor[data-char="' + id + '"]');
  }

  function poseSrc(id, pose) {
    return "images/game/" + id + "-" + pose + ".webp";
  }

  function applyActorPose(id) {
    const a = game.actors[id];
    const el = actorEl(id);
    if (!el || !a) return;
    const pose = a.moving && id === "simba" ? "walk" : (a.pose || "idle");
    el.className = "game-actor " + id + " pose-" + pose +
      (a.facing === "left" ? " facing-left" : " facing-right") +
      (a.moving ? " moving" : "") +
      (isInteractTarget(id) ? " target" : "");
    el.style.left = a.x + "%";
    el.style.top = a.y + "%";
    el.style.zIndex = String(10 + Math.round(a.y));
    const imgs = el.querySelectorAll(".sprite img");
    imgs.forEach(function (img) {
      const p = img.getAttribute("data-pose");
      if (pose === "walk") {
        img.classList.toggle("show", p === "walk-" + game.walkFrame);
      } else {
        img.classList.toggle("show", p === pose);
      }
    });
  }

  function placeAll() {
    ["simba", "nilo", "reed"].forEach(applyActorPose);
    document.querySelectorAll(".game-spot").forEach(function (btn) {
      const id = btn.getAttribute("data-spot");
      const m = mission();
      btn.classList.toggle("target", !!(m && game.phase === "navigate" && m.target === id));
      const mi = MISSIONS.findIndex(function (x) { return x.target === id && game.doneFlags[MISSIONS.indexOf(x)]; });
      btn.classList.toggle("done", game.doneFlags.some(function (_, i) { return MISSIONS[i].target === id && game.doneFlags[i]; }));
    });
  }

  function isInteractTarget(id) {
    if (game.screen !== "play") return false;
    if (game.phase !== "interact") return false;
    const m = mission();
    if (!m) return false;
    if (m.interact === "tap-self") return id === "simba";
    if (m.interact === "tap-npc") return id === m.npc;
    if (m.interact === "gather") return id === "simba" || id === "nilo" || id === "reed";
    if (m.interact === "raise-hand") return id === "simba";
    return false;
  }

  function startWalkFrames() {
    if (game.walkTimer) return;
    game.walkTimer = setInterval(function () {
      game.walkFrame = (game.walkFrame % 4) + 1;
      if (game.actors.simba.moving) applyActorPose("simba");
      else stopWalkFrames();
    }, 140);
  }

  function stopWalkFrames() {
    if (game.walkTimer) {
      clearInterval(game.walkTimer);
      game.walkTimer = 0;
    }
    game.walkFrame = 1;
  }

  function approachSpot(id, spotId) {
    const spot = SPOTS[spotId];
    const dest = { x: spot.x, y: spot.y };
    if (id !== "simba") return dest;
    const blocked = ["nilo", "reed"].some(function (other) {
      const actor = game.actors[other];
      return actor && Math.hypot(actor.x - spot.x, actor.y - spot.y) < 8;
    });
    if (!blocked) return dest;
    const shift = spot.x <= 50 ? 18 : -18;
    dest.x = Math.max(14, Math.min(88, spot.x + shift));
    dest.y = Math.min(94, spot.y + 1);
    return dest;
  }

  function walkTo(id, spotId, done) {
    const a = game.actors[id];
    const spot = SPOTS[spotId];
    const dest = spot ? approachSpot(id, spotId) : null;
    if (!a || !dest) { if (done) done(); return; }
    const dx = dest.x - a.x;
    const dy = dest.y - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1.4) {
      a.x = dest.x;
      a.y = dest.y;
      a.spot = spotId;
      a.moving = false;
      applyActorPose(id);
      if (done) done();
      return;
    }
    if (Math.abs(dx) > 0.6) a.facing = dx < 0 ? "left" : "right";
    a.moving = true;
    if (id === "simba") {
      a.pose = "walk";
      startWalkFrames();
    }
    const dur = Math.min(2400, Math.max(650, dist * 28));
    const fromX = a.x;
    const fromY = a.y;
    const t0 = performance.now();
    const token = ++game.playToken;
    function step(now) {
      if (token !== game.playToken && id === "simba") {
        /* a new cancel only bumps playToken for audio; walks use their own check via moving flag */
      }
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      a.x = fromX + dx * e;
      a.y = fromY + dy * e;
      applyActorPose(id);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        a.x = dest.x;
        a.y = dest.y;
        a.spot = spotId;
        a.moving = false;
        if (a.pose === "walk") a.pose = "idle";
        applyActorPose(id);
        if (id === "simba") stopWalkFrames();
        if (done) done();
      }
    }
    requestAnimationFrame(step);
  }

  function gatherOffsets(spotId) {
    const c = SPOTS[spotId];
    return {
      simba: { x: c.x - 8, y: c.y + 1, facing: "right" },
      nilo: { x: c.x, y: c.y - 1, facing: "right" },
      reed: { x: c.x + 9, y: c.y + 1, facing: "left" }
    };
  }

  function walkActorToPoint(id, point, done) {
    const a = game.actors[id];
    if (!a || !point) { if (done) done(); return; }
    const dest = { x: point.x, y: point.y };
    const dx = dest.x - a.x;
    const dy = dest.y - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1.4) {
      a.x = dest.x;
      a.y = dest.y;
      if (point.facing) a.facing = point.facing;
      a.moving = false;
      applyActorPose(id);
      if (done) done();
      return;
    }
    if (Math.abs(dx) > 0.6) a.facing = dx < 0 ? "left" : "right";
    a.moving = true;
    if (id === "simba") {
      a.pose = "walk";
      startWalkFrames();
    }
    const dur = Math.min(2400, Math.max(650, dist * 28));
    const fromX = a.x;
    const fromY = a.y;
    const t0 = performance.now();
    function step(now) {
      const t = Math.min(1, (now - t0) / dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      a.x = fromX + dx * e;
      a.y = fromY + dy * e;
      applyActorPose(id);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        a.x = dest.x;
        a.y = dest.y;
        a.moving = false;
        if (a.pose === "walk") a.pose = "idle";
        if (point.facing) a.facing = point.facing;
        applyActorPose(id);
        if (id === "simba") stopWalkFrames();
        if (done) done();
      }
    }
    requestAnimationFrame(step);
  }

  function beginMission(index, opts) {
    opts = opts || {};
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    cancelPlay();
    hideHint();
    if (index >= MISSIONS.length) {
      finishDay();
      return;
    }
    game.screen = "play";
    game.mission = index;
    game.phase = "navigate";
    game.talkLine = 0;
    game.celebrating = false;
    game.actors.simba.pose = "idle";
    game.actors.nilo.pose = "idle";
    game.actors.reed.pose = "idle";
    resetRecForMission();
    if (api && api.render) api.render();
    armHint();
    /* Send teammates home unless this is a gather mission mid-way. */
    if (!opts.keepPlaces) {
      if (game.actors.nilo.spot !== HOME.nilo) walkTo("nilo", HOME.nilo);
      if (game.actors.reed.spot !== HOME.reed) walkTo("reed", HOME.reed);
    }
  }

  function arrivedAtTarget() {
    const m = mission();
    if (!m) return;
    game.phase = "talk";
    game.talkLine = 0;
    const npc = m.npc === "both" ? "nilo" : (m.npc || "nilo");
    if (game.actors[npc]) {
      const dx = game.actors.simba.x - game.actors[npc].x;
      game.actors[npc].facing = dx < 0 ? "left" : "right";
      game.actors[npc].pose = "talk";
      game.actors.simba.facing = dx < 0 ? "right" : "left";
    }
    hideHint();
    const api = S();
    if (api && api.render) api.render();
    speakLine();
    armHint();
  }

  function maybeArrive(spotId) {
    const m = mission();
    if (!m || game.phase !== "navigate") return;
    if (spotId === m.target) arrivedAtTarget();
    else {
      game.hintOn = true;
      showHint(m.hintZh);
      armHint();
    }
  }

  function goToSpot(spotId) {
    if (game.screen !== "play") return;
    if (game.actors.simba.moving) return;
    const api = S();
    if (api && api.getState && api.getState().recOn) return;
    hideHint();
    const m = mission();
    /* Character standing on that spot? Treat as talking to them once we arrive. */
    walkTo("simba", spotId, function () {
      maybeArrive(spotId);
    });
    if (m && game.phase === "navigate" && spotId !== m.target) {
      showHint(m.hintZh);
    }
  }

  function goToCharacter(id) {
    if (game.screen !== "play") return;
    const api = S();
    if (api && api.getState && api.getState().recOn) return;
    if (game.phase === "interact") {
      tryInteract(id);
      return;
    }
    if (id === "simba" && game.phase === "navigate") {
      /* tapping self while navigating does nothing special */
      return;
    }
    const a = game.actors[id];
    if (!a) return;
    if (game.actors.simba.moving) return;
    hideHint();
    const m = mission();
    const destSpot = a.spot || (id === "nilo" ? "radio" : "crates");
    const already = Math.hypot(game.actors.simba.x - a.x, game.actors.simba.y - a.y) < 8;
    function after() {
      if (m && game.phase === "navigate") {
        if (m.target === destSpot || m.npc === id || m.npc === "both") arrivedAtTarget();
        else showHint(m.hintZh);
      } else if (game.phase === "interact") {
        tryInteract(id);
      }
    }
    if (already) after();
    else walkTo("simba", destSpot, after);
  }

  function speakLine() {
    const api = S();
    const m = mission();
    if (!api || !m) return;
    const line = m.dialogue[game.talkLine];
    if (!line) return;
    const who = line.who;
    ["nilo", "reed"].forEach(function (id) {
      game.actors[id].pose = (id === who) ? "talk" : "idle";
    });
    applyActorPose("nilo");
    applyActorPose("reed");
    const token = ++game.playToken;
    api.sayZh(line.text).then(function () {
      if (token !== game.playToken) return;
      if (game.actors[who]) {
        game.actors[who].pose = "idle";
        applyActorPose(who);
      }
    });
  }

  function advanceTalk() {
    const m = mission();
    if (!m || game.phase !== "talk") return;
    cancelPlay();
    if (game.talkLine < m.dialogue.length - 1) {
      game.talkLine += 1;
      const api = S();
      if (api && api.render) api.render();
      speakLine();
      armHint();
      return;
    }
    game.phase = "interact";
    const api = S();
    if (api && api.render) api.render();
    armHint();
  }

  function tryInteract(id) {
    const m = mission();
    if (!m || game.phase !== "interact") return;
    if (m.interact === "tap-self" && id && id !== "simba") return;
    if (m.interact === "tap-npc" && id && id !== m.npc) {
      showHint(m.interactHintZh);
      return;
    }
    if (m.interact === "gather") {
      startGatherThenListen();
      return;
    }
    doGestureThenListen();
  }

  function doGestureThenListen() {
    const m = mission();
    game.actors.simba.pose = m.pose || "talk";
    if (m.npc && m.npc !== "both" && game.actors[m.npc]) {
      game.actors[m.npc].pose = "talk";
    }
    applyActorPose("simba");
    if (m.npc && game.actors[m.npc]) applyActorPose(m.npc);
    beginListen();
  }

  function startGatherThenListen() {
    const pts = gatherOffsets("gather");
    let left = 3;
    function one() {
      left -= 1;
      if (left <= 0) {
        game.actors.simba.pose = "wave";
        game.actors.nilo.pose = "wave";
        game.actors.reed.pose = "wave";
        placeAll();
        beginListen();
      }
    }
    walkActorToPoint("simba", pts.simba, one);
    walkActorToPoint("nilo", pts.nilo, one);
    walkActorToPoint("reed", pts.reed, one);
  }

  async function beginListen() {
    const api = S();
    const ph = phrase();
    const m = mission();
    if (!api || !ph) return;
    cancelPlay();
    game.phase = "listen";
    hideHint();
    const state = api.getState();
    state.revealZh = false;
    state.view = "game";
    state.lesson = GAME_LESSON;
    state.phraseIndex = game.mission;
    if (api.render) api.render();
    const token = ++game.playToken;
    game.actors.simba.pose = "talk";
    applyActorPose("simba");
    try {
      if (api.unlockAudio) api.unlockAudio();
      await api.playModel(ph);
    } catch (e) {}
    if (token !== game.playToken) return;
    state.revealZh = true;
    game.actors.simba.pose = m.pose || "idle";
    if (api.render) api.render();
    try { await api.sayZh(ph.zh); } catch (e2) {}
    if (token !== game.playToken) return;
    game.phase = "invite";
    if (api.render) api.render();
    armHint();
  }

  async function replay(slow) {
    const api = S();
    const ph = phrase();
    if (!api || !ph) return;
    if (api.getState().recOn) return;
    if (api.unlockAudio) api.unlockAudio();
    const token = ++game.playToken;
    game.actors.simba.pose = "talk";
    applyActorPose("simba");
    try { await api.playModel(ph, !!slow); } catch (e) {}
    if (token !== game.playToken) return;
    game.actors.simba.pose = (mission() && mission().pose) || "idle";
    applyActorPose("simba");
  }

  async function playZh() {
    const api = S();
    const ph = phrase();
    if (!api || !ph) return;
    const state = api.getState();
    state.revealZh = true;
    if (api.render) api.render();
    try { await api.sayZh(ph.zh); } catch (e) {}
  }

  function beginSpeak() {
    const api = S();
    if (!api) return;
    cancelPlay();
    const state = api.getState();
    if (state.recOn) return;
    game.phase = "speak";
    state.view = "game";
    state.lesson = GAME_LESSON;
    state.phraseIndex = game.mission;
    if (!state.lastBlob) {
      state.scoreBand = 0;
      state.recMsg = "";
      state.recMsgKind = "";
    }
    if (api.render) api.render();
    api.beginSpeakCapture();
  }

  function onRecResult(state) {
    if (game.screen !== "play" || game.phase !== "speak") return;
    if (state.recMsgKind === "ok" && !game.doneFlags[game.mission]) {
      game.doneFlags[game.mission] = true;
      game.celebrating = true;
      game.phase = "success";
      const m = mission();
      game.actors.simba.pose = (m && m.successPose) || "thumbs";
      if (m && m.npcSuccess) {
        if (m.npc === "both" || !m.npc) {
          game.actors.nilo.pose = m.npcSuccess;
          game.actors.reed.pose = m.npcSuccess;
        } else if (game.actors[m.npc]) {
          game.actors[m.npc].pose = m.npcSuccess;
        }
      } else {
        game.actors.nilo.pose = "thumbs";
        if (m && m.gather) game.actors.reed.pose = "thumbs";
      }
    }
  }

  function nextMission() {
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    beginMission(game.mission + 1);
  }

  function finishDay() {
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    cancelPlay();
    game.screen = "done";
    game.phase = "done";
    game.actors.simba.pose = "thumbs";
    game.actors.nilo.pose = "thumbs";
    game.actors.reed.pose = "thumbs";
    try {
      if (api && api.loadProgress) {
        const p = api.loadProgress();
        if (p && p.completed && !p.completed[GAME_LESSON.id]) {
          p.completed[GAME_LESSON.id] = { at: new Date().toISOString().slice(0, 10), sticker: "radio" };
          try { localStorage.setItem("simba-squad-progress-v1", JSON.stringify(p)); } catch (e) {}
        }
      }
    } catch (e2) {}
    if (api && api.render) api.render();
    if (api && api.sayZh) api.sayZh(GAME_LESSON.tip.zh);
  }

  function goYear() {
    cancelPlay();
    stopWalkFrames();
    clearHintTimer();
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    document.body.classList.remove("game-open");
    if (api && api.goYearCourse) api.goYearCourse();
  }

  function goToday() {
    cancelPlay();
    stopWalkFrames();
    clearHintTimer();
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    document.body.classList.remove("game-open");
    if (window.TodayLesson && typeof window.TodayLesson.start === "function") {
      window.TodayLesson.start();
    }
  }

  function start(opts) {
    opts = opts || {};
    preload();
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    cancelPlay();
    stopWalkFrames();
    clearHintTimer();
    document.body.classList.remove("today-open");
    document.body.classList.add("game-open");
    game.screen = opts.screen || "brief";
    game.mission = opts.mission || 0;
    game.phase = "navigate";
    game.talkLine = 0;
    game.hintOn = false;
    game.celebrating = false;
    game.lastRecKind = "";
    game.doneFlags = [false, false, false, false, false];
    game.actors.simba = { x: 62, y: 91, spot: "start", facing: "left", pose: "idle", moving: false };
    game.actors.nilo = { x: 27, y: 70, spot: "radio", facing: "right", pose: "wave", moving: false };
    game.actors.reed = { x: 61, y: 71, spot: "crates", facing: "left", pose: "wave", moving: false };
    const state = api ? api.getState() : null;
    if (state) {
      state.view = "game";
      state.lesson = GAME_LESSON;
      state.phraseIndex = 0;
      state.revealZh = false;
      state.recordings = {};
      state.lastBlob = null;
      state.scoreBand = 0;
      state.recMsg = "";
      state.recMsgKind = "";
      state.recOn = false;
    }
    if (api && api.setBanner) api.setBanner();
    if (routeFromHash()) return;
    if (api && api.render) api.render();
    else render();
  }

  function routeFromHash() {
    const h = String(location.hash || "").replace(/^#/, "");
    if (h === "today" || h === "lesson") {
      goToday();
      return true;
    }
    if (h === "year" || h === "course") {
      goYear();
      return true;
    }
    return false;
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

  function topBar(title) {
    return '<div class="game-top"><div class="brand">' + esc(title || "小队电台英语") + "</div>" +
      '<div class="top-actions">' +
      '<button type="button" class="icon-btn" data-act="game-today">上一课</button>' +
      '<button type="button" class="icon-btn" data-act="game-year">全年课程</button>' +
      "</div></div>";
  }

  function stampsHtml() {
    let html = '<div class="game-stamps" aria-label="今日任务">';
    for (let i = 0; i < MISSIONS.length; i++) {
      const cls = game.doneFlags[i] ? " done" : (i === game.mission && game.screen === "play" ? " now" : "");
      html += '<span class="game-stamp' + cls + '" title="' + esc(MISSIONS[i].titleZh) + '">' +
        (game.doneFlags[i] ? "★" : (i + 1)) + "</span>";
    }
    return html + "</div>";
  }

  function hudHtml() {
    const m = mission();
    if (!m) return "";
    return '<div class="game-hud"><div class="hud-row"><p class="mission-title">' + esc(m.titleZh) +
      "</p><span>" + (game.doneFlags.filter(Boolean).length) + " / 5</span></div>" +
      '<p class="goal">' + esc(m.goalZh) + "</p>" + stampsHtml() + "</div>";
  }

  function actorHtml(id) {
    const a = game.actors[id];
    const c = CHAR[id];
    let html = '<button type="button" class="game-actor ' + id + ' pose-' + esc(a.pose) +
      (a.facing === "left" ? " facing-left" : "") +
      '" data-act="game-char-' + id + '" data-char="' + id +
      '" style="left:' + a.x + "%;top:" + a.y + "%;z-index:" + (10 + Math.round(a.y)) +
      '" aria-label="' + esc(c.name + "，" + c.role) + '">';
    html += '<span class="who">' + esc(c.name) + "</span>";
    html += '<div class="flip"><div class="sprite">';
    POSES[id].forEach(function (p) {
      html += '<img data-pose="' + p + '" src="' + poseSrc(id, p) + '" alt="">';
    });
    if (id === "simba") {
      for (let i = 1; i <= 4; i++) {
        html += '<img data-pose="walk-' + i + '" src="images/game/simba-walk-' + i + '.webp" alt="">';
      }
    }
    html += "</div></div></button>";
    return html;
  }

  function mapHtml() {
    let html = '<div class="game-map-wrap" id="game-map-wrap">';
    html += '<div class="game-map" role="img" aria-label="营地院子"></div>';
    html += '<div class="game-map-fx"></div>';
    Object.keys(SPOTS).forEach(function (id) {
      const s = SPOTS[id];
      const m = mission();
      const cls = (m && game.phase === "navigate" && m.target === id) ? " target" : "";
      html += '<button type="button" class="game-spot' + cls + '" data-act="game-spot-' + id +
        '" data-spot="' + id + '" style="left:' + s.x + "%;top:" + s.y +
        '%" aria-label="' + esc(s.label) + '"><span class="ring"></span><span class="spot-label">' +
        esc(s.label) + "</span></button>";
    });
    html += actorHtml("nilo") + actorHtml("reed") + actorHtml("simba");
    html += "</div>";
    return html;
  }

  function speakPanel() {
    const api = S();
    const state = api.getState();
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
    return html;
  }

  function dockHtml() {
    const api = S();
    const state = api.getState() || { revealZh: false };
    const m = mission();
    const ph = phrase();
    let html = '<div class="game-dock" id="game-dock">';
    if (game.phase === "talk") {
      const line = m.dialogue[game.talkLine] || m.dialogue[0];
      const who = CHAR[line.who];
      html += '<div class="game-dialog" data-act="game-advance" role="button" aria-label="继续对话">';
      html += '<img class="portrait" src="images/game/' + line.who + '-portrait.webp" alt="' + esc(who.name) + '">';
      html += '<div class="body"><p class="who-line">' + esc(who.name) + "<small>" + esc(who.role) + "</small></p>";
      html += '<p class="line">' + esc(line.text) + "</p>";
      html += '<p class="advance">' + (game.talkLine < m.dialogue.length - 1 ? "点这里继续 ▸" : "点这里开始任务 ▸") + "</p>";
      html += "</div></div>";
    } else if (game.phase === "interact") {
      html += '<p class="game-kicker">' + esc(m.titleZh) + "</p>";
      html += '<p class="game-goal-plain">' + esc(m.interactHintZh) + "</p>";
      html += '<button class="primary" data-act="game-action">' + esc(m.actionLabel || "开始") + "</button>";
    } else if (game.phase === "listen") {
      html += '<p class="game-kicker">' + esc(m.titleZh) + "</p>";
      html += '<p class="phrase">' + esc(ph.en) + "</p>";
      html += '<p class="zh">' + (state.revealZh ? esc(ph.zh) : "正在听英语…") + "</p>";
      html += '<p class="cue">先听示范，也可以再听一遍。</p>';
    } else if (game.phase === "invite" || game.phase === "speak" || game.phase === "success") {
      html += '<p class="game-kicker">' + esc(m.titleZh) + "</p>";
      html += '<p class="phrase">' + esc(ph.en) + "</p>";
      html += '<p class="zh">' + (state.revealZh ? esc(ph.zh) : "先听英语，或点「中文」看意思") + "</p>";
      if (game.phase === "success") {
        html += '<div class="game-success"><span class="ok-flag">任务完成 ★</span></div>';
        html += speakPanel();
        const last = game.mission >= MISSIONS.length - 1;
        html += '<button class="primary" data-act="game-next">' + (last ? "完成今日任务" : "下一个任务") + "</button>";
      } else if (game.phase === "speak") {
        html += speakPanel();
      } else {
        html += '<p class="cue">' + esc(ph.cue || "先听，再说") + "</p>";
        html += '<button class="horn" data-act="play">再听一遍</button>';
        html += '<div class="row"><button class="secondary" data-act="slow">慢速</button>';
        html += '<button class="secondary" data-act="zh">中文</button></div>';
        html += '<button class="primary" data-act="to-speak">我听完了，开始说</button>';
      }
    } else {
      html += '<p class="game-kicker">' + esc(m.titleZh) + "</p>";
      html += '<p class="game-goal-plain">' + esc(m.hintZh) + "</p>";
    }
    html += "</div>";
    return html;
  }

  function render() {
    const app = document.getElementById("app");
    if (!app) return;
    document.body.classList.add("game-open");
    document.body.classList.remove("today-open");
    const api = S();
    const state = api ? api.getState() : { recMsgKind: "", recOn: false };
    if (state && game.phase === "speak" && !state.recOn) {
      onRecResult(state);
    }
    syncLessonState();

    if (game.screen === "brief") {
      let html = bannerHtml();
      html += '<div class="game-wrap">';
      html += topBar("小队电台英语");
      html += '<div class="game-brief-art"><img src="images/game/camp-map.webp" alt="营地集合点"></div>';
      html += '<div class="game-dock">';
      html += '<p class="game-kicker">周二 · 小队集合</p>';
      html += '<h1 class="game-title">今天有五个任务</h1>';
      html += '<p class="sub" style="text-align:center">走进营地，点角色，走到帐篷、桌子和营门，再录下今天的五句话。</p>';
      html += '<div class="game-cast">';
      ["simba", "nilo", "reed"].forEach(function (id) {
        const c = CHAR[id];
        html += '<div class="member"><img src="images/game/' + id + '-portrait.webp" alt="' + esc(c.name) + '">' +
          '<div class="nm">' + esc(c.name) + '</div><div class="rl">' + esc(c.role) + "</div></div>";
      });
      html += "</div>";
      html += '<button class="primary" data-act="game-start">出发</button>';
      html += '<button class="ghost" data-act="game-today">上一课：今日动画课</button>';
      html += "</div></div>";
      app.innerHTML = html;
      return;
    }

    if (game.screen === "done") {
      let html = bannerHtml();
      html += '<div class="game-wrap game-done">';
      html += topBar("小队电台英语");
      html += mapHtml();
      html += '<div class="game-dock">';
      html += '<div class="sticker-art">🏅</div>';
      html += '<h1 class="game-title">小队集合完成</h1>';
      html += stampsHtml();
      html += '<p class="tip-title">' + esc(GAME_LESSON.tip.titleZh) + "</p>";
      html += '<p class="en" style="text-align:center;font-weight:800;margin:8px 0 4px">' + esc(GAME_LESSON.tip.en) + "</p>";
      html += '<p class="zh">' + esc(GAME_LESSON.tip.zh) + "</p>";
      html += '<button class="primary" data-act="game-again">再玩一次</button>';
      html += '<button class="secondary" data-act="game-today">打开上一课</button>';
      html += '<button class="ghost" data-act="game-year">打开全年课程</button>';
      html += "</div></div>";
      app.innerHTML = html;
      return;
    }

    let html = bannerHtml();
    html += '<div class="game-wrap">';
    html += topBar("小队集合 " + (game.mission + 1) + " / 5");
    html += hudHtml();
    html += mapHtml();
    html += dockHtml();
    html += "</div>";
    app.innerHTML = html;
  }

  function afterRender() {
    if (game.screen === "play" || game.screen === "done") placeAll();
    if (game.screen === "play") {
      if (game.phase === "navigate" || game.phase === "interact" || game.phase === "invite") armHint();
    }
  }

  function onAct(act) {
    const api = S();
    const state = api ? api.getState() : null;
    if (act === "game-year" || act === "today-year") {
      goYear();
      return true;
    }
    if (act === "game-today") {
      goToday();
      return true;
    }
    if (act === "game-start") {
      beginMission(0);
      return true;
    }
    if (act === "game-again") {
      start({ screen: "brief" });
      return true;
    }
    if (act === "game-advance") {
      advanceTalk();
      return true;
    }
    if (act === "game-action") {
      tryInteract("simba");
      return true;
    }
    if (act === "game-next") {
      if (state && state.recOn) return true;
      const last = game.mission >= MISSIONS.length - 1;
      if (last) finishDay();
      else nextMission();
      return true;
    }
    if (act.indexOf("game-spot-") === 0) {
      goToSpot(act.slice("game-spot-".length));
      return true;
    }
    if (act.indexOf("game-char-") === 0) {
      goToCharacter(act.slice("game-char-".length));
      return true;
    }
    if (act === "play") {
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
    if (act === "mine") {
      if (state && state.lastBlob && api.playBlob) api.playBlob(state.lastBlob);
      return true;
    }
    if (act === "compare") {
      const ph = phrase();
      if (state && state.lastBlob && ph && api.playCompare) {
        game.actors.simba.pose = "talk";
        applyActorPose("simba");
        Promise.resolve(api.playCompare(ph, state.lastBlob)).then(function () {
          game.actors.simba.pose = (mission() && (game.phase === "success" ? mission().successPose : mission().pose)) || "idle";
          applyActorPose("simba");
        });
      }
      return true;
    }
    if (act === "copy-link") return false;
    return false;
  }

  function preview(kind) {
    document.body.classList.add("game-open");
    document.body.classList.remove("today-open");
    const api = S();
    if (api && api.getState) {
      const state = api.getState();
      state.view = "game";
      state.lesson = GAME_LESSON;
      state.phraseIndex = 0;
      state.revealZh = true;
      state.recOn = false;
    }
    if (kind === "map") {
      game.screen = "play";
      game.mission = 0;
      game.phase = "navigate";
      game.actors.simba = { x: 62, y: 91, spot: "start", facing: "left", pose: "idle", moving: false };
      game.actors.nilo = { x: 27, y: 70, spot: "radio", facing: "right", pose: "wave", moving: false };
      game.actors.reed = { x: 61, y: 71, spot: "crates", facing: "left", pose: "idle", moving: false };
    } else if (kind === "talk") {
      game.screen = "play";
      game.mission = 0;
      game.phase = "talk";
      game.talkLine = 0;
      game.actors.simba = { x: 36, y: 70, spot: "radio", facing: "left", pose: "idle", moving: false };
      game.actors.nilo = { x: 27, y: 70, spot: "radio", facing: "right", pose: "talk", moving: false };
      game.actors.reed = { x: 61, y: 71, spot: "crates", facing: "left", pose: "idle", moving: false };
    } else if (kind === "walk") {
      game.screen = "play";
      game.mission = 0;
      game.phase = "navigate";
      game.walkFrame = 2;
      game.actors.simba = { x: 48, y: 80, spot: "start", facing: "left", pose: "walk", moving: true };
      game.actors.nilo = { x: 27, y: 70, spot: "radio", facing: "right", pose: "wave", moving: false };
      game.actors.reed = { x: 61, y: 71, spot: "crates", facing: "left", pose: "idle", moving: false };
    } else if (kind === "ready") {
      game.screen = "play";
      game.mission = 1;
      game.phase = "invite";
      game.actors.simba = { x: 84, y: 58, spot: "gate", facing: "left", pose: "ready", moving: false };
      game.actors.nilo = { x: 27, y: 70, spot: "radio", facing: "right", pose: "idle", moving: false };
      game.actors.reed = { x: 61, y: 71, spot: "crates", facing: "left", pose: "idle", moving: false };
    } else if (kind === "success") {
      game.screen = "play";
      game.mission = 0;
      game.phase = "success";
      game.doneFlags = [true, false, false, false, false];
      game.celebrating = true;
      game.actors.simba = { x: 36, y: 70, spot: "radio", facing: "left", pose: "thumbs", moving: false };
      game.actors.nilo = { x: 27, y: 70, spot: "radio", facing: "right", pose: "thumbs", moving: false };
      game.actors.reed = { x: 61, y: 71, spot: "crates", facing: "left", pose: "wave", moving: false };
    } else if (kind === "done") {
      game.screen = "done";
      game.phase = "done";
      game.mission = 4;
      game.doneFlags = [true, true, true, true, true];
      game.actors.simba = { x: 42, y: 80, spot: "gather", facing: "right", pose: "thumbs", moving: false };
      game.actors.nilo = { x: 50, y: 76, spot: "gather", facing: "right", pose: "thumbs", moving: false };
      game.actors.reed = { x: 59, y: 80, spot: "gather", facing: "left", pose: "thumbs", moving: false };
    }
    if (api && api.render) api.render();
    else { render(); afterRender(); }
  }

  window.GameLesson = {
    lesson: GAME_LESSON,
    start: start,
    render: render,
    afterRender: afterRender,
    onAct: onAct,
    goYear: goYear,
    goToday: goToday,
    preview: preview
  };
})();
