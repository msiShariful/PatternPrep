/* PatternPrep data — the Pattern Atlas taxonomy (mind map on #/patterns).
   Adapted from the "DSA Patterns" mind map by CodeWithNishchal (whimsical.com).
   Node: { t, cat?, kids? } — `cat` links the node to a problem-bank category id
   (must resolve; checked by the data-integrity script). Branch nodes also carry
   `hue`, one of the tonal families defined in css/style.css. */
window.PATTERN_MAP = {
  credit: "Taxonomy adapted from CodeWithNishchal’s DSA Patterns mind map",
  branches: [

    { t: "Array", hue: "indigo", kids: [
      { t: "Two Pointer", cat: "two-pointers", kids: [
        { t: "Opposite ends (left + right)" },
        { t: "Same direction (fast & slow)" },
        { t: "Partition / Dutch flag" }
      ] },
      { t: "Sliding Window", cat: "sliding-window", kids: [
        { t: "Fixed size" },
        { t: "Variable size", kids: [
          { t: "Expand–shrink" },
          { t: "Monotonic window" }
        ] }
      ] },
      { t: "Prefix Based", cat: "prefix-sums", kids: [
        { t: "Prefix sum" },
        { t: "Prefix XOR" },
        { t: "2D prefix" }
      ] },
      { t: "Kadane’s / Subarray", kids: [
        { t: "Max subarray sum (Kadane’s)" },
        { t: "Max product subarray" },
        { t: "Subarray with given XOR / sum" }
      ] },
      { t: "Binary Search", cat: "binary-search", kids: [
        { t: "On index" },
        { t: "On answer" }
      ] }
    ] },

    { t: "String", hue: "magenta", kids: [
      { t: "Sliding Window", cat: "sliding-window", kids: [
        { t: "Longest substring without repeat" },
        { t: "Minimum window substring" },
        { t: "Anagram / permutation in string" }
      ] },
      { t: "Two Pointers", cat: "two-pointers", kids: [
        { t: "Palindrome check" },
        { t: "Reverse words / characters" },
        { t: "String compression" }
      ] },
      { t: "Pattern Matching", kids: [
        { t: "KMP (failure function)" },
        { t: "Rabin–Karp (rolling hash)" },
        { t: "Z-algorithm" }
      ] }
    ] },

    { t: "Hash Map", hue: "blue", kids: [
      { t: "Frequency Based" },
      { t: "Lookup Based" },
      { t: "Set Based" },
      { t: "Index Mapping" },
      { t: "Grouping Pattern" }
    ] },

    { t: "Stack", hue: "green", cat: "stacks-monotonic", kids: [
      { t: "Monotonic Stack", kids: [
        { t: "Increasing" },
        { t: "Decreasing" }
      ] },
      { t: "Nearest Element", kids: [
        { t: "Next greater" },
        { t: "Next smaller" },
        { t: "Previous variants" }
      ] },
      { t: "Range / Span" },
      { t: "Min / Max Stack" },
      { t: "Expression Handling" },
      { t: "Histogram Pattern" }
    ] },

    { t: "Queue / Deque", hue: "orange", kids: [
      { t: "FIFO Processing" },
      { t: "Level-wise Processing" },
      { t: "Circular Queue Pattern" },
      { t: "Deque Based" }
    ] },

    { t: "Linked List", hue: "amber", kids: [
      { t: "Pointer Techniques", cat: "fast-slow-pointers", kids: [
        { t: "Fast–slow" },
        { t: "Cycle detection" },
        { t: "Finding middle" }
      ] },
      { t: "Reversal", cat: "linked-list-reversal", kids: [
        { t: "Full reverse" },
        { t: "Partial (k-group)" }
      ] },
      { t: "Merge Lists" }
    ] },

    { t: "Trees", hue: "red", cat: "trees-bfs-dfs", kids: [
      { t: "Traversal", kids: [
        { t: "DFS (pre / in / post order)" },
        { t: "BFS (level order / zigzag / right view)" }
      ] },
      { t: "Recursion Patterns", kids: [
        { t: "Top-down approach" },
        { t: "Bottom-up approach" }
      ] },
      { t: "Path Based", kids: [
        { t: "Max path sum" },
        { t: "Diameter / height / depth" }
      ] },
      { t: "BST (Binary Search Tree)" }
    ] },

    { t: "Recursion", hue: "purple", kids: [
      { t: "Backtracking", cat: "backtracking", kids: [
        { t: "Exploration", kids: [
          { t: "Decision tree" },
          { t: "Choose–explore–unchoose" },
          { t: "Subsets (power set)" },
          { t: "Permutations / combinations (nCr)" },
          { t: "Word search on grid" },
          { t: "Palindrome partitioning" }
        ] },
        { t: "Pruning / State Tracking" }
      ] },
      { t: "Divide & Conquer", kids: [
        { t: "Merge sort pattern" },
        { t: "Quick select (kth largest)", cat: "heaps-top-k" },
        { t: "Count inversions" }
      ] }
    ] },

    { t: "Heap", hue: "teal", cat: "heaps-top-k", kids: [
      { t: "Top K / Kth Element / K Closest" },
      { t: "Greedy + Heap", kids: [
        { t: "Task scheduler" },
        { t: "Meeting rooms" },
        { t: "Reorganize string" },
        { t: "Huffman encoding" }
      ] },
      { t: "K-way Merge" }
    ] },

    { t: "Graphs", hue: "brown", cat: "graphs", kids: [
      { t: "Traversal", kids: [
        { t: "BFS" },
        { t: "DFS" }
      ] },
      { t: "Cycle Detection", kids: [
        { t: "Directed" },
        { t: "Undirected" }
      ] },
      { t: "Topological Sort", kids: [
        { t: "Kahn’s algorithm (BFS in-degree)" },
        { t: "DFS-based topo sort" }
      ] },
      { t: "Shortest Path", kids: [
        { t: "Dijkstra" },
        { t: "Bellman–Ford" },
        { t: "Floyd–Warshall (all pairs)" }
      ] },
      { t: "Spanning Tree", kids: [
        { t: "Kruskal’s" },
        { t: "Prim’s" }
      ] },
      { t: "Union-Find (DSU)", cat: "union-find" },
      { t: "Bipartite / Multi-source BFS / 0-1 BFS" }
    ] },

    { t: "Trie", hue: "magenta", cat: "tries", kids: [
      { t: "Prefix Based", kids: [
        { t: "Insert / search" },
        { t: "Prefix match" }
      ] },
      { t: "Bitwise Trie" }
    ] },

    { t: "Dynamic Programming", hue: "slate", cat: "dynamic-programming", kids: [
      { t: "Core", kids: [
        { t: "1D" },
        { t: "2D" }
      ] },
      { t: "Transition Type", kids: [
        { t: "Linear DP" },
        { t: "Grid DP" },
        { t: "Decision DP" }
      ] },
      { t: "Pattern Types", kids: [
        { t: "Knapsack" },
        { t: "Sequence DP" },
        { t: "Partition DP" },
        { t: "Interval DP" }
      ] },
      { t: "Advanced", cat: "advanced-dp", kids: [
        { t: "Bitmask DP" },
        { t: "Digit DP" },
        { t: "DP on trees" }
      ] },
      { t: "Optimization", kids: [
        { t: "Memoization" },
        { t: "Tabulation" }
      ] }
    ] },

    { t: "Greedy", hue: "purple", cat: "greedy", kids: [
      { t: "Interval Greedy", cat: "intervals", kids: [
        { t: "Activity selection" },
        { t: "Non-overlapping intervals" },
        { t: "Minimum removals" }
      ] },
      { t: "Scheduling Greedy", kids: [
        { t: "Deadline-based scheduling" },
        { t: "Profit-based selection" }
      ] },
      { t: "Resource Allocation", kids: [
        { t: "Minimum platforms / rooms" },
        { t: "Meeting rooms" }
      ] },
      { t: "Jump Game Pattern" },
      { t: "Huffman / Merge Cost" }
    ] },

    { t: "Bit Manipulation", hue: "blue", cat: "bit-manipulation", kids: [
      { t: "Core", kids: [
        { t: "XOR pattern" },
        { t: "Bit masking" }
      ] },
      { t: "Usage", kids: [
        { t: "Subset via bits" },
        { t: "Bit checks" },
        { t: "Prefix XOR" }
      ] }
    ] },

    { t: "Sorting Algorithms", hue: "graphite", kids: [
      { t: "Bubble Sort" },
      { t: "Selection Sort" },
      { t: "Insertion Sort" },
      { t: "Merge Sort" },
      { t: "Quick Sort" },
      { t: "Heap Sort" },
      { t: "Counting Sort" },
      { t: "Radix Sort" },
      { t: "Bucket Sort" }
    ] },

    { t: "Range Structures", hue: "green", kids: [
      { t: "Segment Tree", kids: [
        { t: "Range query" },
        { t: "Lazy propagation" }
      ] },
      { t: "Fenwick Tree (BIT)", kids: [
        { t: "Prefix query" }
      ] }
    ] }
  ]
};
