window.PROBLEM_BANK = window.PROBLEM_BANK || [];

window.PROBLEM_BANK.push({
  id: "trees-bfs-dfs",
  name: "Trees: BFS & DFS",
  group: "Trees & Graphs",
  order: 10,
  tagline: "Traverse and transform binary trees",
  blurb: "Binary tree problems almost always reduce to a traversal: DFS (usually recursive) when the answer depends on subtree results, BFS when the answer depends on levels or distance from the root.",
  problems: [
    {
      id: "maximum-depth-of-binary-tree",
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      description: `Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

Input: root = [3,9,20,null,null,15,7]
Output: 3`,
      hints: [
        `Hint 1: Think about how the depth of a tree relates to the depth of its two subtrees. Can you express the answer in terms of smaller versions of the same problem?`,
        `Hint 2: Use recursive DFS: the depth of a node is 1 plus the larger of its children's depths. An empty tree has depth 0.`,
        `Hint 3:
function maxDepth(node):
    if node is null:
        return 0
    left = maxDepth(node.left)
    right = maxDepth(node.right)
    return 1 + max(left, right)`
      ],
      solution: {
        java: `// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
        explanation: `The depth of a tree is defined recursively: an empty tree has depth 0, and any other tree is 1 (for the root) plus the deeper of its two subtrees. A postorder DFS computes each subtree's depth exactly once, visiting every node a single time.`,
        time: "O(n)",
        space: "O(h) recursion stack, O(n) worst case"
      }
    },
    {
      id: "invert-binary-tree",
      title: "Invert Binary Tree",
      difficulty: "Easy",
      description: `Given the root of a binary tree, invert the tree (mirror it) and return its root. Every left child becomes the right child and vice versa, at every level of the tree.

Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]`,
      hints: [
        `Hint 1: What single local operation, applied at every node, would mirror the whole tree? Consider what "mirroring" means for one node and its two children.`,
        `Hint 2: At each node, swap its left and right child pointers, then recursively do the same for both subtrees. The order (swap first or recurse first) does not matter.`,
        `Hint 3:
function invert(node):
    if node is null:
        return null
    temp = node.left
    node.left = invert(node.right)
    node.right = invert(temp)
    return node`
      ],
      solution: {
        java: `// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
}`,
        explanation: `A mirrored tree is one where every node's children are swapped. Recursively inverting both subtrees and then swapping the pointers at the current node applies that transformation at every node exactly once, which is sufficient and necessary to mirror the whole tree.`,
        time: "O(n)",
        space: "O(h) recursion stack, O(n) worst case"
      }
    },
    {
      id: "binary-tree-level-order-traversal",
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      description: `Given the root of a binary tree, return the level order traversal of its nodes' values: a list of lists, one inner list per level, from left to right and top to bottom.

Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]`,
      hints: [
        `Hint 1: The output is grouped by distance from the root. Which traversal strategy naturally visits nodes in order of their distance from the root?`,
        `Hint 2: Use BFS with a queue. To group nodes by level, snapshot the queue size at the start of each round and process exactly that many nodes before moving on.`,
        `Hint 3:
result = []
queue = [root] (skip if root is null)
while queue not empty:
    size = queue.length
    level = []
    repeat size times:
        node = queue.poll()
        level.add(node.val)
        enqueue node.left and node.right if non-null
    result.add(level)
return result`
      ],
      solution: {
        java: `// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
            result.add(level);
        }
        return result;
    }
}`,
        explanation: `BFS visits nodes in increasing distance from the root, which is exactly level order. Capturing the queue size before each round tells us how many nodes belong to the current level, so we can drain precisely one level per iteration while enqueuing the next.`,
        time: "O(n)",
        space: "O(n) for the queue at the widest level"
      }
    },
    {
      id: "validate-binary-search-tree",
      title: "Validate Binary Search Tree",
      difficulty: "Medium",
      description: `Given the root of a binary tree, determine if it is a valid binary search tree (BST). In a valid BST, every node's left subtree contains only values strictly less than the node, every right subtree contains only values strictly greater, and both subtrees must themselves be BSTs.

Input: root = [5,1,4,null,null,3,6]
Output: false (the root's right child 4 is less than 5, and 3 sits in 5's right subtree)`,
      hints: [
        `Hint 1: Checking only that each node is greater than its left child and less than its right child is not enough. Think about what constraint a grandparent imposes on nodes deep in a subtree.`,
        `Hint 2: Pass down an allowed (min, max) range for each subtree. When you go left, the parent's value becomes the new upper bound; when you go right, it becomes the new lower bound.`,
        `Hint 3:
function valid(node, low, high):
    if node is null:
        return true
    if (low != null and node.val <= low) or
       (high != null and node.val >= high):
        return false
    return valid(node.left, low, node.val)
       and valid(node.right, node.val, high)
call valid(root, null, null)`
      ],
      solution: {
        java: `// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }
class Solution {
    public boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }

    private boolean validate(TreeNode node, Integer low, Integer high) {
        if (node == null) {
            return true;
        }
        if ((low != null && node.val <= low) || (high != null && node.val >= high)) {
            return false;
        }
        return validate(node.left, low, node.val)
            && validate(node.right, node.val, high);
    }
}`,
        explanation: `Each node must lie inside an open interval determined by all of its ancestors, not just its parent. DFS threads that interval down the tree: descending left tightens the upper bound to the parent's value, descending right tightens the lower bound. Using nullable Integer bounds avoids edge cases with Integer.MIN_VALUE and MAX_VALUE node values.`,
        time: "O(n)",
        space: "O(h) recursion stack, O(n) worst case"
      }
    },
    {
      id: "lowest-common-ancestor-of-a-bst",
      title: "Lowest Common Ancestor of a BST",
      difficulty: "Medium",
      description: `Given a binary search tree and two nodes p and q that exist in it, return their lowest common ancestor (LCA): the deepest node that has both p and q as descendants, where a node may be a descendant of itself.

Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6`,
      hints: [
        `Hint 1: This tree is not just any binary tree — it is a BST. How can the ordering property tell you, at any node, which side p and q must be on without searching for them?`,
        `Hint 2: Walk down from the root. If both p and q are smaller than the current node, go left; if both are larger, go right. The first node where they split (or equals one of them) is the LCA.`,
        `Hint 3:
node = root
while node is not null:
    if p.val < node.val and q.val < node.val:
        node = node.left
    else if p.val > node.val and q.val > node.val:
        node = node.right
    else:
        return node`
      ],
      solution: {
        java: `// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode node = root;
        while (node != null) {
            if (p.val < node.val && q.val < node.val) {
                node = node.left;
            } else if (p.val > node.val && q.val > node.val) {
                node = node.right;
            } else {
                return node;
            }
        }
        return null;
    }
}`,
        explanation: `In a BST, all values in the left subtree are smaller and all in the right are larger than the current node. So while both targets fall strictly on the same side, the LCA must be deeper on that side; the first node where the targets diverge (or match the node itself) is by definition the lowest node containing both.`,
        time: "O(h), O(n) worst case",
        space: "O(1)"
      }
    },
    {
      id: "binary-tree-maximum-path-sum",
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      description: `A path in a binary tree is any sequence of nodes where consecutive nodes are connected by an edge; a node may appear at most once and the path need not pass through the root. Given the root of a binary tree (values may be negative), return the maximum sum of any non-empty path.

Input: root = [-10,9,20,null,null,15,7]
Output: 42 (the path 15 -> 20 -> 7)`,
      hints: [
        `Hint 1: The best path might bend at some node, going down into both children. Think about what a subtree can contribute to a path that continues upward versus a path that ends inside it.`,
        `Hint 2: Do a postorder DFS where each node returns the best downward gain (node plus at most one child's gain, floored at 0). Separately, at each node, consider the "bent" path node + leftGain + rightGain and track the global maximum.`,
        `Hint 3:
best = -infinity
function gain(node):
    if node is null: return 0
    left = max(gain(node.left), 0)
    right = max(gain(node.right), 0)
    best = max(best, node.val + left + right)
    return node.val + max(left, right)
gain(root); return best`
      ],
      solution: {
        java: `// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }
class Solution {
    private int best = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        gain(root);
        return best;
    }

    private int gain(TreeNode node) {
        if (node == null) {
            return 0;
        }
        int left = Math.max(gain(node.left), 0);
        int right = Math.max(gain(node.right), 0);
        best = Math.max(best, node.val + left + right);
        return node.val + Math.max(left, right);
    }
}`,
        explanation: `Every path has a unique highest node where it "bends", so it suffices to evaluate, at every node, the best path that bends there: the node plus the best downward gains from each side (clamped at 0 to drop harmful negative branches). The recursion returns only the single-branch gain, because a path continuing to the parent cannot use both children; the global maximum over all bend points is the answer.`,
        time: "O(n)",
        space: "O(h) recursion stack, O(n) worst case"
      }
    },
    {
      id: "serialize-and-deserialize-binary-tree",
      title: "Serialize and Deserialize Binary Tree",
      difficulty: "Super Hard",
      description: `Design an algorithm to serialize a binary tree into a single string and deserialize that string back into the identical tree. There is no restriction on the format, but serialize followed by deserialize must reproduce the original structure and values exactly.

Input: root = [1,2,3,null,null,4,5]
Output: serialize(root) might return "1,2,#,#,3,4,#,#,5,#,#" and deserialize of that string rebuilds [1,2,3,null,null,4,5]`,
      hints: [
        `Hint 1: A plain list of values is ambiguous — many trees share the same value sequence. What extra information must the string carry so the shape is recoverable?`,
        `Hint 2: Use preorder DFS and write an explicit marker (e.g. "#") for every null child. With null markers, a preorder string determines the tree uniquely, and deserialization is the same preorder walk consuming tokens.`,
        `Hint 3:
serialize(node):
    if node is null: append "#" and return
    append node.val
    serialize(node.left); serialize(node.right)

deserialize:
    tokens = split string on ","
    build():
        t = next token
        if t == "#": return null
        node = new TreeNode(int(t))
        node.left = build(); node.right = build()
        return node`
      ],
      solution: {
        java: `// class TreeNode { int val; TreeNode left, right; TreeNode(int val) { this.val = val; } }
class Solution {
    private static final String NULL_MARKER = "#";
    private static final String SEP = ",";

    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        buildString(root, sb);
        return sb.toString();
    }

    private void buildString(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append(NULL_MARKER).append(SEP);
            return;
        }
        sb.append(node.val).append(SEP);
        buildString(node.left, sb);
        buildString(node.right, sb);
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        Deque<String> tokens = new ArrayDeque<>(Arrays.asList(data.split(SEP)));
        return buildTree(tokens);
    }

    private TreeNode buildTree(Deque<String> tokens) {
        String token = tokens.poll();
        if (NULL_MARKER.equals(token)) {
            return null;
        }
        TreeNode node = new TreeNode(Integer.parseInt(token));
        node.left = buildTree(tokens);
        node.right = buildTree(tokens);
        return node;
    }
}`,
        explanation: `A preorder traversal that records an explicit marker for every null child encodes the tree's shape unambiguously, because at decode time we always know whether the next token is a real node or the end of a branch. Deserialization replays the identical preorder recursion, consuming one token per call: build the node, then rebuild its left and right subtrees in order.`,
        time: "O(n) for both serialize and deserialize",
        space: "O(n)"
      }
    }
  ]
});

window.PROBLEM_BANK.push({
  id: "graphs",
  name: "Graphs: BFS, DFS & Topo Sort",
  group: "Trees & Graphs",
  order: 12,
  tagline: "Explore grids, graphs, and dependencies",
  blurb: "Use DFS/BFS to explore connectivity in grids and adjacency lists, BFS specifically for shortest paths in unweighted graphs, and topological sort when the problem is about ordering tasks under dependencies or detecting cycles in a directed graph.",
  problems: [
    {
      id: "number-of-islands",
      title: "Number of Islands",
      difficulty: "Medium",
      description: `Given an m x n grid of '1's (land) and '0's (water), return the number of islands. An island is a maximal group of '1' cells connected horizontally or vertically (not diagonally), surrounded by water or the grid edge.

Input: grid = [["1","1","0","0"],["1","1","0","0"],["0","0","1","0"],["0","0","0","1"]]
Output: 3`,
      hints: [
        `Hint 1: Counting islands is really counting connected components. What happens if, every time you find an unvisited land cell, you make sure you never count any cell connected to it again?`,
        `Hint 2: Scan every cell; when you hit a '1', increment the count and run a DFS/BFS flood fill from it, marking every reachable land cell as visited (e.g. overwrite with '0').`,
        `Hint 3:
count = 0
for each cell (r, c):
    if grid[r][c] == '1':
        count += 1
        dfs(r, c):
            if out of bounds or grid[r][c] != '1': return
            grid[r][c] = '0'
            dfs on (r+1,c), (r-1,c), (r,c+1), (r,c-1)
return count`
      ],
      solution: {
        java: `class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    sink(grid, r, c);
                }
            }
        }
        return count;
    }

    private void sink(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') {
            return;
        }
        grid[r][c] = '0';
        sink(grid, r + 1, c);
        sink(grid, r - 1, c);
        sink(grid, r, c + 1);
        sink(grid, r, c - 1);
    }
}`,
        explanation: `Each island is a connected component of land cells. Scanning the grid, the first time we touch a component we count it and flood-fill (DFS) the entire component to water, guaranteeing no cell of that island is ever counted again. Every cell is visited a constant number of times.`,
        time: "O(m * n)",
        space: "O(m * n) recursion stack in the worst case"
      }
    },
    {
      id: "clone-graph",
      title: "Clone Graph",
      difficulty: "Medium",
      description: `Given a reference to a node in a connected undirected graph, return a deep copy of the graph. Each node contains an integer value and a list of its neighbors; the copy must contain brand-new nodes with the same values and the same connection structure.

Input: adjList = [[2,4],[1,3],[2,4],[1,3]] (node 1 connects to 2 and 4, etc.)
Output: a deep copy with the same adjacency list [[2,4],[1,3],[2,4],[1,3]]`,
      hints: [
        `Hint 1: The graph may contain cycles, so naively copying neighbors recursively will loop forever. What bookkeeping prevents copying the same node twice?`,
        `Hint 2: Keep a map from original node to its clone. Traverse with DFS or BFS; when you need a neighbor's clone, reuse it from the map if it exists, otherwise create it and recurse.`,
        `Hint 3:
map = empty HashMap<Node, Node>
function clone(node):
    if node is null: return null
    if node in map: return map[node]
    copy = new Node(node.val)
    map[node] = copy      // register before recursing
    for each nb in node.neighbors:
        copy.neighbors.add(clone(nb))
    return copy`
      ],
      solution: {
        java: `// class Node { int val; List<Node> neighbors; Node(int val) { this.val = val; neighbors = new ArrayList<>(); } }
class Solution {
    private final Map<Node, Node> visited = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) {
            return null;
        }
        if (visited.containsKey(node)) {
            return visited.get(node);
        }
        Node copy = new Node(node.val);
        visited.put(node, copy);
        for (Node neighbor : node.neighbors) {
            copy.neighbors.add(cloneGraph(neighbor));
        }
        return copy;
    }
}`,
        explanation: `DFS visits every node once, creating its clone and wiring up cloned neighbors. The original-to-clone map serves double duty: it memoizes clones so each node is copied exactly once, and — because we register the clone before recursing into neighbors — it breaks cycles that would otherwise cause infinite recursion.`,
        time: "O(V + E)",
        space: "O(V) for the map and recursion stack"
      }
    },
    {
      id: "rotting-oranges",
      title: "Rotting Oranges",
      difficulty: "Medium",
      description: `You are given an m x n grid where each cell is 0 (empty), 1 (fresh orange), or 2 (rotten orange). Every minute, any fresh orange 4-directionally adjacent to a rotten one becomes rotten. Return the minimum number of minutes until no fresh orange remains, or -1 if that is impossible.

Input: grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4`,
      hints: [
        `Hint 1: Rot spreads outward from every rotten orange simultaneously, one step per minute. Which traversal models simultaneous, layer-by-layer spreading from multiple starting points?`,
        `Hint 2: Do a multi-source BFS: enqueue all initially rotten oranges at once, count fresh oranges, then process the queue level by level, each level being one minute. If fresh oranges remain at the end, return -1.`,
        `Hint 3:
enqueue all cells with 2; count fresh
minutes = 0
while queue not empty and fresh > 0:
    for each cell in current level:
        for each 4-neighbor that is 1:
            mark it 2, fresh -= 1, enqueue it
    minutes += 1
return fresh == 0 ? minutes : -1`
      ],
      solution: {
        java: `class Solution {
    public int orangesRotting(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        Queue<int[]> queue = new ArrayDeque<>();
        int fresh = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {
                    queue.offer(new int[]{r, c});
                } else if (grid[r][c] == 1) {
                    fresh++;
                }
            }
        }
        int minutes = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!queue.isEmpty() && fresh > 0) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] cell = queue.poll();
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        fresh--;
                        queue.offer(new int[]{nr, nc});
                    }
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}`,
        explanation: `Seeding the BFS queue with every rotten orange models all sources spreading rot at the same time, and each BFS level corresponds to exactly one minute of spread. Tracking the fresh count lets us stop as soon as everything is rotten and detect unreachable fresh oranges (isolated by empty cells), which yields -1.`,
        time: "O(m * n)",
        space: "O(m * n) for the queue"
      }
    },
    {
      id: "course-schedule",
      title: "Course Schedule",
      difficulty: "Medium",
      description: `There are numCourses courses labeled 0 to numCourses - 1, and a list of prerequisite pairs where [a, b] means you must take course b before course a. Return true if it is possible to finish all courses, and false otherwise.

Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false (course 1 needs 0 first, and 0 needs 1 first — impossible)`,
      hints: [
        `Hint 1: Model courses as nodes and prerequisites as directed edges. What structural property of this directed graph makes finishing all courses impossible?`,
        `Hint 2: The courses can all be finished if and only if the graph has no directed cycle. Use Kahn's algorithm: repeatedly take a course with in-degree 0 and remove its outgoing edges; if you process all nodes, there is no cycle.`,
        `Hint 3:
build adjacency list and indegree[] from edges b -> a
queue = all nodes with indegree 0
taken = 0
while queue not empty:
    course = queue.poll(); taken += 1
    for each next in adj[course]:
        indegree[next] -= 1
        if indegree[next] == 0: queue.offer(next)
return taken == numCourses`
      ],
      solution: {
        java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            adj.add(new ArrayList<>());
        }
        int[] indegree = new int[numCourses];
        for (int[] pre : prerequisites) {
            adj.get(pre[1]).add(pre[0]);
            indegree[pre[0]]++;
        }
        Queue<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }
        int taken = 0;
        while (!queue.isEmpty()) {
            int course = queue.poll();
            taken++;
            for (int next : adj.get(course)) {
                if (--indegree[next] == 0) {
                    queue.offer(next);
                }
            }
        }
        return taken == numCourses;
    }
}`,
        explanation: `The courses form a directed graph where an edge b -> a means b unlocks a; all courses are finishable exactly when this graph is acyclic. Kahn's algorithm repeatedly "takes" any course whose prerequisites are all satisfied (in-degree 0) and decrements its dependents. If a cycle exists, its members never reach in-degree 0, so fewer than numCourses nodes get processed.`,
        time: "O(V + E)",
        space: "O(V + E)"
      }
    },
    {
      id: "pacific-atlantic-water-flow",
      title: "Pacific Atlantic Water Flow",
      difficulty: "Medium",
      description: `Given an m x n matrix of heights, the Pacific ocean touches the top and left edges and the Atlantic touches the bottom and right edges. Water can flow from a cell to a 4-directional neighbor of equal or lower height. Return all cells from which water can flow to both oceans.

Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`,
      hints: [
        `Hint 1: Simulating downhill flow from every cell separately is expensive. Could you instead ask which cells each ocean can be reached from — starting at the oceans themselves?`,
        `Hint 2: Reverse the flow: DFS/BFS uphill (neighbor height >= current) from every Pacific border cell to mark all pacific-reachable cells, do the same from the Atlantic border, and output cells marked by both.`,
        `Hint 3:
pacific = boolean grid, atlantic = boolean grid
for each cell on top row / left column: dfs(cell, pacific)
for each cell on bottom row / right column: dfs(cell, atlantic)
dfs(r, c, seen):
    seen[r][c] = true
    for each neighbor (nr, nc) in bounds, not seen,
        heights[nr][nc] >= heights[r][c]:
        dfs(nr, nc, seen)
answer = all cells with pacific and atlantic both true`
      ],
      solution: {
        java: `class Solution {
    private int rows, cols;
    private int[][] heights;

    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        this.heights = heights;
        this.rows = heights.length;
        this.cols = heights[0].length;
        boolean[][] pacific = new boolean[rows][cols];
        boolean[][] atlantic = new boolean[rows][cols];
        for (int r = 0; r < rows; r++) {
            dfs(r, 0, pacific);
            dfs(r, cols - 1, atlantic);
        }
        for (int c = 0; c < cols; c++) {
            dfs(0, c, pacific);
            dfs(rows - 1, c, atlantic);
        }
        List<List<Integer>> result = new ArrayList<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (pacific[r][c] && atlantic[r][c]) {
                    result.add(Arrays.asList(r, c));
                }
            }
        }
        return result;
    }

    private void dfs(int r, int c, boolean[][] seen) {
        seen[r][c] = true;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && !seen[nr][nc] && heights[nr][nc] >= heights[r][c]) {
                dfs(nr, nc, seen);
            }
        }
    }
}`,
        explanation: `Instead of testing downhill reachability from every cell (which repeats work), we invert the problem: starting from each ocean's border, climb uphill and mark every cell whose water could flow back down to that ocean. Two DFS sweeps produce two reachability sets, and their intersection is exactly the set of cells draining to both oceans. Each sweep visits each cell at most once.`,
        time: "O(m * n)",
        space: "O(m * n)"
      }
    },
    {
      id: "word-ladder",
      title: "Word Ladder",
      difficulty: "Hard",
      description: `Given beginWord, endWord, and a dictionary wordList, return the length of the shortest transformation sequence from beginWord to endWord, changing exactly one letter at a time, where every intermediate word must be in wordList. Return 0 if no such sequence exists. beginWord need not be in wordList, but endWord must be.

Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5 ("hit" -> "hot" -> "dot" -> "dog" -> "cog")`,
      hints: [
        `Hint 1: Think of every word as a node and connect two words when they differ by exactly one letter. What kind of question about that graph is "shortest transformation sequence"?`,
        `Hint 2: It is an unweighted shortest path, so run BFS from beginWord. To find neighbors efficiently, mutate each position of the current word through 'a'..'z' and check membership in a HashSet of the word list; remove words once visited.`,
        `Hint 3:
wordSet = HashSet(wordList); if endWord not in it, return 0
queue = [beginWord], steps = 1
while queue not empty:
    for each word in current level:
        if word == endWord: return steps
        for each position i, each letter c in a..z:
            candidate = word with position i replaced by c
            if candidate in wordSet:
                remove it from wordSet; enqueue it
    steps += 1
return 0`
      ],
      solution: {
        java: `class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) {
            return 0;
        }
        Queue<String> queue = new ArrayDeque<>();
        queue.offer(beginWord);
        wordSet.remove(beginWord);
        int steps = 1;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String word = queue.poll();
                if (word.equals(endWord)) {
                    return steps;
                }
                char[] chars = word.toCharArray();
                for (int pos = 0; pos < chars.length; pos++) {
                    char original = chars[pos];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) {
                            continue;
                        }
                        chars[pos] = c;
                        String candidate = new String(chars);
                        if (wordSet.contains(candidate)) {
                            wordSet.remove(candidate);
                            queue.offer(candidate);
                        }
                    }
                    chars[pos] = original;
                }
            }
            steps++;
        }
        return 0;
    }
}`,
        explanation: `Words differing by one letter form an implicit unweighted graph, so BFS from beginWord finds the shortest sequence: the first time endWord is dequeued, the current level count is the minimum ladder length. Generating neighbors by substituting each of the 26 letters at each position costs O(26 * L) per word with O(1) set lookups, and removing words from the set on discovery doubles as the visited check.`,
        time: "O(N * L * 26) where N = words, L = word length",
        space: "O(N * L)"
      }
    },
    {
      id: "alien-dictionary",
      title: "Alien Dictionary",
      difficulty: "Super Hard",
      description: `You are given a list of words sorted lexicographically according to the rules of an unknown alien language that uses lowercase letters. Derive and return any valid ordering of the alphabet's letters; return "" if the given words are inconsistent with every ordering (including the invalid case where a word is followed by its own proper prefix).

Input: words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"`,
      hints: [
        `Hint 1: Compare each adjacent pair of words. The first position where they differ tells you something about two letters — what kind of relation is that, and what structure do many such relations form?`,
        `Hint 2: Each first-difference gives a directed edge u -> v meaning u comes before v. Build a graph over all letters that appear, then topologically sort it (Kahn's algorithm); a cycle or an invalid prefix pair (e.g. "abc" before "ab") means return "".`,
        `Hint 3:
collect all letters; adj = map, indegree = map (all 0)
for each adjacent pair (w1, w2):
    if w1 longer than w2 and w1 starts with w2: return ""
    at first differing index i: add edge w1[i] -> w2[i]
        (if new) and indegree[w2[i]] += 1
queue = letters with indegree 0
while queue: pop c, append to result,
    decrement indegree of neighbors, enqueue zeros
return result covers all letters ? result : ""`
      ],
      solution: {
        java: `class Solution {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> adj = new HashMap<>();
        Map<Character, Integer> indegree = new HashMap<>();
        for (String word : words) {
            for (char c : word.toCharArray()) {
                adj.putIfAbsent(c, new HashSet<>());
                indegree.putIfAbsent(c, 0);
            }
        }
        for (int i = 0; i < words.length - 1; i++) {
            String w1 = words[i], w2 = words[i + 1];
            if (w1.length() > w2.length() && w1.startsWith(w2)) {
                return "";
            }
            int len = Math.min(w1.length(), w2.length());
            for (int j = 0; j < len; j++) {
                char a = w1.charAt(j), b = w2.charAt(j);
                if (a != b) {
                    if (adj.get(a).add(b)) {
                        indegree.merge(b, 1, Integer::sum);
                    }
                    break;
                }
            }
        }
        Queue<Character> queue = new ArrayDeque<>();
        for (Map.Entry<Character, Integer> e : indegree.entrySet()) {
            if (e.getValue() == 0) {
                queue.offer(e.getKey());
            }
        }
        StringBuilder order = new StringBuilder();
        while (!queue.isEmpty()) {
            char c = queue.poll();
            order.append(c);
            for (char next : adj.get(c)) {
                if (indegree.merge(next, -1, Integer::sum) == 0) {
                    queue.offer(next);
                }
            }
        }
        return order.length() == indegree.size() ? order.toString() : "";
    }
}`,
        explanation: `The sorted word list only constrains letters at the first position where adjacent words differ, giving a directed precedence edge per pair; any alphabet consistent with all edges is a topological order of that graph. Kahn's algorithm produces such an order, and if it cannot place every letter the constraints are cyclic (contradictory), so we return "". The prefix check catches the separately invalid case where a longer word precedes its own prefix.`,
        time: "O(C) where C = total length of all words",
        space: "O(1) — at most 26 letters and 26^2 edges"
      }
    }
  ]
});
