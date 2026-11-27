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

  const KNOWN_AUDIO = {
    "audio/p1-w01-fri-0-hello.mp3": 1,
    "audio/p1-w01-fri-1-nice-to-meet-you.mp3": 1,
    "audio/p1-w01-fri-2-let-s-go-together.mp3": 1,
    "audio/p1-w01-mon-0-hello.mp3": 1,
    "audio/p1-w01-mon-1-my-name-is-simba.mp3": 1,
    "audio/p1-w01-mon-2-i-m-ready.mp3": 1,
    "audio/p1-w01-sat-0-hello-team.mp3": 1,
    "audio/p1-w01-sat-1-i-m-ready.mp3": 1,
    "audio/p1-w01-sat-2-let-s-go-together.mp3": 1,
    "audio/p1-w01-sun-0-hello.mp3": 1,
    "audio/p1-w01-sun-1-i-m-ready.mp3": 1,
    "audio/p1-w01-sun-2-let-s-go-together.mp3": 1,
    "audio/p1-w01-thu-0-we-are-a-team.mp3": 1,
    "audio/p1-w01-thu-1-nice-to-meet-you.mp3": 1,
    "audio/p1-w01-thu-2-let-s-go-together.mp3": 1,
    "audio/p1-w01-tue-0-my-name-is-simba.mp3": 1,
    "audio/p1-w01-tue-1-i-m-ready.mp3": 1,
    "audio/p1-w01-tue-2-we-are-a-team.mp3": 1,
    "audio/p1-w01-wed-0-i-m-ready.mp3": 1,
    "audio/p1-w01-wed-1-we-are-a-team.mp3": 1,
    "audio/p1-w01-wed-2-nice-to-meet-you.mp3": 1
  };

  const PLACE_ZH = {
    start: "起点", left: "左边", right: "右边", yard: "院子",
    door: "门", window: "窗户", bag: "背包", table: "桌子",
    radio: "对讲机", team: "小队", gather: "集合点",
    gate: "营门", crates: "箱子", path: "小路"
  };

  const PLACE_ALIAS = {
    gate: "door", crates: "bag", path: "yard", gather: "team"
  };

  const CUE_PLACE = [
    [/对讲|电台|\bradio\b/i, "radio"],
    [/桌子|\btable\b/i, "table"],
    [/背包|\bbag\b/i, "bag"],
    [/窗户|\bwindow\b/i, "window"],
    [/(^|[^左])门|(^|[^a-z])door\b|营门/i, "door"],
    [/院子|\byard\b/i, "yard"],
    [/起点|\bstart\b/i, "start"],
    [/左边|向左|\bleft\b/i, "left"],
    [/右边|向右|\bright\b/i, "right"],
    [/小队|\bteam\b|集合/i, "team"]
  ];

  const PHASE_MAPS = {
    1: {
      titleZh: "入门营地",
      map: "images/game/camp-map.webp",
      mapLabel: "营地院子",
      theme: "camp",
      home: { simba: "start", nilo: "radio", reed: "crates" },
      defaults: ["radio", "gate", "gather", "crates", "table"],
      spots: {
        start: { x: 62, y: 91, label: "起点" },
        yard: { x: 70, y: 88, label: "院子" },
        radio: { x: 27, y: 70, label: "电台帐篷" },
        table: { x: 42, y: 82, label: "地图桌" },
        path: { x: 70, y: 74, label: "小路" },
        door: { x: 84, y: 58, label: "营门" },
        gate: { x: 84, y: 58, label: "营门" },
        window: { x: 38, y: 58, label: "窗户" },
        bag: { x: 18, y: 80, label: "背包" },
        crates: { x: 61, y: 71, label: "箱子" },
        left: { x: 12, y: 85, label: "左边" },
        right: { x: 88, y: 78, label: "右边" },
        team: { x: 50, y: 78, label: "小队" },
        gather: { x: 50, y: 78, label: "集合点" }
      }
    },
    2: {
      titleZh: "小队沟通",
      map: "images/game/comms-map.webp",
      mapLabel: "电台营地",
      theme: "comms",
      home: { simba: "start", nilo: "radio", reed: "right" },
      defaults: ["radio", "door", "table", "right", "yard"],
      spots: {
        start: { x: 50, y: 92, label: "起点" },
        yard: { x: 52, y: 80, label: "院子" },
        radio: { x: 26, y: 62, label: "电台帐篷" },
        table: { x: 30, y: 70, label: "电台桌" },
        bag: { x: 14, y: 78, label: "左侧" },
        door: { x: 88, y: 58, label: "小帐篷" },
        gate: { x: 88, y: 58, label: "小帐篷" },
        window: { x: 70, y: 50, label: "路牌" },
        left: { x: 12, y: 86, label: "左边" },
        right: { x: 86, y: 78, label: "右边" },
        team: { x: 50, y: 74, label: "小队" },
        gather: { x: 50, y: 74, label: "集合点" },
        path: { x: 58, y: 64, label: "小路" },
        crates: { x: 80, y: 68, label: "小桌" }
      }
    },
    3: {
      titleZh: "地图与策略",
      map: "images/game/lookout-map.webp",
      mapLabel: "望台地图桌",
      theme: "lookout",
      home: { simba: "start", nilo: "table", reed: "bag" },
      defaults: ["table", "window", "bag", "door", "left"],
      spots: {
        start: { x: 54, y: 92, label: "起点" },
        yard: { x: 48, y: 86, label: "院子" },
        table: { x: 32, y: 78, label: "地图桌" },
        radio: { x: 70, y: 62, label: "提灯" },
        bag: { x: 84, y: 78, label: "背包" },
        door: { x: 58, y: 54, label: "观景口" },
        gate: { x: 58, y: 54, label: "观景口" },
        window: { x: 44, y: 56, label: "望台" },
        left: { x: 14, y: 78, label: "左边" },
        right: { x: 88, y: 84, label: "右边" },
        team: { x: 50, y: 82, label: "小队" },
        gather: { x: 50, y: 82, label: "集合点" },
        path: { x: 60, y: 58, label: "小路" },
        crates: { x: 76, y: 70, label: "沙袋" }
      }
    },
    4: {
      titleZh: "交流与解说",
      map: "images/game/briefing-map.webp",
      mapLabel: "讲解小院",
      theme: "briefing",
      home: { simba: "start", nilo: "table", reed: "crates" },
      defaults: ["table", "door", "path", "bag", "team"],
      spots: {
        start: { x: 44, y: 92, label: "起点" },
        yard: { x: 70, y: 84, label: "院子" },
        table: { x: 46, y: 74, label: "讲解桌" },
        radio: { x: 42, y: 58, label: "小黑板" },
        bag: { x: 22, y: 70, label: "背包" },
        door: { x: 16, y: 50, label: "屋门" },
        gate: { x: 84, y: 52, label: "栈道口" },
        window: { x: 28, y: 46, label: "窗户" },
        left: { x: 16, y: 82, label: "左边" },
        right: { x: 80, y: 78, label: "右边" },
        team: { x: 52, y: 82, label: "小队" },
        gather: { x: 52, y: 82, label: "集合点" },
        path: { x: 84, y: 58, label: "木栈道" },
        crates: { x: 72, y: 72, label: "箱子" }
      }
    }
  };

  const TUE_SPECIAL = {
    titleZh: "小队集合",
    introZh: "今天是小队集合日。跟着辛巴走过去，和队友说话，再录下这五句话。",
    phrases: [
      { id: "p1-w01-tue-p0", en: "My name is Simba.", zh: "我叫 Simba。", cue: "指向自己", audio: "audio/p1-w01-tue-0-my-name-is-simba.mp3" },
      { id: "p1-w01-tue-p1", en: "I'm ready.", zh: "我准备好了。", cue: "举手", audio: "audio/p1-w01-tue-1-i-m-ready.mp3" },
      { id: "p1-w01-tue-p2", en: "We are a team.", zh: "我们是一个小队。", cue: "三人站一起", audio: "audio/p1-w01-tue-2-we-are-a-team.mp3" },
      { id: "p1-w01-tue-p3", en: "This is my friend.", zh: "这是我的朋友。", cue: "介绍身边的人" },
      { id: "p1-w01-tue-p4", en: "How are you?", zh: "你怎么样？", cue: "微笑询问" }
    ],
    missions: [
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
    ]
  };

  const TYPE_ZH = { weekday: "日常任务", map: "地图日", review: "复习日" };
  const DAY_ZH = { mon: "周一", tue: "周二", wed: "周三", thu: "周四", fri: "周五", sat: "周六", sun: "周日" };

  const game = {
    screen: "hub",
    lesson: null,
    missions: [],
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
    doneFlags: [],
    quizOpts: null,
    pickFeedback: "",
    hubPhase: 1,
    hubWeek: 1,
    practice: false,
    actors: {
      simba: { x: 62, y: 91, spot: "start", facing: "left", pose: "idle", moving: false },
      nilo: { x: 27, y: 70, spot: "radio", facing: "right", pose: "idle", moving: false },
      reed: { x: 61, y: 71, spot: "crates", facing: "left", pose: "idle", moving: false }
    }
  };

  function S() { return window.SimbaSquad; }

  function esc(s) {
    if (S() && S().esc) return S().esc(s);
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function curriculum() {
    const api = S();
    return (api && api.getData && api.getData()) || null;
  }

  function allLessons() {
    const data = curriculum();
    return (data && data.lessons) || [];
  }

  function lessonById(id) {
    return allLessons().find(function (l) { return l.id === id; }) || null;
  }

  function phaseInfo(phase) {
    return PHASE_MAPS[phase] || PHASE_MAPS[1];
  }

  function currentPhase() {
    return phaseInfo(game.lesson && game.lesson.phase ? game.lesson.phase : game.hubPhase || 1);
  }

  function spots() {
    return currentPhase().spots;
  }

  function resolveSpot(id) {
    const sp = spots();
    if (id && sp[id]) return id;
    if (id && PLACE_ALIAS[id] && sp[PLACE_ALIAS[id]]) return PLACE_ALIAS[id];
    if (id === "team" && sp.gather) return "gather";
    if (id === "gather" && sp.team) return "team";
    return "start";
  }

  function spotLabel(id) {
    const sp = spots();
    const sid = resolveSpot(id);
    return (sp[sid] && sp[sid].label) || PLACE_ZH[id] || PLACE_ZH[sid] || "这里";
  }

  function safeAudio(path) {
    if (path && KNOWN_AUDIO[path]) return path;
    return undefined;
  }

  function clonePhrase(ph, fallbackId) {
    const out = {
      id: (ph && ph.id) || fallbackId,
      en: (ph && ph.en) || "",
      zh: (ph && ph.zh) || "",
      cue: (ph && ph.cue) || "",
      image: (ph && ph.image) || ""
    };
    const audio = safeAudio(ph && ph.audio);
    if (audio) out.audio = audio;
    return out;
  }

  function placeFromText(text) {
    const s = String(text || "").trim();
    if (!s) return null;
    if (PLACE_ZH[s]) return s;
    for (const id in PLACE_ZH) {
      if (PLACE_ZH[id] === s) return id;
    }
    for (let i = 0; i < CUE_PLACE.length; i++) {
      if (CUE_PLACE[i][0].test(s)) return CUE_PLACE[i][1];
    }
    return null;
  }

  function inferInteract(phrase) {
    const blob = ((phrase && phrase.cue) || "") + " " + ((phrase && phrase.en) || "") + " " + ((phrase && phrase.zh) || "");
    if (/指向自己|介绍自己|我叫|my name is/i.test(blob)) {
      return { interact: "tap-self", pose: "point", actionLabel: "介绍自己", npc: "nilo", interactHintZh: "点一下辛巴，介绍你自己。" };
    }
    if (/举手|准备好|i'?m ready|i am ready/i.test(blob)) {
      return { interact: "raise-hand", pose: "ready", actionLabel: "举手", npc: null, interactHintZh: "点「举手」，做出准备好的动作。" };
    }
    if (/三人站|站在一起|站一起|并肩|我们是一个小队|we are a team|集合点/i.test(blob)) {
      return { interact: "gather", pose: "wave", actionLabel: "站在一起", npc: "both", gather: true, interactHintZh: "点「站在一起」，大家集合。" };
    }
    if (/介绍身边|介绍朋友|this is my friend/i.test(blob)) {
      return { interact: "tap-npc", pose: "pointout", actionLabel: "介绍朋友", npc: "reed", interactHintZh: "点一下里德，介绍你的朋友。" };
    }
    if (/问候|询问|how are you|怎么样/i.test(blob)) {
      return { interact: "tap-npc", pose: "talk", actionLabel: "问候队友", npc: "nilo", interactHintZh: "点一下妮萝，问候她。" };
    }
    if (/挥手|hello|你好/i.test(blob)) {
      return { interact: "tap-self", pose: "wave", actionLabel: "挥手问好", npc: "nilo", interactHintZh: "点一下辛巴，挥手问好。" };
    }
    if (phrase && phrase.image) {
      return { interact: "tap-prop", pose: "pointout", actionLabel: "看一看", npc: "nilo", prop: phrase.image, interactHintZh: "点图画，看一看再说。" };
    }
    return { interact: "tap-npc", pose: "talk", actionLabel: "开始说", npc: "nilo", interactHintZh: "点一下妮萝，开始这一句。" };
  }

  function shortTitle(phrase, index, kind) {
    const n = index + 1;
    const prefix = kind === "map" ? "地图 " + n : (kind === "review" ? "复习 " + n : "任务 " + n);
    const en = (phrase && phrase.en) ? String(phrase.en).replace(/[.!?]$/, "") : "";
    const bit = en.split(" ").slice(0, 4).join(" ");
    return bit ? prefix + " · " + bit : prefix;
  }

  function makePhraseMission(lesson, phrase, index, opts) {
    opts = opts || {};
    const act = inferInteract(phrase);
    const target = resolveSpot(opts.target || "start");
    const label = spotLabel(target);
    const npc = act.npc || "nilo";
    const who = (index % 2 === 1) ? "reed" : "nilo";
    const dialogue = opts.dialogue || [
      { who: who, text: "走到" + label + "，我们来学这一句。" },
      { who: "nilo", text: (act.interactHintZh || "到了以后，听一听，再说一说。") }
    ];
    return {
      id: phrase.id,
      kind: opts.kind || "phrase",
      titleZh: opts.titleZh || shortTitle(phrase, index, "phrase"),
      goalZh: opts.goalZh || ("走到" + label + "，" + (phrase.cue || "听一听，再说一说。")),
      hintZh: opts.hintZh || ("点发光的" + label + "，走过去。"),
      interactHintZh: act.interactHintZh,
      target: target,
      npc: npc,
      interact: act.interact,
      pose: act.pose,
      successPose: "thumbs",
      npcSuccess: "thumbs",
      actionLabel: act.actionLabel,
      gather: !!act.gather,
      prop: act.prop || "",
      recordRequired: opts.recordRequired !== false,
      phrase: phrase,
      dialogue: dialogue
    };
  }

  function makeMapMission(lesson, step, index) {
    const phrase = clonePhrase(step, lesson.id + "-map-" + index);
    const target = resolveSpot(step.place || "start");
    const label = spotLabel(target);
    return {
      id: phrase.id,
      kind: "map",
      titleZh: "地图 " + (index + 1) + " · 去" + label,
      goalZh: "点地图上的" + label + "，走到那里。",
      hintZh: "点发光的" + label + "，辛巴会走过去。",
      interactHintZh: "已经走到" + label + "了。听一听这一句。",
      target: target,
      npc: "nilo",
      interact: "arrive",
      pose: "talk",
      successPose: "thumbs",
      npcSuccess: "wave",
      actionLabel: "我到了",
      recordRequired: false,
      phrase: phrase,
      dialogue: [
        { who: "nilo", text: "请到" + label + "那边去。点发光的地点，走过去。" }
      ]
    };
  }

  function makeReviewMission(lesson, phrase, index) {
    const rotation = phaseInfo(lesson.phase).defaults;
    const target = resolveSpot((rotation && rotation[index % rotation.length]) || "table");
    return {
      id: phrase.id,
      kind: "review",
      titleZh: shortTitle(phrase, index, "review"),
      goalZh: "听句子，选出正确的中文意思，再说出来。",
      hintZh: "点发光的地点，走过去开始复习。",
      interactHintZh: "先听英语，再选出正确的意思。",
      target: target,
      npc: "nilo",
      interact: "review-pick",
      pose: "talk",
      successPose: "thumbs",
      npcSuccess: "thumbs",
      actionLabel: "开始选择",
      recordRequired: true,
      phrase: phrase,
      dialogue: [
        { who: "nilo", text: "听一听这句英语，选出正确的中文意思。" }
      ]
    };
  }

  function buildMissions(lesson) {
    if (!lesson) return [];
    const phrases = (lesson.phrases || []).map(function (p, i) {
      return clonePhrase(p, lesson.id + "-p" + i);
    });
    if (lesson.id === "p1-w01-tue") {
      return TUE_SPECIAL.missions.map(function (m, i) {
        const copy = Object.assign({}, m);
        copy.kind = "phrase";
        copy.recordRequired = true;
        const fallback = (TUE_SPECIAL.phrases && TUE_SPECIAL.phrases[i]) || null;
        copy.phrase = (phrases[i] && phrases[i].en) ? phrases[i] : clonePhrase(fallback, m.id);
        return copy;
      });
    }
    const used = {};
    const phase = phaseInfo(lesson.phase);
    function uniqueTarget(preferred, i) {
      let t = preferred ? resolveSpot(preferred) : "";
      if (t && !used[t]) { used[t] = 1; return t; }
      const list = (phase.defaults || []).concat(["start", "table", "radio", "yard", "bag"]);
      for (let k = 0; k < list.length; k++) {
        const id = resolveSpot(list[(i + k) % list.length]);
        if (!used[id]) { used[id] = 1; return id; }
      }
      return resolveSpot(preferred || list[i % list.length] || "start");
    }

    if (lesson.type === "review") {
      return phrases.map(function (ph, i) { return makeReviewMission(lesson, ph, i); });
    }

    if (lesson.type === "map") {
      const phraseMissions = phrases.map(function (ph, i) {
        return makePhraseMission(lesson, ph, i, {
          target: uniqueTarget("table", i),
          kind: "phrase",
          goalZh: "先听、再说：" + ph.en,
          hintZh: "点发光的地点，走到队友身边练这一句。",
          dialogue: [
            { who: (i % 2 ? "reed" : "nilo"), text: "先来练这一句。听清楚，再说出来。" }
          ]
        });
      });
      const steps = ((lesson.task && lesson.task.steps) || []).slice(0, 3);
      const mapMissions = steps.map(function (step, i) { return makeMapMission(lesson, step, i); });
      return phraseMissions.concat(mapMissions);
    }

    return phrases.map(function (ph, i) {
      const preferred = placeFromText(ph.cue) || placeFromText(ph.en) || placeFromText(ph.zh);
      return makePhraseMission(lesson, ph, i, { target: uniqueTarget(preferred, i) });
    });
  }

  function mission() {
    return game.missions[game.mission] || null;
  }

  function phrase() {
    const m = mission();
    return (m && m.phrase) || null;
  }

  function workingLesson() {
    if (!game.lesson) return null;
    const copy = Object.assign({}, game.lesson);
    copy.phrases = game.missions.map(function (m) {
      return m.phrase || { id: m.id, en: "", zh: "" };
    });
    if (game.lesson.id === "p1-w01-tue") {
      copy.titleZh = TUE_SPECIAL.titleZh;
      copy.introZh = TUE_SPECIAL.introZh;
    }
    return copy;
  }

  function preload() {
    const urls = [];
    Object.keys(PHASE_MAPS).forEach(function (k) { urls.push(PHASE_MAPS[k].map); });
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
      if (game.phase === "speak" || game.phase === "listen" || game.phase === "pick") return;
      const m = mission();
      if (!m) return;
      game.hintOn = true;
      let text = m.hintZh;
      if (game.phase === "interact") text = m.interactHintZh || m.hintZh;
      if (game.phase === "invite") text = "听完了就点「开始说」，录下这一句。";
      showHint(text);
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
    state.lesson = workingLesson();
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
    state.lesson = workingLesson();
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
    game.quizOpts = null;
    game.pickFeedback = "";
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

  function visibleSpots() {
    const sp = spots();
    const show = {};
    const home = currentPhase().home || {};
    Object.keys(home).forEach(function (k) { if (home[k]) show[resolveSpot(home[k])] = 1; });
    game.missions.forEach(function (m, i) {
      if (!m || !m.target) return;
      if (game.doneFlags[i] || i === game.mission || m.kind === "map") {
        show[resolveSpot(m.target)] = 1;
      }
    });
    const m = mission();
    if (m && m.target) show[resolveSpot(m.target)] = 1;
    ["start", "table", "radio"].forEach(function (id) {
      const sid = resolveSpot(id);
      if (sp[sid]) show[sid] = 1;
    });
    return show;
  }

  function placeAll() {
    ["simba", "nilo", "reed"].forEach(applyActorPose);
    const shown = visibleSpots();
    document.querySelectorAll(".game-spot").forEach(function (btn) {
      const id = btn.getAttribute("data-spot");
      const m = mission();
      const isTarget = !!(m && game.phase === "navigate" && resolveSpot(m.target) === id);
      btn.classList.toggle("target", isTarget);
      btn.classList.toggle("done", game.missions.some(function (x, i) {
        return game.doneFlags[i] && resolveSpot(x.target) === id;
      }));
      btn.hidden = !shown[id] && !btn.classList.contains("target") && !btn.classList.contains("done");
    });
    const prop = document.querySelector(".game-prop");
    if (prop) {
      const m = mission();
      const on = !!(m && m.prop && game.phase === "interact" && m.interact === "tap-prop");
      prop.hidden = !on;
    }
  }

  function isInteractTarget(id) {
    if (game.screen !== "play") return false;
    if (game.phase !== "interact") return false;
    const m = mission();
    if (!m) return false;
    if (m.interact === "tap-self" || m.interact === "raise-hand") return id === "simba";
    if (m.interact === "tap-npc") return id === m.npc;
    if (m.interact === "gather") return id === "simba" || id === "nilo" || id === "reed";
    if (m.interact === "arrive" || m.interact === "review-pick" || m.interact === "tap-prop") return id === "simba";
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

  function walkTo(id, spotId, done) {
    const a = game.actors[id];
    const dest = spots()[resolveSpot(spotId)];
    if (!a || !dest) { if (done) done(); return; }
    const dx = dest.x - a.x;
    const dy = dest.y - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1.4) {
      a.x = dest.x;
      a.y = dest.y;
      a.spot = resolveSpot(spotId);
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
        a.spot = resolveSpot(spotId);
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
    const c = spots()[resolveSpot(spotId)] || spots().gather || spots().team || spots().start;
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

  function resetActorsHome() {
    const ph = currentPhase();
    const home = ph.home;
    const sp = ph.spots;
    function put(id, spotId, facing, pose) {
      const sid = resolveSpot(spotId);
      const s = sp[sid] || sp.start;
      game.actors[id] = { x: s.x, y: s.y, spot: sid, facing: facing, pose: pose || "idle", moving: false };
    }
    put("simba", home.simba, "left", "idle");
    put("nilo", home.nilo, "right", "wave");
    put("reed", home.reed, "left", "wave");
  }

  function beginMission(index, opts) {
    opts = opts || {};
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    cancelPlay();
    hideHint();
    if (index >= game.missions.length) {
      finishDay();
      return;
    }
    game.screen = "play";
    game.mission = index;
    game.phase = "navigate";
    game.talkLine = 0;
    game.celebrating = false;
    game.quizOpts = null;
    game.pickFeedback = "";
    game.actors.simba.pose = "idle";
    game.actors.nilo.pose = "idle";
    game.actors.reed.pose = "idle";
    resetRecForMission();
    if (api && api.render) api.render();
    armHint();
    if (!opts.keepPlaces) {
      const home = currentPhase().home;
      if (game.actors.nilo.spot !== resolveSpot(home.nilo)) walkTo("nilo", home.nilo);
      if (game.actors.reed.spot !== resolveSpot(home.reed)) walkTo("reed", home.reed);
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
    if (resolveSpot(spotId) === resolveSpot(m.target)) arrivedAtTarget();
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
    walkTo("simba", spotId, function () { maybeArrive(spotId); });
    if (m && game.phase === "navigate" && resolveSpot(spotId) !== resolveSpot(m.target)) {
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
    if (id === "simba" && game.phase === "navigate") return;
    const a = game.actors[id];
    if (!a) return;
    if (game.actors.simba.moving) return;
    hideHint();
    const m = mission();
    const destSpot = a.spot || currentPhase().home[id] || "start";
    const already = Math.hypot(game.actors.simba.x - a.x, game.actors.simba.y - a.y) < 8;
    function after() {
      if (m && game.phase === "navigate") {
        if (resolveSpot(m.target) === resolveSpot(destSpot) || m.npc === id || m.npc === "both") arrivedAtTarget();
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
    if (m.interact === "arrive") {
      beginListen();
      return;
    }
    if (m.interact === "review-pick") {
      beginPick();
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
    if (m.interact === "tap-self" && id && id !== "simba" && id !== "action") return;
    if (m.interact === "tap-npc" && id && id !== m.npc && id !== "action") {
      showHint(m.interactHintZh);
      return;
    }
    if (m.interact === "tap-prop" && id && id !== "prop" && id !== "action" && id !== "simba") {
      showHint(m.interactHintZh);
      return;
    }
    if (m.interact === "gather") {
      startGatherThenListen();
      return;
    }
    if (m.interact === "review-pick") {
      beginPick();
      return;
    }
    if (m.interact === "arrive") {
      beginListen();
      return;
    }
    doGestureThenListen();
  }

  function doGestureThenListen() {
    const m = mission();
    game.actors.simba.pose = (m && m.pose) || "talk";
    if (m && m.npc && m.npc !== "both" && game.actors[m.npc]) {
      game.actors[m.npc].pose = "talk";
    }
    applyActorPose("simba");
    if (m && m.npc && game.actors[m.npc]) applyActorPose(m.npc);
    beginListen();
  }

  function startGatherThenListen() {
    const m = mission();
    const pts = gatherOffsets((m && m.target) || "gather");
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

  function quizOptionsFor(lesson, target) {
    const opts = [target];
    const lessons = allLessons();
    const pool = (lesson.phrases || []).slice();
    const idx = lessons.findIndex(function (l) { return l.id === lesson.id; });
    if (idx > 0) {
      (lessons[idx - 1].phrases || []).forEach(function (p) { pool.push(p); });
    }
    if (idx >= 0 && idx < lessons.length - 1) {
      (lessons[idx + 1].phrases || []).forEach(function (p) { pool.push(p); });
    }
    pool.forEach(function (p) {
      if (opts.length < 3 && p.zh !== target.zh && !opts.some(function (o) { return o.zh === p.zh; })) {
        opts.push({ id: p.id, en: p.en, zh: p.zh, image: p.image });
      }
    });
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = opts[i];
      opts[i] = opts[j];
      opts[j] = tmp;
    }
    return opts;
  }

  function beginPick() {
    const api = S();
    const ph = phrase();
    if (!api || !ph) return;
    cancelPlay();
    game.phase = "pick";
    game.pickFeedback = "";
    if (!game.quizOpts) game.quizOpts = quizOptionsFor(game.lesson, ph);
    hideHint();
    const state = api.getState();
    state.revealZh = false;
    state.view = "game";
    state.lesson = workingLesson();
    state.phraseIndex = game.mission;
    if (api.render) api.render();
    const token = ++game.playToken;
    game.actors.nilo.pose = "talk";
    applyActorPose("nilo");
    Promise.resolve(api.playModel(ph)).catch(function () {}).then(function () {
      if (token !== game.playToken) return;
      game.actors.nilo.pose = "idle";
      applyActorPose("nilo");
    });
    armHint();
  }

  function onPickOption(id) {
    const m = mission();
    const ph = phrase();
    if (!m || !ph || game.phase !== "pick") return;
    const api = S();
    if (id === ph.id) {
      game.pickFeedback = "ok";
      if (api && api.render) api.render();
      setTimeout(function () {
        game.pickFeedback = "";
        beginListen(true);
      }, 650);
    } else {
      game.pickFeedback = "bad";
      game.badPick = id;
      if (api && api.render) api.render();
      if (api && api.playModel) api.playModel(ph);
      setTimeout(function () {
        game.pickFeedback = "";
        game.badPick = "";
        if (api && api.render) api.render();
      }, 900);
    }
  }

  async function beginListen(fromReview) {
    const api = S();
    const ph = phrase();
    const m = mission();
    if (!api || !ph) return;
    cancelPlay();
    game.phase = "listen";
    hideHint();
    const state = api.getState();
    state.revealZh = !!fromReview;
    state.view = "game";
    state.lesson = workingLesson();
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
    game.actors.simba.pose = (m && m.pose) || "idle";
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
    game.actors.simba.pose = (mission() && (game.phase === "success" ? mission().successPose : mission().pose)) || "idle";
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
    state.lesson = workingLesson();
    state.phraseIndex = game.mission;
    if (!state.lastBlob) {
      state.scoreBand = 0;
      state.recMsg = "";
      state.recMsgKind = "";
    }
    if (api.render) api.render();
    api.beginSpeakCapture();
  }

  function alreadySaidThisLine() {
    const api = S();
    const ph = phrase();
    if (!api || !ph) return false;
    const rec = api.getState().recordings || {};
    if (rec[ph.id]) return true;
    const en = String(ph.en || "").trim().toLowerCase();
    return game.missions.some(function (m, i) {
      return i < game.mission && game.doneFlags[i] && m.phrase && String(m.phrase.en || "").trim().toLowerCase() === en;
    });
  }

  function markMissionSuccess() {
    if (game.doneFlags[game.mission]) return;
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

  function completeWithoutRec() {
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    markMissionSuccess();
    if (api && api.render) api.render();
  }

  function onRecResult(state) {
    if (game.screen !== "play" || game.phase !== "speak") return;
    if (state.recMsgKind === "ok" && !game.doneFlags[game.mission]) {
      markMissionSuccess();
    }
  }

  function nextMission() {
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    beginMission(game.mission + 1);
  }

  function markLessonComplete(lesson) {
    const api = S();
    if (!api || !lesson || !api.loadProgress) return;
    try {
      const p = api.loadProgress();
      if (p && p.completed && !p.completed[lesson.id]) {
        const at = (api.todayISO && api.todayISO()) || new Date().toISOString().slice(0, 10);
        p.completed[lesson.id] = { at: at, sticker: lesson.sticker || "" };
        if (api.saveProgress) api.saveProgress(p);
        else {
          try { localStorage.setItem("simba-squad-progress-v1", JSON.stringify(p)); } catch (e) {}
        }
      }
    } catch (e2) {}
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
    if (!game.practice) markLessonComplete(game.lesson);
    if (api && api.render) api.render();
    const tip = game.lesson && game.lesson.tip;
    if (api && api.sayZh && tip && tip.zh) api.sayZh(tip.zh);
  }

  function leaveGameChrome() {
    cancelPlay();
    stopWalkFrames();
    clearHintTimer();
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    document.body.classList.remove("game-open");
  }

  function goYear() {
    openHub();
  }

  function goToday() {
    leaveGameChrome();
    if (window.TodayLesson && typeof window.TodayLesson.start === "function") {
      window.TodayLesson.start();
    }
  }

  function goParent() {
    leaveGameChrome();
    const api = S();
    if (!api || !api.getState) return false;
    const state = api.getState();
    state.view = "parent";
    state.parentAuthed = false;
    if (api.render) api.render();
    return true;
  }

  function nextUncompleted() {
    const api = S();
    if (api && api.nextLesson) return api.nextLesson();
    const p = (api && api.loadProgress && api.loadProgress()) || { completed: {} };
    return allLessons().find(function (l) { return !p.completed[l.id]; }) || null;
  }

  function chronologicalNext() {
    const list = allLessons();
    if (!game.lesson) return nextUncompleted();
    const idx = list.findIndex(function (l) { return l.id === game.lesson.id; });
    if (idx >= 0 && idx < list.length - 1) return list[idx + 1];
    return nextUncompleted();
  }

  function progressObj() {
    const api = S();
    return (api && api.loadProgress && api.loadProgress()) || { completed: {} };
  }

  function resetPlayState(lesson) {
    game.lesson = lesson;
    game.missions = buildMissions(lesson);
    game.mission = 0;
    game.phase = "navigate";
    game.talkLine = 0;
    game.hintOn = false;
    game.celebrating = false;
    game.lastRecKind = "";
    game.quizOpts = null;
    game.pickFeedback = "";
    game.doneFlags = game.missions.map(function () { return false; });
    game.hubPhase = lesson.phase || 1;
    game.hubWeek = lesson.week || 1;
    resetActorsHome();
    const api = S();
    const state = api ? api.getState() : null;
    if (state) {
      state.view = "game";
      state.lesson = workingLesson();
      state.phraseIndex = 0;
      state.revealZh = false;
      state.recordings = {};
      state.lastBlob = null;
      state.scoreBand = 0;
      state.recMsg = "";
      state.recMsgKind = "";
      state.recOn = false;
    }
  }

  function startLesson(lesson, opts) {
    opts = opts || {};
    if (!lesson) return;
    preload();
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    cancelPlay();
    stopWalkFrames();
    clearHintTimer();
    document.body.classList.remove("today-open");
    document.body.classList.add("game-open");
    game.practice = !!opts.practice;
    resetPlayState(lesson);
    game.screen = opts.screen || "brief";
    if (api && api.setBanner) api.setBanner();
    if (api && api.render) api.render();
    else render();
  }

  function openHub(opts) {
    opts = opts || {};
    preload();
    const api = S();
    if (api && api.cancelRec) api.cancelRec();
    cancelPlay();
    stopWalkFrames();
    clearHintTimer();
    document.body.classList.remove("today-open");
    document.body.classList.add("game-open");
    game.screen = "hub";
    game.phase = "hub";
    game.practice = false;
    const next = nextUncompleted();
    if (next) {
      game.hubPhase = next.phase || 1;
      game.hubWeek = next.week || 1;
    }
    if (opts.phase) game.hubPhase = opts.phase;
    if (opts.week) game.hubWeek = opts.week;
    const state = api ? api.getState() : null;
    if (state) {
      state.view = "game";
      state.lesson = null;
      state.recOn = false;
    }
    if (api && api.setBanner) api.setBanner();
    if (api && api.render) api.render();
    else render();
  }

  function start(opts) {
    opts = opts || {};
    preload();
    if (routeFromHash()) return;
    if (opts.lesson) {
      startLesson(opts.lesson, opts);
      return;
    }
    if (opts.screen === "brief" && game.lesson) {
      startLesson(game.lesson, opts);
      return;
    }
    openHub(opts);
  }

  function routeFromHash() {
    const h = String(location.hash || "").replace(/^#/, "").replace(/^game\//, "");
    if (!h) return false;
    if (h === "today" || h === "lesson") {
      goToday();
      return true;
    }
    if (h === "year" || h === "course" || h === "hub") {
      openHub();
      return true;
    }
    const les = lessonById(h);
    if (les) {
      startLesson(les, {});
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

  function topBar(title, extra) {
    return '<div class="game-top"><div class="brand">' + esc(title || "小队电台英语") + "</div>" +
      '<div class="top-actions">' +
      (extra || "") +
      '<button type="button" class="icon-btn" data-act="game-today">上一课</button>' +
      '<button type="button" class="icon-btn" data-act="game-year">全年课程</button>' +
      "</div></div>";
  }

  function stampsHtml() {
    const n = game.missions.length || 5;
    let html = '<div class="game-stamps" aria-label="今日任务">';
    for (let i = 0; i < n; i++) {
      const cls = game.doneFlags[i] ? " done" : (i === game.mission && game.screen === "play" ? " now" : "");
      const title = (game.missions[i] && game.missions[i].titleZh) || ("任务 " + (i + 1));
      html += '<span class="game-stamp' + cls + '" title="' + esc(title) + '">' +
        (game.doneFlags[i] ? "★" : (i + 1)) + "</span>";
    }
    return html + "</div>";
  }

  function hudHtml() {
    const m = mission();
    if (!m) return "";
    const n = game.missions.length;
    const done = game.doneFlags.filter(Boolean).length;
    return '<div class="game-hud"><div class="hud-row"><p class="mission-title">' + esc(m.titleZh) +
      "</p><span>" + done + " / " + n + "</span></div>" +
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
    const phase = currentPhase();
    const sp = phase.spots;
    const shown = (game.screen === "play" || game.screen === "done") ? visibleSpots() : {};
    let html = '<div class="game-map-wrap" id="game-map-wrap">';
    html += '<div class="game-map phase-' + (game.lesson && game.lesson.phase || game.hubPhase || 1) +
      '" role="img" aria-label="' + esc(phase.mapLabel) +
      '" style="background-image:url(\'' + phase.map + '\')"></div>';
    html += '<div class="game-map-fx"></div>';
    const seen = {};
    Object.keys(sp).forEach(function (id) {
      const s = sp[id];
      const key = s.x + "," + s.y;
      if (seen[key] && id !== (mission() && resolveSpot(mission().target))) return;
      seen[key] = 1;
      const m = mission();
      const isTarget = (m && game.phase === "navigate" && resolveSpot(m.target) === id);
      const hidden = game.screen === "play" && !shown[id] && !isTarget ? " hidden" : "";
      html += '<button type="button" class="game-spot' + (isTarget ? " target" : "") + hidden +
        '" data-act="game-spot-' + id +
        '" data-spot="' + id + '" style="left:' + s.x + "%;top:" + s.y +
        '%" aria-label="' + esc(s.label) + '"><span class="ring"></span><span class="spot-label">' +
        esc(s.label) + "</span></button>";
    });
    const m = mission();
    if (m && m.prop && game.phase === "interact" && m.interact === "tap-prop") {
      const dest = sp[resolveSpot(m.target)] || sp.start;
      html += '<button type="button" class="game-prop" data-act="game-prop" style="left:' +
        Math.min(90, dest.x + 10) + "%;top:" + Math.max(20, dest.y - 14) +
        '%"><img src="' + esc(m.prop) + '" alt="看一看"></button>';
    }
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

  function pickHtml() {
    const opts = game.quizOpts || [];
    const ph = phrase();
    let html = '<p class="game-kicker">' + esc((mission() && mission().titleZh) || "复习") + "</p>";
    html += '<p class="game-goal-plain">听句子，选出正确的中文意思。</p>';
    html += '<button class="horn" data-act="play">再听一遍</button>';
    html += '<div class="game-quiz">';
    opts.forEach(function (o) {
      let cls = "game-quiz-opt";
      if (game.pickFeedback === "ok" && ph && o.id === ph.id) cls += " ok";
      if (game.pickFeedback === "bad" && o.id === game.badPick) cls += " bad";
      html += '<button type="button" class="' + cls + '" data-act="game-pick-' + esc(o.id) + '">';
      if (o.image) html += '<img src="' + esc(o.image) + '" alt="">';
      html += "<span>" + esc(o.zh) + "</span></button>";
    });
    html += "</div>";
    if (game.pickFeedback === "ok") html += '<p class="rec-msg ok">选对了！</p>';
    if (game.pickFeedback === "bad") html += '<p class="rec-msg err">再听一次，再选一次。</p>';
    return html;
  }

  function dockHtml() {
    const api = S();
    const state = api.getState() || { revealZh: false };
    const m = mission();
    const ph = phrase();
    let html = '<div class="game-dock" id="game-dock">';
    if (!m) {
      html += "</div>";
      return html;
    }
    if (game.phase === "talk") {
      const line = m.dialogue[game.talkLine] || m.dialogue[0];
      const who = CHAR[line.who];
      html += '<div class="game-dialog" data-act="game-advance" role="button" aria-label="继续对话">';
      html += '<img class="portrait" src="images/game/' + line.who + '-portrait.webp" alt="' + esc(who.name) + '">';
      html += '<div class="body"><p class="who-line">' + esc(who.name) + "<small>" + esc(who.role) + "</small></p>";
      html += '<p class="line">' + esc(line.text) + "</p>";
      html += '<p class="advance">' + (game.talkLine < m.dialogue.length - 1 ? "点这里继续 ▸" : "点这里开始任务 ▸") + "</p>";
      html += "</div></div>";
    } else if (game.phase === "pick") {
      html += pickHtml();
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
        if (m.recordRequired !== false || state.lastBlob) html += speakPanel();
        const last = game.mission >= game.missions.length - 1;
        html += '<button class="primary" data-act="game-next">' + (last ? "完成今日任务" : "下一个任务") + "</button>";
      } else if (game.phase === "speak") {
        html += speakPanel();
      } else {
        html += '<p class="cue">' + esc(ph.cue || "先听，再说") + "</p>";
        html += '<button class="horn" data-act="play">再听一遍</button>';
        html += '<div class="row"><button class="secondary" data-act="slow">慢速</button>';
        html += '<button class="secondary" data-act="zh">中文</button></div>';
        if (m.recordRequired === false) {
          if (alreadySaidThisLine()) {
            html += '<p class="cue">这句刚才已经练过了，走到这里就算完成。</p>';
          }
          html += '<button class="primary" data-act="game-arrive-ok">我到了，完成</button>';
          html += '<button class="secondary" data-act="to-speak">我也想说一句</button>';
        } else {
          html += '<button class="primary" data-act="to-speak">我听完了，开始说</button>';
        }
      }
    } else {
      html += '<p class="game-kicker">' + esc(m.titleZh) + "</p>";
      html += '<p class="game-goal-plain">' + esc(m.hintZh) + "</p>";
    }
    html += "</div>";
    return html;
  }

  function displayTitle(lesson) {
    if (!lesson) return "小队电台英语";
    if (lesson.id === "p1-w01-tue") return "小队集合";
    return lesson.titleZh;
  }

  function lessonKicker(lesson) {
    if (!lesson) return "";
    const typ = TYPE_ZH[lesson.type] || "";
    if (lesson.id === "p1-w01-tue") return "周二 · 小队集合 · " + phaseInfo(lesson.phase).titleZh;
    return "第 " + lesson.week + " 周 · " + (lesson.dayZh || DAY_ZH[lesson.day] || "") + " · " + typ;
  }

  function stickerGlyph(name) {
    const api = S();
    if (api && api.stickerIcon) return api.stickerIcon(name);
    return "⭐";
  }

  function briefHtml() {
    const lesson = game.lesson;
    const phase = currentPhase();
    const title = displayTitle(lesson);
    const intro = (lesson && lesson.id === "p1-w01-tue") ? TUE_SPECIAL.introZh : ((lesson && lesson.introZh) || "");
    const n = game.missions.length;
    let html = bannerHtml();
    html += '<div class="game-wrap phase-' + (lesson && lesson.phase || 1) + '">';
    html += topBar("小队电台英语");
    html += '<div class="game-brief-art"><img src="' + phase.map + '" alt="' + esc(phase.mapLabel) + '"></div>';
    html += '<div class="game-dock">';
    html += '<p class="game-kicker">' + esc(lessonKicker(lesson)) + "</p>";
    html += '<h1 class="game-title">' + esc(title) + "</h1>";
    html += '<p class="sub" style="text-align:center">' + esc(intro || ("今天有 " + n + " 个任务。走进地图，点角色，听一听，再说一说。")) + "</p>";
    html += '<div class="game-cast">';
    ["simba", "nilo", "reed"].forEach(function (id) {
      const c = CHAR[id];
      html += '<div class="member"><img src="images/game/' + id + '-portrait.webp" alt="' + esc(c.name) + '">' +
        '<div class="nm">' + esc(c.name) + '</div><div class="rl">' + esc(c.role) + "</div></div>";
    });
    html += "</div>";
    html += '<p class="meta" style="text-align:center">共 ' + n + " 个任务 · " + esc(phase.titleZh) + "</p>";
    html += '<button class="primary" data-act="game-start">出发</button>';
    html += '<button class="ghost" data-act="game-year">返回课程表</button>';
    html += "</div></div>";
    return html;
  }

  function doneHtml() {
    const lesson = game.lesson;
    const tip = (lesson && lesson.tip) || {};
    const next = nextUncompleted();
    let html = bannerHtml();
    html += '<div class="game-wrap game-done phase-' + (lesson && lesson.phase || 1) + '">';
    html += topBar("小队电台英语");
    html += mapHtml();
    html += '<div class="game-dock">';
    html += '<div class="sticker-art">' + esc(stickerGlyph(lesson && lesson.sticker)) + "</div>";
    html += '<h1 class="game-title">' + esc(displayTitle(lesson)) + " 完成</h1>";
    html += stampsHtml();
    if (tip.titleZh) html += '<p class="tip-title">' + esc(tip.titleZh) + "</p>";
    if (tip.en) html += '<p class="en" style="text-align:center;font-weight:800;margin:8px 0 4px">' + esc(tip.en) + "</p>";
    if (tip.zh) html += '<p class="zh">' + esc(tip.zh) + "</p>";
    html += '<div class="row"><button class="secondary" data-act="play-tip-en">听英语</button>';
    html += '<button class="secondary" data-act="play-tip-zh">听中文</button></div>';
    if (next) {
      html += '<button class="primary" data-act="game-continue">下一课：' + esc(next.titleZh) + "</button>";
    } else {
      html += '<p class="sub" style="text-align:center">一年的课都完成了，随时可以回来复习。</p>';
    }
    html += '<button class="secondary" data-act="game-again">再玩一次</button>';
    html += '<button class="ghost" data-act="game-year">打开全年课程</button>';
    html += "</div></div>";
    return html;
  }

  function hubHtml() {
    const data = curriculum();
    const lessons = allLessons();
    const p = progressObj();
    const done = Object.keys(p.completed || {}).length;
    const total = lessons.length || 364;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const next = nextUncompleted();
    const phases = (data && data.phases) || [
      { id: 1, weeks: [1, 13], titleZh: "入门营地" },
      { id: 2, weeks: [14, 26], titleZh: "小队沟通" },
      { id: 3, weeks: [27, 39], titleZh: "地图与策略" },
      { id: 4, weeks: [40, 52], titleZh: "交流与解说" }
    ];
    const phase = phases.find(function (x) { return x.id === game.hubPhase; }) || phases[0];
    const weekStart = phase.weeks[0];
    const weekEnd = phase.weeks[1];
    if (game.hubWeek < weekStart || game.hubWeek > weekEnd) game.hubWeek = weekStart;
    const weekLessons = lessons.filter(function (l) { return l.week === game.hubWeek; });
    const map = phaseInfo((next && next.phase) || game.hubPhase).map;
    let html = bannerHtml();
    html += '<div class="game-wrap game-hub phase-' + game.hubPhase + '">';
    html += '<div class="game-top"><div class="brand">小队电台英语</div><div class="top-actions">' +
      '<button type="button" class="icon-btn" data-act="game-today">上一课</button>' +
      '<button type="button" class="icon-btn" data-act="parent">家长角</button>' +
      "</div></div>";

    html += '<div class="game-continue">';
    html += '<div class="cont-art"><img src="' + map + '" alt=""></div><div class="cont-body">';
    if (next) {
      html += '<p class="game-kicker">继续学习 · 第 ' + next.week + " 周 · " + esc(next.dayZh) + "</p>";
      html += '<h1 class="game-title" style="text-align:left;font-size:26px">' + esc(next.titleZh) + "</h1>";
      html += '<p class="sub">' + esc(TYPE_ZH[next.type] || "") + " · " + esc(phaseInfo(next.phase).titleZh) + "</p>";
      html += '<button class="primary" data-act="game-continue">出发</button>';
    } else {
      html += '<p class="game-kicker">全年任务</p>';
      html += '<h1 class="game-title" style="text-align:left;font-size:26px">一年的课都完成了</h1>';
      html += '<p class="sub">可以从下面任意一天回来复习。</p>';
    }
    html += "</div></div>";

    html += '<div class="game-prog"><div class="progress-bar"><span style="width:' + pct + '%"></span></div>';
    html += '<p class="meta">已完成 ' + done + " / " + total + " 课</p></div>";

    html += '<div class="game-phase-tabs" role="tablist">';
    phases.forEach(function (ph) {
      html += '<button type="button" class="game-phase-tab' + (ph.id === game.hubPhase ? " on" : "") +
        '" data-act="game-phase-' + ph.id + '"><strong>阶段 ' + ph.id + "</strong><span>" +
        esc(ph.titleZh) + "</span></button>";
    });
    html += "</div>";

    html += '<div class="game-weeks">';
    for (let w = weekStart; w <= weekEnd; w++) {
      const wl = lessons.filter(function (l) { return l.week === w; });
      const wd = wl.filter(function (l) { return p.completed && p.completed[l.id]; }).length;
      html += '<button type="button" class="game-week' + (w === game.hubWeek ? " on" : "") +
        (wd === 7 ? " all-done" : "") + '" data-act="game-week-' + w + '">第 ' + w + " 周" +
        (wd ? "<small>" + wd + "/7</small>" : "") + "</button>";
    }
    html += "</div>";

    html += '<div class="game-days">';
    weekLessons.forEach(function (l) {
      const isDone = !!(p.completed && p.completed[l.id]);
      const isNext = next && l.id === next.id;
      html += '<button type="button" class="game-day type-' + esc(l.type) + (isDone ? " done" : "") +
        (isNext ? " next" : "") + '" data-act="game-open-' + esc(l.id) + '">';
      html += '<span class="dow">' + esc(l.dayZh) + "</span>";
      html += '<span class="ttl">' + esc(l.id === "p1-w01-tue" ? "小队集合" : l.titleZh) + "</span>";
      html += '<span class="tag">' + (isDone ? "已完成 ★" : esc(TYPE_ZH[l.type] || "开始")) + "</span>";
      html += "</button>";
    });
    html += "</div>";

    html += '<button class="ghost" data-act="game-today">打开上一课：今日动画课</button>';
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
    if (game.screen === "hub") {
      app.innerHTML = hubHtml();
      return;
    }
    if (game.screen !== "hub") syncLessonState();

    if (game.screen === "brief") {
      app.innerHTML = briefHtml();
      return;
    }
    if (game.screen === "done") {
      app.innerHTML = doneHtml();
      return;
    }

    const heavy = (game.phase === "pick" || game.phase === "speak" || game.phase === "success" || game.phase === "invite" || game.phase === "listen");
    let html = bannerHtml();
    html += '<div class="game-wrap phase-' + (game.lesson && game.lesson.phase || 1) + (heavy ? " dock-heavy" : "") + '">';
    html += topBar(displayTitle(game.lesson) + " " + (game.mission + 1) + " / " + (game.missions.length || 5));
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
      if (game.phase === "pick" || game.phase === "speak" || game.phase === "invite" || game.phase === "success") {
        const dock = document.getElementById("game-dock");
        if (dock && dock.scrollIntoView) {
          try { dock.scrollIntoView({ block: "end", behavior: "instant" }); } catch (e) { dock.scrollIntoView(false); }
        }
      }
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
    if (act === "parent") {
      return goParent();
    }
    if (act === "game-start") {
      beginMission(0);
      return true;
    }
    if (act === "game-again") {
      if (game.lesson) startLesson(game.lesson, { screen: "brief", practice: true });
      else openHub();
      return true;
    }
    if (act === "game-continue") {
      const n = nextUncompleted();
      if (n) startLesson(n, {});
      else openHub();
      return true;
    }
    if (act.indexOf("game-phase-") === 0) {
      game.hubPhase = Number(act.slice("game-phase-".length)) || 1;
      const info = (curriculum() && curriculum().phases || []).find(function (x) { return x.id === game.hubPhase; });
      game.hubWeek = info ? info.weeks[0] : (1 + (game.hubPhase - 1) * 13);
      if (api && api.render) api.render();
      else render();
      return true;
    }
    if (act.indexOf("game-week-") === 0) {
      game.hubWeek = Number(act.slice("game-week-".length)) || 1;
      if (api && api.render) api.render();
      else render();
      return true;
    }
    if (act.indexOf("game-open-") === 0) {
      const les = lessonById(act.slice("game-open-".length));
      if (les) startLesson(les, {});
      return true;
    }
    if (act.indexOf("game-pick-") === 0) {
      onPickOption(act.slice("game-pick-".length));
      return true;
    }
    if (act === "game-advance") {
      advanceTalk();
      return true;
    }
    if (act === "game-action") {
      tryInteract("action");
      return true;
    }
    if (act === "game-prop") {
      tryInteract("prop");
      return true;
    }
    if (act === "game-arrive-ok") {
      completeWithoutRec();
      return true;
    }
    if (act === "game-next") {
      if (state && state.recOn) return true;
      const last = game.mission >= game.missions.length - 1;
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
    if (act === "play-tip-en") {
      const tip = game.lesson && game.lesson.tip;
      if (tip && api && api.speak) api.speak(tip.en, "en-US", 0.92);
      return true;
    }
    if (act === "play-tip-zh") {
      const tip = game.lesson && game.lesson.tip;
      if (tip && api && api.sayZh) api.sayZh(tip.zh);
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

  function preview(kind, lessonId) {
    document.body.classList.add("game-open");
    document.body.classList.remove("today-open");
    const api = S();
    if (kind === "hub" || kind === "year" || kind === "week") {
      if (kind === "week") openHub({ phase: 1, week: 1 });
      else openHub();
      return;
    }
    const id = lessonId || ({
      weekday: "p1-w01-mon",
      tue: "p1-w01-tue",
      sat: "p1-w01-sat",
      sun: "p1-w01-sun",
      phase2: "p2-w14-mon",
      phase3: "p3-w27-mon",
      phase4: "p4-w40-mon"
    })[kind] || lessonId;
    const les = lessonById(id) || game.lesson;
    if (les) resetPlayState(les);
    if (api && api.getState) {
      const state = api.getState();
      state.view = "game";
      state.lesson = workingLesson();
      state.phraseIndex = 0;
      state.revealZh = true;
      state.recOn = false;
    }
    if (kind === "brief") {
      game.screen = "brief";
    } else if (kind === "sat") {
      game.screen = "play";
      game.mission = 5;
      game.phase = "navigate";
      resetActorsHome();
    } else if (kind === "sun") {
      game.screen = "play";
      game.mission = 0;
      game.phase = "pick";
      game.quizOpts = quizOptionsFor(game.lesson, phrase());
      resetActorsHome();
      const dest = spots()[resolveSpot(mission().target)];
      if (dest) {
        game.actors.simba.x = dest.x; game.actors.simba.y = dest.y; game.actors.simba.spot = resolveSpot(mission().target);
      }
    } else if (kind === "success") {
      game.screen = "play";
      game.mission = 0;
      game.phase = "success";
      game.doneFlags[0] = true;
      game.celebrating = true;
    } else if (kind === "done") {
      game.screen = "done";
      game.phase = "done";
      game.doneFlags = game.missions.map(function () { return true; });
    } else if (kind === "phase2" || kind === "phase3" || kind === "phase4" || kind === "weekday" || kind === "tue" || kind === "map") {
      game.screen = "play";
      game.mission = 0;
      game.phase = "navigate";
      resetActorsHome();
    } else {
      game.screen = "play";
      game.mission = 0;
      game.phase = "navigate";
      resetActorsHome();
    }
    if (api && api.render) api.render();
    else { render(); afterRender(); }
  }

  window.GameLesson = {
    start: start,
    startLesson: startLesson,
    openHub: openHub,
    render: render,
    afterRender: afterRender,
    onAct: onAct,
    goYear: goYear,
    goToday: goToday,
    preview: preview,
    buildMissions: buildMissions,
    finishDay: finishDay
  };
})();
