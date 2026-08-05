/* Data Structures guides — part D: Trees, Graphs, Trie, Range Structures. */
window.STRUCTURE_TOPICS = window.STRUCTURE_TOPICS || [];

window.STRUCTURE_TOPICS.push({
  id: "trees",
  order: 7,
  title: "Trees",
  hue: "red",
  tagline: "Hierarchy in nodes, recursion for free",
  minutes: 12,
  summary: "Nodes linked parent-to-child, plus the BST rule that turns search into a halving game. Why in-order traversal prints sorted output, why recursion depth can crash you, and why balanced trees exist.",
  blocks: [
    { type: "p", text: "A tree is nodes linked parent-to-child: one root at the top, exactly one path from the root to anywhere below, no cycles. Cap it at two children per node and add one ordering rule — smaller values go left, larger go right — and you have the <code>binary search tree</code> (BST), where every comparison discards half of what remains. Interviews adore trees because they are recursion made visible: nearly every tree problem is \"handle this node, then trust the same function on my subtrees.\"" },
    { type: "callout", variant: "analogy", title: "A company org chart", text: "One CEO at the top, every employee reports to exactly one manager, and \"who's in your org?\" means everyone beneath you. Walking up is following your boss; walking down is asking your reports — and no chain of command ever loops back on itself." },
    { type: "tree", root: { v: "8", hl: 1, kids: [
      { v: "3", kids: [{ v: "1" }, { v: "6" }] },
      { v: "10", kids: [{ v: "14" }] }
    ] }, caption: "A BST: everything left of 8 is smaller (3, 1, 6), everything right is larger (10, and its lone right child 14). Searching = one walk down, one comparison per level." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "Unlike an array's single block, a tree is scattered: each <code>node</code> is its own heap object holding a value and two references, <code>left</code> and <code>right</code>. A node with no children is a <code>leaf</code> — a dead end. Nothing is contiguous, so there is no index math; you reach things by walking references. Every cost is governed by the tree's <code>height</code> — the longest root-to-leaf walk. A bushy, balanced tree of n nodes has height about log n; a lopsided one can have height n, and every O(log n) promise dies with it." },
    { type: "bigO", rows: [
      ["Search / insert, balanced BST", "O(log n)", "each comparison discards half the tree"],
      ["Search / insert, skewed BST", "O(n)", "height = n — a linked list in disguise"],
      ["Full traversal (DFS or BFS)", "O(n)", "every node visited exactly once"],
      ["Min or max of a BST", "O(h)", "walk all the way left (min) or right (max)"],
      ["Recursion stack space", "O(h)", "h = height: log n balanced, n skewed"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }\n\nvoid inorder(TreeNode node, List<Integer> out) {\n    if (node == null) return;         // base case: fell off the tree\n    inorder(node.left, out);          // 1. everything smaller\n    out.add(node.val);                // 2. the node itself\n    inorder(node.right, out);         // 3. everything larger\n}\n\nboolean search(TreeNode n, int target) { // BST search: one path down\n    if (n == null) return false;\n    if (target == n.val) return true;\n    return search(target < n.val ? n.left : n.right, target);\n}" },
    { type: "steps", title: "Watch in-order DFS print the BST in sorted order", frames: [
      { d: "In-order = left, self, right. From 8 dive left: 8 → 3 → 1. 1 has no left child, so visit it. Output: 1", tree: { root: { v: "8", kids: [
        { v: "3", kids: [{ v: "1", hl: 1 }, { v: "6" }] },
        { v: "10", kids: [{ v: "14" }] }
      ] } } },
      { d: "1 has no right child — return to 3. Its left side is finished, so 3 itself is visited. Output: 1 3", tree: { root: { v: "8", kids: [
        { v: "3", hl: 1, kids: [{ v: "1", hl: 2 }, { v: "6" }] },
        { v: "10", kids: [{ v: "14" }] }
      ] } } },
      { d: "Now 3's right subtree: 6 has no children, so visit it. Output: 1 3 6", tree: { root: { v: "8", kids: [
        { v: "3", hl: 2, kids: [{ v: "1", hl: 2 }, { v: "6", hl: 1 }] },
        { v: "10", kids: [{ v: "14" }] }
      ] } } },
      { d: "The entire left subtree is done, so the root finally takes its turn. Output: 1 3 6 8", tree: { root: { v: "8", hl: 1, kids: [
        { v: "3", hl: 2, kids: [{ v: "1", hl: 2 }, { v: "6", hl: 2 }] },
        { v: "10", kids: [{ v: "14" }] }
      ] } } },
      { d: "Into the right subtree. 10 has no left child, so it is visited immediately. Output: 1 3 6 8 10", tree: { root: { v: "8", hl: 2, kids: [
        { v: "3", hl: 2, kids: [{ v: "1", hl: 2 }, { v: "6", hl: 2 }] },
        { v: "10", hl: 1, kids: [{ v: "14" }] }
      ] } } },
      { d: "Last stop: 10's right child. Output: 1 3 6 8 10 14 — sorted. In-order on a BST always yields ascending order; that is the BST rule paying out.", tree: { root: { v: "8", hl: 2, kids: [
        { v: "3", hl: 2, kids: [{ v: "1", hl: 2 }, { v: "6", hl: 2 }] },
        { v: "10", hl: 2, kids: [{ v: "14", hl: 1 }] }
      ] } } }
    ] },
    { type: "callout", variant: "pitfall", title: "Recursion is a stack you don't see", text: "Every recursive call parks a frame on the JVM call stack, and the deepest it goes equals the tree's height. On a skewed tree of 100,000 nodes that is 100,000 frames — <code>StackOverflowError</code>, on a tree that fits in memory just fine. The fix is mechanical: replace recursion with an explicit <code>Deque</code> of nodes. And when an interviewer asks for space complexity, the O(h) recursion stack counts — \"O(1), it's just recursion\" is a wrong answer." },
    { type: "callout", variant: "pro", title: "Sorted input is the BST killer", text: "Insert 1, 2, 3, … n into a plain BST and every key goes right: the \"tree\" is a linked list and every operation is O(n). That failure mode is the entire reason self-balancing trees exist — <strong>AVL</strong> and <strong>red-black</strong> trees rotate nodes on insert to pin the height at O(log n). You will never implement one in an interview, but the JDK ships them: <code>TreeMap</code> and <code>TreeSet</code> are red-black trees. Saying \"I'd use a TreeMap for sorted keys with log-n everything\" is the senior move." },
    { type: "callout", variant: "rule", title: "Height vs depth — don't mix them", text: "<strong>Depth</strong> is measured from the root down: the root has depth 0. <strong>Height</strong> is measured from a node down to its deepest leaf: a leaf has height 0, and the tree's height is the root's height. Interviewers use both words; ask which they mean before you are off by a level." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"sorted order / kth smallest in a BST\"</strong> → in-order DFS",
      "<strong>\"level by level / zigzag / right side view\"</strong> → BFS with a queue",
      "<strong>\"max depth / path sum / diameter\"</strong> → post-order DFS returning answers upward",
      "<strong>\"lowest common ancestor\"</strong> → walk down comparing values (BST) or DFS both sides",
      "<strong>\"serialize / reconstruct the tree\"</strong> → pre-order DFS with null markers"
    ] },
    { type: "check", items: [
      { q: "Why does in-order traversal of a BST come out sorted?", a: "The BST rule is recursive: everything left of a node is smaller, everything right is larger. In-order visits left subtree, then the node, then right subtree — so every value is printed after all smaller values and before all larger ones." },
      { q: "Balanced vs skewed: what is the height of each for n nodes, and why does it matter?", a: "About log n balanced, n skewed. Every BST cost is O(height), so the same code is O(log n) on one shape and O(n) on the other — shape, not size, sets the bill." },
      { q: "Your recursive DFS crashes with StackOverflowError on a huge test case. What happened and what is the fix?", a: "The tree was skewed, so recursion depth hit the height — likely n. Rewrite the traversal iteratively with an explicit stack (<code>Deque</code>); heap-allocated stacks can hold millions of nodes." },
      { q: "What is the difference between a node's height and its depth?", a: "Depth counts edges up to the root (root = 0); height counts edges down to the deepest leaf (leaf = 0). They run in opposite directions, and mixing them up is a classic off-by-a-level bug." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Re-read the anatomy until \"left smaller, right larger\" is reflex, then replay the in-order walkthrough and predict each output line before reading the caption." },
      { t: "Drill", d: "Traversal is the push-up of tree problems: BFS levels and DFS depths until you can write both from muscle memory.", href: "#/pattern/trees-bfs-dfs", link: "Trees: BFS and DFS" },
      { t: "Interview-ready", d: "Own the classics built on traversal — Path Sum, Diameter, Serialize and Deserialize — each one is a traversal plus a single extra idea.", href: "#/pattern/trees-bfs-dfs", link: "Trees: BFS and DFS" },
      { t: "Master", d: "Clear the Trees branch on the Pattern map, then notice BSTs hiding inside heaps, tries, and segment trees for the rest of your career.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "graphs",
  order: 10,
  title: "Graphs",
  hue: "brown",
  tagline: "Nodes, edges, and problems in disguise",
  minutes: 13,
  summary: "Nodes and edges — the structure every grid, prerequisite list, and word puzzle secretly is. Adjacency lists vs matrices, BFS layers as shortest paths, and the visited-marking bug that passes small tests.",
  blocks: [
    { type: "p", text: "A graph is the loosest structure there is: things — <code>nodes</code>, also called vertices — and connections between them, <code>edges</code>. No root, no order, and cycles are allowed; a tree is just a graph on its best behavior. That generality is why interviews lean on graphs so hard: social networks, course prerequisites, word ladders, and every maze-shaped grid are graphs, and they all fall to the same two traversals — BFS and DFS." },
    { type: "callout", variant: "analogy", title: "Six degrees of separation", text: "People are nodes, friendships are edges. \"How far is Kevin Bacon from you?\" is a BFS: first your friends (one hop), then their friends (two hops), rippling outward one ring at a time. The ring where he first appears is the shortest chain — a shorter one would have surfaced in an earlier ring." },
    { type: "graph", nodes: [
      { id: "a", v: "A", x: 8, y: 50, hl: 1 },
      { id: "b", v: "B", x: 35, y: 20 },
      { id: "c", v: "C", x: 35, y: 80 },
      { id: "d", v: "D", x: 62, y: 20 },
      { id: "e", v: "E", x: 62, y: 80 },
      { id: "f", v: "F", x: 90, y: 50 }
    ], edges: [
      { a: "a", b: "b" }, { a: "a", b: "c" }, { a: "b", b: "d" },
      { a: "c", b: "e" }, { a: "d", b: "f" }, { a: "e", b: "f" }
    ], caption: "Six nodes, six edges, no hierarchy — A can reach F two different ways. The picture is for humans; your code sees the adjacency list below." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "A graph has no natural memory layout, so you pick one. The <code>adjacency list</code> — one bucket per node listing its neighbors — costs O(V + E) space (V nodes, E edges) and is the interview default. The <code>adjacency matrix</code> is a V × V grid of booleans: asking \"is there an edge u–v?\" becomes an O(1) lookup, but you pay O(V²) space even when almost no edges exist. Interview graphs are nearly always sparse — few edges per node — so the list wins. Here is the graph above as its list:" },
    { type: "table", headers: ["Node", "Neighbors"], rows: [
      ["A", "B, C"],
      ["B", "A, D"],
      ["C", "A, E"],
      ["D", "B, F"],
      ["E", "C, F"],
      ["F", "D, E"]
    ] },
    { type: "bigO", rows: [
      ["Adjacency list space", "O(V + E)", "one bucket per node, one entry per edge"],
      ["Adjacency matrix space", "O(V²)", "a full grid — mostly zeros on sparse graphs"],
      ["Edge check, list", "O(degree)", "scan one node's neighbor bucket"],
      ["Edge check, matrix", "O(1)", "grid[u][v] — direct index math"],
      ["BFS / DFS traversal", "O(V + E)", "every node and every edge touched once"],
      ["Shortest hops, unweighted", "O(V + E)", "BFS layers are distances — no Dijkstra needed"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "// adj.get(u) = list of u's neighbors (built once, O(V + E))\nboolean[] visited = new boolean[n];\nQueue<Integer> queue = new ArrayDeque<>();\nqueue.add(start);\nvisited[start] = true;               // mark on ENQUEUE, not dequeue\nwhile (!queue.isEmpty()) {\n    int u = queue.poll();\n    for (int v : adj.get(u)) {\n        if (!visited[v]) {\n            visited[v] = true;       // each node enters the queue once\n            queue.add(v);\n        }\n    }\n}" },
    { type: "steps", title: "BFS from A, one dequeue at a time", frames: [
      { d: "Enqueue the start and mark it visited the moment it enters. queue = [A]", graph: { nodes: [
        { id: "a", v: "A", x: 8, y: 50, hl: 1 }, { id: "b", v: "B", x: 35, y: 20 }, { id: "c", v: "C", x: 35, y: 80 },
        { id: "d", v: "D", x: 62, y: 20 }, { id: "e", v: "E", x: 62, y: 80 }, { id: "f", v: "F", x: 90, y: 50 }
      ], edges: [
        { a: "a", b: "b" }, { a: "a", b: "c" }, { a: "b", b: "d" }, { a: "c", b: "e" }, { a: "d", b: "f" }, { a: "e", b: "f" }
      ] } },
      { d: "Dequeue A and discover B and C — each is marked visited as it is enqueued. queue = [B, C]", graph: { nodes: [
        { id: "a", v: "A", x: 8, y: 50, hl: 2 }, { id: "b", v: "B", x: 35, y: 20, hl: 1 }, { id: "c", v: "C", x: 35, y: 80, hl: 1 },
        { id: "d", v: "D", x: 62, y: 20 }, { id: "e", v: "E", x: 62, y: 80 }, { id: "f", v: "F", x: 90, y: 50 }
      ], edges: [
        { a: "a", b: "b", hl: true }, { a: "a", b: "c", hl: true }, { a: "b", b: "d" }, { a: "c", b: "e" }, { a: "d", b: "f" }, { a: "e", b: "f" }
      ] } },
      { d: "Dequeue B; A is already marked, and B's one new neighbor D joins. queue = [C, D]", graph: { nodes: [
        { id: "a", v: "A", x: 8, y: 50, hl: 2 }, { id: "b", v: "B", x: 35, y: 20, hl: 2 }, { id: "c", v: "C", x: 35, y: 80, hl: 2 },
        { id: "d", v: "D", x: 62, y: 20, hl: 1 }, { id: "e", v: "E", x: 62, y: 80 }, { id: "f", v: "F", x: 90, y: 50 }
      ], edges: [
        { a: "a", b: "b" }, { a: "a", b: "c" }, { a: "b", b: "d", hl: true }, { a: "c", b: "e" }, { a: "d", b: "f" }, { a: "e", b: "f" }
      ] } },
      { d: "Dequeue C. Its new neighbor E joins the queue. queue = [D, E]", graph: { nodes: [
        { id: "a", v: "A", x: 8, y: 50, hl: 2 }, { id: "b", v: "B", x: 35, y: 20, hl: 2 }, { id: "c", v: "C", x: 35, y: 80, hl: 2 },
        { id: "d", v: "D", x: 62, y: 20, hl: 2 }, { id: "e", v: "E", x: 62, y: 80, hl: 1 }, { id: "f", v: "F", x: 90, y: 50 }
      ], edges: [
        { a: "a", b: "b" }, { a: "a", b: "c" }, { a: "b", b: "d" }, { a: "c", b: "e", hl: true }, { a: "d", b: "f" }, { a: "e", b: "f" }
      ] } },
      { d: "Dequeue D and discover F. E never re-entered the queue — marked at enqueue, it was already spoken for. queue = [E, F]", graph: { nodes: [
        { id: "a", v: "A", x: 8, y: 50, hl: 2 }, { id: "b", v: "B", x: 35, y: 20, hl: 2 }, { id: "c", v: "C", x: 35, y: 80, hl: 2 },
        { id: "d", v: "D", x: 62, y: 20, hl: 2 }, { id: "e", v: "E", x: 62, y: 80, hl: 2 }, { id: "f", v: "F", x: 90, y: 50, hl: 1 }
      ], edges: [
        { a: "a", b: "b" }, { a: "a", b: "c" }, { a: "b", b: "d" }, { a: "c", b: "e" }, { a: "d", b: "f", hl: true }, { a: "e", b: "f" }
      ] } },
      { d: "E and F drain with nothing new. The layers ARE distances: B, C at 1 hop, D, E at 2, F at 3 — BFS hands you shortest paths for free.", graph: { nodes: [
        { id: "a", v: "A", x: 8, y: 50, hl: 2 }, { id: "b", v: "B", x: 35, y: 20, hl: 2 }, { id: "c", v: "C", x: 35, y: 80, hl: 2 },
        { id: "d", v: "D", x: 62, y: 20, hl: 2 }, { id: "e", v: "E", x: 62, y: 80, hl: 2 }, { id: "f", v: "F", x: 90, y: 50, hl: 2 }
      ], edges: [
        { a: "a", b: "b" }, { a: "a", b: "c" }, { a: "b", b: "d" }, { a: "c", b: "e" }, { a: "d", b: "f" }, { a: "e", b: "f" }
      ] } }
    ] },
    { type: "callout", variant: "pitfall", title: "Mark visited when you ENQUEUE, not when you dequeue", text: "Marking on dequeue lets several neighbors enqueue the same node before its first dequeue — the answers still look right on small tests, so the bug ships silently. Then a dense graph arrives, the queue balloons with duplicates, and O(V + E) quietly becomes something far worse. The rule: the instant a node enters the queue, it is spoken for. Mark it there." },
    { type: "callout", variant: "pro", title: "Most interview graphs are implicit", text: "Nobody hands you nodes and edges. A grid's cells are nodes and the edges are <code>(r±1, c)</code>, <code>(r, c±1)</code>; in Word Ladder a word's neighbors are its one-letter mutations; in puzzle problems every reachable state is a node. Don't build an adjacency list — generate neighbors on the fly inside the loop. And when every edge costs 1, BFS already returns shortest paths; <strong>Dijkstra</strong> only earns its complexity when edges carry different weights." },
    { type: "callout", variant: "rule", title: "Choosing the representation", text: "Sparse graph — almost every interview — take the adjacency list at O(V + E). Dense graph, or repeated \"is u connected to v?\" checks over small V — take the matrix: O(V²) space but O(1) per check. Grid problem — neither; the grid itself already is the graph." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"number of islands / provinces / connected groups\"</strong> → DFS flood fill or Union-Find",
      "<strong>\"minimum steps / fewest moves / shortest transformation\"</strong> → BFS on an implicit graph",
      "<strong>\"course schedule / build order / depends on\"</strong> → Topological Sort",
      "<strong>\"cheapest route, roads with costs\"</strong> → Dijkstra — weights disqualify plain BFS",
      "<strong>\"can you reach / is it connected\"</strong> → any traversal from the source"
    ] },
    { type: "check", items: [
      { q: "Why is BFS O(V + E) rather than O(V × E)?", a: "Each node is dequeued once, and each edge is examined once from each endpoint — all the neighbor lists together hold 2E entries. Nothing is ever re-scanned." },
      { q: "Marking visited on dequeue still visits every node — so what actually breaks?", a: "Reachability stays correct, but a node can be enqueued once per neighbor before its first dequeue. The queue fills with duplicates and runtime and memory blow past O(V + E) — a performance bug small tests never catch." },
      { q: "Your maze problem gives you a grid, not a graph. Where are the nodes and edges?", a: "Each open cell is a node; edges connect cells one step up, down, left, or right. You never build this — you compute the four neighbors on the fly. The BFS layer that reaches the exit is the minimum number of moves." },
      { q: "When would you genuinely pick the adjacency matrix?", a: "Dense graphs (E near V²) or algorithms that hammer \"does edge u–v exist?\" — the O(1) lookup beats scanning a bucket, and with small V the O(V²) memory is affordable." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Replay the BFS walkthrough and say the queue contents out loud at every frame — the queue is the algorithm; the picture is just its shadow." },
      { t: "Drill", d: "Flood fills, islands, and topo sorts until writing BFS and DFS costs you nothing.", href: "#/pattern/graphs", link: "Graph patterns" },
      { t: "Interview-ready", d: "Add connectivity without traversal: Union-Find answers \"same group?\" in near-constant time and unlocks a whole class of merging problems.", href: "#/pattern/union-find", link: "Union-Find" },
      { t: "Master", d: "Clear the Graphs branch on the Pattern map, ending with weighted shortest paths — the Dijkstra problems.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "trie",
  order: 11,
  title: "Trie",
  hue: "magenta",
  tagline: "Prefixes stored once, walked letter by letter",
  minutes: 10,
  summary: "A tree that spells words one letter per hop, sharing prefixes so lookup costs O(word length) no matter how huge the dictionary. The structure behind autocomplete and every \"starts with\" problem.",
  blocks: [
    { type: "p", text: "A <code>trie</code> (rhymes with \"try\", from re-trie-val) is a tree that stores strings one character per hop: every root-to-node path spells a prefix, and specially flagged nodes mark where whole words end. Store \"car\" and \"cat\" and they share the c–a spine — the common prefix exists once. The payoff: looking a word up costs O(its length), completely independent of how many thousands of words are stored. That is why autocomplete, spell-check, and every \"starts with\" interview problem reach for it." },
    { type: "callout", variant: "analogy", title: "Your phone's contact search", text: "Type \"Al\" and the contact list instantly narrows to everyone starting with Al. The phone didn't rescan every contact — it walked two letters down a trie, and the entire subtree below that node is the answer, already grouped and waiting." },
    { type: "tree", root: { v: "∅", kids: [
      { v: "c", kids: [
        { v: "a", kids: [{ v: "r•" }, { v: "t•" }] }
      ] }
    ] }, caption: "A trie holding \"car\" and \"cat\". Each hop adds one letter; • marks isWord = true. The path c→a exists, but \"ca\" is not a word — the flag, not the path, decides that." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "Each node is a tiny table of child references plus one boolean, <code>isWord</code>. The interview default is a 26-slot array where the child for <code>'c'</code> lives at index <code>'c' - 'a'</code> = 2 — so following a letter is O(1) index math, exactly like an array read. A word of length m is a path of m hops; inserting it creates at most m nodes, and every later word sharing its prefix rides the same nodes for free. The dictionary's total size never appears in any per-word cost — only the word's own length does." },
    { type: "bigO", rows: [
      ["Insert a word of length m", "O(m)", "one hop per character, creating nodes as needed"],
      ["Exact search", "O(m)", "walk the path, then check the isWord flag"],
      ["Prefix check (startsWith)", "O(m)", "same walk, no flag check — HashSet can't do this"],
      ["List all words under a prefix", "O(m + results)", "walk to the prefix, then DFS its subtree"],
      ["Space", "O(total chars)", "worst case; shared prefixes shrink it in practice"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "class TrieNode {\n    TrieNode[] kids = new TrieNode[26]; // one slot per letter a-z\n    boolean isWord;                     // true only where a word ENDS\n}\n\nvoid insert(TrieNode root, String w) {\n    TrieNode cur = root;\n    for (char ch : w.toCharArray()) {\n        int i = ch - 'a';               // 'c' -> slot 2\n        if (cur.kids[i] == null) cur.kids[i] = new TrieNode();\n        cur = cur.kids[i];\n    }\n    cur.isWord = true;                  // flag the final node\n}" },
    { type: "steps", title: "Insert \"car\", then \"cat\" — watch the prefix get reused", frames: [
      { d: "An empty trie is a lone root holding no letter. Every word will hang below it.", tree: { root: { v: "∅", hl: 1 } } },
      { d: "Insert \"car\": the root has no c child yet, so create one and step onto it.", tree: { root: { v: "∅", kids: [
        { v: "c", hl: 1 }
      ] } } },
      { d: "No a beneath c either — create it and step down. Two letters in, two nodes built.", tree: { root: { v: "∅", kids: [
        { v: "c", hl: 2, kids: [{ v: "a", hl: 1 }] }
      ] } } },
      { d: "Create r and flip its isWord flag on (the •). \"car\" is now a word — the flag says so, not the node's existence.", tree: { root: { v: "∅", kids: [
        { v: "c", hl: 2, kids: [{ v: "a", hl: 2, kids: [{ v: "r•", hl: 1 }] }] }
      ] } } },
      { d: "Insert \"cat\": c already exists, so walk it — no new node. Same at a. Reuse, not rebuild.", tree: { root: { v: "∅", kids: [
        { v: "c", hl: 2, kids: [{ v: "a", hl: 2, kids: [{ v: "r•" }] }] }
      ] } } },
      { d: "Only t is new — create it, flag it. Two words, four letter nodes: the shared prefix \"ca\" is stored exactly once.", tree: { root: { v: "∅", kids: [
        { v: "c", hl: 2, kids: [{ v: "a", hl: 2, kids: [{ v: "r•" }, { v: "t•", hl: 1 }] }] }
      ] } } }
    ] },
    { type: "callout", variant: "pitfall", title: "A path existing is not a word existing", text: "Insert only \"card\", then search for \"car\": the walk succeeds — c, a, r all exist — but r's <code>isWord</code> is false, so the answer is NO. Returning true just because the walk didn't fail is the classic trie bug. Keep the two questions separate: <code>search</code> = walk + flag check; <code>startsWith</code> = walk only." },
    { type: "callout", variant: "pro", title: "Child tables, memory bills, and the XOR trick", text: "A 26-slot array per node is O(1) per hop but costs 26 references (roughly 200 bytes) per node even on one-child chains — big dictionaries feel it. <code>HashMap&lt;Character, TrieNode&gt;</code> children pay only for edges that exist: lighter, unicode-friendly, slower constants. The senior flex: build a trie over the <strong>bits of numbers</strong> — two children per node, 0 and 1, each number a 32-hop path. To maximize XOR against a query, walk down greedily choosing the opposite bit at every level. Same structure, wildly different problem." },
    { type: "callout", variant: "rule", title: "Trie or HashSet? Ask one question", text: "Do you ever query by <strong>prefix</strong>? No — exact membership only — then HashSet: one hash beats m hops. Yes — autocomplete, startsWith counts, wildcard walks, many words searched at once — then trie. The trie's entire edge over hashing is that it physically groups words by prefix." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"autocomplete / typeahead / starts with\"</strong> → Trie",
      "<strong>\"dictionary with '.' wildcard matching\"</strong> → Trie + DFS over all branches at the dot",
      "<strong>\"find many words in one grid at once\"</strong> → Trie + backtracking (Word Search II)",
      "<strong>\"maximum XOR of two numbers\"</strong> → bitwise trie over 32-bit paths"
    ] },
    { type: "check", items: [
      { q: "The trie holds only \"card\". What does search(\"car\") return, and why?", a: "False. The walk c→a→r succeeds because those nodes exist as a prefix of \"card\", but r's <code>isWord</code> flag was never set. Node existence answers startsWith; only the flag answers search." },
      { q: "Why is lookup O(m) even with a million words stored?", a: "You only ever walk the m letters of the query, one O(1) child hop each. Other words live on other branches the walk never looks at. Dictionary size affects memory, never lookup time." },
      { q: "When does a plain HashSet beat a trie?", a: "When every query is exact membership. One hash computation beats m child hops, and a HashSet carries none of the trie's per-node overhead. The trie only wins once prefixes enter the game." },
      { q: "Array children vs HashMap children — what is the actual trade?", a: "Array: O(1) hop by index math, but 26 references per node whether used or not. HashMap: memory proportional to real edges and any alphabet works, but every hop pays hashing overhead. Interviews default to the array for lowercase a–z." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Rebuild the insert walkthrough on paper for \"dog\" and \"door\": draw the shared d–o spine, and mark exactly which nodes carry the isWord flag." },
      { t: "Drill", d: "Implement insert, search, and startsWith from a blank file — the Implement Trie problem is the rite of passage.", href: "#/pattern/tries", link: "Tries" },
      { t: "Interview-ready", d: "Word Search II class: plant a trie inside a backtracking grid walk and prune entire branches the dictionary can't match.", href: "#/pattern/tries", link: "Tries" },
      { t: "Master", d: "Finish the Tries branch on the Pattern map, then do Maximum XOR with a bitwise trie to watch the structure escape strings entirely.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "range-structures",
  order: 16,
  title: "Range Structures",
  hue: "green",
  tagline: "Range queries that survive updates",
  minutes: 13,
  summary: "Prefix sums answer range-sum in O(1) but break the moment the array changes; segment trees and Fenwick trees make both update and query O(log n). When to use which — and when neither.",
  blocks: [
    { type: "p", text: "You hold an array and face two kinds of requests, interleaved: \"sum of elements l through r\" and \"change element i\". Prefix sums answer the first in O(1) — but one update stales every prefix after i, an O(n) rebuild. A <code>segment tree</code> — a tree whose every node stores the sum of one range — rebalances the deal to O(log n) for <strong>both</strong>. When the follow-up to a prefix-sum problem suddenly adds updates, this structure is what the interviewer is fishing for." },
    { type: "callout", variant: "analogy", title: "Budget rollups", text: "Each team's spend rolls up into a department subtotal, departments into the company total. Ask for any slice of the org and finance hands you a few ready-made subtotals instead of re-adding every receipt. One team overspends? Only its chain of subtotals up to the top gets corrected — everyone else's numbers stand." },
    { type: "tree", root: { v: "24", kids: [
      { v: "8", kids: [
        { v: "7", kids: [{ v: "2" }, { v: "5" }] },
        { v: "1" }
      ] },
      { v: "16", kids: [
        { v: "13", kids: [{ v: "4" }, { v: "9" }] },
        { v: "3" }
      ] }
    ] }, caption: "Segment tree over [2, 5, 1, 4, 9, 3]. Each node is the sum of a range: root = [0..5] = 24, its children split that into [0..2] = 8 and [3..5] = 16, down to the leaves — the array itself." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "Despite the picture, a segment tree is usually one flat array using the heap trick: node <code>i</code>'s children live at <code>2i</code> and <code>2i + 1</code> — no node objects, no pointers, about 4n slots for the whole thing. Build is O(n): copy the array into the leaves, then fill each parent from its two children, bottom-up. A point update rewrites one leaf and re-sums the nodes on its root-to-leaf path — the tree is balanced by construction, so that path is O(log n) long no matter what data you feed it." },
    { type: "bigO", rows: [
      ["Prefix-sum query (static array)", "O(1)", "sum[r] − sum[l−1], two lookups"],
      ["Prefix-sum after an update", "O(n)", "every prefix past i is stale — full rebuild"],
      ["Segment tree range query", "O(log n)", "each level contributes at most a few nodes"],
      ["Segment tree point update", "O(log n)", "one root-to-leaf path, re-sum on the way up"],
      ["Fenwick update / prefix query", "O(log n)", "hop between blocks by the lowest set bit"],
      ["Build (either tree)", "O(n)", "each node computed once from its children"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "// tree[node] covers arr[lo..hi]; children live at 2*node and 2*node+1\nint query(int[] t, int node, int lo, int hi, int l, int r) {\n    if (r < lo || hi < l) return 0;           // disjoint: contributes nothing\n    if (l <= lo && hi <= r) return t[node];   // fully covered: take the whole sum\n    int mid = (lo + hi) / 2;                  // partial: split, ask both children\n    return query(t, 2 * node, lo, mid, l, r)\n         + query(t, 2 * node + 1, mid + 1, hi, l, r);\n}\n// update(i, val): walk one root-to-leaf path, re-sum each node on it" },
    { type: "steps", title: "Query sum of [1..4]: take whole nodes, skip the rest", frames: [
      { d: "Query: sum of [1..4]. The root's range [0..5] only partly overlaps it — we can't take 24; descend into both children.", tree: { root: { v: "24", hl: 2, kids: [
        { v: "8", kids: [{ v: "7", kids: [{ v: "2" }, { v: "5" }] }, { v: "1" }] },
        { v: "16", kids: [{ v: "13", kids: [{ v: "4" }, { v: "9" }] }, { v: "3" }] }
      ] } } },
      { d: "Left child [0..2]: partial overlap with [1..4] — index 0 is unwanted — so descend.", tree: { root: { v: "24", hl: 2, kids: [
        { v: "8", hl: 2, kids: [{ v: "7", kids: [{ v: "2" }, { v: "5" }] }, { v: "1" }] },
        { v: "16", kids: [{ v: "13", kids: [{ v: "4" }, { v: "9" }] }, { v: "3" }] }
      ] } } },
      { d: "[0..1] is still partial for the same reason — descend to its leaves.", tree: { root: { v: "24", hl: 2, kids: [
        { v: "8", hl: 2, kids: [{ v: "7", hl: 2, kids: [{ v: "2" }, { v: "5" }] }, { v: "1" }] },
        { v: "16", kids: [{ v: "13", kids: [{ v: "4" }, { v: "9" }] }, { v: "3" }] }
      ] } } },
      { d: "Leaf [0..0] lies outside — rejected, contributes 0. Leaf [1..1] is fully inside: take its 5. Total: 5.", tree: { root: { v: "24", hl: 2, kids: [
        { v: "8", hl: 2, kids: [{ v: "7", hl: 2, kids: [{ v: "2", hl: 2 }, { v: "5", hl: 1 }] }, { v: "1" }] },
        { v: "16", kids: [{ v: "13", kids: [{ v: "4" }, { v: "9" }] }, { v: "3" }] }
      ] } } },
      { d: "Back up a level: [2..2] sits fully inside [1..4] — take its 1 without descending. Total: 6.", tree: { root: { v: "24", hl: 2, kids: [
        { v: "8", hl: 2, kids: [{ v: "7", hl: 2, kids: [{ v: "2", hl: 2 }, { v: "5", hl: 1 }] }, { v: "1", hl: 1 }] },
        { v: "16", kids: [{ v: "13", kids: [{ v: "4" }, { v: "9" }] }, { v: "3" }] }
      ] } } },
      { d: "Now the right child: [3..5] is partial — index 5 is unwanted — so descend.", tree: { root: { v: "24", hl: 2, kids: [
        { v: "8", hl: 2, kids: [{ v: "7", hl: 2, kids: [{ v: "2", hl: 2 }, { v: "5", hl: 1 }] }, { v: "1", hl: 1 }] },
        { v: "16", hl: 2, kids: [{ v: "13", kids: [{ v: "4" }, { v: "9" }] }, { v: "3" }] }
      ] } } },
      { d: "[3..4] fits entirely inside the query: grab its precomputed 13 whole, never touching leaves 4 and 9. Total: 19.", tree: { root: { v: "24", hl: 2, kids: [
        { v: "8", hl: 2, kids: [{ v: "7", hl: 2, kids: [{ v: "2", hl: 2 }, { v: "5", hl: 1 }] }, { v: "1", hl: 1 }] },
        { v: "16", hl: 2, kids: [{ v: "13", hl: 1, kids: [{ v: "4" }, { v: "9" }] }, { v: "3" }] }
      ] } } },
      { d: "Leaf [5..5] is outside — rejected. Answer: 19 = 5 + 1 + 4 + 9, assembled from three taken nodes. That pruning is the O(log n).", tree: { root: { v: "24", hl: 2, kids: [
        { v: "8", hl: 2, kids: [{ v: "7", hl: 2, kids: [{ v: "2", hl: 2 }, { v: "5", hl: 1 }] }, { v: "1", hl: 1 }] },
        { v: "16", hl: 2, kids: [{ v: "13", hl: 1, kids: [{ v: "4" }, { v: "9" }] }, { v: "3", hl: 2 }] }
      ] } } }
    ] },
    { type: "h3", text: "The Fenwick tree: same power, one flat array" },
    { type: "p", text: "A <code>Fenwick tree</code> (binary indexed tree, BIT) packs point-update and prefix-sum into a single flat 1-indexed array and about ten lines of code. Its magic is <code>i &amp; -i</code> — the lowest set bit of i — which tells slot i how large a block of the array it summarizes; updates and queries hop between blocks by adding or subtracting it. Roughly half the memory and half the code of a segment tree. The trade: it natively handles prefix-style, invertible sums — a range sum is <code>prefix(r) − prefix(l−1)</code> — while arbitrary range min/max stays segment-tree territory." },
    { type: "callout", variant: "pitfall", title: "Two intervals in flight — don't cross them", text: "Every segment-tree call juggles the node's range <code>[lo..hi]</code> and the query's <code>[l..r]</code>. Writing <code>l &lt;= lo</code> where you meant <code>lo &lt;= l</code> compiles, runs, and returns confident nonsense — keep \"query swallows node\" (<code>l &lt;= lo &amp;&amp; hi &lt;= r</code>) taped to your monitor. Fenwick has its own trap: it is 1-indexed by convention, so feeding it 0-based indices without the +1 shift silently corrupts the block arithmetic." },
    { type: "callout", variant: "pro", title: "The three power-ups seniors name-drop", text: "<strong>Lazy propagation</strong> extends segment trees to range updates — \"add 5 to all of [l..r]\" — by parking pending changes at high nodes and pushing them down only when a query actually descends; mention it, implement it only if forced. <strong>Sqrt decomposition</strong> — √n blocks with per-block sums — gives O(√n) everything in a fraction of the code: a legitimate fallback under time pressure. And when values span billions but only thousands appear, <strong>coordinate compression</strong> (sort, dedupe, rank) shrinks them to fit a Fenwick — the standard companion in counting problems like Count of Smaller Numbers After Self." },
    { type: "callout", variant: "rule", title: "Pick by workload, not by coolness", text: "Array never changes — plain prefix sums: O(1) queries, ten lines, done; a segment tree there is over-engineering. Point updates + range sums — Fenwick. Range min/max/gcd, or range updates — segment tree (with lazy propagation for the latter). Huge sparse values — add coordinate compression." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"range sum queries, immutable array\"</strong> → Prefix Sums — no tree needed",
      "<strong>\"range sums with updates in between\"</strong> → Fenwick tree or segment tree",
      "<strong>\"count of smaller after self / count inversions\"</strong> → Fenwick over values + coordinate compression",
      "<strong>\"range minimum / maximum, array changes\"</strong> → segment tree",
      "<strong>\"add x to every element in [l..r]\"</strong> → lazy propagation — or a difference array if all updates precede all queries"
    ] },
    { type: "check", items: [
      { q: "Why exactly does one update cost O(n) with prefix sums?", a: "prefix[j] includes a[i] for every j ≥ i, so changing a[i] stales the entire suffix of the prefix array. With updates and queries interleaved, each update forces an O(n) rebuild — the exact problem these trees exist to fix." },
      { q: "In the walkthrough, why take node 13 instead of leaves 4 and 9?", a: "Its range [3..4] sits fully inside the query [1..4], so its precomputed sum answers for the whole subtree and recursion stops there. Stopping at covered nodes is precisely where the O(log n) comes from." },
      { q: "What does i &amp; -i compute, and what does Fenwick use it for?", a: "The lowest set bit — for i = 12 (binary 1100) it is 4 (binary 100). Slot i summarizes a block of that many elements ending at i; adding or subtracting it hops between exactly the blocks an update or prefix query must touch." },
      { q: "The interviewer confirms the array is never modified. What do you build?", a: "Plain prefix sums. O(1) query beats O(log n), the code is a tenth the size, and reaching for a segment tree anyway signals you match structures to habits, not workloads." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Replay the query walkthrough, classifying every node out loud — disjoint, fully covered, or partial — until the three-case split is automatic." },
      { t: "Drill", d: "Master the read-only cousin first: running totals and sum[r] − sum[l−1] are the mental model everything here upgrades.", href: "#/pattern/prefix-sums", link: "Prefix Sums" },
      { t: "Interview-ready", d: "Take the Range Structures branch on the Pattern map: write a Fenwick from memory, then a segment tree with point update and range query.", href: "#/patterns/map", link: "Pattern map" },
      { t: "Master", d: "Finish the branch with the heavy hitters — Count of Smaller Numbers After Self via Fenwick plus coordinate compression, then a lazy-propagation read-through.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});
