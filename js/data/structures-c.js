/* Data Structures guides — part C: Stack, Queue/Deque, Heap, Sorting Algorithms. */
window.STRUCTURE_TOPICS = window.STRUCTURE_TOPICS || [];

window.STRUCTURE_TOPICS.push({
  id: "stack",
  order: 4,
  title: "Stack",
  hue: "green",
  tagline: "Last in, first out — nesting made mechanical",
  minutes: 10,
  summary: "Push on the top, pop from the top, never touch the middle. Why every nesting problem collapses into a stack, and why the call stack under your recursion is the very same machine.",
  blocks: [
    { type: "p", text: "A stack is a pile you may only touch from the top: <code>push</code> adds there, <code>pop</code> removes there, and everything underneath waits its turn. That single restriction — last in, first out — is exactly the shape of nested things: brackets inside brackets, function calls inside function calls, undo histories. Interviews love stacks because the structure is never the hard part; the hard part is noticing that a problem about “the most recent unfinished thing” is a stack problem in disguise." },
    { type: "callout", variant: "analogy", title: "A spring-loaded plate dispenser", text: "In a cafeteria you take the top plate — which is the last plate the staff loaded. Want a plate from the middle? You must lift off every plate above it first. That is the whole API: add on top, take from the top, no exceptions." },
    { type: "cells", title: "Anatomy", dir: "v", cells: [{ v: "3" }, { v: "8" }, { v: "5", hl: 1 }], pointers: [{ i: 2, t: "top" }], caption: "Push and pop both happen at the top — O(1), nothing shifts. Reaching 3 means popping 5 and 8 first; the middle is deliberately out of bounds." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "A stack is just an array plus one integer: push writes at the top index and bumps it, pop reads and drops it. No holes, no shifting, no searching — which is why Java's <code>ArrayDeque</code>, a resizable array, is the standard implementation. The JVM runs your program on one too: every method call pushes a <code>frame</code> (the call's local variables plus a return address) onto the call stack, and every return pops it. Recursion depth is literally stack depth — a fact that pays off below." },
    { type: "bigO", rows: [
      ["Push", "O(1)", "write at the top index, bump it"],
      ["Pop", "O(1)", "read the top index, drop it"],
      ["Peek (look, don't remove)", "O(1)", "the top index is always in hand"],
      ["Read / search below the top", "O(n)", "no index math — you'd pop your way down"],
      ["Monotonic pass over n items", "O(n) amortized", "each element pushed once, popped at most once"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "Deque<Character> st = new ArrayDeque<>(); // the modern stack in Java\nst.push('(');                    // O(1) — lands on top\nst.push('[');\nchar top = st.peek();            // '[' — look without removing\nchar out = st.pop();             // '[' — last in, first out\nboolean empty = st.isEmpty();    // always check before pop\n\n// bracket-matching skeleton: openers push, closers must answer the top\n// if (c == '(') st.push(c);\n// else if (st.isEmpty() || st.pop() != '(') return false;\n// ...valid at the end only if st.isEmpty()" },
    { type: "steps", title: "Watch it nest: validate \"{[]}\"", frames: [
      { d: "Scan left to right. Openers get pushed; every closer must match whatever is on top at that moment. The stack starts empty.", cells: { dir: "v", cells: [{ v: "·", dim: true }, { v: "·", dim: true }] } },
      { d: "Read '{' — an opener. Push it. It is now the unfinished business the next closer will answer to.", cells: { dir: "v", cells: [{ v: "{", hl: 1 }, { v: "·", dim: true }], pointers: [{ i: 0, t: "top" }] } },
      { d: "Read '[' — another opener. Push. Note the order: '[' must close before '{' can. That is nesting, encoded as last-in-first-out.", cells: { dir: "v", cells: [{ v: "{", hl: 2 }, { v: "[", hl: 1 }], pointers: [{ i: 1, t: "top" }] } },
      { d: "Read ']' — a closer. Pop the top: '[' pairs with ']'. Match — the innermost open bracket closed first, exactly as nesting demands.", cells: { dir: "v", cells: [{ v: "{", hl: 2 }, { v: "[", hl: 1 }], pointers: [{ i: 1, t: "pop" }] } },
      { d: "'[' is gone; '{' is exposed again, still waiting for its own closer.", cells: { dir: "v", cells: [{ v: "{", hl: 1 }, { v: "·", dim: true }], pointers: [{ i: 0, t: "top" }] } },
      { d: "Read '}' — pop the top: '{' pairs with '}'. Match again.", cells: { dir: "v", cells: [{ v: "{", hl: 1 }, { v: "·", dim: true }], pointers: [{ i: 0, t: "pop" }] } },
      { d: "Input consumed and the stack is empty — valid. The two failure modes: a closer meets a wrong or empty top, or openers are left over at the end.", cells: { dir: "v", cells: [{ v: "·", dim: true }, { v: "·", dim: true }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "Empty pops and leftover openers", text: "The two classic Valid Parentheses bugs: calling <code>pop()</code> when a closer arrives and the stack is already empty — in Java that throws <code>NoSuchElementException</code>, so check <code>isEmpty()</code> first — and forgetting that surviving the scan is not enough. <code>\"((\"</code> never hits a mismatch, but its leftover openers make it invalid. The final is-the-stack-empty check is half the algorithm." },
    { type: "callout", variant: "pro", title: "The call stack is a stack — exploit that", text: "Any recursive algorithm is a loop plus an explicit <code>Deque</code> of frames: push what you would have passed as arguments, loop while non-empty. That rewrite is how you dodge <code>StackOverflowError</code> on deep inputs — the JVM call stack dies around ten thousand frames, while a heap-allocated deque takes millions. Second: a monotonic stack pass looks O(n²) because of its inner while-loop, but each element is pushed once and popped at most once — at most 2n operations, amortized O(n). Third: in Java use <code>ArrayDeque</code>, never <code>java.util.Stack</code> — the latter extends 1995-era <code>Vector</code> and pays a synchronization toll on every single call." },
    { type: "callout", variant: "rule", title: "Most recent, unfinished, nested → stack", text: "When a problem talks about the most recent thing not yet resolved — the innermost open bracket, the previous smaller price, the enclosing directory — the stack top is that thing by construction. Push what is pending; pop the moment it resolves." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"valid / balanced parentheses, matched tags\"</strong> → push openers, pop on closers",
      "<strong>\"next greater / previous smaller element\"</strong> → Monotonic Stack",
      "<strong>\"evaluate expression, decode nested string\"</strong> → a stack per kind of pending state",
      "<strong>\"undo, back button, most recent first\"</strong> → stack of states",
      "<strong>\"iterative DFS / avoid recursion\"</strong> → explicit stack replacing the call stack"
    ] },
    { type: "check", items: [
      { q: "A monotonic stack has a while-loop inside a for-loop. Why is the pass O(n), not O(n²)?", a: "Count work per element, not per iteration: each element is pushed exactly once and popped at most once, so all inner-loop pops across the whole run total at most n. That's amortized analysis — about 2n operations for n elements." },
      { q: "Why <code>ArrayDeque</code> instead of <code>java.util.Stack</code>?", a: "<code>Stack</code> extends <code>Vector</code>, which synchronizes every method — pure overhead in single-threaded code — and, being a <code>List</code>, lets callers illegally poke the middle. <code>ArrayDeque</code> is the modern array-backed replacement and is faster at both stack and queue work." },
      { q: "Your recursive solution throws <code>StackOverflowError</code> on deep input. What's the mechanical fix?", a: "Recursion depth is call-stack depth. Convert to a loop with an explicit stack: push what you would have passed as arguments, loop while the stack is non-empty. Same work, same order — but the stack now lives on the heap, where it can grow." },
      { q: "When exactly is a bracket string valid?", a: "Two conditions, both required: every closer matches the top opener at the moment it arrives, and the stack is empty when the input ends. Fail either and the string is invalid." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Re-read the anatomy, then replay the bracket walkthrough saying “push” or “pop” out loud before each frame reveals it." },
      { t: "Drill", d: "Start with pure push/pop mechanics — Valid Parentheses and Min Stack — until the LIFO reflex is automatic.", href: "#/pattern/stacks-monotonic", link: "Stacks" },
      { t: "Interview-ready", d: "Graduate to monotonic stacks: Daily Temperatures, Next Greater Element, then Largest Rectangle in Histogram — the pattern behind most Hard stack problems.", href: "#/pattern/stacks-monotonic", link: "Monotonic Stack" },
      { t: "Master", d: "Clear the whole Stacks branch on the Pattern map, then revisit any recursive DFS you know and rewrite it iteratively from memory.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "queue-deque",
  order: 5,
  title: "Queue / Deque",
  hue: "orange",
  tagline: "First in, first out — and the ring that makes it free",
  minutes: 11,
  summary: "The fair line: join at the rear, leave from the front. How a circular buffer makes both ends O(1) without ever shifting an element, and why one <code>ArrayDeque</code> plays stack, queue, and deque.",
  blocks: [
    { type: "p", text: "A queue is a line: elements leave in exactly the order they arrived — first in, first out. A <code>deque</code> (double-ended queue, pronounced “deck”) opens both ends, so it can impersonate a stack, a queue, or both at once. Interviews care for two reasons: the queue is the engine of breadth-first search — process things in the order you discovered them — and the deque powers one famous O(n) trick, the sliding-window maximum." },
    { type: "callout", variant: "analogy", title: "A coffee-shop line, not a coffee-shop scrum", text: "Whoever has waited longest is served next. And watch what happens when the first person leaves: nobody physically shuffles forward one floor tile — the “front of the line” simply becomes the next person. Queues in memory pull the same trick: the elements stand still and the labels move." },
    { type: "cells", title: "Anatomy", index: true, cells: [{ v: "A" }, { v: "B" }, { v: "C" }, { v: "·", dim: true }, { v: "·", dim: true }], pointers: [{ i: 0, t: "front" }, { i: 3, t: "rear", pos: "top" }], caption: "dequeue reads where front points; enqueue writes where rear points. Both are pointer bumps — no element ever shifts." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "Put a queue in a plain array and trouble starts: removing index 0 and shifting everything left makes dequeue O(n), while just advancing a <code>front</code> pointer strands dead slots on the left until the array “runs out” with room to spare. The fix is the <code>ring buffer</code> (circular buffer): let the indices wrap around to 0 when they fall off the end, so the array behaves like a circle and vacated slots get reused. Java's <code>ArrayDeque</code> is exactly this — a ring that doubles its array when full. <code>LinkedList</code> also implements <code>Deque</code>, but it allocates a node per element and scatters them across memory; the ring wins on every count that matters." },
    { type: "bigO", rows: [
      ["Enqueue at rear (offer)", "O(1)", "write at rear, advance it"],
      ["Dequeue from front (poll)", "O(1)", "read at front, advance it — no shifting"],
      ["Peek either end", "O(1)", "both pointers are always in hand"],
      ["Push / pop one end (deque as stack)", "O(1)", "same trick, same end"],
      ["Search / access the middle", "O(n)", "the ends are privileged; the middle is not"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "Deque<Integer> dq = new ArrayDeque<>();  // one class, three roles\ndq.offerLast(1);                         // queue: enqueue at the rear\ndq.offerLast(2);\nint first = dq.pollFirst();              // 1 — FIFO, out from the front\n\ndq.offerFirst(9);                        // deque: both ends open\nint last = dq.pollLast();\n\ndq.push(7);                              // stack mode: push/pop = one end\ndq.pop();\n// offer/poll/peek return false or null on failure; add/remove/element throw" },
    { type: "steps", title: "The ring buffer: capacity 5, nothing ever moves", frames: [
      { d: "enqueue(A): write at rear (slot 0), then advance rear to (0 + 1) % 5 = 1. front points at A — the next to leave.", cells: { index: true, cells: [{ v: "A", hl: 1 }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }], pointers: [{ i: 0, t: "front" }, { i: 1, t: "rear", pos: "top" }] } },
      { d: "enqueue(B): same move. front hasn't budged — A is still first in line.", cells: { index: true, cells: [{ v: "A" }, { v: "B", hl: 1 }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }], pointers: [{ i: 0, t: "front" }, { i: 2, t: "rear", pos: "top" }] } },
      { d: "enqueue(C): three in line, order A → B → C. rear = 3.", cells: { index: true, cells: [{ v: "A" }, { v: "B" }, { v: "C", hl: 1 }, { v: "·", dim: true }, { v: "·", dim: true }], pointers: [{ i: 0, t: "front" }, { i: 3, t: "rear", pos: "top" }] } },
      { d: "dequeue() → A: read where front points, advance front to 1. Slot 0 just goes stale — nothing shifts; B simply becomes the front.", cells: { index: true, cells: [{ v: "·", dim: true }, { v: "B", hl: 1 }, { v: "C" }, { v: "·", dim: true }, { v: "·", dim: true }], pointers: [{ i: 1, t: "front" }, { i: 3, t: "rear", pos: "top" }] } },
      { d: "enqueue(D): rear keeps marching right while slot 0 sits idle.", cells: { index: true, cells: [{ v: "·", dim: true }, { v: "B" }, { v: "C" }, { v: "D", hl: 1 }, { v: "·", dim: true }], pointers: [{ i: 1, t: "front" }, { i: 4, t: "rear", pos: "top" }] } },
      { d: "enqueue(E) fills slot 4 — the array's last. rear advances to (4 + 1) % 5 = 0: the line has wrapped around.", cells: { index: true, cells: [{ v: "·", dim: true }, { v: "B" }, { v: "C" }, { v: "D" }, { v: "E", hl: 1 }], pointers: [{ i: 1, t: "front" }, { i: 0, t: "rear", pos: "top" }] } },
      { d: "enqueue(F) reuses slot 0 — where A once sat. Five elements, zero copies. front == rear now, so real rings track a count to tell full from empty.", cells: { index: true, cells: [{ v: "F", hl: 1 }, { v: "B" }, { v: "C" }, { v: "D" }, { v: "E" }], pointers: [{ i: 1, t: "front" }, { i: 1, t: "rear", pos: "top" }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "Dequeuing by shifting", text: "The instinct “remove index 0, shift everything left” quietly makes each dequeue O(n) — n dequeues become O(n²). The same trap wears a disguise: using <code>ArrayList.remove(0)</code> as a queue. The whole point of front/rear pointers is that departure is a pointer bump. One more Java snag: <code>ArrayDeque</code> bans <code>null</code> elements precisely so that a <code>null</code> from <code>poll()</code> reliably means “empty” — if you need failure to be loud, use <code>remove()</code>, which throws." },
    { type: "callout", variant: "pro", title: "Bitmask wraparound and the monotonic deque", text: "Wrapping with <code>%</code> costs a division, so <code>ArrayDeque</code> keeps its capacity a power of two and wraps with <code>(i + 1) &amp; (cap − 1)</code> — a one-cycle bitmask that equals the modulo exactly when cap is 2^k. And the deque's marquee trick: sliding-window maximum in O(n). Keep indices in the deque with their values decreasing front to back; pop smaller values off the rear as each new element arrives, expire out-of-window indices off the front. The front is always the current window's max, and every index enters and leaves the deque exactly once." },
    { type: "callout", variant: "rule", title: "Arrival order matters → queue", text: "Process-in-discovery-order is BFS with a queue, and in an unweighted graph it guarantees fewest-edges paths. Need to add or drop at both ends — window fronts expiring, window rears pruning — that's a deque. Wanting both ends and the middle means you want a different structure entirely." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"level by level / level-order traversal\"</strong> → BFS with a queue",
      "<strong>\"shortest path, unweighted / fewest moves\"</strong> → BFS — first arrival is shortest",
      "<strong>\"sliding window maximum / minimum\"</strong> → monotonic deque",
      "<strong>\"recent calls / events in the last k seconds\"</strong> → queue evicting from the front",
      "<strong>\"spreads outward each minute (rotting oranges)\"</strong> → multi-source BFS queue"
    ] },
    { type: "check", items: [
      { q: "Why does BFS's plain queue guarantee shortest paths in an unweighted graph?", a: "FIFO order processes every node at distance d before any node at distance d + 1, so the first time you reach a node, you reached it by a fewest-edges route. Swap the queue for a stack and you get DFS — which promises nothing about path length." },
      { q: "In the ring buffer, what happens to a slot when its element is dequeued?", a: "Nothing. front advances past it; the stale value just sits there until rear wraps around and overwrites it. Departure is a pointer move — which is exactly why both ends stay O(1)." },
      { q: "Why does <code>ArrayDeque</code> keep its capacity a power of two?", a: "So wraparound can be <code>(i + 1) &amp; (cap − 1)</code> instead of <code>% cap</code> — a bitmask instead of a division. The identity only holds when the capacity is a power of two, so the class enforces that invariant on every resize." },
      { q: "How does the monotonic deque deliver every window's max in O(n) total?", a: "Each index is pushed at the rear once and removed at most once — popped from the rear as too small, or expired from the front as out of window. That's at most 2n deque operations across all n windows, and the front always holds the answer." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Replay the ring-buffer walkthrough predicting each pointer move before the frame shows it, then explain aloud why dequeue never shifts an element." },
      { t: "Drill", d: "BFS is a queue wearing a tree costume — run level-order traversals until enqueue-the-children, poll-the-parent feels mechanical.", href: "#/pattern/trees-bfs-dfs", link: "BFS & DFS" },
      { t: "Interview-ready", d: "Bring the monotonic deque to Sliding Window Maximum and its cousins — the deque's hardest and highest-paying trick.", href: "#/pattern/sliding-window", link: "Sliding Window" },
      { t: "Master", d: "Clear the BFS and window branches on the Pattern map, then design a queue from two stacks and a stack from two queues, from memory.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "heap",
  order: 9,
  title: "Heap",
  hue: "teal",
  tagline: "A tree flattened into an array that always knows its minimum",
  minutes: 12,
  summary: "A complete binary tree stored in a plain array whose root is always the smallest (or largest) element. The machine behind every “top k”, “k-way merge”, and “median of a stream”.",
  blocks: [
    { type: "p", text: "A heap answers one question instantly — what is the smallest thing right now? — while charging only O(log n) to add or remove. It keeps a deliberately lazy promise: every parent ≤ its children (a <code>min-heap</code>; flip the sign for a max-heap). No left-versus-right order, siblings unranked — just that vertical guarantee. Weaker than sorted, far cheaper to maintain, and exactly enough for schedulers, Dijkstra, and the whole “top k” family. In Java it goes by <code>PriorityQueue</code>." },
    { type: "callout", variant: "analogy", title: "An emergency room, not a checkout line", text: "Triage doesn't serve whoever arrived first — it serves whoever is most urgent right now. And the staff never maintains a full ranking of the waiting room; they only ever need to know who's next. That partial, just-enough ordering is precisely what a heap maintains." },
    { type: "tree", root: { v: "5", hl: 1, kids: [{ v: "8", kids: [{ v: "9" }, { v: "10" }] }, { v: "12" }] }, caption: "A min-heap: each parent ≤ its children. 5 earns the root; whether 9 outranks 12 is nobody's business. The promise is strictly vertical." },
    { type: "cells", title: "The same heap, as the array it really is", index: true, cells: [{ v: "5", hl: 1 }, { v: "8" }, { v: "12" }, { v: "9" }, { v: "10" }], caption: "No pointers anywhere: node i's children live at 2i+1 and 2i+2, its parent at (i−1)/2. The tree is the mental picture; the array is the storage." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "The trick is that a heap is a <code>complete</code> tree — every level full except possibly the last, which fills left to right. Complete trees pack into an array with zero gaps, so child and parent are found by arithmetic instead of pointers, and the “last leaf” is simply the last array slot. Insert appends there and <code>sifts up</code> (swap with the parent while smaller); extract-min hands out the root, moves the last leaf into its place, and <code>sifts down</code>. Every repair walks one root-to-leaf path, and a complete tree's height is log n — that is the whole fee schedule." },
    { type: "bigO", rows: [
      ["Peek min (or max)", "O(1)", "it is always the root, index 0"],
      ["Insert (sift up)", "O(log n)", "bubbles along one root-ward path"],
      ["Extract root (sift down)", "O(log n)", "last leaf replaces root, then sinks one path"],
      ["Build a heap from n items", "O(n)", "bottom-up heapify — most nodes barely move"],
      ["Find an arbitrary element", "O(n)", "heap order says nothing about siblings"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "PriorityQueue<Integer> min = new PriorityQueue<>(); // min-heap by default\nmin.offer(5); min.offer(12); min.offer(8);          // O(log n) each\nint smallest = min.peek();                          // 5 — O(1), non-destructive\nmin.poll();                                         // removes 5 — O(log n)\n\nPriorityQueue<Integer> max =                        // flip for a max-heap\n    new PriorityQueue<>(Comparator.reverseOrder());\n\n// the top-k idiom: never let the heap outgrow k\nmin.offer(x);\nif (min.size() > k) min.poll();                     // O(n log k) over the stream" },
    { type: "steps", title: "Insert 3 into [5, 8, 12, 9, 10]: watch the sift-up", frames: [
      { d: "The heap before, drawn as its tree. Root 5 is the minimum — the only element whose rank the heap actually promises.", tree: { root: { v: "5", kids: [{ v: "8", kids: [{ v: "9" }, { v: "10" }] }, { v: "12" }] } } },
      { d: "insert(3): append as the last leaf — array slot 5, child of 12. Completeness is preserved, but 3 under 12 breaks the parent-≤-child promise.", tree: { root: { v: "5", kids: [{ v: "8", kids: [{ v: "9" }, { v: "10" }] }, { v: "12", hl: 2, kids: [{ v: "3", hl: 1 }] }] } } },
      { d: "Sift up, round 1: compare 3 with its parent 12. Smaller — swap them. The violation moves one level up.", tree: { root: { v: "5", kids: [{ v: "8", kids: [{ v: "9" }, { v: "10" }] }, { v: "3", hl: 1, kids: [{ v: "12", hl: 1 }] }] } } },
      { d: "Sift up, round 2: compare 3 with its new parent, 5. Still smaller — swap again.", tree: { root: { v: "3", hl: 1, kids: [{ v: "8", kids: [{ v: "9" }, { v: "10" }] }, { v: "5", hl: 1, kids: [{ v: "12" }] }] } } },
      { d: "3 has no parent — done. Two compares repaired the whole heap, because a complete tree of six nodes is only three levels tall: that path is the log n.", tree: { root: { v: "3", hl: 1, kids: [{ v: "8", kids: [{ v: "9" }, { v: "10" }] }, { v: "5", kids: [{ v: "12" }] }] } } },
      { d: "8, 9, 10 never entered the story — sift-up walks one path, not the tree. The array now reads [3, 8, 5, 9, 10, 12]: not sorted, heap-ordered.", tree: { root: { v: "3", hl: 2, kids: [{ v: "8", kids: [{ v: "9" }, { v: "10" }] }, { v: "5", hl: 2, kids: [{ v: "12", hl: 2 }] }] } } }
    ] },
    { type: "callout", variant: "pitfall", title: "A heap is not sorted", text: "Iterating a <code>PriorityQueue</code> — its iterator, a stream, or <code>toString()</code> — yields the backing array's order, not sorted order. Only repeated <code>poll()</code> drains smallest-first. Corollaries: the k-th smallest is not at index k − 1, and siblings obey no order at all. If you catch yourself wanting to read anything but the root, you actually wanted a <code>TreeMap</code> or a full sort." },
    { type: "callout", variant: "pro", title: "Heapify is O(n), and decrease-key doesn't exist", text: "Building a heap by n inserts costs O(n log n), but bottom-up <code>heapify</code> — sift down each node from the last parent back to the root — is O(n): half the nodes are leaves and sink zero levels, a quarter sink at most one, and n/2·0 + n/4·1 + n/8·2 + … converges to about 2n. Separately, Java's <code>PriorityQueue</code> lacks decrease-key (the operation textbook Dijkstra wants), so pros use lazy deletion: offer the improved entry as a duplicate and, when polling, discard anything staler than your current-best map. And when inserts vastly outnumber extracts, d-ary heaps (say, four children per node) flatten the tree — cheaper sift-ups for pricier sift-downs." },
    { type: "callout", variant: "rule", title: "“k of n” means a heap of size k", text: "Top k largest → a min-heap capped at k (each arrival evicts the smallest survivor). k smallest → a max-heap capped at k. O(n log k) beats O(n log n) because the heap never grows past k. If k = 1 you just need a running max; if k = n you wanted a sort." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"k largest / k closest / top k frequent\"</strong> → heap of size k",
      "<strong>\"median of a data stream\"</strong> → two heaps: max-heap low half, min-heap high half",
      "<strong>\"merge k sorted lists / arrays\"</strong> → min-heap of the k current heads",
      "<strong>\"always take the cheapest next: ropes, meetings, Dijkstra\"</strong> → priority queue as scheduler"
    ] },
    { type: "check", items: [
      { q: "Where do node i's children and parent live in the array?", a: "Children at 2i + 1 and 2i + 2, parent at (i − 1) / 2 with integer division. It works only because the tree is complete — no gaps means the arithmetic never points at a hole." },
      { q: "Why is bottom-up heapify O(n) when one sift-down costs O(log n)?", a: "Cost tracks how far a node can sink, and almost everything starts near the bottom: n/2 leaves sink zero levels, n/4 nodes at most one, n/8 at most two. The weighted sum converges to about 2n — the expensive root-length sinks are exponentially rare." },
      { q: "Java's <code>PriorityQueue</code> has no decrease-key. How do you run Dijkstra anyway?", a: "Lazy deletion: when a node's distance improves, offer a fresh (distance, node) entry without removing the old one. On poll, skip any entry worse than the recorded best. Stale entries cost heap space, never correctness." },
      { q: "Is [3, 8, 5, 9, 10, 12] sorted? Is it a valid min-heap?", a: "Not sorted — 8 sits before 5. But it is a valid heap: 3 ≤ 8 and 5; 8 ≤ 9 and 10; 5 ≤ 12. The promise is parent-to-child only: exactly weak enough to maintain in O(log n), exactly strong enough to keep the minimum on top." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Draw [5, 8, 12, 9, 10] as tree and array from memory, then replay the sift-up predicting each swap before the frame shows it." },
      { t: "Drill", d: "Kth Largest Element and Top K Frequent — drill the size-k heap idiom until offer-then-shrink is a reflex.", href: "#/pattern/heaps-top-k", link: "Heaps / Top-K" },
      { t: "Interview-ready", d: "The senior set: two-heap Find Median from Data Stream and k-way Merge k Sorted Lists — the two shapes every hard heap question reduces to.", href: "#/pattern/heaps-top-k", link: "Heaps / Top-K" },
      { t: "Master", d: "Clear the heap branch on the Pattern map, then hand-roll siftUp and siftDown over a raw int[] once — after that, PriorityQueue holds no mysteries.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "sorting",
  order: 15,
  title: "Sorting Algorithms",
  hue: "graphite",
  tagline: "n log n: the wall, and the ways around it",
  minutes: 13,
  summary: "Merge, quick, heap, counting — one map of who is fast, who is stable, and who cheats the comparison bound. Plus why “sort it first” is the most valuable setup move in interviews.",
  blocks: [
    { type: "p", text: "You will almost never implement a sort in an interview — but you will constantly decide whether to sort, know which sort your language just ran, and cash in what a sorted array unlocks. Sorting first turns brute-force O(n²) pair-hunting into two pointers, makes binary search legal, and lines intervals up for greedy sweeps. The price of admission is the landscape: who runs in n log n, who is <code>stable</code> (equal items keep their original order), who needs extra memory, and who gets to cheat." },
    { type: "callout", variant: "analogy", title: "One deck of cards, three strategies", text: "Split the deck in half, sort each half, riffle them together — merge sort. Pick a card, deal everything into a lower pile and a higher pile, repeat inside each pile — quicksort. Repeatedly pull out the smallest remaining card — selection, which becomes heap sort once a heap makes “find the smallest” cheap. Same deck, same final order, very different bills." },
    { type: "cells", title: "Anatomy of a quicksort partition", index: true, cells: [{ v: "3", hl: 2 }, { v: "2", hl: 2 }, { v: "8" }, { v: "5" }, { v: "4", hl: 1 }], pointers: [{ i: 1, t: "i" }, { i: 3, t: "j" }, { i: 4, t: "pivot", pos: "top" }], caption: "The invariant mid-pass: slots 0..i hold values ≤ pivot, slots after i hold bigger ones, j scans, and the pivot waits at the end. One pass, then the pivot is seated between the camps." },
    { type: "h3", text: "Why n log n is the wall" },
    { type: "p", text: "A comparison sort learns only through yes/no questions — “is a[i] smaller than a[j]?” — so its possible runs form a binary decision tree that needs a distinct leaf for every one of the n! orderings the input might be in, forcing depth of at least log₂(n!) ≈ n log n. That is a floor for every comparison sort ever written. Counting, radix, and bucket sort duck under the wall by never comparing at all: they read the key itself and index straight into buckets — legal only when keys are bounded, like integers in a known range or fixed-width strings." },
    { type: "bigO", rows: [
      ["Merge sort", "O(n log n) always", "halve, sort halves, merge — stable, needs a buffer"],
      ["Quicksort", "O(n log n) average", "n² on adversarial pivots; in-place, cache-happy"],
      ["Heap sort", "O(n log n) guaranteed", "n extract-roots; in-place but cache-unfriendly"],
      ["Counting / radix", "O(n + k)", "no compares — index by key; needs bounded keys"],
      ["Comparison-sort floor", "Ω(n log n)", "the decision tree must fit n! leaves"]
    ] },
    { type: "table", headers: ["Algorithm", "Time (avg / worst)", "Extra space", "Stable?"], rows: [
      ["Merge sort", "n log n / n log n", "O(n) buffer", "Yes"],
      ["Quicksort", "n log n / n²", "O(log n) stack", "No"],
      ["Heap sort", "n log n / n log n", "O(1)", "No"],
      ["Insertion sort", "n² / n² — n if nearly sorted", "O(1)", "Yes"],
      ["Counting / radix", "n + k / n + k", "O(n + k)", "Yes"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "int[] a = {3, 8, 2, 5, 4};\nArrays.sort(a);                        // primitives → dual-pivot quicksort\n\nInteger[] boxed = {3, 8, 2, 5, 4};\nArrays.sort(boxed);                    // objects → TimSort (stable)\n\nint[][] iv = {{5, 9}, {1, 4}, {1, 2}};\nArrays.sort(iv, (p, q) -> Integer.compare(p[0], q[0])); // the interview move\n// after sorting: two pointers, binary search, and greedy sweeps become legal" },
    { type: "steps", title: "One Lomuto partition: [3, 8, 2, 5, 4], pivot 4", frames: [
      { d: "Pivot = 4, the last element. j scans left to right; i marks the right edge of the ≤-pivot zone and starts just before the array (i = −1).", cells: { index: true, cells: [{ v: "3" }, { v: "8" }, { v: "2" }, { v: "5" }, { v: "4", hl: 2 }], pointers: [{ i: 0, t: "j" }, { i: 4, t: "pivot", pos: "top" }] } },
      { d: "j=0: 3 ≤ 4, so i advances to 0 and a[i] swaps with a[j] — with itself, here. The ≤ zone is now [3].", cells: { index: true, cells: [{ v: "3", hl: 1 }, { v: "8" }, { v: "2" }, { v: "5" }, { v: "4", hl: 2 }], pointers: [{ i: 0, t: "i" }, { i: 1, t: "j" }, { i: 4, t: "pivot", pos: "top" }] } },
      { d: "j=1: 8 is bigger — leave it in place. i stays put; the bigger-than-pivot zone starts growing behind j.", cells: { index: true, cells: [{ v: "3" }, { v: "8", hl: 2 }, { v: "2" }, { v: "5" }, { v: "4", hl: 2 }], pointers: [{ i: 0, t: "i" }, { i: 2, t: "j" }, { i: 4, t: "pivot", pos: "top" }] } },
      { d: "j=2: 2 ≤ 4, so i advances to 1 and a[1] swaps with a[2]: 8 and 2 trade places. Small values compact left; the 8 slides along.", cells: { index: true, cells: [{ v: "3" }, { v: "2", hl: 1 }, { v: "8", hl: 1 }, { v: "5" }, { v: "4", hl: 2 }], pointers: [{ i: 1, t: "i" }, { i: 3, t: "j" }, { i: 4, t: "pivot", pos: "top" }] } },
      { d: "j=3: 5 is bigger — leave it. Scan over: [3, 2] sit at or below the pivot, [8, 5] above it, and 4 still waits at the end.", cells: { index: true, cells: [{ v: "3", hl: 2 }, { v: "2", hl: 2 }, { v: "8" }, { v: "5" }, { v: "4", hl: 2 }], pointers: [{ i: 1, t: "i" }, { i: 3, t: "j" }, { i: 4, t: "pivot", pos: "top" }] } },
      { d: "Seat the pivot: swap a[i+1] with the last slot — 4 and 8 trade. 4 lands at index 2, its final sorted position, forever.", cells: { index: true, cells: [{ v: "3" }, { v: "2" }, { v: "4", hl: 1 }, { v: "5" }, { v: "8", hl: 1 }], pointers: [{ i: 2, t: "pivot", pos: "top" }] } },
      { d: "The split: recurse on [3, 2] and on [5, 8] independently. Halving like this about log n times, each level costing n total, is where n log n comes from.", cells: { index: true, cells: [{ v: "3", hl: 2 }, { v: "2", hl: 2 }, { v: "4", hl: 1 }, { v: "5", hl: 2 }, { v: "8", hl: 2 }], pointers: [{ i: 0, t: "left" }, { i: 2, t: "done", pos: "top" }, { i: 3, t: "right" }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "The subtraction comparator", text: "<code>(p, q) -&gt; p[0] - q[0]</code> looks idiomatic and is a genuine production bug: with large values of opposite sign the subtraction overflows and reports the wrong order — <code>Arrays.sort</code> can even throw “Comparison method violates its general contract”. Always <code>Integer.compare(p[0], q[0])</code>. Quicksort has its own trap: a naive first- or last-element pivot degrades to O(n²) on already-sorted input — the most common input there is." },
    { type: "callout", variant: "pro", title: "TimSort, dual-pivot, and the sort-first reflex", text: "Java ships two sorts on purpose: primitives get dual-pivot quicksort, objects get TimSort. The dividing line is observability — reordering equal <code>int</code>s is undetectable, but equal objects can differ in their other fields, so stability is part of the contract only for objects. TimSort also hunts for <code>runs</code> — stretches already in order — and merges them, approaching O(n) on nearly-sorted data, which is what production data usually is. Tactically, make “can I sort first?” your opening question on any array problem: an n log n toll that unlocks the two-pointer, binary-search, and interval-greedy families is almost always worth paying." },
    { type: "callout", variant: "rule", title: "Choosing under pressure", text: "Guaranteed n log n plus stability → merge sort (or just TimSort). Fast in practice, in-place → quicksort. Guaranteed n log n with O(1) space → heap sort. Keys are small bounded integers → counting or radix. In a Java interview the honest answer is usually <code>Arrays.sort</code> — spend your cleverness on the comparator instead." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"merge / overlapping intervals, meeting rooms\"</strong> → sort by start, sweep once",
      "<strong>\"pair / triplet summing to a target\"</strong> → sort, then two pointers converge",
      "<strong>\"kth largest / smallest\"</strong> → don't fully sort — heap of size k or quickselect",
      "<strong>\"how many are smaller / rank of each element\"</strong> → sorted copy plus binary search",
      "<strong>\"nearly sorted / each item at most k away\"</strong> → size-k heap, not a full sort"
    ] },
    { type: "check", items: [
      { q: "In one sentence: why can no comparison sort beat n log n?", a: "There are n! possible orderings of the input and each comparison splits the possibilities only in two, so any correct sort needs at least log₂(n!) ≈ n log n comparisons in the worst case to tell them all apart." },
      { q: "Why does Java use stable TimSort for objects but quicksort for primitives?", a: "Stability is observable only for objects: two equal ints are indistinguishable, so reordering them is invisible and quicksort's raw speed wins. Equal objects can carry different data in other fields, so their relative order matters — TimSort guarantees it survives." },
      { q: "When is counting sort legitimately faster than n log n, and what's the catch?", a: "When keys are bounded integers — ages, scores, characters — it indexes by key instead of comparing, running O(n + k). The catch is k: a full 32-bit range makes the count array absurd. Radix sort repairs that by counting one digit at a time." },
      { q: "Quicksort can hit O(n²) — why do libraries still build on it?", a: "The worst case needs consistently terrible pivots, which randomized, median-of-three, or dual-pivot selection makes vanishingly rare — while partitioning works in place and walks memory sequentially, cache behavior merge sort's buffer can't match. Average speed wins; engineering defuses the tail." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Replay the partition walkthrough, then run it by hand on [5, 1, 4, 2, 3] and confirm the pivot 3 lands at index 2." },
      { t: "Drill", d: "Sort-first territory: Merge Intervals and Meeting Rooms, where the sort <strong>is</strong> the insight and the sweep afterwards is the easy part.", href: "#/pattern/intervals", link: "Intervals" },
      { t: "Interview-ready", d: "Collect the sorted-input payoffs: the binary-search family and rotated arrays — then revisit any two-pointer pair problem and name the sort that unlocked it.", href: "#/pattern/binary-search", link: "Binary Search" },
      { t: "Master", d: "Clear the map end to end, and be able to whiteboard merge sort and quicksort from memory with their space and stability trade-offs attached.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});
