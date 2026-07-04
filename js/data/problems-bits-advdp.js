window.PROBLEM_BANK = window.PROBLEM_BANK || [];

window.PROBLEM_BANK.push({
  id: "bit-manipulation",
  name: "Bit Manipulation",
  group: "Greedy & Bits",
  order: 15,
  tagline: "XOR tricks and bit counting",
  blurb: "Bit manipulation applies when a problem involves integers whose binary representation carries structure: pairs canceling via XOR, counting set bits, or simulating arithmetic without operators. These solutions are typically O(1) space and blazingly fast.",
  problems: [
    {
      id: "single-number",
      title: "Single Number",
      difficulty: "Easy",
      description: `Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with linear runtime complexity and use only constant extra space.

Input: nums = [4,1,2,1,2]
Output: 4`,
      hints: [
        `Hint 1: A hash set works but uses extra space. Think about what property lets duplicate pairs cancel each other out without storing anything.`,
        `Hint 2: XOR is commutative and associative, and x ^ x = 0 while x ^ 0 = x. What happens if you XOR every element of the array together?`,
        `Hint 3:
result = 0
for each num in nums:
    result = result XOR num
return result
// all pairs cancel to 0, leaving the single number`
      ],
      solution: {
        java: `class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int num : nums) {
            result ^= num;
        }
        return result;
    }
}`,
        explanation: `XOR every element together. Because XOR is commutative/associative and any value XORed with itself is 0, all paired elements cancel, and the running result ends as the unique element. This achieves linear time with no extra storage.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "number-of-1-bits",
      title: "Number of 1 Bits",
      difficulty: "Easy",
      description: `Write a function that takes the binary representation of an unsigned integer and returns the number of set bits it has (also known as the Hamming weight). In Java the input is a signed 32-bit int, but you should treat its bits as unsigned.

Input: n = 11 (binary 1011)
Output: 3`,
      hints: [
        `Hint 1: You can inspect the number one bit at a time, but there is a classic identity that skips straight from one set bit to the next.`,
        `Hint 2: The expression n & (n - 1) clears the lowest set bit of n. Count how many times you can apply it before n becomes 0.`,
        `Hint 3:
count = 0
while n != 0:
    n = n AND (n - 1)   // drop the lowest set bit
    count = count + 1
return count`
      ],
      solution: {
        java: `class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1); // clears the lowest set bit
            count++;
        }
        return count;
    }
}`,
        explanation: `Brian Kernighan's trick: n & (n - 1) removes exactly one set bit (the lowest) per iteration, so the loop runs once per set bit rather than once per bit position. The loop condition n != 0 also works correctly for negative Java ints, since clearing bits eventually reaches zero.`,
        time: "O(k) where k = number of set bits",
        space: "O(1)"
      }
    },
    {
      id: "counting-bits",
      title: "Counting Bits",
      difficulty: "Easy",
      description: `Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1 bits in the binary representation of i. Can you do it in a single pass in O(n) time without using any built-in popcount function?

Input: n = 5
Output: [0,1,1,2,1,2]`,
      hints: [
        `Hint 1: Computing the bit count of every number independently costs O(n log n). Notice that numbers you have already processed can help you answer larger ones.`,
        `Hint 2: The binary representation of i is the representation of i / 2 shifted left, plus possibly a trailing 1. So the answer for i depends on the answer for i >> 1.`,
        `Hint 3:
dp = array of size n + 1, dp[0] = 0
for i from 1 to n:
    dp[i] = dp[i >> 1] + (i AND 1)
return dp`
      ],
      solution: {
        java: `class Solution {
    public int[] countBits(int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            dp[i] = dp[i >> 1] + (i & 1);
        }
        return dp;
    }
}`,
        explanation: `Dropping the last bit of i gives i >> 1, whose bit count we already computed. Adding back the dropped bit (i & 1) yields dp[i] = dp[i >> 1] + (i & 1). Each entry is filled in constant time, giving a linear one-pass solution.`,
        time: "O(n)",
        space: "O(n) for the output array"
      }
    },
    {
      id: "missing-number",
      title: "Missing Number",
      difficulty: "Easy",
      description: `Given an array nums containing n distinct numbers taken from the range [0, n], return the only number in the range that is missing from the array. Aim for O(n) time and O(1) extra space.

Input: nums = [3,0,1]
Output: 2`,
      hints: [
        `Hint 1: Sorting or a hash set works but breaks the space/time targets. Think about pairing each index with each value so that everything present cancels out.`,
        `Hint 2: XOR all indices 0..n together with all array values. Matched index/value pairs cancel via x ^ x = 0, leaving only the missing number. (Gauss's sum formula also works.)`,
        `Hint 3:
xor = n            // account for index n which has no array slot
for i from 0 to n - 1:
    xor = xor XOR i XOR nums[i]
return xor`
      ],
      solution: {
        java: `class Solution {
    public int missingNumber(int[] nums) {
        int xor = nums.length; // seed with the extra index n
        for (int i = 0; i < nums.length; i++) {
            xor ^= i ^ nums[i];
        }
        return xor;
    }
}`,
        explanation: `We XOR every index in [0, n] with every value in the array. Each number that is present appears exactly twice in the combined stream (once as an index, once as a value) and cancels to 0; the missing number appears only once as an index, so it survives. This avoids the potential overflow of the arithmetic-sum approach.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "sum-of-two-integers",
      title: "Sum of Two Integers",
      difficulty: "Medium",
      description: `Given two integers a and b, return their sum without using the operators + and -. The values may be negative, and the standard two's-complement representation should make negatives work automatically.

Input: a = 2, b = 3
Output: 5`,
      hints: [
        `Hint 1: Think about how you add binary numbers by hand: each column produces a digit and possibly something that moves to the next column. Which bitwise operators model those two pieces?`,
        `Hint 2: XOR gives the sum of bits ignoring carries, while AND finds the positions that generate a carry. The carry must be shifted left by one and then added in again — repeat until no carry remains.`,
        `Hint 3:
while b != 0:
    carry = (a AND b) << 1   // where both bits are 1, carry out
    a = a XOR b              // sum without carries
    b = carry                // add the carries next round
return a`
      ],
      solution: {
        java: `class Solution {
    public int getSum(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1; // positions that generate a carry
            a = a ^ b;                // add without carrying
            b = carry;                // fold the carry back in
        }
        return a;
    }
}`,
        explanation: `XOR performs a bitwise add that ignores carries, and (a & b) << 1 computes exactly the carries that were ignored. Repeating "sum-without-carry plus carry" propagates every carry until none remain, which takes at most 32 iterations for 32-bit ints. Two's-complement representation makes the same loop correct for negative numbers.`,
        time: "O(1) — at most 32 iterations",
        space: "O(1)"
      }
    },
    {
      id: "single-number-ii",
      title: "Single Number II",
      difficulty: "Medium",
      description: `Given an integer array nums where every element appears exactly three times except for one element which appears exactly once, return the single element. You must implement a solution with linear runtime complexity and constant extra space.

Input: nums = [0,1,0,1,0,1,99]
Output: 99`,
      hints: [
        `Hint 1: Plain XOR no longer works because triples do not cancel. Think about what happens to each bit position when a value appears three times.`,
        `Hint 2: You need a per-bit counter modulo 3. Two integer variables can act as the low and high bits of that counter: "ones" holds bits seen once, "twos" holds bits seen twice, and bits seen three times reset both.`,
        `Hint 3:
ones = 0, twos = 0
for each num in nums:
    ones = (ones XOR num) AND (NOT twos)
    twos = (twos XOR num) AND (NOT ones)
return ones
// a bit cycles ones -> twos -> cleared as it is seen 1, 2, 3 times`
      ],
      solution: {
        java: `class Solution {
    public int singleNumber(int[] nums) {
        int ones = 0, twos = 0;
        for (int num : nums) {
            ones = (ones ^ num) & ~twos;
            twos = (twos ^ num) & ~ones;
        }
        return ones;
    }
}`,
        explanation: `Treat ones/twos as a two-bit counter per bit position that counts occurrences modulo 3. A bit moves into ones on its first appearance, into twos on its second, and the masks (& ~twos, & ~ones) clear it on the third, so any value appearing three times vanishes. After the pass, ones holds exactly the bits of the element that appeared once.`,
        time: "O(n)",
        space: "O(1)"
      }
    }
  ]
});

window.PROBLEM_BANK.push({
  id: "advanced-dp",
  name: "Advanced DP",
  group: "Recursion & DP",
  order: 18,
  tagline: "Knapsacks, trees, states, intervals",
  blurb: "These problems go beyond 1-D linear DP into the classic advanced families: 0/1 knapsack, unbounded knapsack, DP on trees, state-machine DP, and interval DP. Recognizing which family a problem belongs to is the key skill — the recurrence usually follows directly from that classification.",
  problems: [
    {
      id: "partition-equal-subset-sum",
      title: "Partition Equal Subset Sum",
      difficulty: "Medium",
      description: `Given an integer array nums, return true if you can partition the array into two subsets such that the sums of the elements in both subsets are equal, and false otherwise. Each element must go to exactly one side.

Input: nums = [1,5,11,5]
Output: true (partition as [1,5,5] and [11])`,
      hints: [
        `Hint 1: If a valid partition exists, what must each side sum to? Reframe the problem as choosing a subset that hits one specific target value.`,
        `Hint 2: This is 0/1 knapsack: for each number, either include it in the subset or skip it, tracking which sums in [0, total/2] are reachable. A boolean DP over sums suffices.`,
        `Hint 3:
total = sum(nums); if total is odd, return false
target = total / 2
dp = boolean array of size target + 1; dp[0] = true
for each num in nums:
    for s from target down to num:      // reverse to use each num once
        dp[s] = dp[s] OR dp[s - num]
return dp[target]`
      ],
      solution: {
        java: `class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int num : nums) total += num;
        if (total % 2 != 0) return false;

        int target = total / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int num : nums) {
            for (int s = target; s >= num; s--) {
                dp[s] = dp[s] || dp[s - num];
            }
        }
        return dp[target];
    }
}`,
        explanation: `Classic 0/1 knapsack: a valid partition exists iff some subset sums to total/2. The recurrence is dp[s] = dp[s] OR dp[s - num] — sum s is reachable either without the current number or by adding it to a previously reachable sum. Iterating s downward ensures each number is used at most once, which is exactly the 0/1 constraint.`,
        time: "O(n * target) where target = sum/2",
        space: "O(target)"
      }
    },
    {
      id: "target-sum",
      title: "Target Sum",
      difficulty: "Medium",
      description: `You are given an integer array nums and an integer target. You build an expression by adding either '+' or '-' before each number and concatenating them. Return the number of different expressions that evaluate to target.

Input: nums = [1,1,1,1,1], target = 3
Output: 5`,
      hints: [
        `Hint 1: Brute-force branching on +/- for every element is 2^n. Try describing an assignment of signs by the set of numbers that receive '+' — what constraint does that set satisfy?`,
        `Hint 2: If P is the sum of positives and N the sum of negatives, then P - N = target and P + N = total, so P = (total + target) / 2. The problem becomes counting subsets with a fixed sum — a 0/1 knapsack counting variant.`,
        `Hint 3:
total = sum(nums)
if |target| > total or (total + target) is odd: return 0
s = (total + target) / 2
dp = int array of size s + 1; dp[0] = 1
for each num in nums:
    for j from s down to num:
        dp[j] = dp[j] + dp[j - num]
return dp[s]`
      ],
      solution: {
        java: `class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int total = 0;
        for (int num : nums) total += num;
        if (target > total || target < -total || (total + target) % 2 != 0) {
            return 0;
        }
        int sum = (total + target) / 2;
        int[] dp = new int[sum + 1];
        dp[0] = 1;
        for (int num : nums) {
            for (int s = sum; s >= num; s--) {
                dp[s] += dp[s - num];
            }
        }
        return dp[sum];
    }
}`,
        explanation: `Choosing signs is equivalent to picking the '+' subset P with P = (total + target) / 2, reducing the problem to a 0/1 knapsack subset-count. The recurrence is dp[s] += dp[s - num]: ways to reach sum s grow by the ways to reach s - num before considering the current number. The downward loop over s enforces that each number is placed exactly once.`,
        time: "O(n * s) where s = (total + target) / 2",
        space: "O(s)"
      }
    },
    {
      id: "coin-change-ii",
      title: "Coin Change II",
      difficulty: "Medium",
      description: `You are given an integer array coins representing coins of different denominations and an integer amount. Return the number of combinations that make up that amount; combinations that differ only in order count once. You may use each coin an unlimited number of times. If the amount cannot be made, return 0.

Input: amount = 5, coins = [1,2,5]
Output: 4 (5, 2+2+1, 2+1+1+1, 1+1+1+1+1)`,
      hints: [
        `Hint 1: Unlike Coin Change I, you are counting combinations, not minimizing coins — and 1+2 must not be counted separately from 2+1. Think about what loop order avoids counting permutations.`,
        `Hint 2: This is unbounded knapsack counting: iterate coins in the OUTER loop and amounts in the inner loop, so each combination is built in one canonical coin order. The inner loop runs upward because coins are reusable.`,
        `Hint 3:
dp = int array of size amount + 1; dp[0] = 1
for each coin in coins:            // outer: fixes coin order, kills permutations
    for a from coin to amount:     // upward: coin may be reused
        dp[a] = dp[a] + dp[a - coin]
return dp[amount]`
      ],
      solution: {
        java: `class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        for (int coin : coins) {
            for (int a = coin; a <= amount; a++) {
                dp[a] += dp[a - coin];
            }
        }
        return dp[amount];
    }
}`,
        explanation: `Unbounded knapsack: the recurrence dp[a] += dp[a - coin] adds every way of reaching a - coin as a way of reaching a using another copy of the current coin. Looping amounts upward (unlike 0/1 knapsack) allows unlimited reuse of each coin. Putting coins in the outer loop means every combination is counted in exactly one coin order, so permutations are never double-counted.`,
        time: "O(number of coins * amount)",
        space: "O(amount)"
      }
    },
    {
      id: "house-robber-iii",
      title: "House Robber III",
      difficulty: "Medium",
      description: `The houses in this neighborhood form a binary tree rooted at root. A thief cannot rob two directly-linked houses (a parent and its child) on the same night without alerting the police. Return the maximum amount of money the thief can rob without alerting the police.

Input: root = [3,2,3,null,3,null,1]
Output: 7 (rob 3 + 3 + 1)`,
      hints: [
        `Hint 1: The linear House Robber recurrence does not transfer directly because each node has two children, not one successor. Think recursively about what a subtree can report to its parent.`,
        `Hint 2: This is DP on a tree: for every node compute two values in one post-order pass — the best haul if this node IS robbed, and the best if it is NOT. The parent combines its children's pairs.`,
        `Hint 3:
dfs(node):
    if node is null: return (skip = 0, rob = 0)
    L = dfs(node.left)
    R = dfs(node.right)
    rob  = node.val + L.skip + R.skip
    skip = max(L.skip, L.rob) + max(R.skip, R.rob)
    return (skip, rob)
answer = max of dfs(root)`
      ],
      solution: {
        java: `// Definition for a binary tree node:
// public class TreeNode {
//     int val;
//     TreeNode left;
//     TreeNode right;
//     TreeNode(int val) { this.val = val; }
// }
class Solution {
    public int rob(TreeNode root) {
        int[] best = dfs(root);
        return Math.max(best[0], best[1]);
    }

    // returns {maxIfNodeSkipped, maxIfNodeRobbed}
    private int[] dfs(TreeNode node) {
        if (node == null) return new int[]{0, 0};
        int[] left = dfs(node.left);
        int[] right = dfs(node.right);
        int robbed = node.val + left[0] + right[0];
        int skipped = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
        return new int[]{skipped, robbed};
    }
}`,
        explanation: `Tree DP via post-order traversal: each node returns a pair (skip, rob). The recurrence is rob(node) = node.val + skip(left) + skip(right), since robbing a node forbids robbing its children, and skip(node) = max over each child of taking that child's better option independently. Each node is visited once, so the whole tree is solved in linear time.`,
        time: "O(n) nodes visited once",
        space: "O(h) recursion stack, h = tree height"
      }
    },
    {
      id: "best-time-to-buy-and-sell-stock-with-cooldown",
      title: "Best Time to Buy and Sell Stock with Cooldown",
      difficulty: "Medium",
      description: `You are given an array prices where prices[i] is the price of a stock on day i. You may complete as many transactions as you like, but you must sell before buying again, and after you sell you cannot buy on the next day (one day of cooldown). Return the maximum profit you can achieve.

Input: prices = [1,2,3,0,2]
Output: 3 (buy at 1, sell at 2, cooldown, buy at 0, sell at 2)`,
      hints: [
        `Hint 1: Greedy peak-valley reasoning breaks once the cooldown constraint appears. Try describing what "situation" you can be in at the end of any given day.`,
        `Hint 2: This is state-machine DP with three states per day: holding a share, just sold today, or resting with no share. Write the best profit for each state in terms of yesterday's three states, honoring the cooldown edge (rest -> buy, sold -> rest).`,
        `Hint 3:
hold = -infinity, sold = 0, rest = 0
for each price in prices:
    prevSold = sold
    sold = hold + price               // sell what we hold
    hold = max(hold, rest - price)    // keep holding, or buy after resting
    rest = max(rest, prevSold)        // stay idle, or finish cooldown
return max(sold, rest)`
      ],
      solution: {
        java: `class Solution {
    public int maxProfit(int[] prices) {
        int hold = Integer.MIN_VALUE; // best profit while holding a share
        int sold = 0;                 // best profit having sold today
        int rest = 0;                 // best profit idle with no share
        for (int price : prices) {
            int prevSold = sold;
            sold = hold + price;
            hold = Math.max(hold, rest - price);
            rest = Math.max(rest, prevSold);
        }
        return Math.max(sold, rest);
    }
}`,
        explanation: `State-machine DP with three states: hold, sold, rest. The recurrences are sold[i] = hold[i-1] + price (selling today), hold[i] = max(hold[i-1], rest[i-1] - price) (buying is only legal from rest, which encodes the cooldown), and rest[i] = max(rest[i-1], sold[i-1]) (a sale is followed by at least one rest day). Only the previous day's states are needed, so three rolling variables replace full arrays.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "burst-balloons",
      title: "Burst Balloons",
      difficulty: "Super Hard",
      description: `You are given n balloons indexed 0 to n - 1, each painted with a number in the array nums. When you burst balloon i you gain nums[left] * nums[i] * nums[right] coins, where left and right are the balloons adjacent to i AFTER earlier bursts; out-of-bounds neighbors count as 1. Return the maximum coins you can collect by bursting all balloons.

Input: nums = [3,1,5,8]
Output: 167 (burst 1, 5, 3, 8: 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 167)`,
      hints: [
        `Hint 1: Choosing which balloon to burst FIRST is a trap — its neighbors keep changing as balloons disappear. Try thinking about the decision from the opposite end of the process.`,
        `Hint 2: Fix which balloon is burst LAST within an open range: its neighbors are then the fixed boundaries of that range, and the two sides become fully independent subproblems. That structure is interval DP; pad the array with 1s on both ends first.`,
        `Hint 3:
pad: b = [1] + nums + [1], n = len(nums)
dp[l][r] = best coins bursting everything strictly inside (l, r) boundaries
for len from 1 to n:
    for left from 1 while left + len - 1 <= n:
        right = left + len - 1
        for k from left to right:      // k is the LAST balloon burst in (left-1, right+1)
            dp[left][right] = max(dp[left][right],
                dp[left][k-1] + b[left-1]*b[k]*b[right+1] + dp[k+1][right])
return dp[1][n]`
      ],
      solution: {
        java: `class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length;
        int[] balloons = new int[n + 2];
        balloons[0] = 1;
        balloons[n + 1] = 1;
        for (int i = 0; i < n; i++) balloons[i + 1] = nums[i];

        // dp[l][r] = max coins from bursting all balloons in [l, r]
        int[][] dp = new int[n + 2][n + 2];
        for (int len = 1; len <= n; len++) {
            for (int left = 1; left + len - 1 <= n; left++) {
                int right = left + len - 1;
                for (int k = left; k <= right; k++) { // k bursts last in [left, right]
                    int coins = dp[left][k - 1]
                              + balloons[left - 1] * balloons[k] * balloons[right + 1]
                              + dp[k + 1][right];
                    dp[left][right] = Math.max(dp[left][right], coins);
                }
            }
        }
        return dp[1][n];
    }
}`,
        explanation: `Interval DP: dp[l][r] is the best score for bursting every balloon in [l, r], and the recurrence tries each k as the LAST balloon burst there — dp[l][r] = max over k of dp[l][k-1] + b[l-1]*b[k]*b[r+1] + dp[k+1][r]. Because k is last, its neighbors at burst time are exactly the interval boundaries l-1 and r+1, which decouples the left and right subintervals. Padding both ends with 1 handles the boundary balloons; intervals are filled shortest-first so subproblems are always ready.`,
        time: "O(n^3)",
        space: "O(n^2)"
      }
    }
  ]
});
