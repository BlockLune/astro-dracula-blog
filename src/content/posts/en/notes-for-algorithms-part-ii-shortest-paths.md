---
abbrlink: bff11795
categories:
  - CS
  - Algorithms & Data structures
date: 2024-02-10 13:12:59
tags:
  - algorithm
  - data-structure
  - coursera
  - graph-theory
  - spanning-tree
  - note
title: "Notes for Algorithms, Part II: Shortest Paths"
---

This is a note for 4.4 Shortest Paths, _[Algorithms, Part II](https://www.coursera.org/learn/algorithms-part2/)_.

<!--more-->

Dijkstra's algorithm is essentially the same with Prim's algorithm. Both are in a family of algorithms that compute a graph's spanning tree (BTW, DFS and BFS are also in this family). The main distinction is the rule used to choose next vertex for the tree:

- Dijkstra's: Closest vertex to the source (via a directed path).
- Prim's: Closest vertex to the tree (via an undirected edge).
