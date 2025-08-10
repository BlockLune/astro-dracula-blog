---
abbrlink: d3e12860
categories:
  - CS
  - Algorithms & Data structures
date: 2023-07-27 16:28:42
katex: true
mathjax: true
tags:
  - algorithm
  - data-structure
  - java
  - coursera
  - graph-theory
  - note
title: "Notes for Algorithms, Part II: Undirected Graphs"
---

This is a note for 4.1 Undirected Graphs, _[Algorithms, Part II](https://www.coursera.org/learn/algorithms-part2/)_.

<!--more-->

## Introduction

### Some graph-processing problems

- Path. Is there a path between $s$ and $t$?
- Shortest path. What is the shortest path between $s$ and $t$?
- Cycle. Is there a cycle in the graph?
- Euler tour. Is there a cycle that uses each edge exactly once?
- Hamilton tour. Is there a cycle that uses each vertex exactly once? (classical NP-complete problem)
- Connectivity. Is there a way to connect all of the vertices?
- MST (Minimal Spanning Tree, 最小生成树). What is the best way to connect all of the vertices?
- Biconnectivity (双连通性). Is there a vertex whose removal disconnects the graph? (DFS)
- Planarity. Can you draw the graph in the plane with no crossing edges? (linear-time DFS-based planarity algorithm discovered by Tarjan in 1970s)
- Graph isomorphism (同构). Do two adjacency lists represent the same graph? (graph isomorphism is longstanding open problem, 长期悬而未决)

## Graph API

$$
\begin{aligned}
\text{public class } &\text{Graph} \\\\
                     &\text{Graph(int V)}    &\text{create an empty graph with V vertices}\\\\
                     &\text{Graph(In in)}    &\text{create a graph from input stream}\\\\
       \text{void }  &\text{addEdge(int v, int w)} &\text{add an edge v-w}\\\\
       \text{Iterable\<Integer\> }  &\text{adj(int v)} &\text{vertices adjacent to v}\\\\
       \text{int }  &\text{V()} &\text{number of vertices}\\\\
       \text{int }  &\text{E()} &\text{number of edges}\\\\
       \text{String }  &\text{toString()} &\text{string representation}\\\\
\end{aligned}
$$

### Typical graph-processing code

- compute the degree of $v$

```java
public static in degree(Graph G, int v) {
    int degree = 0;
    for (int w : G.adj(v)) degree++;
    return degree;
}
```

- compute maximum degree

```java
public static int maxDegree(Graph G) {
    int max = 0;
    for (int v = 0; v < G.V(); v++) {
        if (degree(G, v) > max) {
            max = degree(G, v);
        }
    }
    return max;
}
```

- compute average degree

```java
public static double averageDegree(Graph G) {
    return 2.0 * G.E() / G.V();
}
```

- compute self-loops

```java
public static int numberOfSelfLoops(Graph G) {
    int count = 0;
    for (int v = 0; v < G.V(); v++) {
        for (int w : G.adj(v)) {
            if (v == w) {
                count++;
            }
        }
    }
    return count / 2;  // each edge counted twice
}
```

### Representations

- Set-of-edges graph representation
- Adjacency-matrix graph representation
- **Adjacency-list graph representation**

| representation   | space | add edge | edge between v and w? | iterate over vertices adjacent to v? |
| ---------------- | ----- | -------- | --------------------- | ------------------------------------ |
| list of edges    | E     | 1        | E                     | E                                    |
| adjacency matrix | V^2   | 1\*      | 1                     | V                                    |
| adjacency lists  | E+V   | 1        | degree(v)             | degree(v)                            |

\* disallows parallel edges

#### Adjacency-list graph representation: Java implementation

```java
public class Graph {
    private final int V;
    private Bag<Integer>[] adj;  // adjacency lists (using Bag data type)

    public Graph(int V) {
        this.V = V;
        adj = (Bag<Integer>[]) new Bag[V];  // create empty graph with V vertices
        for (int v = 0; v < V; v++) {
            adj[v] = new Bag<Integer>();
        }
    }

    public void addEdge(int v, int w) {
        adj[v].add(w);  // add edge v-w
        adj[w].add(v);  // (parallel edges and self-loops allowed)
    }

    public Iterable<Integer> adj(int v) {
        return adj[v];
    }
}
```

## Depth-first search

**DFS** (to visit a vertex $v$):

- Mark $v$ as visited
- Recursively visit all unmarked vertices $w$ adjacent to $v$

```java
public class DepthFirstPaths {
    private boolean[] marked;  // marked[v] = true if v connected to s
    private int[] edgeTo;      // edgeTo[v] = previous vertex on path from s to v
    private int s;

    public DepthFirstPaths(Graph G, int s) {
        ...                    // initialize data structures
        dfs(G, s);             // find vertices connected to s
    }

    private void dfs(Graph G, int v) {
        marked[v] = true;
        for (int w : G.adj(v)) {
            if (!marked[w]) {
                dfs(G, w);
                edgeTo[w] = v;
            }
        }
    }
}
```

DFS marks all vertices connected to $s$ in time proportional to the sum of their degrees.

After DFS, can find vertices connected to $s$ in constant time and can find a pth to $s$ (if one exists) in time proportional to its length.

```java
public boolean hasPathTo(int v) {
    return marked[v];
}

public Iterable<Integer> pathTo(int v) {
    if (!hasPathTo(v)) return null;
    Stack<Integer> path = new Stack<Integer>();
    for (int x = v; x != s; x = edgeTo[x])
        path.push(x);
    path.push(s);
    return path;
}
```

## Breadth-first search

**BFS** (from source vertex $s$):

- Put $s$ onto a FIFO queue, and mark $s$ as visited
- Repeat until the queue is empty:
  - remove the least recently added vertex $v$
  - add each of $v$'s unvisited neighbors to the queue, and mark them as visited

BFS computes shortest paths from $s$ to all other vertices in a graph in time proportional to $E+V$

```java
public class BreadthFirstPaths {
    private boolean[] marked;
    private int[] edgeTo;
    ...

    private void bfs(Graph G, int s) {
        Queue<Integer> q = new Queue<Integer>();
        q.enqueue(s);
        marked[s] = true;
        while (!q.isEmpty()) {
            int v = q.dequeue();
            for (int w : G.adj(v)) {
                if (!marked[w]) {
                    q.enqueue(w);
                    marked[w] = true;
                    edgeTo[w] = v;
                }
            }
        }
    }
}
```

## Connected components

$$
\begin{aligned}
\text{public class } &\text{CC}\\\\
&\text{CC(Graph G)} &\text{find connected components in G} \\\\
\text{boolean }&\text{connected(int v, int w)} &\text{are v and w connected?} \\\\
\text{int }&\text{count()} &\text{number of connected components} \\\\
\text{int }&\text{id(int v)} &\text{component identifier for v} \\\\
\end{aligned}
$$

**Connected components**:

- Initialize all vertices $v$ as unmarked
- For each unmarked vertex $v$, run DFS to identify all vertices discovered as part of the same component

```java
public class CC {
    private boolean[] marked;
    private int[] id;   // id[v] = id of component containing v
    private int count;  // number of components

    public CC(Graph G) {
        marked = new boolean[G.V()];
        id = new int[G.V()];
        for (int v = 0; v < G.V(); v++) {
            if (!marked[v]) {
                dfs(G, v);
                count++;
            }
        }
    }

    public int count() {
        return count;
    }

    public int id(int v) {
        return id[v];
    }

    private void dfs(Graph G, int v) {
        marked[v] = true;
        id[v] = count;
        for (int w : G.adj(v)) {
            if (!marked[w]) {
                dfs(G, w);
            }
        }
    }
}
```
