/* Data Structures guides — part E: the technique guides (Recursion, DP, Greedy, Bit Manipulation). */
window.STRUCTURE_TOPICS = window.STRUCTURE_TOPICS || [];

window.STRUCTURE_TOPICS.push({
  id: "recursion",
  order: 8,
  title: "Recursion",
  hue: "purple",
  tagline: "Base case, smaller call, trust the stack",
  minutes: 11,
  summary: "A function that solves a problem by calling itself on a smaller piece of it. What the <code>call stack</code> actually does, the two-line correctness proof, and how to size a recursion before you run it.",
  blocks: [
    { type: "p", text: "Recursion is delegation: a function hands a smaller copy of its own problem to a fresh copy of itself, then combines the answer that comes back. Two ingredients keep it honest — a <code>base case</code> (an input so small the answer is immediate) and <strong>progress</strong> (every call moves toward that base). Trees, backtracking, divide &amp; conquer, and dynamic programming are all recursion wearing different jackets, which makes this the single most load-bearing technique in the interview canon." },
    { type: "callout", variant: "analogy", title: "Ask the person in front of you", text: "You're in a long queue and want your position. Tap the shoulder ahead: \"what's your number?\" That person asks ahead too, all the way to the front, where someone finally says \"1\" — the base case. Answers then flow backward, each person adding one. Nobody counted the whole line; everyone solved a one-step problem and trusted the rest." },
    { type: "tree", root: { v: "f4", kids: [
      { v: "f3", kids: [
        { v: "f2", hl: 2, kids: [{ v: "f1", hl: 2 }, { v: "f0", hl: 2 }] },
        { v: "f1" }
      ] },
      { v: "f2", hl: 2, kids: [{ v: "f1", hl: 2 }, { v: "f0", hl: 2 }] }
    ] }, caption: "The call tree of fib(4). Both highlighted subtrees are the identical fib(2) computation, done twice in full. The same work done twice is the doorway to Dynamic Programming." },
    { type: "h3", text: "Base case + progress = a proof" },
    { type: "p", text: "Reading a recursive function by tracing every call is how beginners drown. The senior move is the <strong>leap of faith</strong>: assume the recursive call returns the right answer for its smaller input, then check just two things — the base case is correct, and the combine step is correct given that assumption. That is mathematical induction in disguise, and it is a complete proof. The machine that does the actual tracing is the <code>call stack</code>: every unfinished call sits in a <strong>frame</strong> (its arguments, locals, and where to resume), stacked up until the base case lets them unwind." },
    { type: "bigO", rows: [
      ["factorial(n) — one branch", "O(n)", "a straight chain of n calls"],
      ["Naive fib(n) — two branches", "O(2ⁿ)", "every call spawns two more"],
      ["Recursive binary search", "O(log n)", "the input halves before each call"],
      ["Merge sort", "O(n log n)", "log n levels, n work per level"],
      ["Stack space, any recursion", "O(depth)", "every unfinished call holds a live frame"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "long factorial(int n) {\n    if (n <= 1) return 1;            // base case: answer known outright\n    return n * factorial(n - 1);     // progress: n shrinks toward the base\n}\n\n// The same descent with an explicit stack — recursion made visible\nlong factorialIter(int n) {\n    Deque<Integer> stack = new ArrayDeque<>();\n    for (int i = n; i > 1; i--) stack.push(i);\n    long result = 1;\n    while (!stack.isEmpty()) result *= stack.pop();\n    return result;\n}" },
    { type: "steps", title: "The call stack: factorial(4), down and back up", frames: [
      { d: "factorial(4) is called. A frame — its argument plus where to resume — is pushed onto the call stack.", cells: { dir: "v", cells: [{ v: "f(4)", hl: 1 }] } },
      { d: "f(4) can't finish until factorial(3) answers, so it pauses mid-multiplication and f(3)'s frame pushes on top.", cells: { dir: "v", cells: [{ v: "f(4)" }, { v: "f(3)", hl: 1 }] } },
      { d: "f(3) pauses the same way; f(2) pushes. Every frame below is frozen, waiting on the one above it.", cells: { dir: "v", cells: [{ v: "f(4)" }, { v: "f(3)" }, { v: "f(2)", hl: 1 }] } },
      { d: "f(1) pushes and hits the base case: n ≤ 1, return 1 — no deeper call. Peak depth 4 frames: that is the O(n) stack space.", cells: { dir: "v", cells: [{ v: "f(4)" }, { v: "f(3)" }, { v: "f(2)" }, { v: "f(1)", hl: 1 }], pointers: [{ i: 3, t: "base" }] } },
      { d: "f(1) returns 1 and its frame pops. f(2) wakes exactly where it paused and computes 2 × 1.", cells: { dir: "v", cells: [{ v: "f(4)" }, { v: "f(3)" }, { v: "f(2)", hl: 2 }, { v: "f(1)", hl: 1 }], pointers: [{ i: 3, t: "ret 1" }] } },
      { d: "f(2) returns 2 and pops. f(3) resumes: 3 × 2.", cells: { dir: "v", cells: [{ v: "f(4)" }, { v: "f(3)", hl: 2 }, { v: "f(2)", hl: 1 }, { v: "f(1)", dim: true }], pointers: [{ i: 2, t: "ret 2" }] } },
      { d: "f(3) returns 6 and pops. One frame left.", cells: { dir: "v", cells: [{ v: "f(4)", hl: 2 }, { v: "f(3)", hl: 1 }, { v: "f(2)", dim: true }, { v: "f(1)", dim: true }], pointers: [{ i: 1, t: "ret 6" }] } },
      { d: "f(4) returns 4 × 6 = 24 and the stack is empty. The unwind multiplied in exactly the reverse order of the descent.", cells: { dir: "v", cells: [{ v: "f(4)", hl: 1 }, { v: "f(3)", dim: true }, { v: "f(2)", dim: true }, { v: "f(1)", dim: true }], pointers: [{ i: 0, t: "ret 24" }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "Two ways to die: no base, no progress", text: "A missing (or unreachable) base case recurses forever; so does a call that doesn't shrink its input — <code>helper(n)</code> quietly calling <code>helper(n)</code> on one branch. Java grants roughly 10⁴ stack frames before <code>StackOverflowError</code>, so even a correct recursion dies on deep-but-legal input: a 100,000-node linked list, a degenerate tree that is really a chain. Depth that can reach five digits needs the iterative rewrite." },
    { type: "callout", variant: "pro", title: "Every recursion is a loop plus an explicit stack", text: "The call stack is just a stack — so any recursion can be rewritten as a loop pushing what a frame would hold onto your own <code>Deque</code>. That conversion is how you dodge <code>StackOverflowError</code>, because the JVM performs <strong>no tail-call optimization</strong>: even a perfect tail call burns a frame. And size before you run: the call tree is bounded by branching^depth — two branches at depth n is 2ⁿ (fib, subsets), n branches shrinking by one is n! (permutations). If that number frightens you, memoize or prune before writing another line." },
    { type: "callout", variant: "rule", title: "The two-line correctness proof", text: "Line 1: the base case returns the right answer. Line 2: assuming the recursive call is right for smaller input, the combine step is right. If both hold, the function is correct — that's induction. Never trace the whole tree in your head; tracing is what the machine is for." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"the structure contains smaller copies of itself\"</strong> (trees, nested lists, JSON) → recurse where the shape recurses",
      "<strong>\"generate all / try every combination\"</strong> → Backtracking — recursion with undo",
      "<strong>\"split in half, solve the halves, merge\"</strong> → Divide &amp; Conquer",
      "<strong>\"the same subproblem keeps reappearing\"</strong> → add a memo — the recursion graduates into DP"
    ] },
    { type: "check", items: [
      { q: "What two facts prove a recursive function correct?", a: "The base case returns the right answer, and — assuming the recursive call is right for its smaller input — the combine step is right. That's induction in two lines; no full trace required." },
      { q: "Naive fib(50) versus a simple loop — why the astronomical gap?", a: "The call tree has on the order of 2⁵⁰ nodes because both branches recompute the same subproblems; the loop computes each of the 50 values exactly once. Same math, different bookkeeping." },
      { q: "Your recursion passes the samples but throws StackOverflowError on a 200,000-node list. What's the fix?", a: "Depth ≈ n blows past the JVM's ~10⁴ frames, and Java has no tail-call optimization to save you. Convert to a loop with an explicit Deque — same algorithm, heap-sized memory instead of stack-sized." },
      { q: "How do you estimate a recursion's cost before running it?", a: "Bound the call tree: branching factor raised to depth, times per-call work. Two branches at depth n → O(2ⁿ); one branch at depth n → O(n); halving input → O(log n) calls." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Replay the factorial walkthrough, narrating each unwind step yourself before reading the caption — the wake-up-and-resume moment is the entire concept." },
      { t: "Drill", d: "Backtracking is recursion with undo: choose, recurse, un-choose. The cleanest place to build call-tree intuition.", href: "#/pattern/backtracking", link: "Backtracking" },
      { t: "Interview-ready", d: "Learn to spot repeated subtrees in your own recursions and cache them — the exact move that turns exponential into linear.", href: "#/pattern/dynamic-programming", link: "Dynamic Programming" },
      { t: "Master", d: "Open the Pattern map and clear every recursion-powered branch: backtracking, trees, divide &amp; conquer, DP.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "dynamic-programming",
  order: 12,
  title: "Dynamic Programming",
  hue: "slate",
  tagline: "Recursion that remembers",
  minutes: 12,
  summary: "Never answer the same question twice: cache sub-answers and O(2ⁿ) collapses to O(n). The two properties that make DP legal, and the three questions — state, transition, base — that design one.",
  blocks: [
    { type: "p", text: "Dynamic Programming is recursion that writes things down. When a recursion keeps asking the same question — fib(4) computing fib(2) twice — store each answer the first time and every repeat becomes a lookup. That single move regularly collapses O(2ⁿ) into O(n). The name is historical noise; the idea is a cache plus a plan for filling it. If you can say what a subproblem is in one sentence, a working DP is three questions away." },
    { type: "callout", variant: "analogy", title: "Write it down, never recount", text: "You counted a long column of 1s and wrote \"8\" beside it. Someone appends another +1 and asks for the total. You say \"nine\" instantly — not because you recounted, but because you remembered. DP is exactly that discipline: every sub-answer gets written down, so no question is ever answered twice." },
    { type: "cells", title: "Anatomy", index: true, cells: [{ v: "0" }, { v: "1" }, { v: "1" }, { v: "2" }, { v: "3" }, { v: "5" }, { v: "8" }], pointers: [{ i: 6, t: "dp[6]" }], caption: "A filled fib table: slot i holds the complete answer to subproblem i, and <code>dp[i] = dp[i−1] + dp[i−2]</code>. Seven questions, seven answers, zero recounts." },
    { type: "h3", text: "Two properties, three questions" },
    { type: "p", text: "DP applies when a problem has <strong>overlapping subproblems</strong> — the same smaller question gets asked more than once (fib(2) lives inside both fib(3) and fib(4)) — and <strong>optimal substructure</strong> — the best whole answer is built from best sub-answers (the cheapest way to floor 10 extends the cheapest way to floor 9 or 8). Merge sort has substructure but its halves never overlap, so a cache would never score a hit: that's plain divide &amp; conquer. When both properties hold, design by answering three questions. <strong>State</strong>: what does <code>dp[i]</code> (or <code>dp[i][j]</code>) mean, in one plain sentence? <strong>Transition</strong>: how does a state combine earlier states — the recurrence? <strong>Base</strong>: which states are known outright? Answer those and the code writes itself, top-down or bottom-up." },
    { type: "bigO", rows: [
      ["Naive fib(n)", "O(2ⁿ)", "the same subproblems recomputed exponentially"],
      ["Memoized fib(n)", "O(n)", "each state computed once; repeats become lookups"],
      ["Tabulated fib(n)", "O(n)", "one table pass; O(n) space for the table"],
      ["Rolling-variable fib(n)", "O(n)", "same pass, O(1) space — only two states matter"],
      ["Any DP", "O(states × transition)", "count the table cells, multiply by work per cell"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "// Top-down: the recursion you'd write anyway, plus a cache (memoization)\nlong fibMemo(int n, long[] memo) {\n    if (n <= 1) return n;                 // base\n    if (memo[n] != 0) return memo[n];     // seen this state? reuse it\n    return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n}\n\n// Bottom-up: fill the table from the base (tabulation)\nlong fibTab(int n) {\n    long[] dp = new long[n + 1];\n    dp[1] = 1;                            // base; dp[0] stays 0\n    for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];\n    return dp[n];\n}" },
    { type: "steps", title: "Bottom-up: filling the fib table for n = 5", frames: [
      { d: "Bases go in first: dp[0] = 0 and dp[1] = 1 are known without any computation. Four slots remain unknown.", cells: { index: true, cells: [{ v: "0", hl: 1 }, { v: "1", hl: 1 }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }] } },
      { d: "dp[2] = dp[1] + dp[0] = 1. Two reads of finished slots, one write. No recursion, no revisits.", cells: { index: true, cells: [{ v: "0", hl: 2 }, { v: "1", hl: 2 }, { v: "1", hl: 1 }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }] } },
      { d: "dp[3] = dp[2] + dp[1] = 2. The pair of source slots slides right along with us.", cells: { index: true, cells: [{ v: "0" }, { v: "1", hl: 2 }, { v: "1", hl: 2 }, { v: "2", hl: 1 }, { v: "·", dim: true }, { v: "·", dim: true }] } },
      { d: "dp[4] = dp[3] + dp[2] = 3. Notice only the last two slots are ever read — foreshadowing O(1) space.", cells: { index: true, cells: [{ v: "0" }, { v: "1" }, { v: "1", hl: 2 }, { v: "2", hl: 2 }, { v: "3", hl: 1 }, { v: "·", dim: true }] } },
      { d: "dp[5] = dp[4] + dp[3] = 5. Every state computed exactly once, in an order where sources are always ready.", cells: { index: true, cells: [{ v: "0" }, { v: "1" }, { v: "1" }, { v: "2", hl: 2 }, { v: "3", hl: 2 }, { v: "5", hl: 1 }] } },
      { d: "Done: fib(5) = 5 in five O(1) writes. The naive call tree for n = 5 makes 15 calls; by n = 50 the gap is astronomical.", cells: { index: true, cells: [{ v: "0" }, { v: "1" }, { v: "1" }, { v: "2" }, { v: "3" }, { v: "5", hl: 1 }], pointers: [{ i: 5, t: "answer" }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "Code before state", text: "The classic DP failure is writing loops before you can finish the sentence \"<code>dp[i]</code> is the …\". A fuzzy state breeds transitions invented to fit the sample input, which then break on hidden tests. Second killer: fill order — bottom-up must compute sources before their readers, so if <code>dp[i]</code> reads <code>dp[i+1]</code>, the loop has to run backward. Say the state out loud, in one sentence, before touching the keyboard." },
    { type: "callout", variant: "pro", title: "Every DP is a path through a DAG", text: "States are nodes, transitions are edges, and the graph is acyclic because states depend only on \"smaller\" states — so a DP is literally a shortest, longest, or counted path over a <code>DAG</code> (a graph with no cycles). Seeing that unlocks two upgrades. Reconstruction: store which incoming edge won each state, then walk the winners backward from the final state to recover the actual answer, not just its value. And memory: when transitions reach back only k states, keep k rolling variables instead of the whole table — fib drops from O(n) space to O(1) with two." },
    { type: "callout", variant: "rule", title: "Memo or table?", text: "Top-down <strong>memoization</strong> keeps your recursive thinking and computes only the states actually reached — wins when the state space is sparse. Bottom-up <strong>tabulation</strong> pays for every cell but has no recursion overhead, no stack-depth limit, and easy space-rolling. Interview default: derive the recurrence top-down, then ship it bottom-up if depth or constant factors threaten." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"count the ways to …\"</strong> → sum over transitions instead of taking a max",
      "<strong>\"minimum cost / fewest steps to reach …\"</strong> → min over incoming transitions",
      "<strong>\"longest subsequence / longest common …\"</strong> → 1D or 2D table over prefixes",
      "<strong>\"can you make exactly k / partition into …\"</strong> → boolean subset-sum table"
    ] },
    { type: "check", items: [
      { q: "Merge sort splits into subproblems — why isn't it DP?", a: "Its halves never overlap: no subproblem is ever solved twice, so a cache would never get a hit. DP needs overlapping subproblems, not just optimal substructure." },
      { q: "What exactly is a \"state\", and why is designing it the hard part?", a: "One sentence of the form \"dp[…] = the answer to this subproblem.\" Each index dimension is one decision or resource you're tracking; too few dimensions and different situations collide in one cell, too many and the table explodes." },
      { q: "When can an O(n)-space DP shrink to O(1)?", a: "When the transition reads only the last k states — keep k rolling variables and overwrite as you sweep. fib needs two; House Robber needs two." },
      { q: "How do you recover the actual solution, not just its value?", a: "Record which choice won each state — parent pointers on the state DAG — then walk them backward from the final state. The reversed walk is the answer itself." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Refill the table on paper for Climbing Stairs — dp[i] = dp[i−1] + dp[i−2] with different bases. Same recurrence, new story: that transfer is the whole skill." },
      { t: "Drill", d: "The core DP set: 1D tables, House Robber-style rolling state, and the first 2D grids.", href: "#/pattern/dynamic-programming", link: "Dynamic Programming" },
      { t: "Interview-ready", d: "Graduate to multi-dimensional states, knapsacks, and interval DP — where designing the state is the entire problem.", href: "#/pattern/advanced-dp", link: "Advanced DP" },
      { t: "Master", d: "Clear the full DP branch on the Pattern map, and practice saying every state definition out loud in one sentence first.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "greedy",
  order: 13,
  title: "Greedy",
  hue: "purple",
  tagline: "Commit locally, win globally — with proof",
  minutes: 10,
  summary: "Make the best-looking choice now, never revisit it, and — when the proof holds — land on the global optimum in one sorted pass. Also: how to smell the cases where greedy is confidently wrong.",
  blocks: [
    { type: "p", text: "A greedy algorithm makes the best-looking choice right now, commits, and never looks back. No table of subproblems, no branching search — one sorted pass, usually O(n log n), and done. That speed comes with a contract: greedy is only correct when a local choice can never spoil the global outcome, and that has to be argued, not assumed. The skill being interviewed is exactly that judgment — knowing when \"take the best now\" is provably safe and when it's confidently wrong." },
    { type: "callout", variant: "analogy", title: "The freelancer's calendar", text: "Gigs arrive with fixed start and end times and you can work one at a time. Which do you accept to fit the most gigs? Always take the offer that <strong>ends earliest</strong> — finishing sooner leaves the most calendar open for everything that follows. You never reconsider a signed contract, and you still end up with the fullest possible schedule." },
    { type: "cells", title: "Anatomy", cells: [{ v: "1–4" }, { v: "3–5" }, { v: "0–6" }, { v: "5–7" }, { v: "6–8" }], caption: "Five gigs on a timeline, labeled start–end. Which subset can coexist without overlapping? Greedy answers in one pass — no trying of subsets." },
    { type: "h3", text: "One rule, applied n times" },
    { type: "p", text: "Every greedy has the same skeleton: <strong>sort by the one key that matters</strong>, sweep once, keep a scrap of state (here: the time you're next free), and apply a fixed rule at each element. The entire design lives in the sort key. For interval scheduling the key is <strong>finish time</strong> — the gig that ends earliest leaves maximal room, so taking it can never cost you. Earliest start fails (one long early gig can block three others) and shortest duration fails (a short gig straddling two long ones kills both). Choosing the provable key is the design step; the loop afterward is trivia." },
    { type: "bigO", rows: [
      ["Sort by the greedy key", "O(n log n)", "usually the dominant cost"],
      ["The greedy sweep itself", "O(n)", "each element examined once, decided forever"],
      ["Interval scheduling", "O(n log n)", "sort by finish time + one linear sweep"],
      ["Heap-backed greedy (rooms, Huffman)", "O(n log n)", "each pick or merge is a log n heap op"],
      ["Same problem via DP when greedy fails", "O(n × amount)", "the price of having to try every choice"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "// Maximum non-overlapping intervals: sort by finish time, sweep once\nint maxNonOverlap(int[][] iv) {\n    Arrays.sort(iv, (a, b) -> a[1] - b[1]);  // the greedy key: finish time\n    int count = 0, freeAt = Integer.MIN_VALUE;\n    for (int[] in : iv) {\n        if (in[0] >= freeAt) {   // starts once we're free? take it\n            count++;\n            freeAt = in[1];      // frontier: when we're free again\n        }                        // else skip forever — no backtracking\n    }\n    return count;\n}" },
    { type: "steps", title: "Earliest finish wins: scheduling the five gigs", frames: [
      { d: "Sorted by finish time: 1–4, 3–5, 0–6, 5–7, 6–8. Rule: take a gig iff it starts at or after the moment you're free. You start free.", cells: { cells: [{ v: "1–4" }, { v: "3–5" }, { v: "0–6" }, { v: "5–7" }, { v: "6–8" }] } },
      { d: "1–4 starts at 1 and you're free — take it. You're now busy until 4.", cells: { cells: [{ v: "1–4", hl: 1 }, { v: "3–5" }, { v: "0–6" }, { v: "5–7" }, { v: "6–8" }], pointers: [{ i: 0, t: "pick" }] } },
      { d: "3–5 starts at 3, before 4 — it collides with the pick. Skip it forever; greedy never backtracks.", cells: { cells: [{ v: "1–4", hl: 2 }, { v: "3–5", dim: true }, { v: "0–6" }, { v: "5–7" }, { v: "6–8" }], pointers: [{ i: 1, t: "skip" }] } },
      { d: "0–6 starts at 0 &lt; 4 — collides too. Note it alone would have blocked three gigs; earliest-finish never even flirted with it.", cells: { cells: [{ v: "1–4", hl: 2 }, { v: "3–5", dim: true }, { v: "0–6", dim: true }, { v: "5–7" }, { v: "6–8" }], pointers: [{ i: 2, t: "skip" }] } },
      { d: "5–7 starts at 5 ≥ 4 — compatible. Take it; the free-at frontier advances to 7.", cells: { cells: [{ v: "1–4", hl: 2 }, { v: "3–5", dim: true }, { v: "0–6", dim: true }, { v: "5–7", hl: 1 }, { v: "6–8" }], pointers: [{ i: 3, t: "pick" }] } },
      { d: "6–8 starts at 6 &lt; 7 — collides with 5–7. Skip.", cells: { cells: [{ v: "1–4", hl: 2 }, { v: "3–5", dim: true }, { v: "0–6", dim: true }, { v: "5–7", hl: 2 }, { v: "6–8", dim: true }], pointers: [{ i: 4, t: "skip" }] } },
      { d: "Final: {1–4, 5–7} — two gigs, and no subset does better. Five decisions, each O(1), none ever revisited.", cells: { cells: [{ v: "1–4", hl: 1 }, { v: "3–5", dim: true }, { v: "0–6", dim: true }, { v: "5–7", hl: 1 }, { v: "6–8", dim: true }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "Greedy that feels right and isn't", text: "Coins {1, 3, 4}, amount 6. Greedy grabs the biggest coin first: 4 + 1 + 1 — three coins. Optimal is 3 + 3 — two. Taking the 4 poisoned the future in a way no later choice could repair: the <strong>greedy-choice property</strong> failed, and the problem is secretly DP (which tries every first coin). US denominations just happen to be greedy-safe, which is exactly why this trap feels so natural. Always test your rule against a small adversarial case before trusting it." },
    { type: "callout", variant: "pro", title: "The exchange argument, in one paragraph", text: "How seniors prove a greedy: take any optimal solution OPT that disagrees with greedy, find the <strong>first disagreement</strong>, and swap OPT's choice for greedy's. Show the result is still feasible and no worse — for intervals, greedy's pick finishes no later than OPT's, so everything OPT scheduled afterward still fits. Repeat the swap until OPT has been morphed into greedy's answer without ever losing value; therefore greedy ties the optimum. One honest paragraph of this beats \"it seems to work\" in any interview." },
    { type: "callout", variant: "rule", title: "Half of every greedy is the sort", text: "Finish time for intervals. Value-per-weight ratio for fractional knapsack. Deadline for penalty scheduling. Smallest-two-first for Huffman merges. When a greedy idea stalls, the fix is usually not a cleverer rule — it's a different key. Ask: <strong>sorted by what</strong> would the obvious sweep become correct?" },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"maximum number of non-overlapping …\"</strong> → sort by finish time, sweep",
      "<strong>\"minimum rooms / platforms / arrows to cover …\"</strong> → interval sweep or a min-heap of end times",
      "<strong>\"can you jump / reach the end\"</strong> → track the furthest reachable frontier",
      "<strong>\"fewest coins / pieces / operations\"</strong> → careful: verify the greedy-choice property or fall back to DP"
    ] },
    { type: "check", items: [
      { q: "Why sort intervals by finish time rather than by start or by length?", a: "Earliest finish leaves maximal room for the rest, so it can be exchanged into any optimal solution. Earliest start fails (0–6 would be picked first and block everything); shortest fails when a short interval straddles two disjoint long ones." },
      { q: "Coins {1, 3, 4}, amount 6 — what goes wrong for greedy?", a: "Biggest-first gives 4 + 1 + 1 = three coins; optimal is 3 + 3 = two. The first pick leaves a remainder the other coins handle badly — no greedy-choice property, so this is a DP problem." },
      { q: "What is the exchange argument, in one line?", a: "Any optimal solution can be transformed, one harmless swap at a time, into the greedy solution without ever getting worse — therefore greedy ties the optimum." },
      { q: "Where does the O(n log n) in most greedy solutions come from?", a: "The sort by the greedy key. The sweep itself is O(n); if picks need a running best (rooms, Huffman), a heap contributes the log factor instead." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Replay the walkthrough using the rule \"earliest start\" and watch 0–6 wreck the schedule — feeling a wrong key fail is the fastest way to respect the right one." },
      { t: "Drill", d: "The core greedy set: frontier-tracking jumps, sorted sweeps, and picking the provable key.", href: "#/pattern/greedy", link: "Greedy" },
      { t: "Interview-ready", d: "Intervals are greedy's home turf: merge, schedule, and count rooms until sort-by-finish is reflex.", href: "#/pattern/intervals", link: "Intervals" },
      { t: "Master", d: "Clear the greedy and interval branches on the Pattern map, sketching a one-line exchange argument for each solution you accept.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "bit-manipulation",
  order: 14,
  title: "Bit Manipulation",
  hue: "blue",
  tagline: "Thirty-two switches in every int",
  minutes: 11,
  summary: "A Java <code>int</code> is 32 independent switches, and three masks — check, set, clear — control them in one CPU instruction each. Plus the two identities interviewers love: <code>n &amp; -n</code> and <code>n &amp; (n−1)</code>.",
  blocks: [
    { type: "p", text: "Every <code>int</code> in Java is 32 tiny switches, and the bitwise operators read, flip, and combine them in a single CPU instruction. That buys two things interviewers care about: raw speed, and the ability to encode an entire set — \"which of these 20 items did I take?\" — inside one number. Three mask moves (check, set, clear) plus two classic identities cover almost every bit problem in the bank, so this technique is small enough to master completely." },
    { type: "callout", variant: "analogy", title: "A panel of eight switches", text: "An 8-bit number is a row of eight light switches. A <strong>mask</strong> is a cardboard stencil laid over the panel: holes where you want to act, solid card everywhere else. OR through the stencil turns switches on, AND with the stencil flipped inside-out turns them off, XOR toggles — each in one motion, never disturbing the covered switches." },
    { type: "cells", title: "Anatomy", index: true, cells: [{ v: "0" }, { v: "0" }, { v: "0" }, { v: "1", hl: 2 }, { v: "0" }, { v: "1", hl: 2 }, { v: "1", hl: 2 }, { v: "0" }], pointers: [{ i: 3, t: "16" }, { i: 5, t: "4" }, { i: 6, t: "2" }], caption: "22 in binary, shown most-significant-first: the cell at index i holds bit 7−i, and bit k is worth 2ᵏ. The set bits sit at place values 16, 4, and 2 — and 16 + 4 + 2 = 22." },
    { type: "h3", text: "Masks: pointing at bits with arithmetic" },
    { type: "p", text: "<code>1 &lt;&lt; k</code> — the number one, shifted left k places — is a mask: a number whose only set bit is at position k. Every core move is that mask plus one operator: <code>n &amp; mask</code> asks (nonzero means the bit is on), <code>n | mask</code> sets it, <code>n &amp; ~mask</code> clears it (<code>~</code> flips every bit — the stencil turned inside-out), and <code>n ^ mask</code> toggles it. Bits are numbered from 0 at the right, and bit k is worth 2ᵏ — which is why shifting left multiplies by two and shifting right divides." },
    { type: "bigO", rows: [
      ["Check / set / clear / toggle a bit", "O(1)", "one mask, one instruction"],
      ["Count set bits (Kernighan)", "O(k)", "k = number of 1s; each loop strips one"],
      ["Bitmask set: add / remove / contains", "O(1)", "an int is 32 membership flags"],
      ["Enumerate all subsets of n items", "O(2ⁿ)", "one mask per subset, 0 … 2ⁿ−1"],
      ["XOR-fold an array", "O(n)", "pairs cancel to 0; the lone element survives"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "int n = 0b01011;                 // decimal 11\nint bit2 = (n >> 2) & 1;         // check bit 2      -> 0\nn |= 1 << 4;                     // set bit 4        -> 0b11011 = 27\nn &= ~(1 << 1);                  // clear bit 1      -> 0b11001 = 25\nn ^= 1;                          // toggle bit 0     -> 0b11000 = 24\nint lowest = n & -n;             // lowest set bit   -> 0b01000 = 8\n\nint count = 0;                   // Kernighan popcount: one loop per 1-bit\nfor (int x = n; x != 0; x &= x - 1) count++;   // count == 2" },
    { type: "steps", title: "Three masks on n = 01011 (decimal 11)", frames: [
      { d: "n = 01011 = 11. Bits number right to left starting at 0, so the rightmost cell is bit 0 — the 1s place.", cells: { cells: [{ v: "0" }, { v: "1" }, { v: "0" }, { v: "1" }, { v: "1" }], pointers: [{ i: 0, t: "bit 4" }, { i: 4, t: "bit 0" }] } },
      { d: "Check bit 2: <code>(n &gt;&gt; 2) &amp; 1</code>. The shift slides bit 2 down to position 0; the &amp; 1 erases everything else. It reads 0 — the bit is off.", cells: { cells: [{ v: "0" }, { v: "1" }, { v: "0", hl: 1 }, { v: "1" }, { v: "1" }], pointers: [{ i: 2, t: "reads 0" }] } },
      { d: "Set bit 4: build the mask <code>1 &lt;&lt; 4</code> = 10000. One hole in the stencil, aimed at one switch.", cells: { cells: [{ v: "0", hl: 1 }, { v: "1" }, { v: "0" }, { v: "1" }, { v: "1" }], pointers: [{ i: 0, t: "mask 1" }] } },
      { d: "n | 10000 = 11011 = 27. OR can only turn bits on, so bit 4 flips to 1 and the other four bits pass through untouched.", cells: { cells: [{ v: "1", hl: 1 }, { v: "1" }, { v: "0" }, { v: "1" }, { v: "1" }], pointers: [{ i: 0, t: "set" }] } },
      { d: "Clear bit 1: mask <code>~(1 &lt;&lt; 1)</code> = 11101 — the stencil inverted, a zero only at the target. AND forces that bit to 0.", cells: { cells: [{ v: "1" }, { v: "1" }, { v: "0" }, { v: "1", hl: 1 }, { v: "1" }], pointers: [{ i: 3, t: "mask 0" }] } },
      { d: "n &amp; 11101 = 11001 = 25. Bit 1 is off; every other bit survived the AND. Check, set, clear — one mask and one operator each.", cells: { cells: [{ v: "1" }, { v: "1" }, { v: "0" }, { v: "0", hl: 1 }, { v: "1" }], pointers: [{ i: 3, t: "cleared" }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "The shift that drags the sign", text: "Java has two right shifts: <code>&gt;&gt;</code> copies the sign bit in from the left (so <code>-8 &gt;&gt; 1</code> is <code>-4</code>), while <code>&gt;&gt;&gt;</code> shoves in zeros (<code>-8 &gt;&gt;&gt; 1</code> is a huge positive number). Loop over the bits of a possibly-negative int with <code>&gt;&gt;</code> and the sign bit refills forever — an infinite loop. Two more stingers: shift counts wrap mod 32, so <code>1 &lt;&lt; 32 == 1</code>; and <code>&amp;</code> binds looser than <code>==</code>, so always parenthesize: <code>(n &amp; mask) == 0</code>." },
    { type: "callout", variant: "pro", title: "Two's complement is a trick generator", text: "Negation is flip-every-bit-then-add-1. That +1 ripples through the trailing 1s of <code>~n</code> and stops exactly at n's lowest set bit — so <code>n</code> and <code>-n</code> agree on that bit alone, and <code>n &amp; -n</code> isolates it in three instructions. Its sibling <code>n &amp; (n − 1)</code> clears the lowest set bit, because subtracting 1 rewrites everything up to and including it. Loop that until zero and you've counted the 1s in O(set bits) — Brian Kernighan's popcount, and the heartbeat of Fenwick trees." },
    { type: "callout", variant: "rule", title: "An int is a set of 32 elements", text: "When n ≤ 20, a bitmask beats a HashSet: contains is <code>(mask &gt;&gt; i) &amp; 1</code>, add is <code>|</code>, remove is <code>&amp; ~</code>, and all 2ⁿ subsets enumerate with <code>for (int mask = 0; mask &lt; (1 &lt;&lt; n); mask++)</code>. That loop is the engine behind bitmask DP — travelling salesman on 16 cities fits in an int." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"every element appears twice except one\"</strong> → XOR everything; pairs cancel to 0",
      "<strong>\"count the 1 bits / Hamming weight\"</strong> → <code>n &amp; (n−1)</code> in a loop",
      "<strong>\"all subsets, n ≤ 20\"</strong> → enumerate masks 0 … 2ⁿ−1",
      "<strong>\"multiply / divide by a power of two\"</strong> → shift left / right",
      "<strong>\"O(1)-space set of small integers\"</strong> → one int as a bitmask"
    ] },
    { type: "check", items: [
      { q: "Why does <code>n &amp; (n − 1)</code> clear the lowest set bit?", a: "Subtracting 1 turns the lowest 1 into 0 and every bit below it into 1s; AND-ing with the original zeroes all of those and preserves everything above. One set bit disappears per application." },
      { q: "What is <code>-n</code> in two's complement, and what does <code>n &amp; -n</code> give?", a: "-n = ~n + 1. The +1 carries through the flipped low zeros and stops at n's lowest set bit, so the two numbers agree only there — the AND yields exactly that single bit." },
      { q: "<code>-1 &gt;&gt; 1</code> versus <code>-1 &gt;&gt;&gt; 1</code> in Java?", a: "-1 is thirty-two 1s. <code>&gt;&gt;</code> sign-extends, so it stays -1 forever; <code>&gt;&gt;&gt;</code> injects a zero, giving 2³¹ − 1 — Integer.MAX_VALUE." },
      { q: "You must try every subset of 18 items — what's the structure?", a: "<code>for (int mask = 0; mask &lt; (1 &lt;&lt; 18); mask++)</code>: each mask is one subset, bit i saying whether item i is in. That's 262,144 iterations with O(1) membership tests — trivial." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Write 13, 22, and 37 in binary by hand, then run check, set, and clear on each until the three masks stop needing thought." },
      { t: "Drill", d: "Single-bit ops, popcount, and power-of-two checks — the mechanical layer, until masks are muscle memory.", href: "#/pattern/bit-manipulation", link: "Bit Manipulation" },
      { t: "Interview-ready", d: "The XOR family: single number, missing number, and swaps without a temp — where cancellation does the thinking.", href: "#/pattern/bit-manipulation", link: "XOR family" },
      { t: "Master", d: "Finish the bit branch on the Pattern map, then use masks as O(1) sets inside a backtracking or DP solution.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});
