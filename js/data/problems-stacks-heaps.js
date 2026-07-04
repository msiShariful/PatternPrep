window.PROBLEM_BANK = window.PROBLEM_BANK || [];

window.PROBLEM_BANK.push({
  id: "stacks-monotonic",
  name: "Stacks & Monotonic Stack",
  group: "Stacks & Heaps",
  order: 8,
  tagline: "LIFO order and nearest boundaries",
  blurb: "Reach for a stack when the most recent unresolved item is the next one that matters: matching pairs, undo-style state, or backtracking through history. A monotonic stack extends this to \"nearest greater/smaller element\" questions, resolving each element exactly once for linear time.",
  problems: [
    {
      id: "valid-parentheses",
      title: "Valid Parentheses",
      difficulty: "Easy",
      description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. A string is valid if open brackets are closed by the same type of bracket, open brackets are closed in the correct order, and every close bracket has a corresponding open bracket.

Input: s = "()[]{}"
Output: true`,
      hints: [
        `Think about the order in which brackets must close: the most recently opened bracket has to close first. Which data structure naturally tracks "most recent first"?`,
        `Push something onto a stack whenever you see an opening bracket. When you see a closing bracket, it must match whatever is on top of the stack; otherwise the string is invalid.`,
        `stack = empty
for each char c in s:
    if c is an opener:
        push its matching closer onto stack
    else:
        if stack is empty or pop() != c: return false
return stack is empty`
      ],
      solution: {
        java: `import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            switch (c) {
                case '(' -> stack.push(')');
                case '[' -> stack.push(']');
                case '{' -> stack.push('}');
                default -> {
                    if (stack.isEmpty() || stack.pop() != c) {
                        return false;
                    }
                }
            }
        }
        return stack.isEmpty();
    }
}`,
        explanation: `For every opening bracket we push the closing bracket we expect to see later. When a closing bracket arrives, it is valid only if it equals the top of the stack, which enforces both correct type and correct nesting order. The string is valid exactly when every character is consumed and the stack ends empty.`,
        time: "O(n)",
        space: "O(n)"
      }
    },
    {
      id: "min-stack",
      title: "Min Stack",
      difficulty: "Medium",
      description: `Design a stack that supports push, pop, top, and retrieving the minimum element, all in constant time. Implement the MinStack class with methods push(int val), pop(), top(), and getMin(). Each operation must run in O(1).

Input: push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()
Output: -3, 0, -2`,
      hints: [
        `A single stack loses information when you pop: if the minimum leaves, how would you know what the minimum was before it arrived? Think about remembering history, not recomputing.`,
        `Maintain a second stack that moves in lockstep with the main one, where each entry records the minimum of everything at or below that position. Popping then automatically restores the previous minimum.`,
        `push(val):
    mainStack.push(val)
    newMin = minStack empty ? val : min(val, minStack.top)
    minStack.push(newMin)
pop():
    mainStack.pop(); minStack.pop()
top(): return mainStack.top
getMin(): return minStack.top`
      ],
      solution: {
        java: `import java.util.ArrayDeque;
import java.util.Deque;

class MinStack {
    private final Deque<Integer> stack = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();

    public void push(int val) {
        stack.push(val);
        mins.push(mins.isEmpty() ? val : Math.min(val, mins.peek()));
    }

    public void pop() {
        stack.pop();
        mins.pop();
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return mins.peek();
    }
}`,
        explanation: `Alongside the value stack we keep a parallel stack whose top is always the minimum of the current contents: on every push we store min(new value, previous minimum). Because the two stacks push and pop together, removing an element automatically reveals the minimum as it was before that element existed, so all four operations are O(1).`,
        time: "O(1)",
        space: "O(n)"
      }
    },
    {
      id: "daily-temperatures",
      title: "Daily Temperatures",
      difficulty: "Medium",
      description: `Given an array of integers temperatures representing daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after day i to get a warmer temperature. If there is no future day with a warmer temperature, answer[i] is 0.

Input: temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
Output: [1, 1, 4, 2, 1, 1, 0, 0]`,
      hints: [
        `Brute force checks every future day for every day, which is quadratic. Notice that once a warmer day appears, it resolves possibly many earlier days at once — think about which earlier days are still "waiting".`,
        `Keep a stack of indices whose answer is unknown; their temperatures are strictly decreasing from bottom to top. When a new temperature arrives, pop every index colder than it — the new day is their answer.`,
        `answer = int[n], stack = empty (indices)
for i in 0..n-1:
    while stack not empty and temps[i] > temps[stack.top]:
        j = stack.pop()
        answer[j] = i - j
    stack.push(i)
return answer  // unresolved indices stay 0`
      ],
      solution: {
        java: `import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] answer = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int j = stack.pop();
                answer[j] = i - j;
            }
            stack.push(i);
        }
        return answer;
    }
}`,
        explanation: `The stack holds indices of days still waiting for a warmer temperature, kept in decreasing temperature order. Each new day pops every waiting day that is colder, recording the gap in days as its answer. Every index is pushed and popped at most once, so the total work is linear despite the nested loop.`,
        time: "O(n)",
        space: "O(n)"
      }
    },
    {
      id: "next-greater-element-ii",
      title: "Next Greater Element II",
      difficulty: "Medium",
      description: `Given a circular integer array nums, return the next greater number for every element. The next greater number of nums[i] is the first number strictly greater than it when traversing forward, wrapping around to the beginning if necessary. If it does not exist, return -1 for that element.

Input: nums = [1, 2, 1]
Output: [2, -1, 2]`,
      hints: [
        `Without the circular wrap this is a classic "next greater element" question. Start by asking how you would solve the non-circular version in one pass, then worry about the wrap-around separately.`,
        `Simulate the circle by conceptually walking the array twice. A monotonic stack of indices resolves elements when a strictly greater value appears; the second pass lets early elements see values behind them.`,
        `n = nums.length, res = int[n] filled with -1
stack = empty (indices)
for i in 0..2n-1:
    cur = nums[i mod n]
    while stack not empty and nums[stack.top] < cur:
        res[stack.pop()] = cur
    if i < n: stack.push(i)
return res`
      ],
      solution: {
        java: `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class Solution {
    public int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        Arrays.fill(res, -1);
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < 2 * n; i++) {
            int cur = nums[i % n];
            while (!stack.isEmpty() && nums[stack.peek()] < cur) {
                res[stack.pop()] = cur;
            }
            if (i < n) {
                stack.push(i);
            }
        }
        return res;
    }
}`,
        explanation: `We run the standard monotonic-stack sweep but iterate 2n times with indices taken modulo n, which is equivalent to unrolling the circle once. Indices are only pushed during the first pass; the second pass exists purely so that elements near the end can be resolved by values that wrap around. Anything never popped has no greater element and keeps its -1.`,
        time: "O(n)",
        space: "O(n)"
      }
    },
    {
      id: "car-fleet",
      title: "Car Fleet",
      difficulty: "Medium",
      description: `There are n cars traveling to a destination target miles away. Car i starts at position[i] with speed speed[i]. A faster car that catches up to a slower car ahead of it must slow down and travel at the slower car's speed, forming a fleet. A car that catches a fleet exactly at the destination still counts as part of that fleet. Return the number of car fleets that arrive at the destination.

Input: target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]
Output: 3`,
      hints: [
        `Cars cannot pass each other, so only the car directly ahead can block you. Try converting each car into a single number that captures everything relevant about it — ignoring collisions, when would it reach the target on its own?`,
        `Sort cars by starting position from closest-to-target to farthest. Walking that order, a car merges into the fleet ahead exactly when its solo arrival time is less than or equal to the fleet's arrival time; otherwise it leads a new fleet.`,
        `pair each car as (position, time = (target - position) / speed)
sort pairs by position descending
fleets = 0, lastTime = 0
for each (pos, time) in sorted order:
    if time > lastTime:
        fleets += 1
        lastTime = time
    // else it catches the fleet ahead and merges
return fleets`
      ],
      solution: {
        java: `import java.util.Arrays;

class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        int n = position.length;
        double[][] cars = new double[n][2];
        for (int i = 0; i < n; i++) {
            cars[i][0] = position[i];
            cars[i][1] = (double) (target - position[i]) / speed[i];
        }
        Arrays.sort(cars, (a, b) -> Double.compare(b[0], a[0]));
        int fleets = 0;
        double lastArrival = 0.0;
        for (double[] car : cars) {
            if (car[1] > lastArrival) {
                fleets++;
                lastArrival = car[1];
            }
        }
        return fleets;
    }
}`,
        explanation: `Each car reduces to its solo arrival time (target - position) / speed. Processing cars from nearest to farthest, a car with arrival time no greater than the current fleet leader's must catch up and merge, while a strictly slower arrival time starts a new fleet — conceptually a monotonic stack of arrival times where merged cars are never pushed. The count of stack pushes is the number of fleets.`,
        time: "O(n log n)",
        space: "O(n)"
      }
    },
    {
      id: "largest-rectangle-in-histogram",
      title: "Largest Rectangle in Histogram",
      difficulty: "Super Hard",
      description: `Given an array of integers heights representing a histogram's bar heights where the width of each bar is 1, return the area of the largest rectangle that can be formed within the histogram. The rectangle must be axis-aligned and fit entirely under the bars.

Input: heights = [2, 1, 5, 6, 2, 3]
Output: 10`,
      hints: [
        `Every maximal rectangle is limited by some bar that is its full height. For a fixed bar, the best rectangle using that bar's height extends left and right until it hits a shorter bar — so the real question is finding those boundaries efficiently.`,
        `Use a monotonic stack of indices with non-decreasing heights. When the current bar is shorter than the top of the stack, the popped bar has found its right boundary (the current index) and its left boundary (the new stack top), so its area can be finalized.`,
        `stack = empty (indices), best = 0
for i in 0..n (treat heights[n] as 0 sentinel):
    h = (i == n) ? 0 : heights[i]
    while stack not empty and heights[stack.top] >= h:
        height = heights[stack.pop()]
        left = stack empty ? -1 : stack.top
        width = i - left - 1
        best = max(best, height * width)
    stack.push(i)
return best`
      ],
      solution: {
        java: `import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        Deque<Integer> stack = new ArrayDeque<>();
        int best = 0;
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] >= h) {
                int height = heights[stack.pop()];
                int left = stack.isEmpty() ? -1 : stack.peek();
                int width = i - left - 1;
                best = Math.max(best, height * width);
            }
            stack.push(i);
        }
        return best;
    }
}`,
        explanation: `The stack stores indices of bars in non-decreasing height order. When a shorter bar arrives, every taller bar on the stack is popped and scored: the arriving index is the first shorter bar to its right, and the index left on the stack is the first shorter bar to its left, so height times the span between them is the largest rectangle using that bar as the limiting height. A sentinel height of 0 at the end flushes the stack, and each bar is pushed and popped once, giving linear time.`,
        time: "O(n)",
        space: "O(n)"
      }
    }
  ]
});

window.PROBLEM_BANK.push({
  id: "heaps-top-k",
  name: "Heaps & Top-K",
  group: "Stacks & Heaps",
  order: 9,
  tagline: "Priority access without full sorting",
  blurb: "Heaps give O(log n) access to the smallest or largest item without sorting everything, which is exactly what streaming, scheduling, and top-k problems need. Whenever you repeatedly ask for \"the current best/worst k elements,\" a bounded PriorityQueue usually beats a full sort.",
  problems: [
    {
      id: "kth-largest-element-in-a-stream",
      title: "Kth Largest Element in a Stream",
      difficulty: "Easy",
      description: `Design a class that finds the kth largest element in a stream of integers, counting duplicates. Implement KthLargest(int k, int[] nums) which initializes the object with the integer k and initial stream nums, and int add(int val) which appends val to the stream and returns the element representing the kth largest element so far.

Input: KthLargest(3, [4, 5, 8, 2]); add(3); add(5); add(10); add(9); add(4)
Output: 4, 5, 5, 8, 8`,
      hints: [
        `You never need the whole sorted stream — only enough information to answer one specific rank query over and over as elements arrive. Which k elements are the only ones that can ever matter?`,
        `Keep just the k largest elements seen so far in a min-heap. The heap's smallest element (its root) is then exactly the kth largest overall.`,
        `constructor(k, nums):
    minHeap = empty, store k
    for num in nums: add(num)
add(val):
    minHeap.offer(val)
    if minHeap.size > k: minHeap.poll()
    return minHeap.peek()`
      ],
      solution: {
        java: `import java.util.PriorityQueue;

class KthLargest {
    private final PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    private final int k;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int num : nums) {
            add(num);
        }
    }

    public int add(int val) {
        minHeap.offer(val);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
        return minHeap.peek();
    }
}`,
        explanation: `A min-heap capped at size k always contains the k largest elements seen so far, because any time it overflows we discard its smallest member. The root of that heap is therefore the kth largest element of the entire stream, making each add a couple of O(log k) heap operations.`,
        time: "O(log k) per add",
        space: "O(k)"
      }
    },
    {
      id: "last-stone-weight",
      title: "Last Stone Weight",
      difficulty: "Easy",
      description: `You are given an array of integers stones where stones[i] is the weight of the ith stone. On each turn, choose the two heaviest stones x <= y and smash them together: if x == y both are destroyed; otherwise the stone of weight y - x remains. Return the weight of the last remaining stone, or 0 if none remain.

Input: stones = [2, 7, 4, 1, 8, 1]
Output: 1`,
      hints: [
        `The simulation repeatedly needs the two heaviest stones, and the collection shrinks and changes after every smash. What structure hands you the current maximum cheaply after arbitrary insertions and removals?`,
        `Load all stones into a max-heap. Repeatedly poll the top two; if they differ, push the difference back. Stop when at most one stone remains.`,
        `maxHeap = all stones
while maxHeap.size > 1:
    y = poll(), x = poll()   // y >= x
    if y != x: offer(y - x)
return maxHeap empty ? 0 : peek()`
      ],
      solution: {
        java: `import java.util.Collections;
import java.util.PriorityQueue;

class Solution {
    public int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int stone : stones) {
            maxHeap.offer(stone);
        }
        while (maxHeap.size() > 1) {
            int y = maxHeap.poll();
            int x = maxHeap.poll();
            if (y != x) {
                maxHeap.offer(y - x);
            }
        }
        return maxHeap.isEmpty() ? 0 : maxHeap.peek();
    }
}`,
        explanation: `A max-heap makes "give me the two heaviest stones" an O(log n) operation, so we can simulate the game directly: poll twice, and re-insert the difference when the stones are unequal. Each smash removes at least one stone permanently, so there are at most n - 1 rounds before zero or one stone remains.`,
        time: "O(n log n)",
        space: "O(n)"
      }
    },
    {
      id: "k-closest-points-to-origin",
      title: "K Closest Points to Origin",
      difficulty: "Medium",
      description: `Given an array of points where points[i] = [xi, yi] represents a point on the plane, and an integer k, return the k points closest to the origin (0, 0) measured by Euclidean distance. The answer may be returned in any order and is guaranteed to be unique except for ordering.

Input: points = [[1, 3], [-2, 2]], k = 1
Output: [[-2, 2]]`,
      hints: [
        `Sorting all n points works but does more than asked: you only care about membership in the closest k, not a full ordering. Also note you can compare squared distances and skip the square root entirely.`,
        `Maintain a max-heap of at most k points keyed by squared distance. When it grows past k, evict the farthest point — whatever survives the whole pass is the answer.`,
        `maxHeap ordered by squared distance, farthest on top
for p in points:
    offer(p)
    if heap.size > k: poll()   // drop current farthest
collect heap contents into result array
return result`
      ],
      solution: {
        java: `import java.util.PriorityQueue;

class Solution {
    public int[][] kClosest(int[][] points, int k) {
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
                (a, b) -> Long.compare(squaredDist(b), squaredDist(a)));
        for (int[] point : points) {
            maxHeap.offer(point);
            if (maxHeap.size() > k) {
                maxHeap.poll();
            }
        }
        int[][] result = new int[k][];
        for (int i = 0; i < k; i++) {
            result[i] = maxHeap.poll();
        }
        return result;
    }

    private long squaredDist(int[] p) {
        return (long) p[0] * p[0] + (long) p[1] * p[1];
    }
}`,
        explanation: `We keep a max-heap of size k ordered by squared distance, so its root is always the farthest of the current candidates. Every point is offered once, and any time the heap exceeds k we evict that farthest root, guaranteeing the survivors are the k closest points. Squared distance preserves the ordering of Euclidean distance, avoiding floating point entirely.`,
        time: "O(n log k)",
        space: "O(k)"
      }
    },
    {
      id: "kth-largest-element-in-an-array",
      title: "Kth Largest Element in an Array",
      difficulty: "Medium",
      description: `Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in sorted order, not the kth distinct element. Try to solve it without fully sorting the array.

Input: nums = [3, 2, 1, 5, 6, 4], k = 2
Output: 5`,
      hints: [
        `A full sort answers far more questions than you were asked. You only need to separate the top k elements from everything else — the order of the rest is irrelevant.`,
        `Sweep the array once while maintaining a min-heap of the k largest elements seen so far; evict the root whenever the heap exceeds k. (Quickselect achieves average O(n), but the heap version is the clean, dependable interview answer.)`,
        `minHeap = empty
for num in nums:
    offer(num)
    if heap.size > k: poll()
return peek()   // smallest of the k largest = kth largest`
      ],
      solution: {
        java: `import java.util.PriorityQueue;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.offer(num);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
        return minHeap.peek();
    }
}`,
        explanation: `A min-heap bounded at size k retains exactly the k largest values: whenever a new value pushes the size past k, the smallest current member is discarded and can never have been the answer. After one pass the heap root is the smallest of the k largest values, which is by definition the kth largest element. This runs in O(n log k), beating a full O(n log n) sort when k is small.`,
        time: "O(n log k)",
        space: "O(k)"
      }
    },
    {
      id: "task-scheduler",
      title: "Task Scheduler",
      difficulty: "Medium",
      description: `You are given an array of CPU tasks labeled 'A' to 'Z' and an integer n. Each CPU interval executes one task or sits idle, and two executions of the same task label must be at least n intervals apart. Return the minimum number of intervals required to complete all tasks.

Input: tasks = ["A", "A", "A", "B", "B", "B"], n = 2
Output: 8 (one valid order is A -> B -> idle -> A -> B -> idle -> A -> B)`,
      hints: [
        `Only the counts of each label matter, not their original order. Intuitively, which task should you schedule first at any moment to avoid painting yourself into a corner full of forced idles?`,
        `Greedy: at every interval run the available task with the highest remaining count, using a max-heap of counts plus a cooldown queue of tasks waiting out their n-interval gap with their ready time.`,
        `count occurrences of each label; push counts into maxHeap
time = 0; cooldown = FIFO of (remainingCount, readyTime)
while maxHeap not empty or cooldown not empty:
    time += 1
    if maxHeap not empty:
        c = poll() - 1
        if c > 0: cooldown.add((c, time + n))
    if cooldown.head exists and head.readyTime == time:
        offer(cooldown.remove().remainingCount)
return time`
      ],
      solution: {
        java: `import java.util.ArrayDeque;
import java.util.Collections;
import java.util.Deque;
import java.util.PriorityQueue;

class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] counts = new int[26];
        for (char task : tasks) {
            counts[task - 'A']++;
        }
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int count : counts) {
            if (count > 0) {
                maxHeap.offer(count);
            }
        }
        Deque<int[]> cooldown = new ArrayDeque<>(); // {remainingCount, readyTime}
        int time = 0;
        while (!maxHeap.isEmpty() || !cooldown.isEmpty()) {
            time++;
            if (!maxHeap.isEmpty()) {
                int remaining = maxHeap.poll() - 1;
                if (remaining > 0) {
                    cooldown.offer(new int[]{remaining, time + n});
                }
            }
            if (!cooldown.isEmpty() && cooldown.peek()[1] == time) {
                maxHeap.offer(cooldown.poll()[0]);
            }
        }
        return time;
    }
}`,
        explanation: `At each tick we greedily run the available task with the most remaining executions, because the most frequent task is the one that forces idle slots if deferred. A max-heap supplies that task in O(log 26), and a FIFO cooldown queue holds tasks until time reaches their readyTime, at which point they re-enter the heap. Ticks where the heap is empty but the cooldown queue is not are the mandatory idle intervals, so the final clock value is the minimum schedule length.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "find-median-from-data-stream",
      title: "Find Median from Data Stream",
      difficulty: "Hard",
      description: `The median is the middle value in an ordered list; if the list length is even, it is the mean of the two middle values. Design a data structure that supports addNum(int num), which adds a number from a data stream, and findMedian(), which returns the median of all elements added so far.

Input: addNum(1), addNum(2), findMedian(), addNum(3), findMedian()
Output: 1.5, 2.0`,
      hints: [
        `Keeping a sorted list makes findMedian trivial but insertion linear. You do not need total order — you only ever look at one or two values in the very middle. What partial ordering is enough?`,
        `Split the numbers into two halves: a max-heap holding the smaller half and a min-heap holding the larger half, balanced so their sizes differ by at most one. The median lives at the heap tops.`,
        `low = maxHeap (smaller half), high = minHeap (larger half)
addNum(num):
    low.offer(num)
    high.offer(low.poll())        // route the largest of low upward
    if high.size > low.size:
        low.offer(high.poll())    // rebalance so low.size >= high.size
findMedian():
    if low.size > high.size: return low.peek()
    return (low.peek() + high.peek()) / 2.0`
      ],
      solution: {
        java: `import java.util.Collections;
import java.util.PriorityQueue;

class MedianFinder {
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());
    private final PriorityQueue<Integer> high = new PriorityQueue<>();

    public void addNum(int num) {
        low.offer(num);
        high.offer(low.poll());
        if (high.size() > low.size()) {
            low.offer(high.poll());
        }
    }

    public double findMedian() {
        if (low.size() > high.size()) {
            return low.peek();
        }
        return (low.peek() + high.peek()) / 2.0;
    }
}`,
        explanation: `Two heaps partition the stream around the median: a max-heap for the smaller half and a min-heap for the larger half. Every insertion first passes through the low heap and pushes its maximum into the high heap, guaranteeing every element in low is <= every element in high, and a final size check keeps low at most one element larger. The median is then either the top of low (odd count) or the average of the two tops (even count), giving O(log n) inserts and O(1) medians.`,
        time: "O(log n) per add",
        space: "O(n)"
      }
    }
  ]
});
