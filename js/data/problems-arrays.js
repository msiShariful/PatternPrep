/* Problem bank: Arrays & Strings — Two Pointers, Sliding Window, Intervals */

window.PROBLEM_BANK = window.PROBLEM_BANK || [];

/* ============================================================
   Two Pointers
   ============================================================ */
window.PROBLEM_BANK.push({
  id: "two-pointers",
  name: "Two Pointers",
  group: "Arrays & Strings",
  order: 1,
  tagline: "Converging indices over sequences",
  blurb: "Use two indices that walk toward (or past) each other to exploit sorted order or symmetry. It applies when a brute-force pair scan is O(n²) but ordering lets you discard one end per step.",
  problems: [
    {
      id: "two-sum-ii",
      title: "Two Sum II - Input Array Is Sorted",
      difficulty: "Easy",
      description: `Given a 1-indexed array of integers sorted in non-decreasing order, find two numbers that add up to a specific target. Return the indices of the two numbers (1-indexed) as an array of length 2. There is exactly one solution, and you may not use the same element twice. Your solution must use only constant extra space.

Input: numbers = [2,7,11,15], target = 9
Output: [1,2]`,
      hints: [
        `The array is sorted — that ordering is a strong signal. What could you learn from comparing the sum of the smallest and largest elements against the target?`,
        `Keep one pointer at each end. If the current sum is too small, only moving the left pointer right can increase it; if too big, only moving the right pointer left can decrease it.`,
        `left = 0, right = n - 1
while left < right:
    sum = numbers[left] + numbers[right]
    if sum == target: return [left+1, right+1]
    if sum < target: left++
    else: right--`
      ],
      solution: {
        java: `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) {
                return new int[]{left + 1, right + 1};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{-1, -1}; // unreachable per problem guarantee
    }
}`,
        explanation: `Because the array is sorted, a pair sum that is too small can only be fixed by advancing the left pointer, and one that is too large only by retreating the right pointer. Each step permanently eliminates one element from consideration, so the two pointers meet after at most n steps and never miss the answer.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "valid-palindrome",
      title: "Valid Palindrome",
      difficulty: "Easy",
      description: `A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.

Input: s = "A man, a plan, a canal: Panama"
Output: true`,
      hints: [
        `You need to compare characters from opposite ends of the string. Do you really need to build a cleaned-up copy of the string first?`,
        `Walk one pointer from the front and one from the back. Skip any character that is not a letter or digit, then compare the two lowercase characters before moving both pointers inward.`,
        `left = 0, right = n - 1
while left < right:
    while left < right and !alnum(s[left]): left++
    while left < right and !alnum(s[right]): right--
    if lower(s[left]) != lower(s[right]): return false
    left++, right--
return true`
      ],
      solution: {
        java: `class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}`,
        explanation: `Two pointers converge from both ends, skipping non-alphanumeric characters in place, so no filtered copy of the string is needed. Comparing lowercase forms at each aligned pair verifies the palindrome property; any mismatch ends the check immediately.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "container-with-most-water",
      title: "Container With Most Water",
      difficulty: "Medium",
      description: `You are given an integer array height of length n. There are n vertical lines where the i-th line spans from (i, 0) to (i, height[i]). Find two lines that, together with the x-axis, form a container holding the most water, and return the maximum amount of water it can store. Note that the container may not be slanted.

Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49`,
      hints: [
        `The area of a container is width times the shorter wall. Checking all pairs is O(n²) — think about starting with the widest possible container and shrinking it deliberately.`,
        `With pointers at both ends, moving the taller wall inward can never help: width shrinks and the limiting (shorter) wall stays the same or gets worse. So always move the shorter wall's pointer.`,
        `left = 0, right = n - 1, best = 0
while left < right:
    area = (right - left) * min(h[left], h[right])
    best = max(best, area)
    if h[left] < h[right]: left++
    else: right--
return best`
      ],
      solution: {
        java: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int best = 0;
        while (left < right) {
            int area = (right - left) * Math.min(height[left], height[right]);
            best = Math.max(best, area);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return best;
    }
}`,
        explanation: `Start with the widest container and repeatedly discard the shorter of the two walls. Any container that still uses that shorter wall with a smaller width is provably no better, so nothing optimal is ever skipped. Each iteration removes one wall from consideration, giving a single linear pass.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "three-sum",
      title: "3Sum",
      difficulty: "Medium",
      description: `Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i, j, and k are distinct indices and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets, in any order.

Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]`,
      hints: [
        `A triple loop is O(n³). Would sorting the array first let you reduce one of the loops to something you already know how to do faster?`,
        `Sort, then fix the first element nums[i] and solve Two Sum II on the suffix with target -nums[i] using two pointers. Skip repeated values for both the fixed element and the pointers to avoid duplicate triplets.`,
        `sort(nums)
for i in 0..n-3:
    if i > 0 and nums[i] == nums[i-1]: continue
    left = i + 1, right = n - 1
    while left < right:
        sum = nums[i] + nums[left] + nums[right]
        if sum < 0: left++
        else if sum > 0: right--
        else:
            record triplet; left++, right--
            skip duplicates on both sides`
      ],
      solution: {
        java: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        int n = nums.length;
        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            if (nums[i] > 0) break;
            int left = i + 1, right = n - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum < 0) {
                    left++;
                } else if (sum > 0) {
                    right--;
                } else {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    left++;
                    right--;
                    while (left < right && nums[left] == nums[left - 1]) left++;
                    while (left < right && nums[right] == nums[right + 1]) right--;
                }
            }
        }
        return result;
    }
}`,
        explanation: `Sorting lets us fix the smallest element of each triplet and reduce the rest to a two-pointer pair search on the sorted suffix. Duplicate values are skipped at every level (fixed element and both pointers), which guarantees unique triplets without a hash set. The outer loop times the inner sweep gives O(n²) after the O(n log n) sort.`,
        time: "O(n^2)",
        space: "O(1)"
      }
    },
    {
      id: "sort-colors",
      title: "Sort Colors",
      difficulty: "Medium",
      description: `Given an array nums with n objects colored red, white, or blue (represented by the integers 0, 1, and 2), sort them in place so that objects of the same color are adjacent, in the order red, white, blue. You must solve this without using the library sort function, ideally in a single pass with constant extra space.

Input: nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]`,
      hints: [
        `There are only three distinct values. Counting them works in two passes — but can you place every element in its final region during a single scan?`,
        `Maintain three regions: 0s at the front (below a low pointer), 2s at the back (above a high pointer), and an unexamined middle. Swap the current element into the correct region as you scan; this is the Dutch National Flag partition.`,
        `low = 0, mid = 0, high = n - 1
while mid <= high:
    if nums[mid] == 0: swap(nums[low], nums[mid]); low++; mid++
    else if nums[mid] == 2: swap(nums[mid], nums[high]); high--
    else: mid++
// note: after swapping with high, do NOT advance mid`
      ],
      solution: {
        java: `class Solution {
    public void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                int tmp = nums[low]; nums[low] = nums[mid]; nums[mid] = tmp;
                low++;
                mid++;
            } else if (nums[mid] == 2) {
                int tmp = nums[mid]; nums[mid] = nums[high]; nums[high] = tmp;
                high--;
            } else {
                mid++;
            }
        }
    }
}`,
        explanation: `The Dutch National Flag algorithm keeps three invariant regions: everything before low is 0, everything between low and mid is 1, and everything after high is 2. Each element in the shrinking middle region is inspected once and swapped into its region. When swapping a 2 to the back, mid stays put because the incoming element is unexamined.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "trapping-rain-water",
      title: "Trapping Rain Water",
      difficulty: "Hard",
      description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water the terrain can trap after raining. Water above any position is bounded by the tallest bars to its left and right.

Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6`,
      hints: [
        `Focus on a single column: how much water sits on top of it? It depends on the tallest bar somewhere to its left and the tallest somewhere to its right — not on its neighbors.`,
        `Water at column i is min(maxLeft, maxRight) - height[i]. You could precompute both max arrays in two passes, but two pointers let you do it in one pass: the side with the smaller running max is the binding constraint, so you can settle that side's column immediately.`,
        `left = 0, right = n - 1
leftMax = 0, rightMax = 0, total = 0
while left < right:
    if height[left] < height[right]:
        leftMax = max(leftMax, height[left])
        total += leftMax - height[left]
        left++
    else:
        rightMax = max(rightMax, height[right])
        total += rightMax - height[right]
        right--
return total`
      ],
      solution: {
        java: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, total = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = Math.max(leftMax, height[left]);
                total += leftMax - height[left];
                left++;
            } else {
                rightMax = Math.max(rightMax, height[right]);
                total += rightMax - height[right];
                right--;
            }
        }
        return total;
    }
}`,
        explanation: `Water above column i equals min(maxLeft, maxRight) - height[i]. When height[left] < height[right], we know some bar on the right is at least as tall as every bar seen from the left so far, so leftMax alone determines the water at the left column — it can be settled and the pointer advanced. Symmetric logic applies on the right, giving a single pass with no auxiliary arrays.`,
        time: "O(n)",
        space: "O(1)"
      }
    }
  ]
});

/* ============================================================
   Sliding Window
   ============================================================ */
window.PROBLEM_BANK.push({
  id: "sliding-window",
  name: "Sliding Window",
  group: "Arrays & Strings",
  order: 2,
  tagline: "Grow and shrink a subarray",
  blurb: "Maintain a contiguous window over the input, expanding the right edge and contracting the left while tracking incremental state. It turns nested-loop substring/subarray scans into a single linear pass whenever window validity is monotonic.",
  problems: [
    {
      id: "best-time-to-buy-and-sell-stock",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      description: `You are given an array prices where prices[i] is the price of a stock on day i. You want to maximize profit by choosing a single day to buy and a different later day to sell. Return the maximum profit you can achieve; if no profit is possible, return 0.

Input: prices = [7,1,5,3,6,4]
Output: 5`,
      hints: [
        `Comparing every buy day with every later sell day is O(n²). As you scan left to right, what single piece of information about the past do you actually need on each day?`,
        `Track the minimum price seen so far. On each day, the best sale ending today is today's price minus that minimum; keep the best such profit and update the minimum as you go.`,
        `minPrice = +infinity, best = 0
for each price p:
    minPrice = min(minPrice, p)
    best = max(best, p - minPrice)
return best`
      ],
      solution: {
        java: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int best = 0;
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > best) {
                best = price - minPrice;
            }
        }
        return best;
    }
}`,
        explanation: `For each day, the optimal transaction selling on that day buys at the cheapest earlier price, so a single running minimum captures everything needed from the past. One pass updates the minimum and the best profit simultaneously. This is the degenerate sliding window where the left edge only moves when a new minimum appears.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "longest-substring-without-repeating-characters",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      description: `Given a string s, find the length of the longest substring without duplicate characters. A substring is a contiguous sequence of characters within the string.

Input: s = "abcabcbb"
Output: 3 (the answer is "abc")`,
      hints: [
        `Checking every substring for uniqueness is O(n³). Notice that if a substring has no repeats, all of its substrings don't either — that monotonicity suggests a window you extend and contract.`,
        `Grow the right edge one character at a time; when the new character already exists in the window, advance the left edge past its previous occurrence. A map from character to last-seen index lets you jump the left edge directly.`,
        `lastSeen = empty map, left = 0, best = 0
for right in 0..n-1:
    c = s[right]
    if c in lastSeen and lastSeen[c] >= left:
        left = lastSeen[c] + 1
    lastSeen[c] = right
    best = max(best, right - left + 1)
return best`
      ],
      solution: {
        java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            Integer prev = lastSeen.get(c);
            if (prev != null && prev >= left) {
                left = prev + 1;
            }
            lastSeen.put(c, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
        explanation: `The window [left, right] always contains distinct characters. When a duplicate of s[right] appears inside the window, the left edge jumps just past its previous index — no shorter substring starting earlier can beat one we have already measured. Each index enters and leaves the window at most once, so the pass is linear.`,
        time: "O(n)",
        space: "O(min(n, Σ))"
      }
    },
    {
      id: "longest-repeating-character-replacement",
      title: "Longest Repeating Character Replacement",
      difficulty: "Medium",
      description: `You are given a string s of uppercase English letters and an integer k. You may choose any character of the string and change it to any other uppercase letter, at most k times. Return the length of the longest substring containing the same letter you can get after performing the replacements.

Input: s = "ABAB", k = 2
Output: 4 (replace the two 'A's with 'B's, or vice versa)`,
      hints: [
        `A window of length L can be made uniform if you only need to change the characters that are not the majority letter. When is that number of changes within budget?`,
        `A window is valid when (window length - count of its most frequent letter) <= k. Expand right, keep per-letter counts and the max frequency seen, and slide left forward when the window becomes invalid.`,
        `count[26] = 0, left = 0, maxFreq = 0, best = 0
for right in 0..n-1:
    count[s[right]]++
    maxFreq = max(maxFreq, count[s[right]])
    if (right - left + 1) - maxFreq > k:
        count[s[left]]--
        left++
    best = max(best, right - left + 1)
return best`
      ],
      solution: {
        java: `class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int left = 0, maxFreq = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            count[s.charAt(right) - 'A']++;
            maxFreq = Math.max(maxFreq, count[s.charAt(right) - 'A']);
            if (right - left + 1 - maxFreq > k) {
                count[s.charAt(left) - 'A']--;
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
        explanation: `A window is fixable within k replacements exactly when its size minus its dominant letter count is at most k. The window never shrinks below the best size found: when invalid, both edges move together, so the algorithm only tests larger windows. maxFreq is allowed to go stale because only a new, higher frequency can ever justify a longer window.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "permutation-in-string",
      title: "Permutation in String",
      difficulty: "Medium",
      description: `Given two strings s1 and s2, return true if s2 contains a permutation of s1 as a substring, and false otherwise. In other words, check whether any contiguous window of s2 is an anagram of s1.

Input: s1 = "ab", s2 = "eidbaooo"
Output: true (s2 contains "ba")`,
      hints: [
        `A permutation of s1 has exactly the same length and the same letter counts as s1. What does that tell you about which substrings of s2 are even worth checking?`,
        `Slide a fixed-size window of length s1.length() across s2, maintaining letter counts incrementally: add the entering character, remove the leaving one, and compare counts against s1's counts.`,
        `if len(s1) > len(s2): return false
need[26] = counts of s1
win[26] = counts of s2[0 .. len(s1)-1]
if win == need: return true
for i in len(s1)..len(s2)-1:
    win[s2[i]]++
    win[s2[i - len(s1)]]--
    if win == need: return true
return false`
      ],
      solution: {
        java: `import java.util.*;

class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        if (m > n) return false;
        int[] need = new int[26];
        int[] win = new int[26];
        for (int i = 0; i < m; i++) {
            need[s1.charAt(i) - 'a']++;
            win[s2.charAt(i) - 'a']++;
        }
        if (Arrays.equals(need, win)) return true;
        for (int i = m; i < n; i++) {
            win[s2.charAt(i) - 'a']++;
            win[s2.charAt(i - m) - 'a']--;
            if (Arrays.equals(need, win)) return true;
        }
        return false;
    }
}`,
        explanation: `An anagram of s1 is characterized entirely by its letter-count vector, so we slide a window of fixed length |s1| across s2 and update its count vector in O(1) per step (one letter enters, one leaves). Comparing two 26-length arrays is constant work, giving a linear scan overall.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "minimum-window-substring",
      title: "Minimum Window Substring",
      difficulty: "Super Hard",
      description: `Given strings s and t, return the minimum-length substring of s that contains every character of t, including duplicates. If no such window exists, return the empty string. The answer is guaranteed to be unique.

Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"`,
      hints: [
        `You are looking for the shortest contiguous piece of s satisfying a coverage condition. Note that once a window covers t, any larger window containing it also covers t — validity is monotonic in window size.`,
        `Expand the right edge until the window covers all of t's counts, then contract the left edge as far as possible while coverage holds, recording the best window each time. Track how many distinct required characters are currently fully satisfied so validity checks are O(1).`,
        `need = counts of t; required = number of distinct chars in t
left = 0, formed = 0, best = (infinity, -, -)
for right in 0..n-1:
    add s[right] to window counts
    if window[c] == need[c]: formed++
    while formed == required:
        update best with (right - left + 1, left)
        remove s[left] from window counts
        if window[s[left]] < need[s[left]]: formed--
        left++
return best window or ""`
      ],
      solution: {
        java: `import java.util.*;

class Solution {
    public String minWindow(String s, String t) {
        if (t.isEmpty() || s.length() < t.length()) return "";
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) {
            need.merge(c, 1, Integer::sum);
        }
        Map<Character, Integer> window = new HashMap<>();
        int required = need.size();
        int formed = 0;
        int left = 0;
        int bestLen = Integer.MAX_VALUE, bestStart = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (need.containsKey(c)) {
                int cnt = window.merge(c, 1, Integer::sum);
                if (cnt == need.get(c)) formed++;
            }
            while (formed == required) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestStart = left;
                }
                char d = s.charAt(left);
                if (need.containsKey(d)) {
                    int cnt = window.merge(d, -1, Integer::sum);
                    if (cnt < need.get(d)) formed--;
                }
                left++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}`,
        explanation: `The right edge expands until the window satisfies every required character count, then the left edge contracts to the tightest valid position, recording the best length seen. The 'formed' counter tracks how many distinct characters currently meet their required counts, making validity checks O(1). Every index is added and removed at most once, so the total work is linear in |s| plus |t|.`,
        time: "O(|s| + |t|)",
        space: "O(|s| + |t|)"
      }
    },
    {
      id: "sliding-window-maximum",
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      description: `You are given an integer array nums and a window of size k that slides from the left of the array to the right, moving one position at a time. Return an array of the maximum value in each window position.

Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]`,
      hints: [
        `Recomputing the max of each window is O(nk). Notice that when a new element enters the window, some older elements can never be a maximum of this or any later window — which ones?`,
        `Keep a deque of indices whose values are strictly decreasing. Before pushing an index, pop everyone smaller from the back (they are dominated). Pop from the front when an index slides out of the window; the front is always the current max.`,
        `deque = empty (stores indices)
for i in 0..n-1:
    if deque nonempty and deque.front <= i - k: pop front
    while deque nonempty and nums[deque.back] <= nums[i]: pop back
    push i to back
    if i >= k - 1: output nums[deque.front]`
      ],
      solution: {
        java: `import java.util.*;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>(); // indices, values decreasing
        for (int i = 0; i < n; i++) {
            if (!deque.isEmpty() && deque.peekFirst() <= i - k) {
                deque.pollFirst();
            }
            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();
            }
            deque.offerLast(i);
            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }
        return result;
    }
}`,
        explanation: `The deque holds indices of a strictly decreasing subsequence of window values: any element older and smaller than a newcomer is dominated forever and gets evicted from the back, while expired indices leave from the front. The front is therefore always the window maximum. Every index is pushed and popped at most once, amortizing to O(1) per step.`,
        time: "O(n)",
        space: "O(k)"
      }
    }
  ]
});

/* ============================================================
   Intervals
   ============================================================ */
window.PROBLEM_BANK.push({
  id: "intervals",
  name: "Intervals",
  group: "Arrays & Strings",
  order: 4,
  tagline: "Sort, then sweep overlapping ranges",
  blurb: "Interval problems almost always yield to sorting by start (or end) and sweeping once, merging or counting overlaps as you go. Reach for this pattern whenever ranges collide: scheduling, booking, and free-time questions.",
  problems: [
    {
      id: "merge-intervals",
      title: "Merge Intervals",
      difficulty: "Medium",
      description: `Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.

Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]`,
      hints: [
        `In arbitrary order, an interval might overlap something far away in the array. Is there an ordering under which all intervals that should merge together become neighbors?`,
        `Sort by start. Sweep left to right keeping a current merged interval: if the next interval starts at or before the current end, extend the end; otherwise emit the current interval and start a new one.`,
        `sort intervals by start
current = intervals[0]
for each next in intervals[1..]:
    if next.start <= current.end:
        current.end = max(current.end, next.end)
    else:
        output current; current = next
output current`
      ],
      solution: {
        java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        int[] current = intervals[0];
        for (int i = 1; i < intervals.length; i++) {
            int[] next = intervals[i];
            if (next[0] <= current[1]) {
                current[1] = Math.max(current[1], next[1]);
            } else {
                merged.add(current);
                current = next;
            }
        }
        merged.add(current);
        return merged.toArray(new int[0][]);
    }
}`,
        explanation: `After sorting by start, any interval that overlaps the current merged block must appear before a gap does, so one sweep suffices: extend the block while starts fall inside it, and emit it when a gap appears. Sorting dominates the runtime.`,
        time: "O(n log n)",
        space: "O(n)"
      }
    },
    {
      id: "insert-interval",
      title: "Insert Interval",
      difficulty: "Medium",
      description: `You are given a list of non-overlapping intervals sorted by start time, and a new interval. Insert the new interval into the list so that the result is still sorted and non-overlapping, merging where necessary, and return it.

Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]`,
      hints: [
        `The existing list is already sorted and disjoint — you should not need to re-sort. Which existing intervals can possibly be affected by the insertion?`,
        `Sweep in three phases: copy intervals that end before the new one starts, then absorb every interval that overlaps the new one by widening its bounds, then copy the rest unchanged.`,
        `result = []
i = 0
while i < n and intervals[i].end < newInterval.start:
    result.add(intervals[i]); i++
while i < n and intervals[i].start <= newInterval.end:
    newInterval.start = min(newInterval.start, intervals[i].start)
    newInterval.end = max(newInterval.end, intervals[i].end)
    i++
result.add(newInterval)
while i < n: result.add(intervals[i]); i++
return result`
      ],
      solution: {
        java: `import java.util.*;

class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0, n = intervals.length;
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i++]);
        }
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval);
        while (i < n) {
            result.add(intervals[i++]);
        }
        return result.toArray(new int[0][]);
    }
}`,
        explanation: `Because the input is sorted and disjoint, the affected intervals form one contiguous run: everything ending before the new interval is untouched, the overlapping run collapses into the new interval by taking min start and max end, and the remainder is appended as-is. One linear pass, no sorting needed.`,
        time: "O(n)",
        space: "O(n)"
      }
    },
    {
      id: "non-overlapping-intervals",
      title: "Non-overlapping Intervals",
      difficulty: "Medium",
      description: `Given an array of intervals where intervals[i] = [start_i, end_i], return the minimum number of intervals you must remove so that the remaining intervals are non-overlapping. Intervals that only touch at a point (e.g., [1,2] and [2,3]) do not overlap.

Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1 (remove [1,3])`,
      hints: [
        `Removing the minimum number of intervals is the same as keeping the maximum number of mutually compatible ones — this is activity selection in disguise.`,
        `Sort by end time and greedily keep every interval that starts at or after the end of the last kept one. An interval that ends earliest leaves the most room for the future, so it is always safe to keep.`,
        `sort intervals by end
kept = 0, lastEnd = -infinity
for each [s, e] in intervals:
    if s >= lastEnd:
        kept++; lastEnd = e
return n - kept`
      ],
      solution: {
        java: `import java.util.*;

class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int kept = 0;
        long lastEnd = Long.MIN_VALUE;
        for (int[] interval : intervals) {
            if (interval[0] >= lastEnd) {
                kept++;
                lastEnd = interval[1];
            }
        }
        return intervals.length - kept;
    }
}`,
        explanation: `Minimizing removals is equivalent to keeping the largest non-overlapping subset, which is classic activity selection: sorting by end time and greedily taking each compatible interval is optimal, since the earliest-ending choice never blocks more future intervals than any alternative. The answer is total minus kept.`,
        time: "O(n log n)",
        space: "O(1)"
      }
    },
    {
      id: "meeting-rooms-ii",
      title: "Meeting Rooms II",
      difficulty: "Medium",
      description: `Given an array of meeting time intervals where intervals[i] = [start_i, end_i], return the minimum number of conference rooms required so that no two overlapping meetings share a room. A meeting ending at time t does not conflict with one starting at time t.

Input: intervals = [[0,30],[5,10],[15,20]]
Output: 2`,
      hints: [
        `The number of rooms you need equals the maximum number of meetings happening simultaneously at any instant. How could you measure that peak without simulating every moment in time?`,
        `Only starts and ends change the concurrency count. Sort all start times and all end times separately; sweep starts in order, and before seating each meeting check whether the earliest-ending meeting has already finished.`,
        `starts = sorted start times
ends = sorted end times
rooms = 0, maxRooms = 0, e = 0
for each s in starts:
    if s >= ends[e]: rooms--; e++   // a meeting freed its room
    rooms++
    maxRooms = max(maxRooms, rooms)
return maxRooms`
      ],
      solution: {
        java: `import java.util.*;

class Solution {
    public int minMeetingRooms(int[][] intervals) {
        int n = intervals.length;
        int[] starts = new int[n];
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) {
            starts[i] = intervals[i][0];
            ends[i] = intervals[i][1];
        }
        Arrays.sort(starts);
        Arrays.sort(ends);
        int rooms = 0, maxRooms = 0, e = 0;
        for (int s = 0; s < n; s++) {
            if (starts[s] >= ends[e]) {
                rooms--;
                e++;
            }
            rooms++;
            maxRooms = Math.max(maxRooms, rooms);
        }
        return maxRooms;
    }
}`,
        explanation: `The required room count is the peak number of concurrent meetings, and concurrency only changes at start or end events. Sorting starts and ends independently and sweeping them with two pointers counts that peak directly: each start claims a room unless the earliest unfinished meeting has already ended and can hand its room over. This matches the min-heap solution but with simpler bookkeeping.`,
        time: "O(n log n)",
        space: "O(n)"
      }
    },
    {
      id: "employee-free-time",
      title: "Employee Free Time",
      difficulty: "Hard",
      description: `You are given a schedule for several employees, where each employee has a list of non-overlapping intervals [start, end] sorted by start time, representing when they are working. Return the list of finite intervals of positive length during which every employee is free, sorted by start time.

Input: schedule = [[[1,2],[5,6]],[[1,3]],[[4,10]]]
Output: [[3,4]]`,
      hints: [
        `Common free time is time covered by nobody's working interval. Does it matter which employee an interval belongs to, or only the union of all busy time?`,
        `Flatten every employee's intervals into one list, sort by start, and merge overlapping busy blocks exactly as in Merge Intervals. The gaps between consecutive merged blocks are the shared free time.`,
        `all = flatten every employee's intervals
sort all by start
end = all[0].end
free = []
for each interval in all[1..]:
    if interval.start > end:
        free.add([end, interval.start])
    end = max(end, interval.end)
return free`
      ],
      solution: {
        java: `import java.util.*;

class Solution {
    public List<int[]> employeeFreeTime(List<List<int[]>> schedule) {
        List<int[]> all = new ArrayList<>();
        for (List<int[]> employee : schedule) {
            all.addAll(employee);
        }
        all.sort((a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> free = new ArrayList<>();
        int end = all.get(0)[1];
        for (int i = 1; i < all.size(); i++) {
            int[] current = all.get(i);
            if (current[0] > end) {
                free.add(new int[]{end, current[0]});
            }
            end = Math.max(end, current[1]);
        }
        return free;
    }
}`,
        explanation: `Ownership of the busy intervals is irrelevant — everyone is free exactly in the gaps of the union of all busy time. Flattening and sorting all intervals reduces the problem to a Merge Intervals sweep, where each gap between the running merged end and the next start is a shared free interval. A k-way heap merge over the pre-sorted employee lists achieves the same result in O(n log k) if k is small.`,
        time: "O(n log n)",
        space: "O(n)"
      }
    }
  ]
});
