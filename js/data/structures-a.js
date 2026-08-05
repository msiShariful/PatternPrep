/* Data Structures guides — part A: Array (the exemplar all guides follow). */
window.STRUCTURE_TOPICS = window.STRUCTURE_TOPICS || [];

window.STRUCTURE_TOPICS.push({
  id: "array",
  order: 1,
  title: "Array",
  hue: "indigo",
  tagline: "Contiguous memory, instant index math",
  minutes: 10,
  summary: "One solid block of memory where <code>arr[i]</code> is a multiplication away. Why access is free, why inserting isn't, and why hardware loves arrays more than any other structure.",
  blocks: [
    { type: "p", text: "An array is one unbroken block of memory split into equal-width slots. That single fact explains everything about it: reading any slot is instant, growing it means relocating, and squeezing something into the middle means physically pushing neighbors aside. Roughly half of all interview problems start life as an array, so the patterns built on it — two pointers, sliding window, prefix sums, binary search — pay rent forever." },
    { type: "callout", variant: "analogy", title: "A street of numbered mailboxes", text: "The postman never searches for box 7 — it is exactly seven doors from the start of the street. Jump-straight-there addressing is the array's superpower, and every array trick is a way of exploiting it." },
    { type: "cells", title: "Anatomy", index: true, cells: [{ v: "7" }, { v: "2" }, { v: "9", hl: 1 }, { v: "4" }, { v: "1" }], pointers: [{ i: 2, t: "arr[2]" }], caption: "arr[2] = value at address base + 2 × slot-width. No walking, no searching — arithmetic." },
    { type: "h3", text: "How it lives in memory" },
    { type: "p", text: "Every slot has the same width (a Java <code>int</code> is 4 bytes), so the address of slot <code>i</code> is <code>base + i × width</code> — one multiply and one add, regardless of whether the array holds ten items or ten million. The price of that contract: the block is fixed-size. Java arrays never grow; <code>ArrayList</code> fakes growth by allocating a bigger block and copying everything over when the old one fills up." },
    { type: "bigO", rows: [
      ["Read / write by index", "O(1)", "address = base + i × width"],
      ["Append at end (amortized)", "O(1)", "occasional resize-and-copy, averaged out"],
      ["Insert / delete in the middle", "O(n)", "everything after the slot shifts"],
      ["Search, unsorted", "O(n)", "no order — must check every slot"],
      ["Search, sorted", "O(log n)", "binary search halves the field each step"]
    ] },
    { type: "h3", text: "The operations that matter" },
    { type: "code", lang: "java", text: "int[] a = new int[5];          // fixed capacity, zero-filled\na[0] = 7;                      // O(1) write\nint x = a[2];                  // O(1) read\n\n// \"growing\" = allocate bigger + copy — the hidden cost inside ArrayList.add\nint[] bigger = new int[a.length * 2];\nSystem.arraycopy(a, 0, bigger, 0, a.length);" },
    { type: "steps", title: "Watch the O(n): insert 9 at index 1", frames: [
      { d: "Four values, capacity five — one free slot at the end.", cells: { index: true, cells: [{ v: "3" }, { v: "7" }, { v: "12" }, { v: "20" }, { v: "·", dim: true }] } },
      { d: "9 belongs at index 1 — but the slot is occupied. Everything from index 1 on must move right.", cells: { index: true, cells: [{ v: "3" }, { v: "7", hl: 2 }, { v: "12", hl: 2 }, { v: "20", hl: 2 }, { v: "·", dim: true }], pointers: [{ i: 1, t: "target" }] } },
      { d: "Shift right-to-left so nothing is overwritten: 20 moves into the free slot.", cells: { index: true, cells: [{ v: "3" }, { v: "7", hl: 2 }, { v: "12", hl: 2 }, { v: "·", dim: true }, { v: "20", hl: 1 }] } },
      { d: "12 moves right.", cells: { index: true, cells: [{ v: "3" }, { v: "7", hl: 2 }, { v: "·", dim: true }, { v: "12", hl: 1 }, { v: "20" }] } },
      { d: "7 moves right. Index 1 is finally free.", cells: { index: true, cells: [{ v: "3" }, { v: "·", dim: true }, { v: "7", hl: 1 }, { v: "12" }, { v: "20" }] } },
      { d: "Write 9. One insert cost three shifts — near the front of a big array that's n shifts. That is the O(n).", cells: { index: true, cells: [{ v: "3" }, { v: "9", hl: 1 }, { v: "7" }, { v: "12" }, { v: "20" }], pointers: [{ i: 1, t: "inserted" }] } }
    ] },
    { type: "callout", variant: "pitfall", title: "Off-by-one lives at the boundaries", text: "<code>length</code> is 5 but the last index is 4. Nearly every array bug is a boundary bug: <code>&lt;</code> vs <code>&lt;=</code> in the loop guard, <code>mid</code> computed as <code>(lo + hi) / 2</code> overflowing, or reading <code>a[i + 1]</code> on the final lap. Check the first index, the last index, and the empty array before calling anything done." },
    { type: "callout", variant: "pro", title: "Arrays win on hardware, not just on Big-O", text: "Contiguous memory means one cache line brings in several neighbors, and a predictable stride lets the prefetcher run ahead of you. This is why <code>ArrayList</code> outruns <code>LinkedList</code> even at linked-list-shaped jobs, and why 'copy everything into an array first' is often the fastest real-world plan despite the extra O(n)." },
    { type: "callout", variant: "rule", title: "Hear the word, guess the cost", text: "\"By index\" → O(1). \"Insert / delete inside\" → O(n) shift. \"Sorted\" → O(log n) is on the table. If a plan needs repeated middle-inserts, the array is the wrong tool — redesign toward append-then-sort, or switch structures." },
    { type: "h3", text: "Spot it in the wild" },
    { type: "list", items: [
      "<strong>\"contiguous subarray / substring …\"</strong> → Sliding Window",
      "<strong>\"sorted array + find / pair to target\"</strong> → Binary Search or Two Pointers",
      "<strong>\"running total, range sum, count of subarrays\"</strong> → Prefix Sums",
      "<strong>\"in place, O(1) extra space\"</strong> → a writer pointer trailing a reader pointer"
    ] },
    { type: "check", items: [
      { q: "Why is reading <code>arr[500000]</code> exactly as fast as <code>arr[0]</code>?", a: "The address is computed, not found: <code>base + 500000 × width</code>. One multiply, one add, one load — no walking through elements." },
      { q: "Append is \"O(1) amortized\". What is the amortized hiding?", a: "The occasional full resize: when capacity runs out, a bigger block is allocated and all n elements are copied. Spread across many appends the average stays O(1)." },
      { q: "Insert at the front of an n-element array — how many moves?", a: "n. Every element shifts one slot right. A workload that keeps inserting at the front wants a deque, not an array." },
      { q: "When does a linked list genuinely beat an array?", a: "Splicing at a node you already hold a reference to — O(1) rewire vs O(n) shift. But if you must search for the node first, the walk costs O(n) anyway and cache locality hands the win back to arrays." }
    ] },
    { type: "ladder", steps: [
      { t: "Learn", d: "Re-read the anatomy and memory model until the address math feels obvious, then step through the insert walkthrough once more without reading the captions." },
      { t: "Drill", d: "Converging and chasing pointers over one array — the gateway drill for every in-place trick.", href: "#/pattern/two-pointers", link: "Two Pointers" },
      { t: "Interview-ready", d: "Own the three array workhorses: Sliding Window for contiguous ranges, Prefix Sums for instant range math, Binary Search for sorted anything.", href: "#/pattern/sliding-window", link: "Sliding Window" },
      { t: "Master", d: "Open the Array branch on the Pattern map and clear all 20 techniques, ending with Trapping Rain Water in the Two Pointers set.", href: "#/patterns/map", link: "Pattern map" }
    ] }
  ]
});
