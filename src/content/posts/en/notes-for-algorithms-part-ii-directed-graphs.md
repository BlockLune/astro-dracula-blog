---
abbrlink: 5b849ae3
categories:
  - CS
  - Algorithms & Data structures
date: 2023-07-29 09:34:51
katex: true
mathjax: true
tags:
  - algorithm
  - data-structure
  - java
  - digraph
  - coursera
  - note
title: "Notes for Algorithms, Part II: Directed Graphs"
---

This is a note for 4.2 Directed Graphs, _[Algorithms, Part II](https://www.coursera.org/learn/algorithms-part2/)_.

<!--more-->

## Introduction

### Some digraph problems

- Path. Is there a directed path from $s$ to $t$?
- Shortest path. What is the shortest directed path from $s$ to $t$?
- Topological sort (拓扑排序). Can you draw a digraph so that all edges point upwards?
- Strong connectivity. Is there a directed path between all pairs of vertices?
- Transitive closure. For which vertices $v$ and $w$ is there a path from $v$ to $w$?
- PageRank. What is the importance of a web page?

## Digraph API

$$
\begin{aligned}
\text{public class } &\text{Digraph} \\\\
                     &\text{Digraph(int V)}    &\text{create an empty digraph with V vertices}\\\\
                     &\text{Digraph(In in)}    &\text{create a digraph from input stream}\\\\
       \text{void }  &\text{addEdge(int v, int w)} &\text{add a directed edge v->w}\\\\
       \text{Iterable\<Integer\> }  &\text{adj(int v)} &\text{vertices pointing from v}\\\\
       \text{int }  &\text{V()} &\text{number of vertices}\\\\
       \text{int }  &\text{E()} &\text{number of edges}\\\\
       \text{Digraph }  &\text{reverse()} &\text{reverse of this digraph}\\\\
       \text{String }  &\text{toString()} &\text{string representation}\\\\
\end{aligned}
$$

## Representations

| representation   | space | insert edge from v to w | edge from v to w? | iterate over vertices pointing from v? |
| ---------------- | ----- | ----------------------- | ----------------- | -------------------------------------- |
| list of edges    | E     | 1                       | E                 | E                                      |
| adjacency matrix | V^2   | 1\*                     | 1                 | V                                      |
| adjacency lists  | E+V   | 1                       | outdegree(v)      | outdegree(v)                           |

\* disallows parallel edges

### Adjacency-lists digraph representation: Java implementation

```java
public class Digraph {
    private final int V;
    private Bag<Integer>[] adj;  // adjacency lists

    public Digraph(int V) {
        this.V = V;
        adj = (Bag<Integer>[]) new Bag[V];  // create empty digraph with V vertices
        for (int v = 0; v < V; v++) {
            adj[v] = new Bag<Integer>();
        }
    }

    // the only difference between Graph and Digraph, apart from their names
    public void addEdge(int v, int w) {
        adj[v].add(w);  // add edge v->w
    }

    public Iterable<Integer> adj(int v) {
        return adj[v];
    }

    public Digraph reverse() {
        Digraph reverse = new Digraph(V);
        for (int v = 0; v < V; v++) {
            for (int w : adj(v)) {
                reverse.addEdge(w, v);
            }
        }
        return reverse;
    }
}
```

## Digraph search

### Depth-first search in digraphs

**Same method as for undirected graphs.**

- Every undirected graph is a digraph (with edges in both directions).
- DFS is a digraph algorithm.

```java
public class DirectedDFS {
    private boolean[] marked;  // true if path from s

    public DirectedDFS(Digraph G, int s) {
        marked = new boolean[G.V()];  // constructor marks vertices reachable from s
        dfs(G, s);
    }

    private void dfs(Digraph G, int v) {  // recursive DFS does the work
        marked[v] = true;
        for (int w : G.adj(v)) {
            if (!marked[w]) {
                dfs(G, w);
            }
        }
    }

    // client can ask whether any vertex is reachable from s
    public boolean visited(int v) {
        return marked[v];
    }
}
```

### Reachability application

- Program control-flow program
- Mark-sweep garbage collector (Mark-sweep algorithm. McCarthy, 1960)

## Breadth-first search in digraphs

**Same method as for undirected graphs.**

- Every undirected graph is a digraph (with edges in both directions).
- BFS is a digraph algorithm.

### Multiple-source shortest paths

Given a digraph and a set of source vertices, find shortest path from any vertex in the set to each other vertex.

Use BFS, but initialize by enqueuing all source vertices.

### Breadth-first search in digraphs application: web crawler (网络爬虫)

Goal. Crawl web, starting from some root web page.

Solution. [BFS with implicit digraph]

- Choose root web page as source $s$.
- Maintain a `Queue` of websites to explore.
- Maintain a `SET` of discovered websites.
- Dequeue the next website and enqueue websites to which it links (provided you haven't done so before).

...

## Topological sort (拓扑排序)

### Precedence scheduling (优先级调度)

Goal. Given a set of tasks to be completed with precedence constraints, in which order should we schedule the tasks?

Digraph model. vertex = task; edge = precedence constraint.

### Topological sort

DAG. Directed acyclic (非循环的) graph.

Topological sort. Redraw DAG so all edges point upwards.

- Run depth-first search.
- Return vertices in reverse postorder.

```java
public class DepthFirstOrder {
    private boolean[] marked;
    private Stack<Integer> reversePost;

    public DepthFirstOrder(Digraph G) {
        reversePost = new Stack<Integer>();
        marked = new boolean[G.V()];
        for (int v = 0; v < G.V(); v++)
            if (!marked[v]) dfs(G, v);
    }

    private void dfs(Digraph G, int v) {
        marked[v] = true;
        for (int w : G.adj(v))
            if (!marked[w]) dfs(G, w);
        reversePost.push(v);
    }

    public Iterable<Integer> reversePost() {
        return reversePost;  // returns all vertices in "reverse DFS postorder"
    }
}
```

## Strongly-connected components

Kosaraju-Sharir algorithm:

- Compute reverse postorder in $G^R$.
- Run DFS in $G$, visiting unmarked vertices in reverse postorder of $G^R$.

```java
public class KosarajuSharirSCC {
    private boolean[] marked;
    private int[] id;
    private int count;

    public KosarajuSharirSCC(Digraph G) {
        marked = new boolean[G.V()];
        id = new int[G.V()];
        DepthFirstOrder dfs = new DepthFirstOrder(G.reverse());
        for (int v : dfs.reversePost()) {
            if (!marked[v]) {
                dfs(G, v);
                count++;
            }
        }
    }

    private void dfs(Digraph G, int v) {
        marked[v] = true;
        id[v] = count;
        for (int w : G.adj(v))
            if (!marked[w])
                dfs(G, w);
    }

    public boolean stronglyConnected(int v, int w) {
        return id[v] == id[w];
    }
}
```
