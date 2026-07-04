/* Roadmaps — two guided routes through everything on the site.
   Item kinds:
     patterns — ids are problem-bank category ids; progress = solved/total problems
     topics   — scope picks the section (fund/sd/db/cs/bh/sdp); progress = read/total
     note     — external work the site can't track (mocks, diagnostics) */
window.ROADMAPS = {
  junior: {
    id: "junior",
    name: "Junior / Mid-level",
    sub: "L3–L4 · new grad to ~4 years",
    duration: "~12 weeks",
    pitch: "Junior loops are decided by the coding rounds. This route front-loads pattern mastery, adds just enough CS breadth and design vocabulary, and finishes with behavioral stories and live practice.",
    stages: [
      {
        title: "Foundations",
        duration: "Week 1",
        hue: "blue",
        goal: "Big O and the core data structures, cold — plus a repeatable routine for opening any problem.",
        items: [
          { kind: "topics", scope: "fund", ids: ["big-o", "arrays-strings", "linked-lists", "stacks-queues", "hash-maps", "trees", "graphs", "heaps", "reading-a-problem"] }
        ],
        gate: "You can state the time and space complexity of anything you write without hesitating."
      },
      {
        title: "Linear patterns",
        duration: "Weeks 2–4",
        hue: "blue",
        goal: "The bread-and-butter half of every interview: arrays, strings, linked lists, and binary search.",
        items: [
          { kind: "patterns", ids: ["two-pointers", "sliding-window", "prefix-sums", "intervals", "fast-slow-pointers", "linked-list-reversal", "binary-search"] }
        ],
        gate: "A new Easy falls in ≤15 minutes; a Medium in a pattern you know in ≤35."
      },
      {
        title: "Stacks & heaps",
        duration: "Week 5",
        hue: "amber",
        goal: "Order-sensitive processing: monotonic stacks and priority queues.",
        items: [
          { kind: "patterns", ids: ["stacks-monotonic", "heaps-top-k"] }
        ],
        gate: "“Next greater element” and “top-k” trigger the right structure by reflex."
      },
      {
        title: "Trees & graphs",
        duration: "Weeks 6–7",
        hue: "red",
        goal: "BFS, DFS, tries, and union-find — the heart of most FAANG mediums.",
        items: [
          { kind: "patterns", ids: ["trees-bfs-dfs", "tries", "graphs", "union-find"] }
        ],
        gate: "You pick BFS vs DFS without deliberating, and you track visited without being reminded."
      },
      {
        title: "Techniques, recursion & DP",
        duration: "Weeks 8–9",
        hue: "purple",
        goal: "The hardest quartile: greedy proofs, bit tricks, backtracking templates, and dynamic programming.",
        items: [
          { kind: "patterns", ids: ["greedy", "bit-manipulation", "backtracking", "dynamic-programming", "advanced-dp"] }
        ],
        gate: "You can name the recurrence (or the greedy invariant) out loud before you write code."
      },
      {
        title: "CS breadth & design vocabulary",
        duration: "Week 10",
        hue: "teal",
        goal: "The screening-round classics — networking, OS, SQL — plus enough system design to hold a conversation.",
        items: [
          { kind: "topics", scope: "cs", ids: ["osi-model", "tcp-vs-udp", "http-and-dns", "processes-vs-threads", "concurrency-basics", "memory-and-gc"] },
          { kind: "topics", scope: "db", ids: ["sql-fundamentals", "indexing", "transactions-acid"] },
          { kind: "topics", scope: "sd", ids: ["scalability-basics", "caching"] },
          { kind: "topics", scope: "sdp", ids: ["design-url-shortener"] }
        ],
        gate: "You can answer “what happens when you type a URL” for five straight minutes."
      },
      {
        title: "Behavioral & live practice",
        duration: "Weeks 11–12",
        hue: "green",
        goal: "Stories, not improvisation — then pressure-test everything live.",
        items: [
          { kind: "topics", scope: "bh", ids: ["why-behavioral-matters", "star-framework", "story-bank", "amazon-leadership-principles", "google-meta-and-beyond", "questions-to-ask"] },
          { kind: "note", text: "Write 8–10 STAR stories covering conflict, failure, leadership, deadlines" },
          { kind: "note", text: "3+ live mock interviews (Pramp, interviewing.io, or a friend)" }
        ],
        gate: "Every core theme has a story you can tell in under 3 minutes without notes."
      }
    ]
  },

  senior: {
    id: "senior",
    name: "Senior+",
    sub: "L5 and up · design-heavy loops",
    duration: "~10 weeks",
    pitch: "Senior loops flip the weighting: system design and leadership stories carry as much as code. This route calibrates your coding quickly, spends three weeks on design, and builds an org-scope narrative.",
    stages: [
      {
        title: "Calibrate",
        duration: "Week 1",
        hue: "blue",
        goal: "Find your rusty patterns fast instead of re-grinding everything.",
        items: [
          { kind: "topics", scope: "fund", ids: ["big-o", "reading-a-problem"] },
          { kind: "note", text: "Diagnostic: one unseen Medium from each phase, 30 minutes each — note where you stall" }
        ],
        gate: "You know exactly which 4–5 patterns are rusty; only those get double reps next."
      },
      {
        title: "Pattern mastery, hard-first",
        duration: "Weeks 2–4",
        hue: "purple",
        goal: "All 18 patterns at interview speed, prioritizing Hard and Super Hard — narrating aloud the whole time.",
        items: [
          { kind: "patterns", ids: ["two-pointers", "sliding-window", "prefix-sums", "intervals", "fast-slow-pointers", "linked-list-reversal", "binary-search", "stacks-monotonic", "heaps-top-k", "trees-bfs-dfs", "tries", "graphs", "union-find", "greedy", "bit-manipulation", "backtracking", "dynamic-programming", "advanced-dp"] }
        ],
        gate: "Mediums in 20–25 minutes while talking, and you can weigh two valid approaches and defend a choice."
      },
      {
        title: "System design — the differentiator",
        duration: "Weeks 4–6",
        hue: "green",
        goal: "At L5+ this round carries double weight. Own the whole arc: requirements → estimates → API → data model → scaling → bottlenecks.",
        items: [
          { kind: "topics", scope: "sd", ids: ["scalability-basics", "load-balancing", "caching", "databases-sql-vs-nosql", "message-queues", "consistency-and-cap"] },
          { kind: "topics", scope: "sdp", ids: ["design-url-shortener", "design-rate-limiter", "design-news-feed"] },
          { kind: "note", text: "Twice a week: a 45-minute end-to-end design on a whiteboard, out loud" }
        ],
        gate: "You drive the session — clarifying questions, trade-offs unprompted, and you end at the bottlenecks."
      },
      {
        title: "Data & infrastructure depth",
        duration: "Week 7",
        hue: "amber",
        goal: "The follow-up questions that separate senior answers: isolation levels, index design, concurrency, memory.",
        items: [
          { kind: "topics", scope: "db", ids: ["sql-fundamentals", "indexing", "normalization", "transactions-acid", "common-query-problems"] },
          { kind: "topics", scope: "cs", ids: ["processes-vs-threads", "concurrency-basics", "memory-and-gc"] }
        ],
        gate: "You can explain read anomalies per isolation level and design an index for a slow query, cold."
      },
      {
        title: "Leadership narrative",
        duration: "Week 8",
        hue: "red",
        goal: "At senior, scope is the signal: influence without authority, conflict above your level, failures with real blast radius.",
        items: [
          { kind: "topics", scope: "bh", ids: ["why-behavioral-matters", "star-framework", "story-bank", "amazon-leadership-principles", "google-meta-and-beyond", "senior-signals", "questions-to-ask"] },
          { kind: "note", text: "10–12 stories with quantified impact — people, systems, dollars, duration. “I”, not “we”" }
        ],
        gate: "You have stories for influencing without authority, org-level conflict, and a failure that cost something."
      },
      {
        title: "Full-loop rehearsal",
        duration: "Weeks 9–10",
        hue: "teal",
        goal: "Make the real loop feel routine.",
        items: [
          { kind: "note", text: "One full mock loop in a day: 2 coding + 1 design + 1 behavioral" },
          { kind: "note", text: "Research level and comp bands (levels.fyi); never name a number first" }
        ],
        gate: "The mock loop feels like a Tuesday."
      }
    ]
  }
};
