/* Progress persistence — localStorage only, no backend.
   Shape: {
     problems: { [problemId]: { status: "attempted"|"solved", hints: 0..3, solution: bool } },
     topics:   { [scopedTopicKey]: true }   // e.g. "fund:big-o", "sd:caching", "bh:star-framework"
   } */
(function () {
  var KEY = "patternprep.v1";

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var data = raw ? JSON.parse(raw) : null;
      if (!data || typeof data !== "object" || typeof data.problems !== "object" || data.problems === null) {
        return { problems: {}, topics: {} };
      }
      if (typeof data.topics !== "object" || data.topics === null) data.topics = {};
      return data;
    } catch (e) {
      return { problems: {}, topics: {} };
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* storage full or blocked — progress simply won't persist */
    }
  }

  var state = load();

  function entry(id) {
    return state.problems[id] || { status: null, hints: 0, solution: false };
  }

  window.Progress = {
    get: entry,

    setStatus: function (id, status) {
      var e = entry(id);
      if (status === null) {
        e.status = null;
      } else {
        e.status = status; // "attempted" | "solved"
      }
      state.problems[id] = e;
      if (e.status === null && e.hints === 0 && !e.solution) delete state.problems[id];
      save(state);
    },

    revealHint: function (id, level) {
      var e = entry(id);
      if (level > e.hints) e.hints = level;
      state.problems[id] = e;
      save(state);
    },

    revealSolution: function (id) {
      var e = entry(id);
      e.solution = true;
      state.problems[id] = e;
      save(state);
    },

    isTopicRead: function (key) {
      return !!state.topics[key];
    },

    setTopicRead: function (key, read) {
      if (read) state.topics[key] = true;
      else delete state.topics[key];
      save(state);
    },

    exportJSON: function () {
      return JSON.stringify({ app: "patternprep", version: 1, exportedAt: new Date().toISOString(), data: state }, null, 2);
    },

    importJSON: function (text) {
      var parsed = JSON.parse(text); // throws on invalid JSON — caller handles
      var incoming = parsed && parsed.app === "patternprep" ? parsed.data : parsed;
      if (!incoming || typeof incoming.problems !== "object" || incoming.problems === null) {
        throw new Error("Not a PatternPrep progress file.");
      }
      state = { problems: {}, topics: {} };
      Object.keys(incoming.problems).forEach(function (id) {
        var e = incoming.problems[id] || {};
        state.problems[id] = {
          status: e.status === "solved" || e.status === "attempted" ? e.status : null,
          hints: Math.min(3, Math.max(0, parseInt(e.hints, 10) || 0)),
          solution: !!e.solution
        };
      });
      if (incoming.topics && typeof incoming.topics === "object") {
        Object.keys(incoming.topics).forEach(function (k) {
          if (incoming.topics[k]) state.topics[k] = true;
        });
      }
      save(state);
    },

    resetAll: function () {
      state = { problems: {}, topics: {} };
      save(state);
    }
  };
})();
