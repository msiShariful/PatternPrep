/* PatternPrep v2 — Material-expressive, hash-routed static app. */
(function () {
  var esc = Highlight.esc;
  var hl = Highlight.highlight;

  /* ---------- data assembly ---------- */
  var CATEGORIES = (window.PROBLEM_BANK || []).slice().sort(function (a, b) { return a.order - b.order; });
  var BEYOND = window.BEYOND_DSA || null;
  var FUND = window.FUNDAMENTALS || { topics: [], intro: "", name: "DSA Fundamentals" };

  var CAT_BY_ID = {};
  var GROUPS = [];
  CATEGORIES.forEach(function (c) {
    CAT_BY_ID[c.id] = c;
    if (GROUPS.indexOf(c.group) === -1) GROUPS.push(c.group);
  });

  var ALL_PROBLEMS = [];
  CATEGORIES.forEach(function (c) {
    c.problems.forEach(function (p) { ALL_PROBLEMS.push({ cat: c, prob: p }); });
  });

  var BEHAV = window.BEHAVIORAL || null;
  var ROADMAPS = window.ROADMAPS || null;

  var GROUP_HUE = {
    "Arrays & Strings": "blue",
    "Pointers & Search": "green",
    "Stacks & Heaps": "amber",
    "Trees & Graphs": "red",
    "Greedy & Bits": "teal",
    "Recursion & DP": "purple"
  };
  var HUE_MAIN = { blue: "#1a73e8", green: "#1e8e3e", amber: "#f29900", red: "#d93025", purple: "#8430ce", teal: "#0097a7" };

  var DIFF_CLASS = { "Easy": "chip-easy", "Medium": "chip-medium", "Hard": "chip-hard", "Super Hard": "chip-super" };

  var AVATAR = {
    "two-pointers": "TP", "sliding-window": "SW", "prefix-sums": "PS", "intervals": "IN",
    "fast-slow-pointers": "FS", "linked-list-reversal": "LR", "binary-search": "BS",
    "stacks-monotonic": "ST", "heaps-top-k": "HK",
    "trees-bfs-dfs": "TR", "tries": "TI", "graphs": "GR", "union-find": "UF",
    "greedy": "GY", "bit-manipulation": "BM",
    "backtracking": "BT", "dynamic-programming": "DP", "advanced-dp": "D2"
  };

  function hue(cat) { return GROUP_HUE[cat.group] || "blue"; }

  /* Topic scopes — used for read-tracking keys and roadmap links.
     Key format in storage: "<scope>:<topicId>". */
  function SCOPES() {
    return {
      fund: { topics: FUND.topics, base: "#/fundamentals/", section: "DSA Fundamentals" },
      sd: { topics: BEYOND ? BEYOND.systemDesign.topics : [], base: "#/system-design/topic/", section: "System Design" },
      sdp: { topics: BEYOND ? (BEYOND.systemDesign.designProblems || []) : [], base: "#/system-design/design/", section: "Design Walkthroughs" },
      db: { topics: BEYOND ? BEYOND.database.topics : [], base: "#/database/", section: "Databases & SQL" },
      cs: { topics: BEYOND ? BEYOND.csFundamentals.topics : [], base: "#/cs/", section: "CS Fundamentals" },
      bh: { topics: BEHAV ? BEHAV.topics : [], base: "#/behavioral/", section: "Behavioral" }
    };
  }

  function readCount(scope, ids) {
    var n = 0;
    ids.forEach(function (id) { if (Progress.isTopicRead(scope + ":" + id)) n++; });
    return n;
  }

  /* ---------- helpers ---------- */
  var view = document.getElementById("view");

  function statusOf(id) { return Progress.get(id).status; }

  function catStats(cat) {
    var solved = 0, attempted = 0;
    cat.problems.forEach(function (p) {
      var s = statusOf(p.id);
      if (s === "solved") solved++;
      else if (s === "attempted") attempted++;
    });
    return { solved: solved, attempted: attempted, total: cat.problems.length };
  }

  function totalStats() {
    var t = { solved: 0, attempted: 0, total: ALL_PROBLEMS.length };
    ALL_PROBLEMS.forEach(function (e) {
      var s = statusOf(e.prob.id);
      if (s === "solved") t.solved++;
      else if (s === "attempted") t.attempted++;
    });
    return t;
  }

  function chip(difficulty) {
    return '<span class="chip ' + (DIFF_CLASS[difficulty] || "chip-neutral") + '">' + esc(difficulty) + "</span>";
  }

  function strip(cat, large) {
    var sq = cat.problems.map(function (p) {
      var s = statusOf(p.id) || "";
      return '<span class="sq ' + s + '" title="' + esc(p.title) + (s ? " — " + s : "") + '"></span>';
    }).join("");
    return '<div class="strip' + (large ? " strip-lg" : "") + '">' + sq + "</div>";
  }

  /* Wavy expressive ring (signature). pathLength=100 lets dasharray express %. */
  function wavyRingSVG(pct, size, color) {
    var cx = size / 2, cy = size / 2;
    var r = size / 2 - 12, amp = size * 0.028, waves = 12;
    var pts = [];
    for (var i = 0; i <= 240; i++) {
      var th = (i / 240) * Math.PI * 2;
      var rr = r + amp * Math.sin(waves * th);
      pts.push((cx + rr * Math.cos(th)).toFixed(2) + " " + (cy + rr * Math.sin(th)).toFixed(2));
    }
    var d = "M" + pts.join(" L") + " Z";
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" role="img" aria-label="' + pct + '% complete">' +
      '<path d="' + d + '" fill="none" stroke="#e4e9f1" stroke-width="10" stroke-linejoin="round"/>' +
      '<path class="ring-progress" d="' + d + '" fill="none" stroke="' + color + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" pathLength="100" stroke-dasharray="' + Math.max(pct, 0.5) + ' 100" transform="rotate(-90 ' + cx + " " + cy + ')"/>' +
      "</svg>";
  }

  function miniRingSVG(solved, total, size, color) {
    var pct = total ? (solved / total) * 100 : 0;
    var r = size / 2 - 4;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="#e4e9f1" stroke-width="4"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray="' + Math.max(pct, 0.5) + ' 100" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')"/></svg>';
  }

  function toast(msg) {
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2600);
  }

  /* structured content blocks (bundled trusted data; p/h3/list may contain <code>/<strong>) */
  function renderBlocks(blocks) {
    return '<div class="blocks">' + (blocks || []).map(function (b) {
      switch (b.type) {
        case "p": return "<p>" + b.text + "</p>";
        case "h3": return "<h3>" + b.text + "</h3>";
        case "list": return "<ul>" + b.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
        case "code": return '<pre class="code">' + hl(b.text, b.lang) + "</pre>";
        case "table": return "<table><thead><tr>" +
          b.headers.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
          "</tr></thead><tbody>" +
          b.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") +
          "</tbody></table>";
        default: return "";
      }
    }).join("") + "</div>";
  }

  function renderStatement(text) {
    var paras = String(text).split(/\n\s*\n/);
    return '<div class="statement">' + paras.map(function (p) {
      if (/^(Input|Output|Example|Explanation)\b/m.test(p)) {
        return '<div class="example">' + esc(p) + "</div>";
      }
      return "<p>" + esc(p) + "</p>";
    }).join("") + "</div>";
  }

  /* ---------- top bar: tabs, progress pill, drawer ---------- */
  var TABS = [
    { href: "#/", label: "Home", match: function (h) { return h === "#/" || h === ""; } },
    { href: "#/roadmap", label: "Roadmap", match: function (h) { return h.indexOf("#/roadmap") === 0; } },
    { href: "#/fundamentals", label: "Fundamentals", match: function (h) { return h.indexOf("#/fundamentals") === 0; } },
    { href: "#/patterns", label: "Problem Bank", match: function (h) { return /^#\/(patterns|pattern\/|problem\/)/.test(h); } },
    { href: "#/system-design", label: "System Design", match: function (h) { return h.indexOf("#/system-design") === 0; } },
    { href: "#/database", label: "Databases", match: function (h) { return h.indexOf("#/database") === 0; } },
    { href: "#/cs", label: "CS Core", match: function (h) { return h.indexOf("#/cs") === 0 && h.indexOf("#/cs-") !== 0; } },
    { href: "#/behavioral", label: "Behavioral", match: function (h) { return h.indexOf("#/behavioral") === 0; } }
  ];

  function renderChrome() {
    var hash = location.hash || "#/";
    document.getElementById("tabs").innerHTML = TABS.map(function (t) {
      return '<a class="tab' + (t.match(hash) ? " active" : "") + '" href="' + t.href + '">' + t.label + "</a>";
    }).join("");

    var s = totalStats();
    var pct = s.total ? Math.round((s.solved / s.total) * 100) : 0;
    document.getElementById("progressPill").innerHTML =
      miniRingSVG(s.solved, s.total, 26, HUE_MAIN.blue) + "<span>" + s.solved + "/" + s.total + "</span>";

    var d = TABS.map(function (t) {
      return '<a class="' + (t.match(hash) ? "active" : "") + '" href="' + t.href + '">' + t.label + "</a>";
    }).join("");
    d += '<div class="drawer-group">Patterns</div>';
    CATEGORIES.forEach(function (c) {
      var cs = catStats(c);
      d += '<a href="#/pattern/' + c.id + '">' + esc(c.name) + '<span class="mini">' + cs.solved + "/" + cs.total + "</span></a>";
    });
    document.getElementById("drawerNav").innerHTML = d;
  }

  /* ---------- shared view pieces ---------- */
  function patternCard(c) {
    var s = catStats(c);
    var h = hue(c);
    return '<a class="pattern-card" href="#/pattern/' + c.id + '">' +
      '<div class="pattern-top">' +
      '<span class="avatar avatar-' + h + '">' + (AVATAR[c.id] || "··") + "</span>" +
      '<span><span class="name">' + esc(c.name) + '</span><br><span class="tag">' + esc(c.tagline || "") + "</span></span>" +
      '<span class="mini-ring">' + miniRingSVG(s.solved, s.total, 44, HUE_MAIN[h]) +
      '<span class="mr-label">' + s.solved + "/" + s.total + "</span></span>" +
      "</div>" + strip(c) + "</a>";
  }

  function pathGrid() {
    var html = "";
    GROUPS.forEach(function (g, gi) {
      var h = GROUP_HUE[g] || "blue";
      html += '<div><span class="phase-label phase-' + h + '"><span class="n">PHASE ' + (gi + 1) + "</span>" + esc(g) + "</span></div>";
      html += '<div class="grid grid-3">' +
        CATEGORIES.filter(function (c) { return c.group === g; }).map(patternCard).join("") +
        "</div>";
    });
    return html;
  }

  function continueCard() {
    var resume = null;
    for (var i = 0; i < ALL_PROBLEMS.length; i++) {
      if (statusOf(ALL_PROBLEMS[i].prob.id) === "attempted") { resume = ALL_PROBLEMS[i]; break; }
    }
    if (!resume) {
      for (var j = 0; j < ALL_PROBLEMS.length; j++) {
        if (!statusOf(ALL_PROBLEMS[j].prob.id)) { resume = ALL_PROBLEMS[j]; break; }
      }
    }
    if (!resume) return "";
    var attempted = statusOf(resume.prob.id) === "attempted";
    return '<div class="continue-card">' +
      '<span class="avatar avatar-' + hue(resume.cat) + '">' + (AVATAR[resume.cat.id] || "··") + "</span>" +
      '<span><span class="up-next">' + (attempted ? "Pick up where you left off" : "Up next on the path") + "</span><br>" +
      '<span class="t">' + esc(resume.prob.title) + "</span> " + chip(resume.prob.difficulty) + "</span>" +
      '<span class="spacer"></span>' +
      '<a class="btn btn-filled btn-sm" href="#/problem/' + resume.cat.id + "/" + resume.prob.id + '">' + (attempted ? "Resume" : "Start") + " →</a>" +
      "</div>";
  }

  /* ---------- views ---------- */
  function viewHome() {
    var t = totalStats();
    var pct = t.total ? Math.round((t.solved / t.total) * 100) : 0;

    var html = '<section class="hero">' +
      "<div>" +
      '<p class="eyebrow">Pattern over grind</p>' +
      "<h1>Master 18 patterns,<br>not 2,000 problems.</h1>" +
      '<p class="lede">Interviewers reuse a small set of algorithmic patterns. Learn them in order — with progressive hints so you struggle productively — and every new problem becomes a variation of one you already know.</p>' +
      '<div class="hero-actions">' +
      '<a class="btn btn-filled" href="#/roadmap">Follow the roadmap</a>' +
      '<a class="btn btn-tonal" href="#/patterns">Browse the problem bank</a>' +
      "</div>" +
      '<div class="stat-chips">' +
      '<span class="stat-chip sol"><b>' + t.solved + "</b> solved</span>" +
      '<span class="stat-chip att"><b>' + t.attempted + "</b> attempted</span>" +
      '<span class="stat-chip rem"><b>' + (t.total - t.solved - t.attempted) + "</b> to go</span>" +
      "</div></div>" +
      '<div class="hero-ring">' + wavyRingSVG(pct, 230, HUE_MAIN.blue) +
      '<div class="ring-label"><span class="pct">' + pct + '%</span><span class="frac">' + t.solved + " / " + t.total + " solved</span></div>" +
      "</div></section>";

    html += continueCard();

    html += '<div class="section-head"><h2>The 18-pattern path</h2><span class="sub">six phases, easiest first — finish a phase before moving on</span></div>';
    html += pathGrid();

    function learnCount(scope, topics) {
      return readCount(scope, topics.map(function (t) { return t.id; })) + "/" + topics.length + " read";
    }
    html += '<div class="section-head"><h2>Beyond the algorithms</h2><span class="sub">the rest of the FAANG loop</span></div>';
    html += '<div class="grid grid-2">' +
      learnCard("#/fundamentals", "blue", "O(n)", "DSA Fundamentals", "Big O, the core data structures, and a 6-step protocol for reading any problem — read this before phase 1.", learnCount("fund", FUND.topics)) +
      (BEYOND ? learnCard("#/system-design", "green", "⬡", "System Design", "Scalability, load balancing, caching, queues, CAP — plus guided walkthroughs of the classic design questions.", learnCount("sd", BEYOND.systemDesign.topics) + " · " + BEYOND.systemDesign.designProblems.length + " walkthroughs") : "") +
      (BEYOND ? learnCard("#/database", "amber", "SQL", "Databases & SQL", "Joins, indexing, normalization, transactions — and the query problems interviewers actually ask.", learnCount("db", BEYOND.database.topics)) : "") +
      (BEYOND ? learnCard("#/cs", "purple", "TCP", "CS Fundamentals", "The OSI model, TCP vs UDP, what-happens-when-you-type-a-URL, processes vs threads, deadlocks.", learnCount("cs", BEYOND.csFundamentals.topics)) : "") +
      (BEHAV ? learnCard("#/behavioral", "red", "STAR", "Behavioral", "STAR stories, all 16 Amazon Leadership Principles, Google & Meta signals, and senior-scope narratives — half the loop lives here.", learnCount("bh", BEHAV.topics)) : "") +
      "</div>";

    html += '<div class="section-head"><h2>Your progress data</h2></div>' +
      '<div class="data-card"><p>Everything is saved in this browser’s localStorage — no account, no server. That also means clearing site data (or switching browsers) resets it. Keep a backup:</p>' +
      '<div class="data-actions">' +
      '<button class="btn btn-tonal btn-sm" id="dashExport">Export JSON</button>' +
      '<button class="btn btn-outline btn-sm" id="dashImport">Import JSON</button>' +
      '<button class="btn btn-danger-outline btn-sm" id="dashReset">Reset everything</button>' +
      "</div></div>";

    view.innerHTML = html;
    document.getElementById("dashExport").addEventListener("click", doExport);
    document.getElementById("dashImport").addEventListener("click", function () { document.getElementById("importFile").click(); });
    document.getElementById("dashReset").addEventListener("click", function () {
      if (confirm("Reset ALL progress? This cannot be undone (export a backup first).")) {
        Progress.resetAll();
        renderChrome();
        route();
        toast("Progress reset");
      }
    });
  }

  function learnCard(href, h, glyph, title, sub, count) {
    return '<a class="learn-card learn-' + h + '" href="' + href + '">' +
      '<span class="glyph">' + glyph + "</span>" +
      '<span class="t">' + title + "</span>" +
      '<span class="s">' + sub + "</span>" +
      '<span class="count">' + count + "</span></a>";
  }

  function viewPatterns() {
    var t = totalStats();
    var html = '<header style="margin-bottom:26px"><p class="eyebrow">Problem bank</p>' +
      "<h1>The pattern path</h1>" +
      '<p class="lede">' + t.total + " curated problems in 18 patterns across six phases. Each problem has three progressive hints — pattern, approach, pseudocode — and a Java solution kept firmly behind a click.</p></header>";
    html += continueCard();
    html += pathGrid();
    view.innerHTML = html;
  }

  function topicListNumbers(hueName) {
    return { blue: "avatar-blue", green: "avatar-green", amber: "avatar-amber", red: "avatar-red", purple: "avatar-purple", teal: "avatar-teal" }[hueName];
  }

  function viewTopicList(cfg) {
    /* cfg: {eyebrow, name, intro, topics, baseHref, hue, scope, extraHtml} */
    var read = cfg.scope ? readCount(cfg.scope, cfg.topics.map(function (t) { return t.id; })) : 0;
    var html = '<header style="margin-bottom:26px"><p class="eyebrow">' + esc(cfg.eyebrow) +
      (cfg.scope ? " · " + read + "/" + cfg.topics.length + " read" : "") + "</p>" +
      "<h1>" + esc(cfg.name) + "</h1>" +
      '<p class="lede">' + (cfg.intro ? cfg.intro.split(/\n\s*\n/)[0] : "") + "</p></header>";
    html += '<div class="grid grid-2">';
    cfg.topics.forEach(function (tp, i) {
      var done = cfg.scope && Progress.isTopicRead(cfg.scope + ":" + tp.id);
      html += '<a class="topic-card" href="' + cfg.baseHref + "/" + tp.id + '">' +
        '<span class="num ' + (done ? "num-done" : topicListNumbers(cfg.hue)) + '">' + (done ? "✓" : String(i + 1).padStart(2, "0")) + "</span>" +
        '<span><span class="t">' + esc(tp.title) + '</span><br><span class="s">' + tp.summary + "</span></span></a>";
    });
    html += "</div>" + (cfg.extraHtml || "");
    view.innerHTML = html;
  }

  function readToggleHTML(key) {
    var read = Progress.isTopicRead(key);
    return '<button class="btn btn-sm read-toggle' + (read ? " is-read" : "") + '" data-read-key="' + key + '">' +
      (read ? "✓ Read" : "Mark as read") + "</button>";
  }

  function bindReadToggle() {
    var btn = view.querySelector(".read-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-read-key");
      var now = !Progress.isTopicRead(key);
      Progress.setTopicRead(key, now);
      btn.classList.toggle("is-read", now);
      btn.textContent = now ? "✓ Read" : "Mark as read";
      if (now) toast("Marked as read ✓");
    });
  }

  function viewTopic(cfg) {
    /* cfg: {topic, topics, baseHref, backLabel, scope} — with prev/next pager */
    var idx = cfg.topics.indexOf(cfg.topic);
    var prev = cfg.topics[idx - 1], next = cfg.topics[idx + 1];
    var key = cfg.scope + ":" + cfg.topic.id;
    view.innerHTML = '<div class="article-wide">' +
      '<header style="margin-bottom:22px"><p class="eyebrow"><a href="' + cfg.baseHref + '">' + esc(cfg.backLabel) + "</a> · " + (idx + 1) + " of " + cfg.topics.length + "</p>" +
      '<div class="prob-head"><div><h1>' + esc(cfg.topic.title) + "</h1>" +
      '<p class="lede">' + cfg.topic.summary + "</p></div>" +
      readToggleHTML(key) + "</div></header>" +
      '<div class="article-body">' + renderBlocks(cfg.topic.blocks) + "</div>" +
      '<div class="prob-pager">' +
      (prev ? '<a href="' + cfg.baseHref + "/" + prev.id + '">← ' + esc(prev.title) + "</a>" : "<span></span>") +
      (next ? '<a href="' + cfg.baseHref + "/" + next.id + '">' + esc(next.title) + " →</a>" : "<span></span>") +
      "</div></div>";
    bindReadToggle();
  }

  function viewMissing(name) {
    view.innerHTML = '<header><h1>' + esc(name) + '</h1><p class="lede">This section’s data file has not been generated yet. Check that all files in <code>js/data/</code> are present.</p></header>';
  }

  function viewFundamentals(topicId) {
    if (topicId) {
      var tp = FUND.topics.filter(function (t) { return t.id === topicId; })[0];
      if (!tp) return viewMissing("Topic not found");
      return viewTopic({ topic: tp, topics: FUND.topics, baseHref: "#/fundamentals", backLabel: "DSA Fundamentals", scope: "fund" });
    }
    viewTopicList({ eyebrow: "Start here", name: FUND.name, intro: FUND.intro, topics: FUND.topics, baseHref: "#/fundamentals", hue: "blue", scope: "fund" });
  }

  function viewBehavioral(topicId) {
    if (!BEHAV) return viewMissing("Behavioral");
    if (topicId) {
      var tp = BEHAV.topics.filter(function (t) { return t.id === topicId; })[0];
      if (!tp) return viewMissing("Topic not found");
      return viewTopic({ topic: tp, topics: BEHAV.topics, baseHref: "#/behavioral", backLabel: "Behavioral", scope: "bh" });
    }
    viewTopicList({ eyebrow: "The other half of the loop", name: BEHAV.name, intro: BEHAV.intro, topics: BEHAV.topics, baseHref: "#/behavioral", hue: "red", scope: "bh" });
  }

  function patternChips(activeId) {
    return '<div class="pattern-chips">' + CATEGORIES.map(function (c) {
      var active = c.id === activeId;
      return '<a class="pchip' + (active ? " active-" + hue(c) : "") + '" href="#/pattern/' + c.id + '">' + esc(c.name) + "</a>";
    }).join("") + "</div>";
  }

  function viewCategory(catId) {
    var cat = CAT_BY_ID[catId];
    if (!cat) return viewMissing("Pattern not found");
    var s = catStats(cat);
    var h = hue(cat);
    var pct = s.total ? Math.round((s.solved / s.total) * 100) : 0;

    var html = patternChips(catId);
    html += '<section class="cat-hero cat-hero-' + h + '">' +
      '<p class="eyebrow">' + esc(cat.group) + " · " + s.total + " problems</p>" +
      '<div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">' +
      '<span class="avatar avatar-' + h + '" style="width:56px;height:56px;border-radius:19px;font-size:18px">' + (AVATAR[cat.id] || "··") + "</span>" +
      "<h1 style='margin:0'>" + esc(cat.name) + "</h1></div>" +
      '<p class="lede" style="margin-top:14px">' + esc(cat.blurb || "") + "</p>" +
      '<div class="cat-hero-meta">' + strip(cat, true) +
      '<span class="txt">' + pct + "% · " + s.solved + " solved · " + s.attempted + " attempted</span>" +
      "</div></section>";

    html += '<div class="prob-rows">';
    cat.problems.forEach(function (p, i) {
      var st = statusOf(p.id) || "";
      var e = Progress.get(p.id);
      html += '<a class="prob-row" href="#/problem/' + cat.id + "/" + p.id + '">' +
        '<span class="status-dot ' + st + '" title="' + (st || "not started") + '"></span>' +
        '<span class="idx">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="t">' + esc(p.title) + "</span>" +
        '<span class="meta">' +
        (e.hints > 0 ? '<span class="hint-count">' + e.hints + " hint" + (e.hints > 1 ? "s" : "") + "</span>" : "") +
        chip(p.difficulty) + "</span></a>";
    });
    html += "</div>";
    view.innerHTML = html;
  }

  function viewProblem(catId, probId) {
    var cat = CAT_BY_ID[catId];
    var prob = cat && cat.problems.filter(function (p) { return p.id === probId; })[0];
    if (!prob) return viewMissing("Problem not found");

    var h = hue(cat);
    var idx = cat.problems.indexOf(prob);
    var prev = cat.problems[idx - 1];
    var next = cat.problems[idx + 1];
    var entry = Progress.get(prob.id);
    var status = entry.status;

    var html = '<div class="article">' +
      '<header><p class="eyebrow"><a href="#/pattern/' + cat.id + '">' + esc(cat.name) + "</a> · problem " + (idx + 1) + " of " + cat.problems.length + "</p>" +
      '<div class="prob-head"><div>' +
      "<h1>" + esc(prob.title) + "</h1>" +
      '<div class="chips">' + chip(prob.difficulty) + '<span class="chip chip-neutral">' + esc(cat.name) + "</span></div></div>" +
      '<div class="statuses" role="group" aria-label="Progress status">' +
      '<button data-status="" class="' + (!status ? "on-none" : "") + '">Not started</button>' +
      '<button data-status="attempted" class="' + (status === "attempted" ? "on-attempted" : "") + '">Attempted</button>' +
      '<button data-status="solved" class="' + (status === "solved" ? "on-solved" : "") + '">Solved ✓</button>' +
      "</div></div></header>";

    html += '<div class="statement-card">' + renderStatement(prob.description) + "</div>";

    var HINT_LABELS = ["Which pattern?", "Which approach?", "Pseudocode"];
    html += "<h2>Hints</h2><p class='lede' style='font-size:15px;margin:-6px 0 16px'>Struggle first. Reveal one level only when you’re genuinely stuck — that’s what builds recall.</p>";
    html += '<div class="hints">';
    prob.hints.forEach(function (hint, i) {
      var lvl = i + 1;
      var revealed = entry.hints >= lvl;
      var unlockable = entry.hints >= i;
      html += '<div class="hint-step' + (unlockable ? "" : " locked") + '">' +
        '<button class="hint-trigger" data-hint="' + lvl + '" ' + (unlockable ? "" : "disabled") + ">" +
        '<span class="hn">' + (unlockable ? lvl : "🔒") + "</span>" +
        '<span class="ht">Hint ' + lvl + " — " + HINT_LABELS[i] + "</span>" +
        '<span class="hs">' + (revealed ? "revealed · tap to show" : (unlockable ? "tap to reveal" : "reveal hint " + i + " first")) + "</span>" +
        "</button>" +
        '<div class="hint-body' + (lvl === 3 ? " mono" : "") + '" data-hint-body="' + lvl + '" hidden>' + esc(hint) + "</div>" +
        "</div>";
    });
    html += "</div>";

    html += "<h2>Solution</h2>";
    html += '<div class="spoiler-actions"><button class="btn btn-filled btn-sm" id="showSolution">Show solution · Java</button>' +
      '<span class="spoiler-note">spoiler — stays hidden until you ask</span></div>';
    html += '<div id="solutionBody" hidden>' +
      '<div class="complexity"><span class="cx">Time <b>' + esc(prob.solution.time) + '</b></span>' +
      '<span class="cx">Space <b>' + esc(prob.solution.space) + "</b></span></div>" +
      '<pre class="code">' + hl(prob.solution.java, "java") + "</pre>" +
      '<div class="explain-card"><p>' + esc(prob.solution.explanation) + "</p></div>" +
      "</div>";

    html += '<div class="prob-pager">' +
      (prev ? '<a href="#/problem/' + cat.id + "/" + prev.id + '">← ' + esc(prev.title) + "</a>" : "<span></span>") +
      (next ? '<a href="#/problem/' + cat.id + "/" + next.id + '">' + esc(next.title) + " →</a>" : "<span></span>") +
      "</div></div>";

    view.innerHTML = html;

    Array.prototype.forEach.call(view.querySelectorAll(".statuses button"), function (btn) {
      btn.addEventListener("click", function () {
        var s = btn.getAttribute("data-status") || null;
        Progress.setStatus(prob.id, s);
        renderChrome();
        viewProblem(catId, probId);
        if (s === "solved") toast("Solved: " + prob.title + " ✓");
      });
    });

    Array.prototype.forEach.call(view.querySelectorAll(".hint-trigger"), function (btn) {
      btn.addEventListener("click", function () {
        var lvl = parseInt(btn.getAttribute("data-hint"), 10);
        var body = view.querySelector('[data-hint-body="' + lvl + '"]');
        var e = Progress.get(prob.id);
        if (e.hints < lvl) {
          Progress.revealHint(prob.id, lvl);
          body.hidden = false;
          var nextBtn = view.querySelector('.hint-trigger[data-hint="' + (lvl + 1) + '"]');
          if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.closest(".hint-step").classList.remove("locked");
            nextBtn.querySelector(".hn").textContent = lvl + 1;
            nextBtn.querySelector(".hs").textContent = "tap to reveal";
          }
          btn.querySelector(".hs").textContent = "revealed · tap to hide";
        } else {
          body.hidden = !body.hidden;
          btn.querySelector(".hs").textContent = body.hidden ? "revealed · tap to show" : "revealed · tap to hide";
        }
      });
    });

    document.getElementById("showSolution").addEventListener("click", function () {
      var body = document.getElementById("solutionBody");
      body.hidden = !body.hidden;
      this.textContent = body.hidden ? "Show solution · Java" : "Hide solution";
      if (!body.hidden) Progress.revealSolution(prob.id);
    });
  }

  function viewSystemDesign(kind, id) {
    if (!BEYOND || !BEYOND.systemDesign) return viewMissing("System Design");
    var sd = BEYOND.systemDesign;

    if (kind === "topic" && id) {
      var tp = sd.topics.filter(function (t) { return t.id === id; })[0];
      if (!tp) return viewMissing("Topic not found");
      return viewTopic({ topic: tp, topics: sd.topics, baseHref: "#/system-design/topic", backLabel: "System Design", scope: "sd" });
    }

    if (kind === "design" && id) {
      var dp = (sd.designProblems || []).filter(function (d) { return d.id === id; })[0];
      if (!dp) return viewMissing("Design problem not found");
      var html = '<div class="article-wide">' +
        '<header style="margin-bottom:22px"><p class="eyebrow"><a href="#/system-design">System Design</a> · guided walkthrough</p>' +
        '<div class="prob-head"><div><h1>' + esc(dp.title) + "</h1>" +
        '<p class="lede">' + dp.summary + " Work each step yourself before expanding it.</p></div>" +
        readToggleHTML("sdp:" + dp.id) + "</div></header>";
      dp.steps.forEach(function (st, i) {
        html += '<details class="step"' + (i === 0 ? " open" : "") + "><summary>" + esc(st.title) + "</summary>" +
          '<div class="step-body">' + renderBlocks(st.blocks) + "</div></details>";
      });
      view.innerHTML = html + "</div>";
      bindReadToggle();
      return;
    }

    var extra = "";
    if (sd.designProblems && sd.designProblems.length) {
      extra = '<div class="section-head"><h2>Guided design walkthroughs</h2><span class="sub">step by step, answers collapsed</span></div><div class="grid grid-2">' +
        sd.designProblems.map(function (d, i) {
          return '<a class="topic-card" href="#/system-design/design/' + d.id + '">' +
            '<span class="num avatar-green">' + String(i + 1).padStart(2, "0") + "</span>" +
            '<span><span class="t">' + esc(d.title) + '</span><br><span class="s">' + d.summary + "</span></span></a>";
        }).join("") + "</div>";
    }
    viewTopicList({ eyebrow: "Beyond DSA", name: sd.name, intro: sd.intro, topics: sd.topics, baseHref: "#/system-design/topic", hue: "green", scope: "sd", extraHtml: extra });
  }

  function viewDatabase(id) {
    if (!BEYOND || !BEYOND.database) return viewMissing("Databases & SQL");
    var db = BEYOND.database;
    if (id) {
      var tp = db.topics.filter(function (t) { return t.id === id; })[0];
      if (!tp) return viewMissing("Topic not found");
      return viewTopic({ topic: tp, topics: db.topics, baseHref: "#/database", backLabel: "Databases & SQL", scope: "db" });
    }
    viewTopicList({ eyebrow: "Beyond DSA", name: db.name, intro: db.intro, topics: db.topics, baseHref: "#/database", hue: "amber", scope: "db" });
  }

  function viewCS(id) {
    if (!BEYOND || !BEYOND.csFundamentals) return viewMissing("CS Fundamentals");
    var cs = BEYOND.csFundamentals;
    if (id) {
      var tp = cs.topics.filter(function (t) { return t.id === id; })[0];
      if (!tp) return viewMissing("Topic not found");
      return viewTopic({ topic: tp, topics: cs.topics, baseHref: "#/cs", backLabel: "CS Fundamentals", scope: "cs" });
    }
    viewTopicList({ eyebrow: "Beyond DSA", name: cs.name, intro: cs.intro, topics: cs.topics, baseHref: "#/cs", hue: "purple", scope: "cs" });
  }

  /* ---------- roadmap ---------- */
  function itemChips(item) {
    if (item.kind === "patterns") {
      return item.ids.map(function (cid) {
        var c = CAT_BY_ID[cid];
        if (!c) return "";
        var s = catStats(c);
        var done = s.solved === s.total && s.total > 0;
        return '<a class="rm-chip' + (done ? " done" : "") + '" href="#/pattern/' + c.id + '">' +
          '<span class="dot" style="background:' + HUE_MAIN[hue(c)] + '"></span>' + esc(c.name) +
          '<span class="ct">' + (done ? "✓" : s.solved + "/" + s.total) + "</span></a>";
      }).join("");
    }
    if (item.kind === "topics") {
      var sc = SCOPES()[item.scope];
      if (!sc) return "";
      return item.ids.map(function (tid) {
        var tp = sc.topics.filter(function (t) { return t.id === tid; })[0];
        if (!tp) return "";
        var done = Progress.isTopicRead(item.scope + ":" + tid);
        return '<a class="rm-chip' + (done ? " done" : "") + '" href="' + sc.base + tid + '">' +
          esc(tp.title) + '<span class="ct">' + (done ? "✓" : "read") + "</span></a>";
      }).join("");
    }
    if (item.kind === "note") {
      return '<span class="rm-chip rm-note">' + esc(item.text) + '<span class="ct">external</span></span>';
    }
    return "";
  }

  function stageProgress(stage) {
    var done = 0, total = 0;
    stage.items.forEach(function (item) {
      if (item.kind === "patterns") {
        item.ids.forEach(function (cid) {
          var c = CAT_BY_ID[cid];
          if (!c) return;
          var s = catStats(c);
          done += s.solved; total += s.total;
        });
      } else if (item.kind === "topics") {
        total += item.ids.length;
        done += readCount(item.scope, item.ids);
      }
    });
    return { done: done, total: total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function viewRoadmap(level) {
    if (!ROADMAPS) return viewMissing("Roadmap");
    level = level === "senior" ? "senior" : "junior";
    var rm = ROADMAPS[level];

    var overallDone = 0, overallTotal = 0;
    rm.stages.forEach(function (st) {
      var p = stageProgress(st);
      overallDone += p.done; overallTotal += p.total;
    });
    var overallPct = overallTotal ? Math.round((overallDone / overallTotal) * 100) : 0;

    var html = '<header style="margin-bottom:22px"><p class="eyebrow">Your route to the loop</p>' +
      "<h1>Interview roadmap</h1>" +
      '<p class="lede">Two routes through everything on this site, in the order that compounds. Every stop links to real material here and tracks itself — finish a stage’s gate before moving on.</p></header>';

    html += '<div class="rm-toggle" role="tablist">' +
      ['junior', 'senior'].map(function (lv) {
        var r = ROADMAPS[lv];
        return '<a class="rm-opt' + (lv === level ? " active" : "") + '" role="tab" aria-selected="' + (lv === level) + '" href="#/roadmap' + (lv === "senior" ? "/senior" : "") + '">' +
          '<span class="t">' + esc(r.name) + '</span><span class="s">' + esc(r.sub) + " · " + esc(r.duration) + "</span></a>";
      }).join("") + "</div>";

    html += '<div class="rm-summary"><p class="lede" style="font-size:15.5px">' + esc(rm.pitch) + "</p>" +
      '<span class="rm-overall">' + overallPct + "% complete</span></div>";

    html += '<div class="roadmap">';
    rm.stages.forEach(function (st, i) {
      var p = stageProgress(st);
      var color = HUE_MAIN[st.hue] || HUE_MAIN.blue;
      html += '<div class="rm-stage">' +
        '<div class="rm-node">' + miniRingSVG(p.done, Math.max(p.total, 1), 46, color) +
        '<span class="rm-node-n"' + (p.pct === 100 && p.total > 0 ? ' style="color:' + color + '"' : "") + ">" + (p.pct === 100 && p.total > 0 ? "✓" : i + 1) + "</span></div>" +
        '<div class="rm-card">' +
        '<div class="rm-head"><span class="rm-title">' + esc(st.title) + '</span>' +
        '<span class="chip chip-neutral">' + esc(st.duration) + "</span>" +
        (p.total ? '<span class="rm-pct">' + p.done + "/" + p.total + "</span>" : "") + "</div>" +
        '<p class="rm-goal">' + esc(st.goal) + "</p>" +
        '<div class="rm-chips">' + st.items.map(itemChips).join("") + "</div>" +
        '<div class="rm-gate"><b>Move on when:</b> ' + esc(st.gate) + "</div>" +
        "</div></div>";
    });
    html += "</div>";
    view.innerHTML = html;
  }

  /* ---------- export / import ---------- */
  function doExport() {
    var blob = new Blob([Progress.exportJSON()], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "patternprep-progress.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    toast("Progress exported");
  }

  document.getElementById("exportBtn").addEventListener("click", function () { closeMenu(); doExport(); });
  document.getElementById("importBtn").addEventListener("click", function () {
    closeMenu();
    document.getElementById("importFile").click();
  });
  document.getElementById("resetBtn").addEventListener("click", function () {
    closeMenu();
    if (confirm("Reset ALL progress? This cannot be undone (export a backup first).")) {
      Progress.resetAll();
      renderChrome();
      route();
      toast("Progress reset");
    }
  });
  document.getElementById("importFile").addEventListener("change", function () {
    var file = this.files[0];
    this.value = "";
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        Progress.importJSON(String(reader.result));
        renderChrome();
        route();
        toast("Progress imported ✓");
      } catch (e) {
        toast("Import failed: " + e.message);
      }
    };
    reader.readAsText(file);
  });

  /* ---------- menu & drawer ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var menuList = document.getElementById("menuList");
  function closeMenu() { menuList.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    menuList.hidden = !menuList.hidden;
    menuBtn.setAttribute("aria-expanded", String(!menuList.hidden));
  });
  document.addEventListener("click", function (e) {
    if (!menuList.hidden && !menuList.contains(e.target)) closeMenu();
  });

  var navToggle = document.getElementById("navToggle");
  function closeDrawer() { document.body.classList.remove("nav-open"); navToggle.setAttribute("aria-expanded", "false"); }
  navToggle.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  document.getElementById("scrim").addEventListener("click", closeDrawer);
  document.getElementById("drawerNav").addEventListener("click", function (e) {
    if (e.target.closest("a")) closeDrawer();
  });

  /* ---------- router ---------- */
  function route() {
    var hash = location.hash || "#/";
    var parts = hash.replace(/^#\//, "").split("/").filter(Boolean);
    window.scrollTo(0, 0);

    if (parts.length === 0) viewHome();
    else if (parts[0] === "roadmap") viewRoadmap(parts[1]);
    else if (parts[0] === "behavioral") viewBehavioral(parts[1]);
    else if (parts[0] === "patterns") viewPatterns();
    else if (parts[0] === "fundamentals") viewFundamentals(parts[1]);
    else if (parts[0] === "pattern") viewCategory(parts[1]);
    else if (parts[0] === "problem") viewProblem(parts[1], parts[2]);
    else if (parts[0] === "system-design") viewSystemDesign(parts[1], parts[2]);
    else if (parts[0] === "database") viewDatabase(parts[1]);
    else if (parts[0] === "cs") viewCS(parts[1]);
    else viewHome();

    var h1 = view.querySelector("h1");
    document.title = (h1 ? h1.textContent.replace(/\s+/g, " ").trim() + " — " : "") + "PatternPrep";
    renderChrome();
  }

  window.addEventListener("hashchange", route);
  route();
})();
