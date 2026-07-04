window.PROBLEM_BANK = window.PROBLEM_BANK || [];

window.PROBLEM_BANK.push({
  id: "fast-slow-pointers",
  name: "Fast & Slow Pointers",
  group: "Pointers & Search",
  order: 5,
  tagline: "Two speeds expose cycles",
  blurb: `Move two pointers through a sequence at different speeds; if a cycle exists they must meet, and their meeting point encodes structure. Use it for cycle detection, finding midpoints, and problems that secretly form a linked list.`,
  problems: [
    {
      id: "linked-list-cycle",
      title: "Linked List Cycle",
      difficulty: "Easy",
      description: `Given the head of a singly linked list, determine whether the list contains a cycle. A cycle exists if some node can be reached again by continuously following next pointers. Return true if there is a cycle, false otherwise. Solve it using O(1) memory.

Input: head = [3,2,0,-4], pos = 1 (tail connects to index 1)
Output: true`,
      hints: [
        `Hint 1: Storing every node you have visited works, but the follow-up asks for constant memory. Think about what must happen to two runners on a circular track.`,
        `Hint 2: Advance one pointer by one step and another by two steps. In a cycle, the gap between them shrinks by one each iteration, so they must collide.`,
        `Hint 3:
slow = head, fast = head
while fast != null and fast.next != null:
    slow = slow.next
    fast = fast.next.next
    if slow == fast: return true
return false`
      ],
      solution: {
        java: `// class ListNode { int val; ListNode next; ListNode(int x) { val = x; next = null; } }
class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                return true;
            }
        }
        return false;
    }
}`,
        explanation: `Floyd's tortoise-and-hare: the fast pointer moves two steps per iteration, the slow pointer one. If there is no cycle, fast reaches null. If there is a cycle, once both pointers are inside it the distance between them decreases by exactly one per step, so they must meet.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "linked-list-cycle-ii",
      title: "Linked List Cycle II",
      difficulty: "Medium",
      description: `Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null. Do not modify the list, and use O(1) memory.

Input: head = [3,2,0,-4], pos = 1 (tail connects to index 1)
Output: the node with value 2`,
      hints: [
        `Hint 1: First establish whether a cycle exists at all with constant memory. The meeting point of your detection step is not random; it carries information about where the cycle starts.`,
        `Hint 2: Let L be the distance from head to the cycle entry. After slow and fast meet, a pointer restarted at head and the pointer left at the meeting point are both exactly L steps (moving one at a time) from the cycle entry.`,
        `Hint 3:
slow = fast = head
repeat: slow = slow.next; fast = fast.next.next
    until fast hits null (return null) or slow == fast
ptr = head
while ptr != slow:
    ptr = ptr.next; slow = slow.next
return ptr`
      ],
      solution: {
        java: `// class ListNode { int val; ListNode next; ListNode(int x) { val = x; next = null; } }
class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                ListNode ptr = head;
                while (ptr != slow) {
                    ptr = ptr.next;
                    slow = slow.next;
                }
                return ptr;
            }
        }
        return null;
    }
}`,
        explanation: `Run Floyd's algorithm to find a meeting point inside the cycle. If the head is L nodes from the cycle entry and the meeting point is K nodes into the cycle of length C, one can show fast having traveled twice slow's distance forces L = C - K (mod C). Therefore walking one pointer from the head and one from the meeting point, both one step at a time, makes them collide exactly at the cycle entry.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "middle-of-the-linked-list",
      title: "Middle of the Linked List",
      difficulty: "Easy",
      description: `Given the head of a singly linked list, return the middle node. If the list has an even number of nodes, return the second of the two middle nodes. Try to do it in a single pass.

Input: head = [1,2,3,4,5]
Output: node 3 (the list [3,4,5])`,
      hints: [
        `Hint 1: Counting the length first requires two passes. Can two pointers moving simultaneously find the middle in one pass?`,
        `Hint 2: If one pointer moves twice as fast as the other, where is the slow one when the fast one runs off the end?`,
        `Hint 3:
slow = head, fast = head
while fast != null and fast.next != null:
    slow = slow.next
    fast = fast.next.next
return slow`
      ],
      solution: {
        java: `// class ListNode { int val; ListNode next; ListNode(int x) { val = x; next = null; } }
class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}`,
        explanation: `The fast pointer covers two nodes for every one the slow pointer covers, so when fast exhausts the list, slow sits at the midpoint. The loop condition (fast != null && fast.next != null) naturally lands slow on the second middle node for even-length lists, matching the problem's requirement.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "happy-number",
      title: "Happy Number",
      difficulty: "Easy",
      description: `A happy number is defined by repeatedly replacing a number with the sum of the squares of its digits. If this process reaches 1 it stays there, and the number is happy; otherwise it loops endlessly in a cycle that never includes 1. Given a positive integer n, return true if n is a happy number.

Input: n = 19
Output: true (19 -> 82 -> 68 -> 100 -> 1)`,
      hints: [
        `Hint 1: The digit-square-sum operation defines an implicit successor for every number, like a next pointer. What does "loops endlessly" mean in that implicit linked list?`,
        `Hint 2: You could store seen values in a HashSet, but cycle detection with two pointers moving at different speeds needs no extra memory. Treat "apply the digit-square-sum once" as one step.`,
        `Hint 3:
next(x): sum of squares of digits of x
slow = n, fast = next(n)
while fast != 1 and slow != fast:
    slow = next(slow)
    fast = next(next(fast))
return fast == 1`
      ],
      solution: {
        java: `class Solution {
    public boolean isHappy(int n) {
        int slow = n;
        int fast = next(n);
        while (fast != 1 && slow != fast) {
            slow = next(slow);
            fast = next(next(fast));
        }
        return fast == 1;
    }

    private int next(int x) {
        int sum = 0;
        while (x > 0) {
            int d = x % 10;
            sum += d * d;
            x /= 10;
        }
        return sum;
    }
}`,
        explanation: `The sequence n, next(n), next(next(n)), ... is a functional graph walk that either reaches the fixed point 1 or enters a cycle (values are bounded, so it cannot grow forever). Applying Floyd's cycle detection over this implicit list distinguishes the two cases without a HashSet: if fast reaches 1 the number is happy; if slow and fast meet elsewhere, the walk is stuck in a non-1 cycle.`,
        time: "O(log n) per step, O(1) cycle length bound overall",
        space: "O(1)"
      }
    },
    {
      id: "find-the-duplicate-number",
      title: "Find the Duplicate Number",
      difficulty: "Hard",
      description: `Given an array nums of n + 1 integers where each integer is in the range [1, n], there is exactly one repeated value (it may repeat more than once). Return that duplicate without modifying the array and using only constant extra space.

Input: nums = [1,3,4,2,2]
Output: 2`,
      hints: [
        `Hint 1: Sorting and HashSets violate the constraints. Since every value is a valid index into the array, following nums[i] as if it were a pointer builds a hidden structure. What does the duplicate value do to that structure?`,
        `Hint 2: Treat i -> nums[i] as a linked list starting at index 0. Two indices pointing at the same node means the "list" has a node with two incoming edges: a cycle whose entry is the duplicate. Now reuse Linked List Cycle II.`,
        `Hint 3:
slow = nums[0], fast = nums[nums[0]]
while slow != fast:
    slow = nums[slow]
    fast = nums[nums[fast]]
slow = 0
while slow != fast:
    slow = nums[slow]
    fast = nums[fast]
return slow`
      ],
      solution: {
        java: `class Solution {
    public int findDuplicate(int[] nums) {
        int slow = nums[0];
        int fast = nums[nums[0]];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[nums[fast]];
        }
        slow = 0;
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}`,
        explanation: `Interpreting the array as a function i -> nums[i] gives a walk from index 0 that must enter a cycle, because two different indices hold the duplicate value and therefore point at the same node. The cycle's entry index equals the duplicate value itself, so Floyd's algorithm (detect the meeting point, then advance one pointer from the start and one from the meeting point in lockstep) returns the duplicate in O(1) space without touching the array contents.`,
        time: "O(n)",
        space: "O(1)"
      }
    }
  ]
});

window.PROBLEM_BANK.push({
  id: "linked-list-reversal",
  name: "In-place Linked List Reversal",
  group: "Pointers & Search",
  order: 6,
  tagline: "Rewire next pointers in place",
  blurb: `Reverse all or part of a linked list by iteratively redirecting next pointers with a prev/curr pair, using no extra memory. It is the core move behind reordering, swapping, and k-group problems, and a dummy head node tames the edge cases.`,
  problems: [
    {
      id: "reverse-linked-list",
      title: "Reverse Linked List",
      difficulty: "Easy",
      description: `Given the head of a singly linked list, reverse the list and return the new head. Do it iteratively with O(1) extra space.

Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]`,
      hints: [
        `Hint 1: Copying values into an array and rebuilding is wasteful. Each node's next pointer just needs to point the other way — what state must you carry along to do that safely?`,
        `Hint 2: Walk the list with a prev pointer trailing a curr pointer. Before flipping curr.next to prev, stash curr.next somewhere or you lose the rest of the list.`,
        `Hint 3:
prev = null, curr = head
while curr != null:
    nxt = curr.next
    curr.next = prev
    prev = curr
    curr = nxt
return prev`
      ],
      solution: {
        java: `// class ListNode { int val; ListNode next; ListNode(int x) { val = x; next = null; } }
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
        explanation: `Maintain the invariant that prev heads an already-reversed prefix and curr heads the untouched suffix. Each iteration detaches curr, points it back at prev, and advances both pointers using the saved next reference. When curr runs off the end, prev is the head of the fully reversed list.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "reverse-linked-list-ii",
      title: "Reverse Linked List II",
      difficulty: "Medium",
      description: `Given the head of a singly linked list and two integers left and right where 1 <= left <= right <= n, reverse the nodes from position left to position right (1-indexed) and return the head. Do it in one pass.

Input: head = [1,2,3,4,5], left = 2, right = 4
Output: [1,4,3,2,5]`,
      hints: [
        `Hint 1: This is standard list reversal confined to a window. The tricky part is not the reversal itself but reconnecting the window's two ends to the untouched parts. What if left = 1?`,
        `Hint 2: Use a dummy node before head so the node preceding the window always exists. Walk to that predecessor, then repeatedly move the node just after the window's first node to the front of the window (head-insertion), right - left times.`,
        `Hint 3:
dummy.next = head; pre = dummy
advance pre (left - 1) times
start = pre.next
repeat (right - left) times:
    then = start.next
    start.next = then.next
    then.next = pre.next
    pre.next = then
return dummy.next`
      ],
      solution: {
        java: `// class ListNode { int val; ListNode next; ListNode(int x) { val = x; next = null; } }
class Solution {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode pre = dummy;
        for (int i = 0; i < left - 1; i++) {
            pre = pre.next;
        }
        ListNode start = pre.next;
        for (int i = 0; i < right - left; i++) {
            ListNode then = start.next;
            start.next = then.next;
            then.next = pre.next;
            pre.next = then;
        }
        return dummy.next;
    }
}`,
        explanation: `A dummy head removes the left = 1 special case. After positioning pre just before the window, each iteration unlinks the node following start and reinserts it directly after pre; after right - left such head-insertions the window is reversed and both boundaries are already connected correctly, all in one pass.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "swap-nodes-in-pairs",
      title: "Swap Nodes in Pairs",
      difficulty: "Medium",
      description: `Given a linked list, swap every two adjacent nodes and return the head. You must swap the nodes themselves, not just their values. A trailing odd node stays in place.

Input: head = [1,2,3,4]
Output: [2,1,4,3]`,
      hints: [
        `Hint 1: Swapping values is the forbidden shortcut; the interviewer wants pointer surgery. For each pair, how many pointers change, and who needs to point at the swapped pair afterward?`,
        `Hint 2: Keep a pointer to the node before the current pair (a dummy node makes one exist before the first pair). Rewire prev -> second -> first -> rest, then advance prev to first.`,
        `Hint 3:
dummy.next = head; prev = dummy
while prev.next and prev.next.next exist:
    first = prev.next; second = first.next
    first.next = second.next
    second.next = first
    prev.next = second
    prev = first
return dummy.next`
      ],
      solution: {
        java: `// class ListNode { int val; ListNode next; ListNode(int x) { val = x; next = null; } }
class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prev = dummy;
        while (prev.next != null && prev.next.next != null) {
            ListNode first = prev.next;
            ListNode second = first.next;
            first.next = second.next;
            second.next = first;
            prev.next = second;
            prev = first;
        }
        return dummy.next;
    }
}`,
        explanation: `Each pair swap changes exactly three pointers: the predecessor now targets the second node, the second targets the first, and the first targets whatever followed the pair. The dummy node supplies a predecessor for the very first pair, and the loop guard leaves a lone odd node untouched.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "reorder-list",
      title: "Reorder List",
      difficulty: "Medium",
      description: `Given the head of a singly linked list L0 -> L1 -> ... -> Ln, reorder it in place to L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ... You may not modify node values, only next pointers.

Input: head = [1,2,3,4,5]
Output: [1,5,2,4,3]`,
      hints: [
        `Hint 1: The target order alternates between the front of the list and the back of the list. Random access into a singly linked list is impossible — but what two sublists, merged alternately, would produce exactly this order?`,
        `Hint 2: Combine three primitives you already know: find the middle with fast/slow pointers, reverse the second half in place, then splice the two halves together one node at a time.`,
        `Hint 3:
slow/fast walk to find middle
second = slow.next; slow.next = null
second = reverse(second)
first = head
while second != null:
    t1 = first.next; t2 = second.next
    first.next = second; second.next = t1
    first = t1; second = t2`
      ],
      solution: {
        java: `// class ListNode { int val; ListNode next; ListNode(int x) { val = x; next = null; } }
class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) {
            return;
        }
        ListNode slow = head;
        ListNode fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = slow.next;
        slow.next = null;
        ListNode prev = null;
        while (second != null) {
            ListNode next = second.next;
            second.next = prev;
            prev = second;
            second = next;
        }
        second = prev;
        ListNode first = head;
        while (second != null) {
            ListNode t1 = first.next;
            ListNode t2 = second.next;
            first.next = second;
            second.next = t1;
            first = t1;
            second = t2;
        }
    }
}`,
        explanation: `Split the list at its midpoint (fast/slow pointers), reverse the second half in place, then interleave the two halves. The reversed second half supplies Ln, Ln-1, ... exactly when the merge asks for them, and because the second half is never longer than the first, the splice loop terminates cleanly with all pointers connected.`,
        time: "O(n)",
        space: "O(1)"
      }
    },
    {
      id: "reverse-nodes-in-k-group",
      title: "Reverse Nodes in k-Group",
      difficulty: "Super Hard",
      description: `Given the head of a linked list and an integer k, reverse the nodes of the list k at a time and return the modified list. Nodes that remain at the end in a group of fewer than k must keep their original order. You may not alter node values, and you should use O(1) extra space.

Input: head = [1,2,3,4,5], k = 3
Output: [3,2,1,4,5]`,
      hints: [
        `Hint 1: This is repeated bounded reversal with strict bookkeeping. Before touching any pointers in a group, what must you verify about the nodes ahead, and which two outside nodes will need reconnecting afterward?`,
        `Hint 2: Use a dummy node and keep groupPrev before each group. Probe k nodes ahead; if fewer remain, stop. Reverse exactly the k nodes of the group with the standard prev/curr loop, then stitch: groupPrev.next becomes the group's old tail-now-head, and the group's old head-now-tail becomes the next groupPrev.`,
        `Hint 3:
dummy.next = head; groupPrev = dummy
loop:
    kth = groupPrev advanced k times (null -> break)
    groupNext = kth.next
    prev = groupNext; curr = groupPrev.next
    while curr != groupNext:
        nxt = curr.next; curr.next = prev
        prev = curr; curr = nxt
    tmp = groupPrev.next
    groupPrev.next = kth
    groupPrev = tmp
return dummy.next`
      ],
      solution: {
        java: `// class ListNode { int val; ListNode next; ListNode(int x) { val = x; next = null; } }
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode groupPrev = dummy;
        while (true) {
            ListNode kth = getKth(groupPrev, k);
            if (kth == null) {
                break;
            }
            ListNode groupNext = kth.next;
            ListNode prev = groupNext;
            ListNode curr = groupPrev.next;
            while (curr != groupNext) {
                ListNode next = curr.next;
                curr.next = prev;
                prev = curr;
                curr = next;
            }
            ListNode tmp = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = tmp;
        }
        return dummy.next;
    }

    private ListNode getKth(ListNode node, int k) {
        while (node != null && k > 0) {
            node = node.next;
            k--;
        }
        return node;
    }
}`,
        explanation: `For each group, first probe whether k nodes exist; if not, the remainder is left untouched as required. Initializing the reversal's prev to groupNext makes the group's old head point directly at the rest of the list the moment it becomes the tail, so after relinking groupPrev to the k-th node the group is fully integrated. Every node is visited a constant number of times and only pointers are rewritten.`,
        time: "O(n)",
        space: "O(1)"
      }
    }
  ]
});

window.PROBLEM_BANK.push({
  id: "binary-search",
  name: "Binary Search & Variants",
  group: "Pointers & Search",
  order: 7,
  tagline: "Halve the search space",
  blurb: `Whenever a predicate is monotonic over a sorted or otherwise ordered domain — indices, rotated arrays, or an answer space like speeds and capacities — binary search discards half the candidates per step. Mastering the boundary conditions (lo/hi updates, mid rounding, loop exit) is the whole game.`,
  problems: [
    {
      id: "classic-binary-search",
      title: "Binary Search",
      difficulty: "Easy",
      description: `Given a sorted (ascending) array of distinct integers nums and a target value, return the index of target if it exists, otherwise return -1. Your algorithm must run in O(log n) time.

Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4`,
      hints: [
        `Hint 1: The O(log n) requirement rules out scanning. What single comparison lets you permanently discard half of a sorted array?`,
        `Hint 2: Keep lo and hi bounds on where the target can still live. Compare the middle element to the target and move the appropriate bound past mid — never leave mid inside the range, or you risk an infinite loop.`,
        `Hint 3:
lo = 0, hi = n - 1
while lo <= hi:
    mid = lo + (hi - lo) / 2
    if nums[mid] == target: return mid
    else if nums[mid] < target: lo = mid + 1
    else: hi = mid - 1
return -1`
      ],
      solution: {
        java: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0;
        int hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return -1;
    }
}`,
        explanation: `Maintain the invariant that if target exists, it lies in [lo, hi]. Each comparison against the middle element eliminates half the interval, and writing mid as lo + (hi - lo) / 2 avoids integer overflow. The loop ends either at the target or with an empty interval.`,
        time: "O(log n)",
        space: "O(1)"
      }
    },
    {
      id: "find-first-and-last-position",
      title: "Find First and Last Position of Element in Sorted Array",
      difficulty: "Medium",
      description: `Given a sorted array nums that may contain duplicates and a target value, return the starting and ending index of target as [first, last]. If target is not present, return [-1, -1]. Required complexity: O(log n).

Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]`,
      hints: [
        `Hint 1: One vanilla binary search lands on some occurrence of target, but not a specific one. What tweak to the search's behavior on an exact match would push it toward an edge of the run of duplicates?`,
        `Hint 2: Run two biased binary searches: one that keeps searching left after finding target (recording the match), and one that keeps searching right. Each is still O(log n).`,
        `Hint 3:
findEdge(leftBias):
    lo = 0, hi = n - 1, ans = -1
    while lo <= hi:
        mid = (lo + hi) / 2
        if nums[mid] == target: ans = mid; leftBias ? hi = mid - 1 : lo = mid + 1
        else if nums[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return ans
return [findEdge(true), findEdge(false)]`
      ],
      solution: {
        java: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        return new int[] { findEdge(nums, target, true), findEdge(nums, target, false) };
    }

    private int findEdge(int[] nums, int target, boolean leftBias) {
        int lo = 0;
        int hi = nums.length - 1;
        int ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                ans = mid;
                if (leftBias) {
                    hi = mid - 1;
                } else {
                    lo = mid + 1;
                }
            } else if (nums[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ans;
    }
}`,
        explanation: `Two biased binary searches solve it: on a match, the left-biased search records the index and continues into the left half to find an earlier occurrence, while the right-biased one continues right. Each search halves the interval every step, so the total remains logarithmic, and a missing target leaves both answers at -1.`,
        time: "O(log n)",
        space: "O(1)"
      }
    },
    {
      id: "search-in-rotated-sorted-array",
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      description: `An ascending array with distinct values has been rotated at an unknown pivot (e.g., [0,1,2,4,5,6,7] becomes [4,5,6,7,0,1,2]). Given the rotated array nums and a target, return its index or -1, in O(log n) time.

Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4`,
      hints: [
        `Hint 1: The array is not sorted, yet O(log n) is demanded — so halving must still be possible. Look at nums[lo], nums[mid], nums[hi]: what is guaranteed about at least one of the two halves?`,
        `Hint 2: One side of mid is always properly sorted (compare nums[lo] with nums[mid] to tell which). Check whether the target lies inside that sorted side's range; if yes, search it, otherwise search the other side.`,
        `Hint 3:
lo = 0, hi = n - 1
while lo <= hi:
    mid = (lo + hi) / 2
    if nums[mid] == target: return mid
    if nums[lo] <= nums[mid]:            // left half sorted
        if nums[lo] <= target < nums[mid]: hi = mid - 1
        else: lo = mid + 1
    else:                                 // right half sorted
        if nums[mid] < target <= nums[hi]: lo = mid + 1
        else: hi = mid - 1
return -1`
      ],
      solution: {
        java: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0;
        int hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                return mid;
            }
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) {
                    hi = mid - 1;
                } else {
                    lo = mid + 1;
                }
            } else {
                if (nums[mid] < target && target <= nums[hi]) {
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
        }
        return -1;
    }
}`,
        explanation: `A single rotation leaves at least one half of any [lo, hi] window fully sorted, identifiable by comparing nums[lo] to nums[mid]. If the target's value falls within the sorted half's endpoints, recurse into it; otherwise it can only be in the other half. Either way half the window is discarded per iteration, preserving O(log n).`,
        time: "O(log n)",
        space: "O(1)"
      }
    },
    {
      id: "find-minimum-in-rotated-sorted-array",
      title: "Find Minimum in Rotated Sorted Array",
      difficulty: "Medium",
      description: `A sorted array of unique elements has been rotated between 1 and n times. Return the minimum element in O(log n) time.

Input: nums = [3,4,5,1,2]
Output: 1`,
      hints: [
        `Hint 1: The minimum is the single "drop point" where order breaks. A linear scan finds it, but the required bound says you should be able to tell which half contains the drop using only a couple of comparisons.`,
        `Hint 2: Compare nums[mid] to nums[hi]. If nums[mid] > nums[hi], the drop (and the minimum) is strictly to the right of mid; otherwise the minimum is at mid or to its left. Note mid itself stays a candidate in the second case.`,
        `Hint 3:
lo = 0, hi = n - 1
while lo < hi:
    mid = (lo + hi) / 2
    if nums[mid] > nums[hi]: lo = mid + 1
    else: hi = mid
return nums[lo]`
      ],
      solution: {
        java: `class Solution {
    public int findMin(int[] nums) {
        int lo = 0;
        int hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return nums[lo];
    }
}`,
        explanation: `Comparing against the right endpoint is the key: nums[mid] > nums[hi] proves the rotation point lies in (mid, hi], so the minimum cannot be at or before mid; otherwise the segment [mid, hi] is sorted and the minimum is at mid or earlier. The half-open updates (lo = mid + 1 versus hi = mid) shrink the range every step and converge with lo == hi at the minimum.`,
        time: "O(log n)",
        space: "O(1)"
      }
    },
    {
      id: "koko-eating-bananas",
      title: "Koko Eating Bananas",
      difficulty: "Medium",
      description: `Koko has piles of bananas, piles[i] bananas in the i-th pile, and h hours before the guards return. Each hour she picks one pile and eats k bananas from it (or the whole pile if fewer than k remain); she cannot switch piles mid-hour. Return the minimum integer eating speed k such that she finishes all bananas within h hours.

Input: piles = [3,6,7,11], h = 8
Output: 4`,
      hints: [
        `Hint 1: Nothing here is a sorted array — but consider the question "can Koko finish at speed k?" How does the answer to that question behave as k grows?`,
        `Hint 2: Feasibility is monotonic: if speed k works, every larger speed works. Binary search over k in [1, max(piles)], where checking a candidate costs one pass summing ceil(pile / k) hours.`,
        `Hint 3:
lo = 1, hi = max(piles)
while lo < hi:
    mid = (lo + hi) / 2
    hours = sum over piles of ceil(pile / mid)
    if hours <= h: hi = mid
    else: lo = mid + 1
return lo`
      ],
      solution: {
        java: `class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int lo = 1;
        int hi = 0;
        for (int pile : piles) {
            hi = Math.max(hi, pile);
        }
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (hoursNeeded(piles, mid) <= h) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }

    private long hoursNeeded(int[] piles, int speed) {
        long hours = 0;
        for (int pile : piles) {
            hours += (pile + speed - 1L) / speed;
        }
        return hours;
    }
}`,
        explanation: `This is binary search on the answer space rather than on an array: the predicate "finishes within h hours at speed k" is monotone in k, so the minimal feasible k is a boundary findable by bisection between 1 and the largest pile. Each feasibility check is a linear pass computing ceiling divisions (done in long arithmetic to avoid overflow), giving O(n log m) overall.`,
        time: "O(n log m), m = max pile",
        space: "O(1)"
      }
    },
    {
      id: "median-of-two-sorted-arrays",
      title: "Median of Two Sorted Arrays",
      difficulty: "Super Hard",
      description: `Given two sorted arrays nums1 and nums2 of sizes m and n, return the median of the combined sorted data. The required time complexity is O(log(m + n)), so merging is not allowed.

Input: nums1 = [1,3], nums2 = [2]
Output: 2.0`,
      hints: [
        `Hint 1: The log bound forbids merging. The median is really a statement about a partition: a way to split all m + n values into a left group and a right group of known sizes. What property must such a split satisfy, and in how many ways can you choose it?`,
        `Hint 2: Binary search only over how many elements of the shorter array go left; the count taken from the longer array is then forced. The split is valid when the max of each left side does not exceed the min of the opposite right side. Use +/- infinity sentinels at array edges.`,
        `Hint 3:
ensure nums1 is the shorter array
lo = 0, hi = m; half = (m + n + 1) / 2
while true:
    i = (lo + hi) / 2; j = half - i
    L1 = (i == 0) ? -inf : nums1[i-1];  R1 = (i == m) ? +inf : nums1[i]
    L2 = (j == 0) ? -inf : nums2[j-1];  R2 = (j == n) ? +inf : nums2[j]
    if L1 <= R2 and L2 <= R1:
        odd  -> return max(L1, L2)
        even -> return (max(L1, L2) + min(R1, R2)) / 2
    else if L1 > R2: hi = i - 1
    else: lo = i + 1`
      ],
      solution: {
        java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }
        int m = nums1.length;
        int n = nums2.length;
        int half = (m + n + 1) / 2;
        int lo = 0;
        int hi = m;
        while (true) {
            int i = lo + (hi - lo) / 2;
            int j = half - i;
            int left1 = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
            int right1 = (i == m) ? Integer.MAX_VALUE : nums1[i];
            int left2 = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
            int right2 = (j == n) ? Integer.MAX_VALUE : nums2[j];
            if (left1 <= right2 && left2 <= right1) {
                if (((m + n) & 1) == 1) {
                    return Math.max(left1, left2);
                }
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2.0;
            } else if (left1 > right2) {
                hi = i - 1;
            } else {
                lo = i + 1;
            }
        }
    }
}`,
        explanation: `The median corresponds to a partition of both arrays where the combined left side holds exactly half the elements and every left value is <= every right value. Binary searching the cut position i in the shorter array forces the cut j in the longer one, and the cross conditions left1 <= right2 and left2 <= right1 tell you whether the cut is correct or which direction to move. Sentinel infinities handle cuts at the array boundaries, and because only the shorter array is searched the cost is O(log(min(m, n))).`,
        time: "O(log(min(m, n)))",
        space: "O(1)"
      }
    }
  ]
});
