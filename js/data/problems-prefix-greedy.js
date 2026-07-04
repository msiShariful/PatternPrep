window.PROBLEM_BANK = window.PROBLEM_BANK || [];

window.PROBLEM_BANK.push({
  id: "prefix-sums",
  name: "Prefix Sums",
  group: "Arrays & Strings",
  order: 3,
  tagline: "Precompute sums, answer instantly",
  blurb: "Precompute running totals so any range or subarray aggregate can be answered in O(1) instead of re-scanning. Reach for this pattern when a problem asks about sums, counts, or balances over contiguous ranges, especially with many queries or subarray conditions.",
  problems: [
    {
      id: "range-sum-query-immutable",
      title: "Range Sum Query - Immutable",
      difficulty: "Easy",
      description: `Given an integer array nums, handle multiple queries of the form sumRange(left, right), which returns the sum of the elements of nums between indices left and right inclusive. Implement the NumArray class with a constructor NumArray(int[] nums) and the method sumRange(int left, int right). The array never changes, but sumRange may be called many times.

Input: ["NumArray", "sumRange", "sumRange", "sumRange"], [[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]
Output: [null, 1, -1, -3]`,
      hints: [
        `Hint 1: Calling a loop for every query repeats a lot of work. Think about what you could compute once, up front, that would make every later query cheap.`,
        `Hint 2: Build a prefix array where prefix[i] is the sum of the first i elements. Then any range sum is the difference of two prefix values.`,
        `Hint 3:
constructor(nums):
  prefix = new array of length n + 1
  for i in 0..n-1:
    prefix[i + 1] = prefix[i] + nums[i]

sumRange(left, right):
  return prefix[right + 1] - prefix[left]`
      ],
      solution: {
        java: `class NumArray {
    private final long[] prefix;

    public NumArray(int[] nums) {
        prefix = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    public int sumRange(int left, int right) {
        return (int) (prefix[right + 1] - prefix[left]);
    }
}`,
        explanation: `We precompute prefix[i] = sum of nums[0..i-1] in the constructor, an O(n) one-time cost. Any range sum nums[left..right] then equals prefix[right + 1] - prefix[left], because subtracting the two running totals cancels everything before left. Each query becomes a single subtraction, O(1).`,
        time: "O(n) build, O(1) per query",
        space: "O(n)"
      }
    },
    {
      id: "product-of-array-except-self",
      title: "Product of Array Except Self",
      difficulty: "Medium",
      description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.

Input: nums = [1, 2, 3, 4]
Output: [24, 12, 8, 6]`,
      hints: [
        `Hint 1: Division is off the table, so think about what information about the elements to the left of i and to the right of i would let you assemble each answer directly.`,
        `Hint 2: answer[i] is (product of everything before i) times (product of everything after i). Both of those can be built as running "prefix products" swept from each end.`,
        `Hint 3:
answer = array of length n, filled with 1
left = 1
for i in 0..n-1:
  answer[i] = left
  left = left * nums[i]
right = 1
for i in n-1..0:
  answer[i] = answer[i] * right
  right = right * nums[i]
return answer`
      ],
      solution: {
        java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];

        int left = 1;
        for (int i = 0; i < n; i++) {
            answer[i] = left;
            left *= nums[i];
        }

        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= right;
            right *= nums[i];
        }

        return answer;
    }
}`,
        explanation: `The first pass stores in answer[i] the product of all elements strictly to the left of i (a prefix product). The second pass sweeps from the right, multiplying each slot by the running product of everything strictly to the right. Since each element's exclusion product is exactly leftProduct * rightProduct, two linear passes suffice with no division, and the output array is the only extra storage.`,
        time: "O(n)",
        space: "O(1) extra (excluding the output array)"
      }
    },
    {
      id: "subarray-sum-equals-k",
      title: "Subarray Sum Equals K",
      difficulty: "Medium",
      description: `Given an array of integers nums and an integer k, return the total number of contiguous subarrays whose sum equals k. Note that nums may contain negative numbers, so sliding-window techniques do not apply.

Input: nums = [1, 1, 1], k = 2
Output: 2`,
      hints: [
        `Hint 1: Every subarray sum can be written as the difference of two running totals. Ask yourself what earlier state would tell you a subarray ending here sums to k.`,
        `Hint 2: If prefix[j] - prefix[i] = k, then a subarray from i+1 to j sums to k. Count, for each running sum, how many earlier prefix sums equal (currentSum - k) using a hash map.`,
        `Hint 3:
map = { 0: 1 }   // empty prefix seen once
sum = 0, count = 0
for x in nums:
  sum += x
  if (sum - k) in map:
    count += map[sum - k]
  map[sum] = map.getOrDefault(sum, 0) + 1
return count`
      ],
      solution: {
        java: `class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Long, Integer> seen = new HashMap<>();
        seen.put(0L, 1);
        long sum = 0;
        int count = 0;
        for (int x : nums) {
            sum += x;
            count += seen.getOrDefault(sum - k, 0);
            seen.merge(sum, 1, Integer::sum);
        }
        return count;
    }
}`,
        explanation: `A subarray (i, j] sums to k exactly when prefix[j] - prefix[i] = k, i.e. an earlier prefix sum equals currentSum - k. We walk the array once maintaining the running sum and a hash map counting how often each prefix sum has occurred; at each step the map lookup tells us how many valid subarrays end at the current index. Seeding the map with {0: 1} counts subarrays that start at index 0.`,
        time: "O(n)",
        space: "O(n)"
      }
    },
    {
      id: "contiguous-array",
      title: "Contiguous Array",
      difficulty: "Medium",
      description: `Given a binary array nums (containing only 0s and 1s), return the maximum length of a contiguous subarray with an equal number of 0 and 1.

Input: nums = [0, 1, 0]
Output: 2`,
      hints: [
        `Hint 1: "Equal number of 0s and 1s" is really a statement about a running balance. Try re-encoding the array values so the condition becomes something about a sum.`,
        `Hint 2: Treat 0 as -1 and 1 as +1. A subarray is balanced exactly when its sum is 0, meaning the running sum takes the same value at both ends. Remember the first index where each running sum appeared.`,
        `Hint 3:
map = { 0: -1 }   // balance 0 before the array starts
balance = 0, best = 0
for i in 0..n-1:
  balance += (nums[i] == 1 ? 1 : -1)
  if balance in map:
    best = max(best, i - map[balance])
  else:
    map[balance] = i
return best`
      ],
      solution: {
        java: `class Solution {
    public int findMaxLength(int[] nums) {
        Map<Integer, Integer> firstIndex = new HashMap<>();
        firstIndex.put(0, -1);
        int balance = 0;
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            balance += nums[i] == 1 ? 1 : -1;
            Integer earliest = firstIndex.get(balance);
            if (earliest != null) {
                best = Math.max(best, i - earliest);
            } else {
                firstIndex.put(balance, i);
            }
        }
        return best;
    }
}`,
        explanation: `Mapping 0 to -1 turns the problem into finding the longest subarray with sum 0, which happens exactly when the running balance repeats. We store the first index at which each balance value occurs; when we see the same balance again at index i, the subarray between those positions has equal 0s and 1s and length i - firstIndex. Keeping only the earliest index per balance maximizes the length, and seeding {0: -1} handles subarrays starting at index 0.`,
        time: "O(n)",
        space: "O(n)"
      }
    },
    {
      id: "range-sum-query-2d-immutable",
      title: "Range Sum Query 2D - Immutable",
      difficulty: "Medium",
      description: `Given a 2D matrix, handle multiple queries of the form sumRegion(row1, col1, row2, col2), which returns the sum of the elements inside the rectangle defined by its upper-left corner (row1, col1) and lower-right corner (row2, col2). Implement the NumMatrix class with a constructor NumMatrix(int[][] matrix) and the method sumRegion. The matrix never changes, but sumRegion may be called many times.

Input: matrix = [[3, 0, 1], [5, 6, 3], [1, 2, 0]], query sumRegion(1, 0, 2, 1)
Output: 14`,
      hints: [
        `Hint 1: This is the 2D version of answering many range-sum queries on a fixed structure. What could you precompute once so each rectangle query needs no scanning at all?`,
        `Hint 2: Build a 2D prefix table where pre[r][c] is the sum of the rectangle from (0, 0) to (r-1, c-1). A rectangle sum is then a combination of four table entries via inclusion-exclusion.`,
        `Hint 3:
constructor(matrix):
  pre = (rows + 1) x (cols + 1) table of zeros
  for r in 0..rows-1:
    for c in 0..cols-1:
      pre[r+1][c+1] = matrix[r][c] + pre[r][c+1] + pre[r+1][c] - pre[r][c]

sumRegion(r1, c1, r2, c2):
  return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1]`
      ],
      solution: {
        java: `class NumMatrix {
    private final int[][] pre;

    public NumMatrix(int[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        pre = new int[rows + 1][cols + 1];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                pre[r + 1][c + 1] = matrix[r][c]
                        + pre[r][c + 1]
                        + pre[r + 1][c]
                        - pre[r][c];
            }
        }
    }

    public int sumRegion(int row1, int col1, int row2, int col2) {
        return pre[row2 + 1][col2 + 1]
                - pre[row1][col2 + 1]
                - pre[row2 + 1][col1]
                + pre[row1][col1];
    }
}`,
        explanation: `The constructor builds a 2D prefix table where pre[r][c] holds the sum of the rectangle from the origin to cell (r-1, c-1), computed row by row with inclusion-exclusion to avoid double-counting the overlapping region. A query then combines four precomputed corner sums: take the big rectangle to (row2, col2), subtract the strips above and to the left, and add back the doubly subtracted top-left block. Every query is O(1) after the O(m*n) build.`,
        time: "O(m*n) build, O(1) per query",
        space: "O(m*n)"
      }
    }
  ]
});

window.PROBLEM_BANK.push({
  id: "greedy",
  name: "Greedy",
  group: "Greedy & Bits",
  order: 14,
  tagline: "Locally optimal, globally correct",
  blurb: "Greedy algorithms commit to the best-looking choice at each step and never revisit it, which works when local decisions provably never block a better global outcome. Suspect greedy when the problem has an ordering or exchange argument: sorting, farthest reach, running balances, or interval boundaries.",
  problems: [
    {
      id: "assign-cookies",
      title: "Assign Cookies",
      difficulty: "Easy",
      description: `You have children with greed factors g[i] (the minimum cookie size that satisfies child i) and cookies with sizes s[j]. Each child can receive at most one cookie, and a cookie s[j] satisfies child i only if s[j] >= g[i]. Return the maximum number of children you can satisfy.

Input: g = [1, 2, 3], s = [1, 1]
Output: 1`,
      hints: [
        `Hint 1: Ask whether giving a cookie to the "cheapest" child to satisfy can ever hurt you later — if satisfying the least greedy child first is always safe, a simple committed strategy should work.`,
        `Hint 2: Sort both arrays. Walk the cookies in increasing size, and for each, satisfy the least greedy still-unsatisfied child if the cookie is big enough; otherwise discard the cookie.`,
        `Hint 3:
sort g, sort s
child = 0
for each cookie in s (ascending):
  if child < g.length and cookie >= g[child]:
    child += 1
return child`
      ],
      solution: {
        java: `class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int child = 0;
        for (int j = 0; j < s.length && child < g.length; j++) {
            if (s[j] >= g[child]) {
                child++;
            }
        }
        return child;
    }
}`,
        explanation: `After sorting both arrays, we scan cookies from smallest to largest and always try to satisfy the least greedy unsatisfied child. This is safe by an exchange argument: if the smallest usable cookie went to a greedier child instead, we could swap the assignment without reducing the count. Each cookie and child is considered once after the sorts.`,
        time: "O(n log n + m log m)",
        space: "O(1) extra (in-place sort)"
      }
    },
    {
      id: "maximum-subarray",
      title: "Maximum Subarray",
      difficulty: "Medium",
      description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum, and return its sum. The array may contain negative numbers.

Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6`,
      hints: [
        `Hint 1: Consider the best subarray ending exactly at each index. Would you ever want to drag along a running total that has gone negative, or is dropping it always safe?`,
        `Hint 2: Kadane's idea: at each element, either extend the previous running sum or restart from the current element alone — whichever is larger. Track the best value seen along the way.`,
        `Hint 3:
current = nums[0]
best = nums[0]
for i in 1..n-1:
  current = max(nums[i], current + nums[i])
  best = max(best, current)
return best`
      ],
      solution: {
        java: `class Solution {
    public int maxSubArray(int[] nums) {
        int current = nums[0];
        int best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            current = Math.max(nums[i], current + nums[i]);
            best = Math.max(best, current);
        }
        return best;
    }
}`,
        explanation: `Kadane's algorithm keeps current, the maximum sum of a subarray ending at the current index. A negative running prefix can only lower any subarray it extends, so it is always safe to discard it and restart at the current element — the greedy choice max(nums[i], current + nums[i]). The global answer is the maximum of current over all positions, found in one pass.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "jump-game",
      title: "Jump Game",
      difficulty: "Medium",
      description: `You are given an integer array nums where you start at the first index, and each element nums[i] represents the maximum jump length from that position. Return true if you can reach the last index, or false otherwise.

Input: nums = [2, 3, 1, 1, 4]
Output: true`,
      hints: [
        `Hint 1: You don't need to know which jumps to take — only whether the end is reachable. Think about a single quantity that summarizes everything reachable so far, so committing to it greedily loses nothing.`,
        `Hint 2: Sweep left to right maintaining the farthest index reachable. If the current index ever exceeds that reach, you are stuck; otherwise extend the reach with i + nums[i].`,
        `Hint 3:
reach = 0
for i in 0..n-1:
  if i > reach: return false
  reach = max(reach, i + nums[i])
  if reach >= n - 1: return true
return true`
      ],
      solution: {
        java: `class Solution {
    public boolean canJump(int[] nums) {
        int reach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > reach) {
                return false;
            }
            reach = Math.max(reach, i + nums[i]);
            if (reach >= nums.length - 1) {
                return true;
            }
        }
        return true;
    }
}`,
        explanation: `We track reach, the farthest index attainable using any combination of jumps within the prefix scanned so far. If the loop reaches an index beyond reach, no sequence of jumps can get there, so the answer is false; otherwise each position can only extend the frontier via i + nums[i]. The maximum reach summarizes all reachable states, so no backtracking or per-path bookkeeping is needed.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "gas-station",
      title: "Gas Station",
      difficulty: "Medium",
      description: `There are n gas stations along a circular route, where the gas at station i is gas[i] and it costs cost[i] to travel to the next station. You begin with an empty tank at one station. Return the starting station's index if you can travel around the circuit once clockwise, otherwise return -1. If a solution exists, it is guaranteed to be unique.

Input: gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]
Output: 3`,
      hints: [
        `Hint 1: If your tank goes negative somewhere after starting at station s, could any station between s and the failure point have worked instead? Reasoning about that tells you failures can be skipped in bulk, safely.`,
        `Hint 2: One pass: track the running tank from the current candidate start. Whenever it drops below zero, no station in that stretch can be the start, so set the candidate to the next station and reset the tank. Also track the total surplus to know whether any answer exists.`,
        `Hint 3:
total = 0, tank = 0, start = 0
for i in 0..n-1:
  diff = gas[i] - cost[i]
  total += diff
  tank += diff
  if tank < 0:
    start = i + 1
    tank = 0
return total >= 0 ? start : -1`
      ],
      solution: {
        java: `class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0;
        int tank = 0;
        int start = 0;
        for (int i = 0; i < gas.length; i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff;
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        return total >= 0 ? start : -1;
    }
}`,
        explanation: `If the total gas is less than the total cost, no start works; otherwise exactly one does. The greedy key: if starting at s the tank first goes negative at i, then every station in (s, i] also fails, because any such start enters the same stretch with less or equal fuel — so we can safely jump the candidate to i + 1. One pass therefore finds the unique valid start whenever total >= 0.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "partition-labels",
      title: "Partition Labels",
      difficulty: "Medium",
      description: `You are given a string s of lowercase English letters. Partition s into as many parts as possible so that each letter appears in at most one part, and the concatenation of the parts in order equals s. Return a list of the sizes of these parts.

Input: s = "ababcbacadefegdehijhklij"
Output: [9, 7, 8]`,
      hints: [
        `Hint 1: Each letter's occurrences must all live in one part, so a letter's first and last positions pin down constraints. Consider whether cutting at the earliest position that violates nothing is always safe.`,
        `Hint 2: Precompute the last index of every letter. Sweep the string extending the current partition's required end to the max last-index of letters seen; when the sweep reaches that end, cut a partition there.`,
        `Hint 3:
last[ch] = final index of ch for each letter in s
result = [], start = 0, end = 0
for i in 0..n-1:
  end = max(end, last[s[i]])
  if i == end:
    result.add(i - start + 1)
    start = i + 1
return result`
      ],
      solution: {
        java: `class Solution {
    public List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) {
            last[s.charAt(i) - 'a'] = i;
        }
        List<Integer> result = new ArrayList<>();
        int start = 0;
        int end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) {
                result.add(i - start + 1);
                start = i + 1;
            }
        }
        return result;
    }
}`,
        explanation: `Every letter inside a part forces the part to extend at least to that letter's last occurrence, so as we sweep we grow end to the maximum last-index seen. When the sweep index meets end, no letter inside the window appears later, making it the earliest legal cut — and cutting as early as possible clearly maximizes the number of parts. Two linear passes over the string suffice.`,
        time: "O(n)",
        space: "O(1) (26-entry table)"
      }
    },
    {
      id: "candy",
      title: "Candy",
      difficulty: "Hard",
      description: `There are n children standing in a line, each with a rating. You must give each child at least one candy, and any child with a higher rating than an adjacent child must get more candies than that neighbor. Return the minimum total number of candies you must distribute.

Input: ratings = [1, 0, 2]
Output: 5`,
      hints: [
        `Hint 1: The constraint couples each child only to immediate neighbors, and the two directions (left neighbor, right neighbor) are independent conditions. Consider whether satisfying each direction with the smallest possible amounts can ever conflict.`,
        `Hint 2: Do a left-to-right pass giving each child one more than the left neighbor when the rating strictly increases, then a right-to-left pass doing the same against the right neighbor. Take the max of the two demands at each position.`,
        `Hint 3:
candies = array of n ones
for i in 1..n-1:
  if ratings[i] > ratings[i-1]:
    candies[i] = candies[i-1] + 1
for i in n-2..0:
  if ratings[i] > ratings[i+1]:
    candies[i] = max(candies[i], candies[i+1] + 1)
return sum(candies)`
      ],
      solution: {
        java: `class Solution {
    public int candy(int[] ratings) {
        int n = ratings.length;
        int[] candies = new int[n];
        Arrays.fill(candies, 1);

        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
            }
        }

        int total = candies[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                candies[i] = Math.max(candies[i], candies[i + 1] + 1);
            }
            total += candies[i];
        }
        return total;
    }
}`,
        explanation: `The rule decomposes into two one-sided constraints: beat the left neighbor when strictly higher, and beat the right neighbor when strictly higher. The left-to-right pass greedily satisfies the first with minimal values, and the right-to-left pass satisfies the second, taking a max so the first constraint is never broken. Each value is the minimum satisfying both directions, so the total is minimal.`,
        time: "O(n)",
        space: "O(n)"
      }
    }
  ]
});
