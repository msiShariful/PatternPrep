/* Data Structures guides — part B: String, Hash Map, Linked List. */
window.STRUCTURE_TOPICS = window.STRUCTURE_TOPICS || [];

window.STRUCTURE_TOPICS.push({
  id: "string",
  order: 2,
  title: "String",
  hue: "magenta",
  tagline: "An array of characters that refuses to change",
  minutes: 10,
  summary: "Under the hood a <code>String</code> is a read-only character array: every \"edit\" is secretly a full copy. Why that makes <code>+=</code> in a loop a trap, what the string pool is, and when <code>length()</code> lies.",
  blocks: [
    { type: "p", text: "A string looks like an array of characters — and in Java it mostly is one — with one radical rule bolted on: it can never change. Every uppercase, trim, and concatenation quietly manufactures a brand-new string and copies the characters over. That one rule explains the string pool, the <code>+=</code> performance trap, and why <code>StringBuilder</code> exists. Interviewers love strings because they are arrays with extra gotchas: every pointer and window trick still applies, plus a layer of rules that separates people who know the model from people who memorized methods." },
    { type: "callout", variant: "analogy", title: "A word carved in stone", text: "You never edit a carved slab — you commission a new one and copy the letters across, changing what you wanted changed. That is every String method that \"modifies\": a fresh slab, full copy, old one abandoned. <code>StringBuilder</code> is the sketchpad you scribble on freely before committing to stone." },
    { type: "cells", title: "Anatomy", index: true, cells: [{ v: "H" }, { v: "E", hl: 1 }, { v: "L" }, { v: "L" }, { v: "O" }], pointers: [{ i: 1, t: "charAt(1)" }], caption: "charAt(1) is plain array index math on the backing array — O(1). length() returns a stored field (5); it never counts." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "A Java <code>String</code> wraps a private, <code>final</code> array of characters (a compact <code>byte[]</code> since Java 9) plus a cached <code>hashCode</code>. Final means no method can touch the contents — <code>toUpperCase()</code>, <code>trim()</code>, and <code>substring()</code> all allocate a fresh string and copy into it. In exchange, the JVM keeps one shared copy of each literal in the <strong>string pool</strong> (two <code>\"cat\"</code> literals point at the same object), threads can share strings without locks, and the hash is computed once and trusted forever — the reason String is the default hash-map key." },
    { type: "bigO", rows: [
      ["charAt(i) / length()", "O(1)", "index math plus a stored count"],
      ["equals / compare", "O(n)", "character by character until a mismatch"],
      ["concat with + (once)", "O(n)", "new string; both halves copied in"],
      ["+= inside a loop", "O(n²)", "every pass recopies all characters so far"],
      ["substring(i, j)", "O(n)", "copies the slice (since Java 7)"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "String s = \"racecar\";\nchar c = s.charAt(3);            // O(1) — array read underneath\nint n = s.length();              // O(1) — stored, never counted\n\ns.toUpperCase();                 // does NOT change s — nothing can\ns = s.toUpperCase();             // a \"change\" is a new string + reassign\n\nStringBuilder sb = new StringBuilder();   // the mutable workspace\nfor (int i = n - 1; i >= 0; i--) {\n    sb.append(s.charAt(i));      // amortized O(1) per append\n}\nString reversed = sb.toString(); // one final O(n) copy out" },
    { type: "steps", title: "Watch two pointers prove RACECAR is a palindrome", frames: [
      { d: "Two pointers start at opposite ends. If the word is a palindrome, every pair they visit must match.", cells: { index: true, cells: [{ v: "R" }, { v: "A" }, { v: "C" }, { v: "E" }, { v: "C" }, { v: "A" }, { v: "R" }], pointers: [{ i: 0, t: "left" }, { i: 6, t: "right" }] } },
      { d: "Compare charAt(0) vs charAt(6): R vs R. Match — the outermost pair agrees, keep going.", cells: { index: true, cells: [{ v: "R", hl: 1 }, { v: "A" }, { v: "C" }, { v: "E" }, { v: "C" }, { v: "A" }, { v: "R", hl: 1 }], pointers: [{ i: 0, t: "left" }, { i: 6, t: "right" }] } },
      { d: "Both pointers step inward: A vs A. Match. The settled outer pair is retired — never looked at again.", cells: { index: true, cells: [{ v: "R", dim: true }, { v: "A", hl: 1 }, { v: "C" }, { v: "E" }, { v: "C" }, { v: "A", hl: 1 }, { v: "R", dim: true }], pointers: [{ i: 1, t: "left" }, { i: 5, t: "right" }] } },
      { d: "C vs C. Match. Each step compares one pair and retires two characters — the whole check is about n/2 comparisons.", cells: { index: true, cells: [{ v: "R", dim: true }, { v: "A", dim: true }, { v: "C", hl: 1 }, { v: "E" }, { v: "C", hl: 1 }, { v: "A", dim: true }, { v: "R", dim: true }], pointers: [{ i: 2, t: "left" }, { i: 4, t: "right" }] } },
      { d: "The pointers meet at E. A lone middle character has no partner to disagree with — nothing to check.", cells: { index: true, cells: [{ v: "R", dim: true }, { v: "A", dim: true }, { v: "C", dim: true }, { v: "E", hl: 2 }, { v: "C", dim: true }, { v: "A", dim: true }, { v: "R", dim: true }], pointers: [{ i: 3, t: "left = right" }] } },
      { d: "left ≥ right: the pointers met, every pair matched. RACECAR is a palindrome — O(n) time, O(1) space, no reversed copy built.", cells: { index: true, cells: [{ v: "R" }, { v: "A" }, { v: "C" }, { v: "E" }, { v: "C" }, { v: "A" }, { v: "R" }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "The quiet O(n²): += in a loop", text: "Because strings can't change, <code>s += c</code> allocates a brand-new string and copies everything built so far — 1 + 2 + … + n copies, roughly n²/2 work. Building a 100,000-character string that way costs billions of character copies; <code>StringBuilder.append</code> does the same job in one linear pass. The loop looks innocent, which is exactly why interviewers watch for it." },
    { type: "callout", variant: "pro", title: "The pool, the builder, and the lie in length()", text: "Three things seniors know cold. The JVM <strong>interns</strong> literals: identical literals share one pooled object, so <code>==</code> sometimes \"works\" — until a runtime-built string arrives and it doesn't; only <code>equals()</code> compares characters. <code>StringBuilder</code> grows by doubling its buffer, so n appends cost amortized O(n) total — same resize trick as ArrayList. And <code>length()</code> counts UTF-16 <strong>code units</strong>, not characters: an emoji beyond the base plane is stored as a surrogate pair, so <code>\"🎉\".length()</code> is 2. <code>codePointCount</code> tells the truth." },
    { type: "callout", variant: "rule", title: "Need to mutate? Convert first", text: "In-place trickery → <code>toCharArray()</code>, do the two-pointer work on the array, build back once. Assembling output → <code>StringBuilder</code>, one <code>toString()</code> at the end. Either way you pay one O(n) copy in and one out, and everything in between is cheap." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"longest / shortest substring that …\"</strong> → Sliding Window over the characters",
      "<strong>\"palindrome, reverse, compare both ends\"</strong> → Two Pointers converging on a char array",
      "<strong>\"anagram, permutation, character counts\"</strong> → a frequency map, or <code>int[26]</code> for lowercase letters",
      "<strong>\"build / transform a string piece by piece\"</strong> → StringBuilder — never += in a loop"
    ] },
    { type: "check", items: [
      { q: "Why is <code>s += c</code> in a loop O(n²) when a single <code>+</code> is only O(n)?", a: "Immutability: each += allocates a fresh string and recopies everything built so far. 1 + 2 + … + n copies is about n²/2. StringBuilder appends into a growing buffer instead — amortized O(1) each." },
      { q: "What does immutability actually buy Java?", a: "Safe sharing. Literals live once in the string pool, threads pass strings around without locks, and the hash is computed once and cached — which is why String is the default hash-map key." },
      { q: "Why can <code>\"🎉\".length()</code> return 2?", a: "length() counts UTF-16 code units, not characters. Characters beyond the base plane are stored as a surrogate pair — two units for one visible symbol. Use codePointCount for the human answer." },
      { q: "How many comparisons does the two-pointer palindrome check make on length n?", a: "About n/2 — each step compares one pair and retires two characters. O(n) time, O(1) space, and no reversed copy is ever built." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Re-read the immutability model, then replay the palindrome stepper predicting each comparison before revealing the caption." },
      { t: "Drill", d: "Converging pointers on strings — palindromes, reversals, and in-place tricks on char arrays.", href: "#/pattern/two-pointers", link: "Two Pointers" },
      { t: "Interview-ready", d: "The substring workhorse: longest/shortest-substring questions all reduce to a window plus a frequency map.", href: "#/pattern/sliding-window", link: "Sliding Window" },
      { t: "Master", d: "Open the Pattern map and clear the string-heavy sets — windows first, then the anagram and palindrome families.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "hash-map",
  order: 3,
  title: "Hash Map",
  hue: "blue",
  tagline: "The key computes its own address",
  minutes: 12,
  summary: "An array in disguise: the key is hashed straight to a bucket index, so <code>put</code> and <code>get</code> average O(1). What collisions, the 0.75 load factor, and the <code>hashCode</code>/<code>equals</code> contract really mean.",
  blocks: [
    { type: "p", text: "A hash map answers one question at superhuman speed: what value belongs to this key? It does it by cheating — instead of searching for the key, it <strong>computes</strong> where the key must live, turning lookup into array index math. That is why <code>put</code>, <code>get</code>, and <code>remove</code> all average O(1), and why this is the single most-used structure in interviews: nearly every \"can you do it faster?\" follow-up is an invitation to trade some memory for a hash map." },
    { type: "callout", variant: "analogy", title: "A coat check with math instead of memory", text: "The attendant never searches the racks. Your name is crunched into a ticket number, and that number IS the rack position — walk straight there. Occasionally two coats share one hook (a collision); the attendant just checks the couple of tags hanging on that hook. Still nothing like searching the whole room." },
    { type: "cells", title: "Anatomy — the bucket array", index: true, cells: [{ v: "·", dim: true }, { v: "to" }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "cat", hl: 1 }, { v: "·", dim: true }, { v: "sun" }, { v: "·", dim: true }], pointers: [{ i: 4, t: "hash % 8" }], caption: "Each bucket is one array slot. \"cat\" never searches for its home — its hash, mod the table size, is the address." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "Inside every <code>HashMap</code> is a plain array of <strong>buckets</strong> (slots). On <code>put</code>, the key runs through <code>hashCode()</code> — every Java object can boil itself down to an int — and that int, mod the table length, picks the bucket. The entry object stores the hash, key, value, and a <code>next</code> link, because two different keys can land on the same index: a <strong>collision</strong>. Colliding entries simply chain behind one another in a mini linked list. To keep chains short, the table doubles in size once it is 75% full — the <strong>load factor</strong>." },
    { type: "bigO", rows: [
      ["get / put / remove (average)", "O(1)", "hash → bucket index, straight to the slot"],
      ["Worst-case bucket (Java 8+)", "O(log n)", "a long chain is converted to a red-black tree"],
      ["Resize / rehash", "O(n)", "table doubles; every entry is re-placed"],
      ["containsValue", "O(n)", "values aren't indexed — full scan"],
      ["Iterate all entries", "O(n)", "plus a visit to every bucket, full or not"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "Map<String, Integer> freq = new HashMap<>();\nfreq.put(\"cat\", 3);                      // hash → bucket → store, O(1) avg\nfreq.put(\"cat\", 4);                      // same key: value replaced, size stays 1\n\nint seen = freq.getOrDefault(\"art\", 0);  // read with a fallback — no null check\nfreq.put(\"art\", seen + 1);               // the frequency-counting idiom\n\nfor (Map.Entry<String, Integer> e : freq.entrySet()) {\n    // iteration order is NOT insertion order — never rely on it\n    System.out.println(e.getKey() + \" = \" + e.getValue());\n}" },
    { type: "steps", title: "Watch a collision: put(\"cat\", 3), then put(\"art\", 7)", frames: [
      { d: "An empty HashMap: an array of 8 buckets. Every key's job is to become an index into this array.", cells: { index: true, cells: [{ v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }] } },
      { d: "put(\"cat\", 3): hashCode(\"cat\") → 101 (illustrative). 101 % 8 = 5 — the key maps itself to bucket 5 with pure index math.", cells: { index: true, cells: [{ v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", hl: 2 }, { v: "·", dim: true }, { v: "·", dim: true }], pointers: [{ i: 5, t: "101 % 8" }] } },
      { d: "The entry — key \"cat\", value 3, and the hash itself — is written into bucket 5. One hash, one mod, one write: O(1).", cells: { index: true, cells: [{ v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "cat", hl: 1 }, { v: "·", dim: true }, { v: "·", dim: true }], pointers: [{ i: 5, t: "cat→3" }] } },
      { d: "put(\"art\", 7): hashCode(\"art\") → 61. 61 % 8 = 5. Occupied! Two different keys, one bucket — a collision.", cells: { index: true, cells: [{ v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "cat", hl: 2 }, { v: "·", dim: true }, { v: "·", dim: true }], pointers: [{ i: 5, t: "61 % 8" }] } },
      { d: "\"art\" chains behind \"cat\" — bucket 5 now holds a two-entry linked list. Collisions don't break the map; they just queue up.", cells: { index: true, cells: [{ v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "cat", hl: 1 }, { v: "·", dim: true }, { v: "·", dim: true }], pointers: [{ i: 5, t: "cat→art" }] } },
      { d: "get(\"art\") retraces the path: hash → 61 % 8 → bucket 5 → walk the short chain, comparing keys with equals() until one matches.", cells: { index: true, cells: [{ v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "·", dim: true }, { v: "cat", hl: 2 }, { v: "·", dim: true }, { v: "·", dim: true }], pointers: [{ i: 5, t: "get" }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "Break the contract, lose your data", text: "Two rules keep a hash map honest: equal objects must have equal hash codes (override <code>equals</code> and <code>hashCode</code> <strong>together</strong>), and a key must never change after insertion. Mutate a key and its hashCode shifts — <code>get()</code> now computes a path to a different bucket while the entry sits filed under the old one: visible in iteration, unreachable by lookup. This is why keys should be immutable types like <code>String</code> and <code>Integer</code>." },
    { type: "callout", variant: "pro", title: "What 0.75 buys, and when chains become trees", text: "At 75% full the table doubles and every entry is rehashed into new positions — an O(n) spike amortized away across inserts, but avoidable: pre-size with <code>new HashMap&lt;&gt;(expected * 4 / 3 + 1)</code> and it never resizes. And since Java 8, a single bucket whose chain reaches 8 entries is converted into a red-black tree, capping the worst bucket at O(log n) — added specifically to defuse hash-flooding attacks, where an adversary sends thousands of keys crafted to collide." },
    { type: "callout", variant: "rule", title: "Pick your map in one breath", text: "<code>HashMap</code>: fastest, no order — the default. <code>LinkedHashMap</code>: remembers insertion (or access) order — the backbone of an LRU cache. <code>TreeMap</code>: keys kept sorted, O(log n), buys range queries like <code>floorKey</code>/<code>ceilingKey</code>. Need nothing special? HashMap." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"count occurrences / frequency of …\"</strong> → map from item to count",
      "<strong>\"have we seen this before? / contains duplicate\"</strong> → HashSet membership test",
      "<strong>\"pair that sums to target\"</strong> → one-pass map of value → index (Two Sum)",
      "<strong>\"group items sharing a property\"</strong> → canonical key → list of members (Group Anagrams)",
      "<strong>\"can you do it in O(n)?\"</strong> → usually: trade memory for a hash map"
    ] },
    { type: "check", items: [
      { q: "Where does the O(1) actually come from?", a: "The key's hash, mod the table size, is an array index — lookup is address math, not search. The bucket array hiding inside the map does the real work." },
      { q: "What happens when the map crosses its load factor (0.75)?", a: "Capacity doubles and every entry is rehashed into its new bucket — an O(n) spike, amortized to O(1) across inserts. Pre-sizing the map skips the spikes entirely." },
      { q: "You mutate an object after using it as a key. What breaks?", a: "Its hashCode changes, so get() walks to a different bucket — but the entry is still filed under the old hash. It appears during iteration yet get() returns null. Keys must be immutable." },
      { q: "When do TreeMap or LinkedHashMap beat HashMap?", a: "TreeMap when you need sorted keys or range queries (floorKey/ceilingKey) and accept O(log n). LinkedHashMap when iteration must follow insertion or access order — the core of an LRU cache. Otherwise, HashMap." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Replay the collision stepper until hash → mod → bucket → chain feels mechanical, then explain the resize story out loud from memory." },
      { t: "Drill", d: "Frequency-map windows: the map counts what's inside the window while two pointers slide it.", href: "#/pattern/sliding-window", link: "Sliding Window" },
      { t: "Interview-ready", d: "Hash + heap combos: count with a map, rank with a heap — the top-k-frequent family.", href: "#/pattern/heaps-top-k", link: "Heaps / Top-K" },
      { t: "Master", d: "Open the Pattern map and clear every set that leans on a map — Two Sum through Group Anagrams to LRU cache.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});

window.STRUCTURE_TOPICS.push({
  id: "linked-list",
  order: 6,
  title: "Linked List",
  hue: "amber",
  tagline: "Scattered nodes, one-pointer surgery",
  minutes: 10,
  summary: "Nodes anywhere on the heap, tied together by <code>next</code> pointers: O(1) splicing where an array would shift everything — paid for with O(n) access and a cache-hostile memory layout.",
  blocks: [
    { type: "p", text: "A linked list abandons the array's one big block: each element becomes a little node object floating anywhere on the heap, holding a value and a pointer to the next node. Give up contiguous memory and you give up O(1) indexing — but you gain O(1) <strong>surgery</strong>: insert or remove a node by redirecting a single pointer, with no shifting. Interviews use linked lists to test one skill above all: can you rewire pointers without losing the rest of the list off the end of a cut wire?" },
    { type: "callout", variant: "analogy", title: "A scavenger hunt", text: "Each clue tells you only where the next clue is. You cannot jump to clue 5 — you must follow clues 1 through 4. But inserting a new clue into the middle of the hunt is trivial: rewrite one clue to point at the newcomer, and point the newcomer at what came next. Nobody else's clue changes." },
    { type: "cells", title: "Anatomy", arrows: true, cells: [{ v: "7" }, { v: "3", hl: 1 }, { v: "9" }], pointers: [{ i: 0, t: "head" }, { i: 2, t: "next = null" }], caption: "Each node holds a value plus a next pointer (the arrow). The last node's next is null — end of the chain. The nodes themselves can live anywhere on the heap." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "Each node is its own heap allocation: a value plus a <code>next</code> reference (a <strong>doubly linked</strong> list adds <code>prev</code>, letting you walk both ways). There is no capacity and no resizing — the list grows one node at a time — but every element pays overhead: with an object header and a pointer, an <code>int</code> that costs 4 bytes in an array costs roughly 24 in a list. And because the allocator drops nodes wherever it likes, neighbors in the list are usually strangers in memory — the root of the performance story below." },
    { type: "bigO", rows: [
      ["Access by index", "O(n)", "no address math — walk i pointers from head"],
      ["Search by value", "O(n)", "follow the chain one node at a time"],
      ["Insert / delete at head", "O(1)", "rewire one pointer, move head"],
      ["Insert / delete after a held node", "O(1)", "one assignment — nothing shifts"],
      ["Delete by value", "O(n)", "the rewire is free; finding the predecessor isn't"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "class ListNode {\n    int val;\n    ListNode next;                   // each node knows only its successor\n    ListNode(int v) { val = v; }\n}\n\nListNode head = new ListNode(3);     // 3\nhead.next = new ListNode(7);         // 3 → 7\n\nListNode n = new ListNode(1);        // O(1) insert at the front:\nn.next = head;                       //   new node points at the old head,\nhead = n;                            //   and head moves. No shifting, ever." },
    { type: "steps", title: "Watch the O(1): delete C by rewiring one pointer", frames: [
      { d: "Five nodes wired left to right. Goal: remove C. An array would shift D and E leftward — here we will just redirect one pointer.", cells: { arrows: true, cells: [{ v: "A" }, { v: "B" }, { v: "C" }, { v: "D" }, { v: "E" }], pointers: [{ i: 0, t: "head" }, { i: 2, t: "delete" }] } },
      { d: "Only C's predecessor holds a link into C, so walk cur from the head. No index math on a list — this walk is the O(n) part.", cells: { arrows: true, cells: [{ v: "A", hl: 2 }, { v: "B" }, { v: "C" }, { v: "D" }, { v: "E" }], pointers: [{ i: 0, t: "cur" }] } },
      { d: "cur steps to B and stops: B.next is the wire we need to move.", cells: { arrows: true, cells: [{ v: "A" }, { v: "B", hl: 2 }, { v: "C" }, { v: "D" }, { v: "E" }], pointers: [{ i: 1, t: "cur" }] } },
      { d: "One assignment — cur.next = cur.next.next. B's wire now bypasses C entirely and lands on D.", cells: { arrows: true, cells: [{ v: "A" }, { v: "B", hl: 1 }, { v: "C", hl: 2 }, { v: "D", hl: 1 }, { v: "E" }], pointers: [{ i: 1, t: "cur" }, { i: 3, t: "cur.next" }] } },
      { d: "Nothing points at C anymore. Traversal now reads A → B → D → E — and D and E never moved.", cells: { arrows: true, cells: [{ v: "A" }, { v: "B" }, { v: "C", dim: true }, { v: "D" }, { v: "E" }] } },
      { d: "The garbage collector reclaims C. The rewire itself was O(1); finding B was the O(n). Already hold the predecessor? Deletion is free.", cells: { arrows: true, cells: [{ v: "A" }, { v: "B" }, { v: "D" }, { v: "E" }], pointers: [{ i: 0, t: "head" }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "Cut the wire, drop the tail", text: "Overwrite a <code>next</code> before saving what it pointed to and everything downstream is gone — unreachable, garbage-collected out from under you. In any rewiring loop (reversal especially), stash <code>node.next</code> in a temp <strong>before</strong> redirecting it. Then check the boundary trio every time: empty list, operating on the head, and the tail's <code>null</code>." },
    { type: "callout", variant: "pro", title: "Big-O says list; the cache says array", text: "Every <code>.next</code> is a jump to a random heap address, and each jump risks a cache miss — while an array streams through prefetched cache lines. That is why <code>ArrayList</code> beats <code>java.util.LinkedList</code> at almost everything in practice, and why LinkedList (which is really a <code>Deque</code>) is almost never the right List. The genuine win is O(1) splice <strong>when something hands you the node directly</strong> — the classic being an LRU cache, where a HashMap points straight at nodes in a doubly linked list: O(1) lookup, O(1) move-to-front, O(1) evict." },
    { type: "callout", variant: "rule", title: "Start with a dummy head", text: "Allocate a throwaway <code>dummy</code> node, set <code>dummy.next = head</code>, do all your work from <code>dummy</code>, and return <code>dummy.next</code>. Now the real head is just another node with a predecessor — deleting or inserting at position 0 uses the same code path as anywhere else, and a whole class of special cases evaporates." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"detect a cycle / find the middle in one pass\"</strong> → Fast & Slow Pointers",
      "<strong>\"reverse the list (or in groups of k)\"</strong> → the prev / cur / next rewiring dance",
      "<strong>\"merge two (or k) sorted lists\"</strong> → dummy head + compare fronts (a heap for k)",
      "<strong>\"O(1) insert, delete, and lookup — LRU\"</strong> → hash map + doubly linked list"
    ] },
    { type: "check", items: [
      { q: "Why is reading element i O(1) in an array but O(n) in a linked list?", a: "Arrays compute the address: base + i × width. A list's nodes are scattered across the heap, so the only route to element i is following i next pointers, one hop at a time." },
      { q: "Deletion is advertised as O(1) — what's the fine print?", a: "The rewire is one assignment, but only if you already hold the predecessor. Finding it costs O(n). Truly-O(1) deletion needs something handing you the node directly — like the hash map in an LRU cache." },
      { q: "Why does ArrayList beat LinkedList in practice, even at inserts?", a: "Cache locality. Array elements arrive in prefetched cache lines; every .next hop is a potential cache miss at a random address. Shifting contiguous memory is cheaper than pointer-chasing to the position first." },
      { q: "What does a dummy head buy you?", a: "The real head stops being a special case: insert and delete at position 0 use the same predecessor-rewire code as everywhere else. Set dummy.next = head, work from dummy, return dummy.next." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Re-run the delete stepper, narrating which pointer changes in each frame before reading the caption." },
      { t: "Drill", d: "Cycle detection and middle-finding — the tortoise-and-hare drills that build pointer confidence.", href: "#/pattern/fast-slow-pointers", link: "Fast & Slow Pointers" },
      { t: "Interview-ready", d: "The three-pointer dance (prev, cur, next), whole-list and in groups — the most-asked list question family.", href: "#/pattern/linked-list-reversal", link: "Linked List Reversal" },
      { t: "Master", d: "Clear the linked-list branch on the Pattern map, finishing with LRU cache — where the list finally meets the hash map.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});
