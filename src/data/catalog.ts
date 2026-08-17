export type Difficulty = "Easy" | "Medium" | "Hard";
export type Plan = "free" | "plus";

export type QuestionRecord = {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topic: string;
  prompt: string;
  starter: string;
  isPlus: boolean;
};

export const QUESTION_CATALOG: QuestionRecord[] = [
  {
    id: 1,
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    prompt:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
    starter: "function twoSum(nums, target) {\n  // return [i, j]\n}",
    isPlus: false,
  },
  {
    id: 2,
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stacks",
    prompt:
      "Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
    starter: "function isValid(s) {\n  // return boolean\n}",
    isPlus: false,
  },
  {
    id: 3,
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked Lists",
    prompt: "Given the head of a singly linked list, reverse the list and return the new head.",
    starter: "function reverseList(head) {\n  // return new head\n}",
    isPlus: false,
  },
  {
    id: 4,
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Searching",
    prompt:
      "Given a sorted array of integers nums and an integer target, return the index of target if it exists, otherwise return -1. Your algorithm must run in O(log n) time.",
    starter: "function search(nums, target) {\n  // return index or -1\n}",
    isPlus: false,
  },
  {
    id: 5,
    slug: "max-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    prompt:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return that sum.",
    starter: "function maxSubArray(nums) {\n  // return number\n}",
    isPlus: false,
  },
  {
    id: 6,
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    prompt:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    starter: "function climbStairs(n) {\n  // return number\n}",
    isPlus: false,
  },
  {
    id: 7,
    slug: "merge-two-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked Lists",
    prompt:
      "You are given the heads of two sorted linked lists. Merge the two lists into one sorted list and return the head of the merged list.",
    starter: "function mergeTwoLists(list1, list2) {\n  // return merged head\n}",
    isPlus: false,
  },
  {
    id: 8,
    slug: "best-time-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Arrays",
    prompt:
      "You are given an array prices where prices[i] is the price of a stock on the ith day. You may complete at most one transaction. Return the maximum profit you can achieve, or 0 if no profit is possible.",
    starter: "function maxProfit(prices) {\n  // return number\n}",
    isPlus: false,
  },
  {
    id: 9,
    slug: "lru-cache",
    title: "LRU Cache",
    difficulty: "Medium",
    topic: "Design",
    prompt:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get(key) and put(key, value) in O(1) average time.",
    starter: "class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}",
    isPlus: true,
  },
  {
    id: 10,
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topic: "Two Pointers",
    prompt:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    starter: "function trap(height) {\n  // return number\n}",
    isPlus: true,
  },
  {
    id: 11,
    slug: "word-search-ii",
    title: "Word Search II",
    difficulty: "Hard",
    topic: "Tries",
    prompt:
      "Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically). The same cell may not be used more than once in a word.",
    starter: "function findWords(board, words) {\n  // return string[]\n}",
    isPlus: true,
  },
  {
    id: 12,
    slug: "serialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    topic: "Trees",
    prompt:
      "Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work as long as a tree can be converted to a string and the string can be converted back to the same tree structure.",
    starter: "function serialize(root) {}\nfunction deserialize(data) {}",
    isPlus: true,
  },
  {
    id: 13,
    slug: "median-two-sorted",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topic: "Searching",
    prompt:
      "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    starter: "function findMedianSortedArrays(nums1, nums2) {\n  // return number\n}",
    isPlus: true,
  },
  {
    id: 14,
    slug: "alien-dictionary",
    title: "Alien Dictionary",
    difficulty: "Hard",
    topic: "Graphs",
    prompt:
      "There is a new alien language that uses the English alphabet. You are given a list of words sorted lexicographically by the rules of this new language. Derive the order of letters in this language, or return an empty string if the order is invalid.",
    starter: "function alienOrder(words) {\n  // return string\n}",
    isPlus: true,
  },
];

export const FREE_QUESTION_COUNT = QUESTION_CATALOG.filter((q) => !q.isPlus).length;
export const PLUS_QUESTION_COUNT = QUESTION_CATALOG.filter((q) => q.isPlus).length;
export const TOTAL_QUESTION_COUNT = QUESTION_CATALOG.length;
