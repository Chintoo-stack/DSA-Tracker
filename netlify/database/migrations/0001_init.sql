CREATE TABLE IF NOT EXISTS "profiles" (
  "user_id" text PRIMARY KEY NOT NULL,
  "email" text,
  "name" text,
  "plan" varchar(16) DEFAULT 'free' NOT NULL,
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "questions" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" varchar(128) NOT NULL,
  "title" varchar(255) NOT NULL,
  "difficulty" varchar(16) NOT NULL,
  "topic" varchar(64) NOT NULL,
  "prompt" text NOT NULL,
  "starter" text,
  "is_plus" boolean DEFAULT false NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "questions_slug" ON "questions" ("slug");

CREATE TABLE IF NOT EXISTS "solves" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "question_id" integer NOT NULL,
  "solved_at" timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "solves_user_question" ON "solves" ("user_id", "question_id");

INSERT INTO "questions" ("slug", "title", "difficulty", "topic", "prompt", "starter", "is_plus") VALUES
(
  'two-sum',
  'Two Sum',
  'Easy',
  'Arrays',
  'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.',
  'function twoSum(nums, target) {\n  // return [i, j]\n}',
  false
),
(
  'valid-parentheses',
  'Valid Parentheses',
  'Easy',
  'Stacks',
  'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.',
  'function isValid(s) {\n  // return boolean\n}',
  false
),
(
  'reverse-linked-list',
  'Reverse Linked List',
  'Easy',
  'Linked Lists',
  'Given the head of a singly linked list, reverse the list and return the new head.',
  'function reverseList(head) {\n  // return new head\n}',
  false
),
(
  'binary-search',
  'Binary Search',
  'Easy',
  'Searching',
  'Given a sorted array of integers nums and an integer target, return the index of target if it exists, otherwise return -1. Your algorithm must run in O(log n) time.',
  'function search(nums, target) {\n  // return index or -1\n}',
  false
),
(
  'max-subarray',
  'Maximum Subarray',
  'Medium',
  'Dynamic Programming',
  'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return that sum.',
  'function maxSubArray(nums) {\n  // return number\n}',
  false
),
(
  'climbing-stairs',
  'Climbing Stairs',
  'Easy',
  'Dynamic Programming',
  'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
  'function climbStairs(n) {\n  // return number\n}',
  false
),
(
  'merge-two-lists',
  'Merge Two Sorted Lists',
  'Easy',
  'Linked Lists',
  'You are given the heads of two sorted linked lists. Merge the two lists into one sorted list and return the head of the merged list.',
  'function mergeTwoLists(list1, list2) {\n  // return merged head\n}',
  false
),
(
  'best-time-stock',
  'Best Time to Buy and Sell Stock',
  'Easy',
  'Arrays',
  'You are given an array prices where prices[i] is the price of a stock on the ith day. You may complete at most one transaction. Return the maximum profit you can achieve, or 0 if no profit is possible.',
  'function maxProfit(prices) {\n  // return number\n}',
  false
),
(
  'lru-cache',
  'LRU Cache',
  'Medium',
  'Design',
  'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get(key) and put(key, value) in O(1) average time.',
  'class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}',
  true
),
(
  'trapping-rain-water',
  'Trapping Rain Water',
  'Hard',
  'Two Pointers',
  'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
  'function trap(height) {\n  // return number\n}',
  true
),
(
  'word-search-ii',
  'Word Search II',
  'Hard',
  'Tries',
  'Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically). The same cell may not be used more than once in a word.',
  'function findWords(board, words) {\n  // return string[]\n}',
  true
),
(
  'serialize-binary-tree',
  'Serialize and Deserialize Binary Tree',
  'Hard',
  'Trees',
  'Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work as long as a tree can be converted to a string and the string can be converted back to the same tree structure.',
  'function serialize(root) {}\nfunction deserialize(data) {}',
  true
),
(
  'median-two-sorted',
  'Median of Two Sorted Arrays',
  'Hard',
  'Searching',
  'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
  'function findMedianSortedArrays(nums1, nums2) {\n  // return number\n}',
  true
),
(
  'alien-dictionary',
  'Alien Dictionary',
  'Hard',
  'Graphs',
  'There is a new alien language that uses the English alphabet. You are given a list of words sorted lexicographically by the rules of this new language. Derive the order of letters in this language, or return an empty string if the order is invalid.',
  'function alienOrder(words) {\n  // return string\n}',
  true
);
