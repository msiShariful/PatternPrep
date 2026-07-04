window.PROBLEM_BANK = window.PROBLEM_BANK || [];

window.PROBLEM_BANK.push({
  id: "backtracking",
  name: "Backtracking",
  group: "Recursion & DP",
  order: 16,
  tagline: "Explore, choose, undo, repeat",
  blurb: "Backtracking incrementally builds candidates and abandons a path the moment it can no longer lead to a valid answer. Reach for it when a problem asks for all combinations, permutations, or placements under constraints.",
  problems: [
    {
      id: "subsets",
      title: "Subsets",
      difficulty: "Easy",
      description: `Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets, and you may return the answer in any order.

Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]`,
      hints: [
        `Every element gives you a binary decision, and the answer size is 2^n. That exponential shape suggests systematically exploring all choice sequences rather than any formula.`,
        `Recurse with a start index and a current path. At each call, the path as it stands is itself a valid subset; then for each index i from start onward, include nums[i], recurse from i+1, and remove it afterward.`,
        `backtrack(start, path):
  add copy of path to results
  for i = start .. n-1:
    path.add(nums[i])
    backtrack(i + 1, path)
    path.removeLast()
call backtrack(0, [])`
      ],
      solution: {
        java: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }
}`,
        explanation: `Each recursive call records the current path as a subset, then extends it with every element at or after the start index, recursing and undoing each choice. Advancing the start index guarantees each subset is generated exactly once in index order, so no duplicates appear.`,
        time: "O(n * 2^n)",
        space: "O(n)"
      }
    },
    {
      id: "permutations",
      title: "Permutations",
      difficulty: "Medium",
      description: `Given an array nums of distinct integers, return all possible permutations. You can return the answer in any order.

Input: nums = [1,2,3]
Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`,
      hints: [
        `You need every ordering, and there are n! of them. A loop cannot enumerate factorially many orderings; think about building each ordering one position at a time.`,
        `State: the partial permutation built so far plus a used[] flag per element. Choices: any unused element for the next slot. Base case: path length equals n, so record a copy.`,
        `backtrack(path, used):
  if path.size == n: record copy of path; return
  for i = 0 .. n-1:
    if used[i]: continue
    used[i] = true; path.add(nums[i])
    backtrack(path, used)
    path.removeLast(); used[i] = false`
      ],
      solution: {
        java: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> result) {
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums, used, path, result);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}`,
        explanation: `We fill the permutation one slot at a time, trying every element not yet used, and undo each choice after the recursive call returns. The used[] array ensures each element appears exactly once per permutation, and completing all n slots yields exactly the n! orderings.`,
        time: "O(n * n!)",
        space: "O(n)"
      }
    },
    {
      id: "combination-sum",
      title: "Combination Sum",
      difficulty: "Medium",
      description: `Given an array of distinct integer candidates and a target integer, return all unique combinations of candidates where the chosen numbers sum to target. The same number may be chosen an unlimited number of times. Two combinations are unique if the multiset of chosen numbers differs.

Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]`,
      hints: [
        `You must enumerate all combinations, not just count them or find one, so a systematic search over choices with the ability to abandon overshooting paths is the natural fit.`,
        `Recurse with a start index and remaining target. At index i you may reuse candidates[i] (recurse with the same i, reduced target) or move on (i+1). Base cases: remaining == 0 records the path; remaining < 0 prunes.`,
        `backtrack(start, remaining, path):
  if remaining == 0: record copy of path; return
  for i = start .. n-1:
    if candidates[i] > remaining: continue
    path.add(candidates[i])
    backtrack(i, remaining - candidates[i], path)   // same i allows reuse
    path.removeLast()`
      ],
      solution: {
        java: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, 0, target, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] candidates, int start, int remaining, List<Integer> path, List<List<Integer>> result) {
        if (remaining == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) continue;
            path.add(candidates[i]);
            backtrack(candidates, i, remaining - candidates[i], path, result);
            path.remove(path.size() - 1);
        }
    }
}`,
        explanation: `The search tries each candidate from the start index onward, passing the same index down so a number can be reused, and prunes any branch whose candidate exceeds the remaining target. Restricting choices to indices at or after start keeps combinations in canonical order, which eliminates duplicate multisets.`,
        time: "O(k * 2^(t/m)) where t is target, m the smallest candidate, k average combination length",
        space: "O(t/m)"
      }
    },
    {
      id: "word-search",
      title: "Word Search",
      difficulty: "Medium",
      description: `Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word must be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring), and the same cell may not be used more than once.

Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true`,
      hints: [
        `A path through the grid must be extended cell by cell, and a wrong turn must be undone so the cell becomes available to other paths. That undo requirement is the telltale sign of the pattern.`,
        `From each cell matching word[0], do a DFS carrying the index into word. Mark the current cell visited (e.g., overwrite with '#'), try all four neighbors for the next character, then restore the cell. Base case: index reaches word length.`,
        `dfs(r, c, idx):
  if idx == word.length: return true
  if out of bounds or board[r][c] != word[idx]: return false
  saved = board[r][c]; board[r][c] = '#'
  found = dfs(r+1,c,idx+1) or dfs(r-1,c,idx+1) or dfs(r,c+1,idx+1) or dfs(r,c-1,idx+1)
  board[r][c] = saved
  return found
try dfs(r, c, 0) from every cell`
      ],
      solution: {
        java: `class Solution {
    public boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int r, int c, int idx) {
        if (idx == word.length()) return true;
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length
                || board[r][c] != word.charAt(idx)) {
            return false;
        }
        char saved = board[r][c];
        board[r][c] = '#';
        boolean found = dfs(board, word, r + 1, c, idx + 1)
                || dfs(board, word, r - 1, c, idx + 1)
                || dfs(board, word, r, c + 1, idx + 1)
                || dfs(board, word, r, c - 1, idx + 1);
        board[r][c] = saved;
        return found;
    }
}`,
        explanation: `From every cell we run a DFS that matches one character per step, temporarily overwriting the cell so it cannot be revisited on the current path, and restoring it on the way back. The restore step is the backtracking: it lets the cell participate in other candidate paths starting elsewhere.`,
        time: "O(m * n * 3^L) where L is the word length",
        space: "O(L)"
      }
    },
    {
      id: "palindrome-partitioning",
      title: "Palindrome Partitioning",
      difficulty: "Hard",
      description: `Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitionings of s.

Input: s = "aab"
Output: [["a","a","b"],["aa","b"]]`,
      hints: [
        `You need every valid partitioning, not the best one, so counting or greedy tricks will not work. Think of the string as a sequence of cut decisions you can explore and revert.`,
        `Recurse on a start index. Choices: every end index such that s[start..end] is a palindrome; take that piece and recurse from end+1. Base case: start reaches s.length, record the current list of pieces.`,
        `backtrack(start, path):
  if start == s.length: record copy of path; return
  for end = start .. s.length-1:
    if isPalindrome(s, start, end):
      path.add(s.substring(start, end+1))
      backtrack(end + 1, path)
      path.removeLast()`
      ],
      solution: {
        java: `class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> result = new ArrayList<>();
        backtrack(s, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(String s, int start, List<String> path, List<List<String>> result) {
        if (start == s.length()) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                path.add(s.substring(start, end + 1));
                backtrack(s, end + 1, path, result);
                path.remove(path.size() - 1);
            }
        }
    }

    private boolean isPalindrome(String s, int lo, int hi) {
        while (lo < hi) {
            if (s.charAt(lo++) != s.charAt(hi--)) return false;
        }
        return true;
    }
}`,
        explanation: `At each start position we try every prefix that is a palindrome, commit it as one piece, recurse on the rest of the string, and then remove it to try a longer prefix. Since only palindromic pieces are ever added, every completed partition is valid, and the loop over end positions covers all cut placements.`,
        time: "O(n * 2^n)",
        space: "O(n)"
      }
    },
    {
      id: "n-queens",
      title: "N-Queens",
      difficulty: "Super Hard",
      description: `The n-queens puzzle is the problem of placing n queens on an n x n chessboard so that no two queens attack each other (no shared row, column, or diagonal). Given an integer n, return all distinct solutions, where each solution is a board layout using 'Q' for a queen and '.' for an empty square.

Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]`,
      hints: [
        `Exactly one queen must go in each row, so a solution is a sequence of column choices, one per row. When a placement leads to a dead end you must be able to retract it and try the next column.`,
        `Recurse row by row. Track which columns and which diagonals are occupied: cells on the same "/" diagonal share row+col, and cells on the same "\\" diagonal share row-col. A column choice is legal only if all three sets are free. Base case: row == n, render the board.`,
        `backtrack(row):
  if row == n: render queen positions into strings; record; return
  for col = 0 .. n-1:
    if col in cols or (row+col) in diag1 or (row-col) in diag2: continue
    place queen: add to cols, diag1, diag2; queens[row] = col
    backtrack(row + 1)
    remove from cols, diag1, diag2`
      ],
      solution: {
        java: `class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        int[] queens = new int[n];
        backtrack(n, 0, queens, new boolean[n], new boolean[2 * n - 1], new boolean[2 * n - 1], result);
        return result;
    }

    private void backtrack(int n, int row, int[] queens, boolean[] cols,
                           boolean[] diag1, boolean[] diag2, List<List<String>> result) {
        if (row == n) {
            result.add(render(queens, n));
            return;
        }
        for (int col = 0; col < n; col++) {
            int d1 = row + col;
            int d2 = row - col + n - 1;
            if (cols[col] || diag1[d1] || diag2[d2]) continue;
            cols[col] = diag1[d1] = diag2[d2] = true;
            queens[row] = col;
            backtrack(n, row + 1, queens, cols, diag1, diag2, result);
            cols[col] = diag1[d1] = diag2[d2] = false;
        }
    }

    private List<String> render(int[] queens, int n) {
        List<String> board = new ArrayList<>();
        for (int r = 0; r < n; r++) {
            char[] rowChars = new char[n];
            Arrays.fill(rowChars, '.');
            rowChars[queens[r]] = 'Q';
            board.add(new String(rowChars));
        }
        return board;
    }
}`,
        explanation: `We place one queen per row, using three boolean arrays to test column and both diagonal conflicts in O(1); row+col indexes the anti-diagonals and row-col (shifted by n-1) the main diagonals. Any conflict skips the column, and after exploring a placement we clear its marks so sibling branches see a clean board. This prunes the vast majority of the n^n placement space.`,
        time: "O(n!)",
        space: "O(n)"
      }
    }
  ]
});

window.PROBLEM_BANK.push({
  id: "dynamic-programming",
  name: "Dynamic Programming",
  group: "Recursion & DP",
  order: 17,
  tagline: "Reuse answers to subproblems",
  blurb: "Dynamic programming solves problems whose optimal answer is built from optimal answers to overlapping subproblems, storing each subproblem result once instead of recomputing it. Use it for counting, min/max optimization, and feasibility questions over sequences and grids.",
  problems: [
    {
      id: "climbing-stairs",
      title: "Climbing Stairs",
      difficulty: "Easy",
      description: `You are climbing a staircase with n steps. Each time you can climb either 1 or 2 steps. In how many distinct ways can you climb to the top?

Input: n = 5
Output: 8`,
      hints: [
        `Naive recursion over "take 1 or take 2" recomputes the same landings over and over. Notice that the number of ways to reach a step depends only on the answers for nearby smaller steps.`,
        `Let dp[i] be the number of ways to reach step i. The last move onto step i came from i-1 or i-2, so dp[i] = dp[i-1] + dp[i-2], with dp[1] = 1 and dp[2] = 2. Only two previous values are ever needed.`,
        `if n <= 2: return n
prev2 = 1, prev1 = 2
for i = 3 .. n:
  cur = prev1 + prev2
  prev2 = prev1
  prev1 = cur
return prev1`
      ],
      solution: {
        java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1;
        int prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int cur = prev1 + prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
        explanation: `The recurrence dp[i] = dp[i-1] + dp[i-2] holds because the final move onto step i is either a single step from i-1 or a double step from i-2, and those two sets of paths are disjoint. Iterating bottom-up with two rolling variables computes the Fibonacci-like sequence in linear time and constant space.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "house-robber",
      title: "House Robber",
      difficulty: "Easy",
      description: `You are a robber planning to rob houses along a street, where nums[i] is the money in the i-th house. Adjacent houses have linked alarms, so you cannot rob two adjacent houses. Return the maximum amount you can rob without alerting the police.

Input: nums = [2,7,9,3,1]
Output: 12`,
      hints: [
        `A greedy pick of the richest houses fails because taking one house constrains its neighbors. The best haul up to house i depends only on best hauls for earlier prefixes, which hints at building answers incrementally.`,
        `Let dp[i] be the best haul considering houses 0..i. Either skip house i (dp[i-1]) or rob it and add dp[i-2]. So dp[i] = max(dp[i-1], dp[i-2] + nums[i]), and two rolling variables suffice.`,
        `prev2 = 0, prev1 = 0
for each num in nums:
  cur = max(prev1, prev2 + num)
  prev2 = prev1
  prev1 = cur
return prev1`
      ],
      solution: {
        java: `class Solution {
    public int rob(int[] nums) {
        int prev2 = 0;
        int prev1 = 0;
        for (int num : nums) {
            int cur = Math.max(prev1, prev2 + num);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
        explanation: `For each house the recurrence dp[i] = max(dp[i-1], dp[i-2] + nums[i]) captures the only two options: skip it and keep the previous best, or rob it and add the best from two houses back. Scanning left to right with two rolling variables yields the optimum in one pass.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "unique-paths",
      title: "Unique Paths",
      difficulty: "Easy",
      description: `A robot starts at the top-left corner of an m x n grid and wants to reach the bottom-right corner. The robot can only move down or right at any point. How many unique paths are there?

Input: m = 3, n = 7
Output: 28`,
      hints: [
        `Brute-force enumeration of paths explodes combinatorially, but many different paths pass through the same cell. Ask what a cell's answer can be built from.`,
        `Let dp[r][c] be the number of paths reaching cell (r,c). Every path arrives from above or from the left, so dp[r][c] = dp[r-1][c] + dp[r][c-1], with the first row and column all 1. A single 1-D row can be reused across iterations.`,
        `dp = array of size n filled with 1   // first row
for r = 1 .. m-1:
  for c = 1 .. n-1:
    dp[c] = dp[c] + dp[c-1]   // above + left
return dp[n-1]`
      ],
      solution: {
        java: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) {
                dp[c] += dp[c - 1];
            }
        }
        return dp[n - 1];
    }
}`,
        explanation: `Since the robot can only enter a cell from above or from the left, the recurrence is dp[r][c] = dp[r-1][c] + dp[r][c-1] with 1s along the top row and left column. Updating a single row in place lets dp[c] hold the value from the row above while dp[c-1] holds the value to the left, collapsing the table to one dimension.`,
        time: "O(m * n)",
        space: "O(n)"
      }
    },
    {
      id: "coin-change",
      title: "Coin Change",
      difficulty: "Medium",
      description: `You are given an integer array coins representing coin denominations and an integer amount. Return the fewest number of coins needed to make up that amount, or -1 if it cannot be made. You may assume an infinite supply of each coin.

Input: coins = [1,2,5], amount = 11
Output: 3`,
      hints: [
        `Greedy (always take the largest coin) fails on inputs like coins = [1,3,4], amount = 6. The minimum for an amount is determined by minimums for smaller amounts, which suggests solving amounts in increasing order.`,
        `Let dp[a] be the fewest coins to make amount a. For each coin c with c <= a, making a could end with coin c on top of an optimal solution for a-c, so dp[a] = min over coins of dp[a-c] + 1, with dp[0] = 0 and unreachable amounts marked infinite.`,
        `dp = array of size amount+1 filled with INF
dp[0] = 0
for a = 1 .. amount:
  for each coin c:
    if c <= a and dp[a-c] != INF:
      dp[a] = min(dp[a], dp[a-c] + 1)
return dp[amount] == INF ? -1 : dp[amount]`
      ],
      solution: {
        java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int INF = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int coin : coins) {
                if (coin <= a && dp[a - coin] != INF) {
                    dp[a] = Math.min(dp[a], dp[a - coin] + 1);
                }
            }
        }
        return dp[amount] == INF ? -1 : dp[amount];
    }
}`,
        explanation: `The tabulation fills dp[a], the fewest coins for amount a, using the recurrence dp[a] = min(dp[a-c] + 1) over all coins c, since an optimal solution for a must end with some final coin c placed on an optimal solution for a-c. amount+1 acts as infinity because no answer can use more than amount coins, and a remaining infinity means the amount is unreachable.`,
        time: "O(amount * k) where k is the number of coins",
        space: "O(amount)"
      }
    },
    {
      id: "longest-increasing-subsequence",
      title: "Longest Increasing Subsequence",
      difficulty: "Medium",
      description: `Given an integer array nums, return the length of the longest strictly increasing subsequence. A subsequence keeps relative order but need not be contiguous.

Input: nums = [10,9,2,5,3,7,101,18]
Output: 4`,
      hints: [
        `Checking all 2^n subsequences is hopeless, but the best increasing subsequence ending at position i is fully determined by the best ones ending at earlier positions. That overlap is the signal.`,
        `Let dp[i] be the length of the longest increasing subsequence that ends exactly at index i. Then dp[i] = 1 + max(dp[j]) over all j < i with nums[j] < nums[i] (or just 1 if none). The answer is the max over all dp[i].`,
        `dp = array of size n filled with 1
best = 1 (0 if empty)
for i = 1 .. n-1:
  for j = 0 .. i-1:
    if nums[j] < nums[i]:
      dp[i] = max(dp[i], dp[j] + 1)
  best = max(best, dp[i])
return best`
      ],
      solution: {
        java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        int best = 1;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            best = Math.max(best, dp[i]);
        }
        return best;
    }
}`,
        explanation: `dp[i] stores the length of the longest increasing subsequence forced to end at i, computed via the recurrence dp[i] = 1 + max(dp[j]) over earlier j with nums[j] < nums[i]; anchoring the subsequence's endpoint is what makes extension decisions valid. The global answer is the maximum dp value. (A patience-sorting variant with binary search improves this to O(n log n).)`,
        time: "O(n^2)",
        space: "O(n)"
      }
    },
    {
      id: "longest-common-subsequence",
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      description: `Given two strings text1 and text2, return the length of their longest common subsequence, or 0 if there is none. A common subsequence appears in both strings in the same relative order, not necessarily contiguously.

Input: text1 = "abcde", text2 = "ace"
Output: 3`,
      hints: [
        `Comparing all subsequence pairs is exponential, but the answer for two strings is expressible through answers for their prefixes. Two indices, one per string, define the subproblem.`,
        `Let dp[i][j] be the LCS length of the first i chars of text1 and the first j chars of text2. If the i-th and j-th characters match, dp[i][j] = dp[i-1][j-1] + 1; otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]).`,
        `dp = (m+1) x (n+1) table of 0
for i = 1 .. m:
  for j = 1 .. n:
    if text1[i-1] == text2[j-1]:
      dp[i][j] = dp[i-1][j-1] + 1
    else:
      dp[i][j] = max(dp[i-1][j], dp[i][j-1])
return dp[m][n]`
      ],
      solution: {
        java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
}`,
        explanation: `The table entry dp[i][j] holds the LCS of the length-i and length-j prefixes, following the recurrence: matching last characters extend the diagonal LCS by one, while a mismatch means at least one of the two last characters is unused, so we take the better of dropping either one. Row 0 and column 0 stay 0 as the empty-prefix base case, and dp[m][n] is the answer.`,
        time: "O(m * n)",
        space: "O(m * n)"
      }
    },
    {
      id: "edit-distance",
      title: "Edit Distance",
      difficulty: "Hard",
      description: `Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. The permitted operations are inserting a character, deleting a character, and replacing a character.

Input: word1 = "horse", word2 = "ros"
Output: 3`,
      hints: [
        `Trying edit sequences directly branches without bound. Notice that after deciding how to handle the last characters of both words, what remains is the same problem on shorter prefixes.`,
        `Let dp[i][j] be the edit distance between the first i chars of word1 and first j chars of word2. If the last characters match, dp[i][j] = dp[i-1][j-1]; otherwise 1 + min(delete dp[i-1][j], insert dp[i][j-1], replace dp[i-1][j-1]). Base cases: dp[i][0] = i, dp[0][j] = j.`,
        `dp = (m+1) x (n+1) table
dp[i][0] = i for all i; dp[0][j] = j for all j
for i = 1 .. m:
  for j = 1 .. n:
    if word1[i-1] == word2[j-1]:
      dp[i][j] = dp[i-1][j-1]
    else:
      dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
return dp[m][n]`
      ],
      solution: {
        java: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                            Math.min(dp[i - 1][j], dp[i][j - 1]));
                }
            }
        }
        return dp[m][n];
    }
}`,
        explanation: `dp[i][j] is the minimum edits between the two prefixes; equal last characters cost nothing (take the diagonal), while a mismatch costs one operation plus the best of the three subproblems corresponding to delete (up), insert (left), and replace (diagonal). The borders encode converting to or from the empty string, which requires exactly i deletions or j insertions.`,
        time: "O(m * n)",
        space: "O(m * n)"
      }
    },
    {
      id: "regular-expression-matching",
      title: "Regular Expression Matching",
      difficulty: "Super Hard",
      description: `Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*', where '.' matches any single character and '*' matches zero or more of the preceding element. The matching should cover the entire input string, not a partial match.

Input: s = "aab", p = "c*a*b"
Output: true`,
      hints: [
        `Greedy scanning breaks because '*' can absorb zero, one, or many characters, and the right choice depends on the rest of the string. Whether a suffix of s matches a suffix of p is a subproblem that repeats — that overlap is your opening.`,
        `Let dp[i][j] mean: the first i chars of s match the first j chars of p. If p[j-1] is a normal char or '.', dp[i][j] = dp[i-1][j-1] when the characters match. If p[j-1] is '*', either drop "x*" entirely (dp[i][j-2]) or, if s[i-1] matches x, consume s[i-1] and keep the star (dp[i-1][j]). Careful base cases: dp[0][0] = true, and dp[0][j] is true when p's prefix collapses via '*'.`,
        `dp[0][0] = true
for j = 2 .. n: if p[j-1] == '*': dp[0][j] = dp[0][j-2]
for i = 1 .. m:
  for j = 1 .. n:
    if p[j-1] == '*':
      dp[i][j] = dp[i][j-2]                       // zero occurrences
      if p[j-2] == '.' or p[j-2] == s[i-1]:
        dp[i][j] = dp[i][j] or dp[i-1][j]          // one more occurrence
    else if p[j-1] == '.' or p[j-1] == s[i-1]:
      dp[i][j] = dp[i-1][j-1]
return dp[m][n]`
      ],
      solution: {
        java: `class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length();
        int n = p.length();
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[0][0] = true;
        for (int j = 2; j <= n; j++) {
            if (p.charAt(j - 1) == '*') {
                dp[0][j] = dp[0][j - 2];
            }
        }
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                char pc = p.charAt(j - 1);
                if (pc == '*') {
                    dp[i][j] = dp[i][j - 2];
                    char prev = p.charAt(j - 2);
                    if (prev == '.' || prev == s.charAt(i - 1)) {
                        dp[i][j] = dp[i][j] || dp[i - 1][j];
                    }
                } else if (pc == '.' || pc == s.charAt(i - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
        return dp[m][n];
    }
}`,
        explanation: `dp[i][j] records whether s's first i characters match p's first j characters. A literal or '.' consumes one character from each side (diagonal move), while a '*' either erases its "x*" pair (dp[i][j-2], zero occurrences) or, when the preceding element matches s[i-1], consumes one character of s while keeping the star active (dp[i-1][j]). The first row handles patterns like "a*b*" that can match the empty string, and the two star branches together cover every possible repetition count without enumerating them.`,
        time: "O(m * n)",
        space: "O(m * n)"
      }
    }
  ]
});
