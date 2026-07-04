window.PROBLEM_BANK = window.PROBLEM_BANK || [];

window.PROBLEM_BANK.push({
  id: "tries",
  name: "Tries",
  group: "Trees & Graphs",
  order: 11,
  tagline: "Prefix trees for fast lookups",
  blurb: `Use a trie when a problem involves many strings sharing prefixes: autocomplete, dictionary lookups, or searching a word list against a grid. A trie turns repeated prefix comparisons into a single walk down a shared tree.`,
  problems: [
    {
      id: "longest-common-prefix",
      title: "Longest Common Prefix",
      difficulty: "Easy",
      description: `Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".

Input: strs = ["flower","flow","flight"]
Output: "fl"`,
      hints: [
        `The answer is a prefix of every string, so it is also a prefix of the first string. What structure do all the strings share at their start?`,
        `Take the first string as a candidate prefix and shrink it: for each other string, chop characters off the end of the candidate until it is a prefix of that string too. Alternatively, compare all strings column by column and stop at the first mismatch.`,
        `prefix = strs[0]
for each s in strs[1..]:
    while s does not start with prefix:
        drop last char of prefix
        if prefix is empty: return ""
return prefix`
      ],
      solution: {
        java: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (strs[i].indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }
}`,
        explanation: `Horizontal scanning: keep a running candidate prefix and shrink it whenever the next string does not start with it. Since the common prefix can only get shorter as more strings are considered, the final candidate is the longest common prefix of all of them. Inserting all strings into a trie and walking down while each node has exactly one child (and is not a word end) gives the same answer and is the classic trie framing.`,
        time: "O(S), where S is the total number of characters",
        space: "O(1)"
      }
    },
    {
      id: "implement-trie-prefix-tree",
      title: "Implement Trie (Prefix Tree)",
      difficulty: "Medium",
      description: `A trie (pronounced "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class with insert(word), search(word) which returns true if the exact word was inserted, and startsWith(prefix) which returns true if any previously inserted word has the given prefix. All inputs consist of lowercase English letters.

Input: ["Trie","insert","search","search","startsWith","insert","search"], [[],["apple"],["apple"],["app"],["app"],["app"],["app"]]
Output: [null,null,true,false,true,null,true]`,
      hints: [
        `Storing every word in a hash set makes search easy, but how would you answer startsWith without scanning every word? Think of a structure where words sharing a prefix share storage.`,
        `Build a tree where each node has up to 26 children, one per letter. Inserting a word walks (and creates) one node per character; mark the last node as the end of a word. search and startsWith are the same walk, differing only in whether the final node must be a word end.`,
        `Node: children[26], isEnd
insert(word):
    node = root
    for ch in word:
        if children[ch] missing: create it
        node = children[ch]
    node.isEnd = true
search / startsWith(s):
    walk from root following each char; return false if a link is missing
    search: return node.isEnd; startsWith: return true`
      ],
      solution: {
        java: `class Trie {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }

    private final TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    public void insert(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (node.children[i] == null) {
                node.children[i] = new TrieNode();
            }
            node = node.children[i];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    private TrieNode walk(String s) {
        TrieNode node = root;
        for (char ch : s.toCharArray()) {
            node = node.children[ch - 'a'];
            if (node == null) return null;
        }
        return node;
    }
}`,
        explanation: `Each node holds a 26-slot child array and an end-of-word flag. Insert walks the word character by character, creating missing nodes; search and startsWith perform the identical walk, with search additionally requiring the terminal node's isEnd flag. Every operation touches exactly one node per character, so cost is linear in the key length regardless of how many words are stored.`,
        time: "O(L) per operation, where L is the word length",
        space: "O(total characters inserted)"
      }
    },
    {
      id: "design-add-and-search-words-data-structure",
      title: "Design Add and Search Words Data Structure",
      difficulty: "Medium",
      description: `Design a data structure that supports adding new words and searching for a string that may contain the wildcard character '.', where '.' matches any single letter. Implement the WordDictionary class with addWord(word) and search(word); search returns true if any previously added word matches the pattern.

Input: ["WordDictionary","addWord","addWord","addWord","search","search","search","search"], [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]
Output: [null,null,null,null,false,true,true,true]`,
      hints: [
        `Exact-match storage is easy; the difficulty is the '.' wildcard. Which data structure lets you explore all words that share a prefix simultaneously instead of checking words one at a time?`,
        `Store words in a trie. For search, walk the trie recursively: a normal letter follows one child link, but a '.' must try every non-null child at that node and succeed if any branch matches the rest of the pattern.`,
        `addWord: standard trie insert
search(word): return dfs(root, 0)
dfs(node, i):
    if i == word.length: return node.isEnd
    ch = word[i]
    if ch == '.':
        for each non-null child c: if dfs(c, i+1): return true
        return false
    else:
        child = node.children[ch]
        return child != null and dfs(child, i+1)`
      ],
      solution: {
        java: `class WordDictionary {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }

    private final TrieNode root;

    public WordDictionary() {
        root = new TrieNode();
    }

    public void addWord(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (node.children[i] == null) {
                node.children[i] = new TrieNode();
            }
            node = node.children[i];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        return dfs(root, word, 0);
    }

    private boolean dfs(TrieNode node, String word, int index) {
        if (index == word.length()) {
            return node.isEnd;
        }
        char ch = word.charAt(index);
        if (ch == '.') {
            for (TrieNode child : node.children) {
                if (child != null && dfs(child, word, index + 1)) {
                    return true;
                }
            }
            return false;
        }
        TrieNode child = node.children[ch - 'a'];
        return child != null && dfs(child, word, index + 1);
    }
}`,
        explanation: `Words live in a standard trie, so addWord is a plain insert. Search is a DFS over the trie: a concrete letter follows exactly one child pointer, while '.' branches into every existing child, backtracking if a branch dies. The trie prunes the search to only prefixes that actually exist, which is why this beats checking each stored word against the pattern.`,
        time: "O(L) for addWord; O(26^d * L) worst case for search with d dots",
        space: "O(total characters added) plus O(L) recursion depth"
      }
    },
    {
      id: "replace-words",
      title: "Replace Words",
      difficulty: "Medium",
      description: `In English, a root word can be followed by other words to form a longer word called a derivative; for example, "help" is the root of "helpful". Given a dictionary of roots and a sentence of words separated by spaces, replace every derivative in the sentence with its root. If a derivative has multiple possible roots, use the shortest one. Return the resulting sentence.

Input: dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"
Output: "the cat was rat by the bat"`,
      hints: [
        `For each word you need to know whether any dictionary root is a prefix of it, and among those, the shortest. Checking every root against every word is wasteful when roots share letters.`,
        `Insert all roots into a trie. For each sentence word, walk the trie character by character and stop at the first node marked as a root end: that is the shortest root prefix. If the walk dies before hitting a root, keep the original word.`,
        `build trie from dictionary roots
for each word in sentence:
    node = root; out = ""
    for ch in word:
        if node.children[ch] missing: out = word; break
        node = node.children[ch]; out += ch
        if node.isEnd: break   // shortest root found
    append (node.isEnd ? out : word) to result
join with spaces`
      ],
      solution: {
        java: `class Solution {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }

    public String replaceWords(List<String> dictionary, String sentence) {
        TrieNode root = new TrieNode();
        for (String word : dictionary) {
            TrieNode node = root;
            for (char ch : word.toCharArray()) {
                int i = ch - 'a';
                if (node.children[i] == null) {
                    node.children[i] = new TrieNode();
                }
                node = node.children[i];
            }
            node.isEnd = true;
        }

        StringBuilder sb = new StringBuilder();
        for (String word : sentence.split(" ")) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(shortestRoot(root, word));
        }
        return sb.toString();
    }

    private String shortestRoot(TrieNode root, String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            node = node.children[word.charAt(i) - 'a'];
            if (node == null) return word;
            if (node.isEnd) return word.substring(0, i + 1);
        }
        return word;
    }
}`,
        explanation: `All roots go into a trie, then each sentence word walks the trie and returns at the first end-of-root marker, which is by construction the shortest root that prefixes the word. If the walk falls off the trie, no root applies and the word stays as is. This does one pass per word instead of comparing every word against every root.`,
        time: "O(D + S), total characters in the dictionary plus the sentence",
        space: "O(D) for the trie"
      }
    },
    {
      id: "word-search-ii",
      title: "Word Search II",
      difficulty: "Super Hard",
      description: `Given an m x n board of lowercase characters and a list of words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring), and the same cell may not be used more than once in a word.

Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]`,
      hints: [
        `Running a separate board DFS for every word repeats enormous amounts of work, because many words share prefixes. What could let you search for all words at once?`,
        `Insert all words into a trie, then DFS from every board cell while walking the trie in lockstep: the current cell must match a child of the current trie node, otherwise prune immediately. When you reach a node holding a complete word, record it and null it out so it is not reported twice.`,
        `build trie of words, storing the full word at its terminal node
for each cell (r, c): dfs(r, c, root)
dfs(r, c, node):
    if out of bounds or board[r][c] == '#': return
    child = node.children[board[r][c]]; if child == null: return
    if child.word != null: add to result; child.word = null
    mark board[r][c] = '#'
    dfs on 4 neighbors with child
    restore board[r][c]
(optional) delete child from its parent when it becomes a leaf`
      ],
      solution: {
        java: `class Solution {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        String word;
    }

    private final TrieNode root = new TrieNode();

    public List<String> findWords(char[][] board, String[] words) {
        for (String word : words) {
            insert(word);
        }
        List<String> result = new ArrayList<>();
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                dfs(board, r, c, root, result);
            }
        }
        return result;
    }

    private void insert(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            int i = ch - 'a';
            if (node.children[i] == null) {
                node.children[i] = new TrieNode();
            }
            node = node.children[i];
        }
        node.word = word;
    }

    private void dfs(char[][] board, int r, int c, TrieNode node, List<String> result) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
        char ch = board[r][c];
        if (ch == '#' || node.children[ch - 'a'] == null) return;

        TrieNode child = node.children[ch - 'a'];
        if (child.word != null) {
            result.add(child.word);
            child.word = null; // avoid duplicates
        }

        board[r][c] = '#';
        dfs(board, r + 1, c, child, result);
        dfs(board, r - 1, c, child, result);
        dfs(board, r, c + 1, child, result);
        dfs(board, r, c - 1, child, result);
        board[r][c] = ch;
    }
}`,
        explanation: `All target words are compressed into one trie, and a single backtracking DFS from each cell advances through the board and the trie simultaneously, so any path that is not a prefix of some word is cut off instantly. Storing the full word at its terminal node and nulling it after first discovery handles output and deduplication in one step. Cells are temporarily marked with '#' to enforce the no-reuse rule and restored on backtrack.`,
        time: "O(m * n * 4 * 3^(L-1)), with L the longest word length",
        space: "O(total characters in words) for the trie"
      }
    }
  ]
});

window.PROBLEM_BANK.push({
  id: "union-find",
  name: "Union-Find",
  group: "Trees & Graphs",
  order: 13,
  tagline: "Merge sets, query connectivity fast",
  blurb: `Union-Find (Disjoint Set Union) tracks which elements belong to the same group as you merge groups incrementally. Reach for it when a problem is about connectivity, components, or cycle detection in an undirected setting, especially when edges arrive one at a time.`,
  problems: [
    {
      id: "find-if-path-exists-in-graph",
      title: "Find if Path Exists in Graph",
      difficulty: "Easy",
      description: `There is a bi-directional graph with n vertices labeled 0 to n - 1, given as an edge list where edges[i] = [ui, vi]. Determine if there is a valid path from vertex source to vertex destination.

Input: n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2
Output: true`,
      hints: [
        `A path exists exactly when the two vertices are in the same connected piece of the graph. You do not need the actual path, only a yes/no about grouping.`,
        `Process every edge once, merging the two endpoints into the same set. At the end, source and destination are connected if and only if they end up in the same set. BFS/DFS also works, but the merge-sets view is the cleanest.`,
        `parent[i] = i for all i
find(x): follow parents to the root, compressing the path
union(a, b): link roots by rank
for each [u, v] in edges: union(u, v)
return find(source) == find(destination)`
      ],
      solution: {
        java: `class Solution {
    public boolean validPath(int n, int[][] edges, int source, int destination) {
        DSU dsu = new DSU(n);
        for (int[] edge : edges) {
            dsu.union(edge[0], edge[1]);
        }
        return dsu.find(source) == dsu.find(destination);
    }
}

class DSU {
    private final int[] parent;
    private final int[] rank;

    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
}`,
        explanation: `Every edge merges its two endpoints into one set, so after processing all edges the sets are exactly the connected components; a path exists iff source and destination share a root. With path compression and union by rank, each find/union runs in amortized O(alpha(n)) time, where alpha is the inverse Ackermann function — effectively constant for any realistic n.`,
        time: "O((n + e) * alpha(n))",
        space: "O(n)"
      }
    },
    {
      id: "number-of-connected-components-in-an-undirected-graph",
      title: "Number of Connected Components in an Undirected Graph",
      difficulty: "Medium",
      description: `You have a graph of n nodes labeled 0 to n - 1 and an array edges where edges[i] = [ai, bi] indicates an undirected edge between nodes ai and bi. Return the number of connected components in the graph.

Input: n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2`,
      hints: [
        `Start by imagining every node as its own isolated island. What does adding an edge do to the number of islands?`,
        `Begin with a count of n components. Each edge that connects two previously separate sets reduces the count by one; an edge inside an existing set changes nothing. A DSU tells you which case you are in.`,
        `count = n
init DSU over n nodes
for each [u, v] in edges:
    if union(u, v) succeeded (roots differed):
        count--
return count`
      ],
      solution: {
        java: `class Solution {
    public int countComponents(int n, int[][] edges) {
        DSU dsu = new DSU(n);
        int count = n;
        for (int[] edge : edges) {
            if (dsu.union(edge[0], edge[1])) {
                count--;
            }
        }
        return count;
    }
}

class DSU {
    private final int[] parent;
    private final int[] rank;

    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
}`,
        explanation: `Every node starts as its own component, and each successful union (one that merges two distinct roots) decreases the component count by exactly one, while redundant edges are no-ops. The final count is therefore the number of connected components. Path compression plus union by rank makes each operation amortized O(alpha(n)) — inverse Ackermann, effectively constant.`,
        time: "O((n + e) * alpha(n))",
        space: "O(n)"
      }
    },
    {
      id: "graph-valid-tree",
      title: "Graph Valid Tree",
      difficulty: "Medium",
      description: `You have a graph of n nodes labeled 0 to n - 1 and a list of undirected edges. Return true if these edges form a valid tree: the graph must be fully connected and contain no cycles.

Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
Output: true`,
      hints: [
        `Recall the two defining properties of a tree on n nodes, and note a useful fact: a tree on n nodes always has exactly n - 1 edges. What can you conclude if that count holds?`,
        `With exactly n - 1 edges, "connected" and "acyclic" imply each other, so you only need to verify one of them. Merge endpoints edge by edge; if an edge joins two nodes already in the same set, you found a cycle.`,
        `if edges.length != n - 1: return false
init DSU over n nodes
for each [u, v] in edges:
    if union(u, v) fails (same root already): return false
return true`
      ],
      solution: {
        java: `class Solution {
    public boolean validTree(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        DSU dsu = new DSU(n);
        for (int[] edge : edges) {
            if (!dsu.union(edge[0], edge[1])) {
                return false; // edge creates a cycle
            }
        }
        return true;
    }
}

class DSU {
    private final int[] parent;
    private final int[] rank;

    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
}`,
        explanation: `A tree on n nodes has exactly n - 1 edges, so any other count fails immediately. Given exactly n - 1 edges, the graph is a tree iff it has no cycle, and a cycle appears exactly when an edge connects two nodes already sharing a DSU root. Each union/find is amortized O(alpha(n)) (inverse Ackermann) thanks to path compression and union by rank.`,
        time: "O(n * alpha(n))",
        space: "O(n)"
      }
    },
    {
      id: "redundant-connection",
      title: "Redundant Connection",
      difficulty: "Medium",
      description: `You are given a graph that started as a tree with n nodes labeled 1 to n, with one additional edge added. Return the edge that can be removed so the resulting graph is a tree of n nodes. If there are multiple answers, return the edge that occurs last in the input.

Input: edges = [[1,2],[1,3],[2,3]]
Output: [2,3]`,
      hints: [
        `A tree plus one extra edge contains exactly one cycle. The removable edge is on that cycle — and because you must return the last valid answer, the order in which you examine edges matters.`,
        `Process edges in input order while merging endpoints into sets. The first edge whose two endpoints are already in the same set is the one that closes the cycle, and since it is the latest such edge on the cycle, it is the answer.`,
        `init DSU over n+1 slots (1-indexed nodes)
for each [u, v] in edges (in order):
    if find(u) == find(v): return [u, v]
    union(u, v)
// problem guarantees an answer, so this line is unreachable`
      ],
      solution: {
        java: `class Solution {
    public int[] findRedundantConnection(int[][] edges) {
        DSU dsu = new DSU(edges.length + 1);
        for (int[] edge : edges) {
            if (!dsu.union(edge[0], edge[1])) {
                return edge;
            }
        }
        return new int[0]; // unreachable per problem constraints
    }
}

class DSU {
    private final int[] parent;
    private final int[] rank;

    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
}`,
        explanation: `Scanning edges in order and unioning endpoints, the first edge that fails to union (both endpoints already share a root) is the edge that completes the single cycle — and being processed last among the cycle's edges, it is exactly the "occurs last in input" answer. With path compression and union by rank each operation is amortized O(alpha(n)), the inverse Ackermann function, effectively constant.`,
        time: "O(n * alpha(n))",
        space: "O(n)"
      }
    },
    {
      id: "accounts-merge",
      title: "Accounts Merge",
      difficulty: "Medium",
      description: `Given a list of accounts where accounts[i] is a list whose first element is a name and the rest are emails, merge the accounts: two accounts belong to the same person if they share at least one email. A person can have multiple accounts, but all their accounts share the same name. Return the merged accounts with each account's emails sorted, in any account order.

Input: accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]
Output: [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]`,
      hints: [
        `"Share at least one email" is a transitive gluing relation: if A shares with B and B shares with C, all three merge. What family of problems is about grouping things under transitive connections?`,
        `Treat each account index as a node. Keep a map from email to the first account index that mentioned it; when an email reappears in a later account, union that account with the recorded one. Afterwards, group emails by their account's root and sort each group.`,
        `dsu over account indices
emailToId = {}
for each account i, each email e:
    if e seen before at account j: union(i, j)
    else: emailToId[e] = i
groups = map from find(i) -> sorted set of emails
for (e, i) in emailToId: groups[find(i)].add(e)
output: for each root, [name of that account] + sorted emails`
      ],
      solution: {
        java: `class Solution {
    public List<List<String>> accountsMerge(List<List<String>> accounts) {
        DSU dsu = new DSU(accounts.size());
        Map<String, Integer> emailToId = new HashMap<>();

        for (int i = 0; i < accounts.size(); i++) {
            for (int j = 1; j < accounts.get(i).size(); j++) {
                String email = accounts.get(i).get(j);
                Integer owner = emailToId.putIfAbsent(email, i);
                if (owner != null) {
                    dsu.union(i, owner);
                }
            }
        }

        Map<Integer, TreeSet<String>> groups = new HashMap<>();
        for (Map.Entry<String, Integer> entry : emailToId.entrySet()) {
            int root = dsu.find(entry.getValue());
            groups.computeIfAbsent(root, k -> new TreeSet<>()).add(entry.getKey());
        }

        List<List<String>> result = new ArrayList<>();
        for (Map.Entry<Integer, TreeSet<String>> entry : groups.entrySet()) {
            List<String> merged = new ArrayList<>();
            merged.add(accounts.get(entry.getKey()).get(0)); // name
            merged.addAll(entry.getValue());
            result.add(merged);
        }
        return result;
    }
}

class DSU {
    private final int[] parent;
    private final int[] rank;

    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
}`,
        explanation: `Account indices are DSU nodes; the first time an email is seen it is claimed by that account, and any later account listing the same email is unioned with the claimer, so transitive sharing collapses into one set per person. Emails are then bucketed by their account's root into sorted sets and prefixed with the account name. DSU operations are amortized O(alpha(n)) via path compression and union by rank; total cost is dominated by sorting the emails.`,
        time: "O(E log E), where E is the total number of emails",
        space: "O(E)"
      }
    },
    {
      id: "longest-consecutive-sequence",
      title: "Longest Consecutive Sequence",
      difficulty: "Medium",
      description: `Given an unsorted array of integers nums, return the length of the longest run of consecutive integer values (the elements themselves may appear anywhere in the array). Your algorithm must run in O(n) time, so sorting is off the table.

Input: nums = [100,4,200,1,3,2]
Output: 4 (the run 1, 2, 3, 4)`,
      hints: [
        `A run of consecutive values like 1,2,3,4 is really a chain of "neighbor" links between values that differ by 1. Think of each number as a node — what are you actually being asked about these chains?`,
        `Map each distinct value to an index and union index(v) with index(v + 1) whenever both values exist. Runs of consecutive values become connected components, and the answer is the size of the largest component.`,
        `index = map value -> its first array index (skip duplicates)
dsu over nums.length slots
for each value v in index:
    if v + 1 in index: union(index[v], index[v+1])
size = array of zeros
best = 0
for each i in index.values():
    r = find(i); size[r]++; best = max(best, size[r])
return best`
      ],
      solution: {
        java: `class Solution {
    public int longestConsecutive(int[] nums) {
        Map<Integer, Integer> indexOf = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            indexOf.putIfAbsent(nums[i], i);
        }

        DSU dsu = new DSU(nums.length);
        for (Map.Entry<Integer, Integer> entry : indexOf.entrySet()) {
            Integer next = indexOf.get(entry.getKey() + 1);
            if (next != null) {
                dsu.union(entry.getValue(), next);
            }
        }

        int[] size = new int[nums.length];
        int best = 0;
        for (int i : indexOf.values()) {
            int root = dsu.find(i);
            size[root]++;
            best = Math.max(best, size[root]);
        }
        return best;
    }
}

class DSU {
    private final int[] parent;
    private final int[] rank;

    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
}`,
        explanation: `Each distinct value maps to a DSU node, and every pair of neighboring values (v, v+1) present in the input gets unioned, so a maximal run of consecutive integers becomes one connected component whose size equals the run length; the answer is the largest component. Each hash lookup is O(1) and each DSU operation is amortized O(alpha(n)) — the inverse Ackermann function, effectively constant — giving overall near-linear time. (The classic alternative walks upward from values v where v-1 is absent using a hash set; the union-find view is what generalizes to streaming/merging variants.)`,
        time: "O(n * alpha(n)), effectively O(n)",
        space: "O(n)"
      }
    }
  ]
});
