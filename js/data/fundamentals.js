/* DSA Fundamentals — the primer to read before starting the pattern bank. */
window.FUNDAMENTALS = {
  id: "fundamentals",
  name: "DSA Fundamentals",
  intro: `Before pattern drilling pays off, you need a small set of load-bearing basics: how to reason about cost with Big&nbsp;O, what each core data structure is actually good at, and a repeatable way to read a problem. This section is short on purpose — read it once, refer back when a solution's complexity analysis doesn't click.`,
  topics: [
    {
      id: "big-o",
      title: "Big O — Time & Space Complexity",
      summary: `How to measure an algorithm's cost as input grows, and the handful of classes that cover 95% of interview answers.`,
      blocks: [
        { type: "p", text: `Big O describes how running time (or memory) grows as the input size <code>n</code> grows. Constants and lower-order terms are dropped: an algorithm doing <code>3n + 20</code> operations is <strong>O(n)</strong>. Interviewers care about the growth class, not the exact count — and they will ask for both <strong>time</strong> and <strong>space</strong>.` },
        { type: "table", headers: ["Class", "Name", "Typical source"], rows: [
          ["O(1)", "Constant", "Hash map get/put, array index, stack push/pop"],
          ["O(log n)", "Logarithmic", "Binary search, balanced BST ops, heap push/pop"],
          ["O(n)", "Linear", "One pass over the input; two pointers; sliding window"],
          ["O(n log n)", "Linearithmic", "Good sorting; n heap operations; divide & conquer"],
          ["O(n²)", "Quadratic", "Nested loops over the same input"],
          ["O(2ⁿ)", "Exponential", "Naive recursion trying all subsets; unmemoized DP"],
          ["O(n!)", "Factorial", "All permutations; brute-force backtracking"]
        ]},
        { type: "h3", text: "Rules of thumb" },
        { type: "list", items: [
          `Sequential steps <strong>add</strong>: a pass then another pass is O(n + n) = O(n). Nested steps <strong>multiply</strong>: a loop inside a loop is O(n²).`,
          `Halving the search space each step is O(log n); doing that n times is O(n log n).`,
          `Recursion cost ≈ number of nodes in the call tree × work per node. Memoization collapses repeated subtrees.`,
          `Space complexity counts extra memory you allocate — including the recursion stack. A DFS over a tree of height h is O(h) space even with no arrays.`,
          `At n ≈ 10⁵–10⁶, an O(n²) solution is usually too slow. Constraints in the problem are a hint about the intended complexity.`
        ]},
        { type: "h3", text: "Amortized cost" },
        { type: "p", text: `Some operations are occasionally expensive but cheap on average: an <code>ArrayList</code> doubles capacity rarely, so append is <strong>amortized O(1)</strong>. Monotonic-stack solutions look like nested loops but each element is pushed and popped at most once, so the whole pass is O(n). When your loop "sometimes does more work," ask what the total work across all iterations is.` }
      ]
    },
    {
      id: "arrays-strings",
      title: "Arrays & Strings",
      summary: `The default containers — contiguous memory, O(1) access, and the substrate for two pointers and sliding window.`,
      blocks: [
        { type: "p", text: `Arrays give <strong>O(1) access by index</strong> because elements sit contiguously in memory. The trade-off: inserting or deleting in the middle shifts everything after it — <strong>O(n)</strong>. Strings in Java are immutable arrays of characters, so building one in a loop with <code>+</code> is O(n²); use <code>StringBuilder</code>.` },
        { type: "list", items: [
          `<strong>Sorted array?</strong> Think binary search or two pointers before anything else.`,
          `<strong>Contiguous subarray / substring?</strong> Think sliding window.`,
          `<strong>Need counts or "have I seen this?"</strong> Pair the array with a hash map or a fixed-size <code>int[26]</code> for lowercase letters.`,
          `<strong>Prefix sums</strong> turn "sum of any range" into O(1) after an O(n) precompute — the backbone of many subarray-sum problems.`
        ]},
        { type: "code", lang: "java", text: `// Prefix sum: range sum (i..j) in O(1)\nint[] prefix = new int[n + 1];\nfor (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];\nint rangeSum = prefix[j + 1] - prefix[i];` }
      ]
    },
    {
      id: "linked-lists",
      title: "Linked Lists",
      summary: `O(1) insertion anywhere you hold a pointer — at the price of O(n) access. Home turf of fast & slow pointers.`,
      blocks: [
        { type: "p", text: `Each node holds a value and a <code>next</code> reference. There is no indexing — reaching the k-th node costs O(k). What lists buy you: <strong>O(1) insert/delete</strong> given a reference to the previous node, and structural moves (reversal, splicing) done purely by rewiring pointers, no data copying.` },
        { type: "list", items: [
          `<strong>Dummy head:</strong> allocate a fake node before the real head so edge cases (deleting the head, empty list) stop being special cases.`,
          `<strong>Fast & slow pointers:</strong> advance one pointer 2 steps per tick and another 1 step — finds middles, detects cycles, and locates cycle entry points without extra memory.`,
          `<strong>Reversal:</strong> the three-pointer dance (<code>prev</code>, <code>curr</code>, <code>next</code>) shows up inside dozens of harder problems — drill it until it's muscle memory.`,
          `Always ask: what happens on an empty list, a single node, and the last node?`
        ]},
        { type: "code", lang: "java", text: `// The reversal you must be able to write cold\nListNode prev = null, curr = head;\nwhile (curr != null) {\n    ListNode next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n}\n// prev is the new head` }
      ]
    },
    {
      id: "stacks-queues",
      title: "Stacks & Queues",
      summary: `LIFO and FIFO — matching pairs, undo, "most recent unresolved thing," and level-by-level processing.`,
      blocks: [
        { type: "p", text: `A <strong>stack</strong> (last-in, first-out) is the right shape whenever the most recently seen unresolved item is the next one you'll need: matching brackets, undo history, evaluating expressions, DFS. A <strong>queue</strong> (first-in, first-out) processes items in arrival order — the engine behind BFS and level-order traversal.` },
        { type: "p", text: `In Java, use <code>ArrayDeque</code> for both (<code>push/pop/peek</code> for stack, <code>offer/poll</code> for queue). Avoid the legacy <code>Stack</code> class.` },
        { type: "list", items: [
          `<strong>Monotonic stack:</strong> a stack kept sorted by popping anything that violates the order as you push. Answers "next greater/smaller element" questions in O(n) — one of the highest-leverage tricks in the bank.`,
          `<strong>Two stacks make a queue</strong> (and vice versa) — a classic warm-up interviewers still ask.`
        ]}
      ]
    },
    {
      id: "hash-maps",
      title: "Hash Maps & Sets",
      summary: `O(1) average lookup — the tool that converts "search for a partner" problems from O(n²) to O(n).`,
      blocks: [
        { type: "p", text: `A hash map stores key → value pairs with <strong>average O(1)</strong> insert, lookup, and delete, by hashing the key to a bucket. A hash set is the same thing without values. The classic move: instead of scanning for a matching element (O(n) per query), record what you've seen and ask the map — Two Sum in one pass.` },
        { type: "list", items: [
          `Count frequencies with <code>map.merge(key, 1, Integer::sum)</code> or <code>getOrDefault</code>.`,
          `Group things by a canonical key — e.g., group anagrams by their sorted string.`,
          `Need insertion order? <code>LinkedHashMap</code>. Need sorted keys with floor/ceiling queries? <code>TreeMap</code> (O(log n), but ordered).`,
          `Worst case is O(n) per operation under adversarial collisions — say "average O(1)" in interviews and you're safe.`
        ]}
      ]
    },
    {
      id: "trees",
      title: "Trees & Binary Search Trees",
      summary: `Hierarchies you traverse recursively; BSTs add an ordering invariant that enables O(log n) search.`,
      blocks: [
        { type: "p", text: `A binary tree node has up to two children. Most tree problems are one of two traversals: <strong>DFS</strong> (recurse depth-first — preorder, inorder, postorder) or <strong>BFS</strong> (queue, level by level). The recursive insight that unlocks the category: <strong>a tree problem is usually "solve for the subtrees, combine at the root."</strong>` },
        { type: "list", items: [
          `A <strong>BST</strong> keeps left subtree &lt; node &lt; right subtree. Inorder traversal of a BST yields sorted order — many BST problems are that one fact in disguise.`,
          `Balanced BSTs give O(log n) search/insert/delete; a degenerate (linked-list-shaped) BST gives O(n). Interviewers expect you to state both.`,
          `DFS space is O(height): O(log n) balanced, O(n) worst case. BFS space is the widest level — up to O(n).`,
          `A <strong>trie</strong> (prefix tree) stores strings character-by-character along paths — the answer to autocomplete and word-search-with-prefixes questions.`
        ]},
        { type: "code", lang: "java", text: `// The shape of most tree solutions\nint dfs(TreeNode node) {\n    if (node == null) return 0;          // base case\n    int left = dfs(node.left);            // solve subtrees\n    int right = dfs(node.right);\n    return combine(node, left, right);    // combine at root\n}` }
      ]
    },
    {
      id: "graphs",
      title: "Graphs",
      summary: `Nodes and edges — grids, prerequisites, networks. Everything reduces to BFS, DFS, or topological sort.`,
      blocks: [
        { type: "p", text: `A graph is nodes plus edges, directed or undirected. Interviews almost always hand you one of three encodings: an <strong>adjacency list</strong> (<code>Map&lt;Integer, List&lt;Integer&gt;&gt;</code>), an <strong>edge list</strong> you convert to one, or a <strong>grid</strong> where each cell is a node and neighbors are up/down/left/right.` },
        { type: "list", items: [
          `<strong>DFS</strong> explores as deep as possible first — connectivity, islands, cycle detection, path existence.`,
          `<strong>BFS</strong> explores in rings — and therefore finds <strong>shortest paths in unweighted graphs</strong>. "Minimum number of steps" on a grid is BFS, essentially always.`,
          `<strong>Topological sort</strong> orders a DAG so every edge points forward — course schedules, build orders. Kahn's algorithm: repeatedly remove nodes with indegree 0.`,
          `<strong>Union-Find</strong> answers "are these connected?" across many queries in near-O(1) — components, redundant connections, Kruskal's MST.`,
          `Always track <code>visited</code> — forgetting it is the #1 graph bug (infinite loops on cycles).`
        ]}
      ]
    },
    {
      id: "heaps",
      title: "Heaps & Priority Queues",
      summary: `Repeatedly need the min or max of a changing collection? That's a heap, and it costs O(log n) per operation.`,
      blocks: [
        { type: "p", text: `A binary heap is a complete binary tree (stored flat in an array) where every parent beats its children. It gives <strong>O(1) peek</strong> at the min (or max) and <strong>O(log n)</strong> insert and remove. Java's <code>PriorityQueue</code> is a min-heap; pass a comparator like <code>(a, b) -&gt; b - a</code> for a max-heap.` },
        { type: "list", items: [
          `<strong>Top-K pattern:</strong> keep a heap of size k of the opposite kind (min-heap for k largest) and evict the root when it grows past k — O(n log k) instead of sorting everything.`,
          `<strong>Two heaps:</strong> a max-heap for the lower half and a min-heap for the upper half maintain a running median.`,
          `Building a heap from n items at once is O(n), not O(n log n) — a nice detail to mention.`
        ]}
      ]
    },
    {
      id: "reading-a-problem",
      title: "How to Read a Problem",
      summary: `A repeatable 6-step protocol that turns a blank stare into a plan — and doubles as your interview communication script.`,
      blocks: [
        { type: "p", text: `Strong candidates don't start typing. They run the same protocol every time — which is exactly what this site's hint levels mirror: identify the <strong>pattern</strong>, then the <strong>approach</strong>, then the <strong>details</strong>.` },
        { type: "list", items: [
          `<strong>1. Restate the problem</strong> in one sentence and confirm it. Misreading costs more than any algorithm mistake.`,
          `<strong>2. Interrogate the constraints.</strong> n ≤ 10⁵ rules out O(n²). Sorted input suggests binary search or two pointers. "Contiguous" suggests a window. Values in a small range suggest counting.`,
          `<strong>3. Work a small example by hand</strong> — including one edge case (empty, single element, all duplicates). What you do by hand is often the algorithm.`,
          `<strong>4. Name the brute force and its cost out loud.</strong> It's a safety net, and the gap between its complexity and what the constraints allow points at the intended pattern.`,
          `<strong>5. Match against patterns.</strong> That's the entire thesis of this site: "pairs in sorted data → two pointers", "best substring → sliding window", "all combinations → backtracking", "overlapping subproblems → DP".`,
          `<strong>6. Only then code</strong> — narrating invariants as you go — and finish by tracing your own solution on the example from step 3.`
        ]},
        { type: "p", text: `If you're stuck for more than a few minutes on a problem here, reveal <strong>Hint 1 only</strong> and try again. The struggle-then-nudge cycle is what builds recall; jumping to the solution builds recognition without recall — which evaporates under interview pressure.` }
      ]
    }
  ]
};
