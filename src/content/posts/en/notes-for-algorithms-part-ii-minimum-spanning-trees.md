---
abbrlink: 8ca4a3fd
categories:
  - CS
  - Algorithms & Data structures
date: 2023-08-03 21:17:06
mathjax: true
tags:
  - algorithm
  - data-structure
  - java
  - coursera
  - minimum-spanning-tree
  - note
title: "Notes for Algorithms, Part II: Minimum Spanning Trees"
---

This is a note for 4.3 Minimum Spanning Trees, _[Algorithms, Part II](https://www.coursera.org/learn/algorithms-part2/)_.

<!--more-->

## Introduction

**Given.** Undirected graph $G$ **with positive edge weights** (connected).

**Def.** A **spanning tree** of $G$ is a subgraph $T$ that is both a **tree** (connected and acyclic) and **spanning** (includes all of the vertices).

**Goal.** Find a min weight spanning tree.

## Greedy algorithm

**Def.** A **cut** in a graph is a partition of its vertices into two (nonempty) sets.

**Def.** A **crossing edge** connects a vertex in one set with a vertex in the other.

**Cut property.** Given any cut, the crossing edge of min weight is in the MST.

![Cut property](https://webp.blocklune.cc/blog-imgs/cs/algorithms%20&%20data%20structures/notes-for-algorithms-part-ii-minimum-spanning-trees/1.png)

Greedy MST algorithm:

- Start with all edges colored gray.
- Find cut with no black crossing edges; color its min-weight edge black.
- Repeat until $V-1$ edges are colored black.

## Edge-weighted graph API

### Weighted edge

$$
\begin{aligned}
\text{public class } & \text{Edge implements Comparable\langle Edge \rangle} \\
& \text{Edge(int v, int w, double weight)} & \text{create a weighted edge v-w} \\
\text{int } & \text{either()} & \text{either endpoint} \\
\text{int } & \text{other(int v)} & \text{the endpoint that's not v} \\
\text{int } & \text{compareTo(Edge that)} & \text{compare this edge to that edge} \\
\text{double } & \text{weight()} & \text{the weight} \\
\text{String } & \text{toString()} & \text{string representation} \\
\end{aligned}
$$

```java
public class Edge implements Comparable<Edge> {
    private final int v, w;
    private final double weight;

    public Edge(int v, int w, double weight) {
        this.v = v;
        this.w = w;
        this.weight = weight;
    }

    public int either() {
        return v;
    }

    public int other(int vertex) {
        if (vertex == v) {
            return w;
        } else {
            return v;
        }
    }

    public int compareTo(Edge that) {
        if (this.weight < that.weight) return -1;
        else if (this.weight > that.weight) return +1;
        else return 0;
    }
}
```

### Edge-weighted graph

$$
\begin{aligned}
\text{public class } & \text{EdgeWeightedGraph} \\
& \text{EdgeWeightedGraph(int V)} & \text{create an empty graph with V vertices} \\
& \text{EdgeWeightedGraph(In in)} & \text{create a graph from input stream} \\
\text{void } & \text{addEdge(Edge e)} & \text{add weighted edge e to this graph} \\
\text{Iterable\langle Edge \rangle } & \text{adj(int v)} & \text{edges incident to v} \\
\text{Iterable\langle Edge \rangle } & \text{edges()} & \text{all edges in this graph} \\
\text{int } & \text{V()} & \text{number of vertices} \\
\text{int } & \text{E()} & \text{number of edges} \\
\text{String } & \text{toString()} & \text{string representation} \\
\end{aligned}
$$

```java
public class EdgeWeightedGraph {
    private final int V;
    private final Bag<Edge>[] adj; // same as Graph, but adjacency lists of Edges instead of integers

    public EdgeWeightedGraph(int V) {
        this.V = V;
        adj = (Bag<Edge>[]) new Bag[V];
        for (int v = 0; v < V; v++) {
            adj[v] = new Bag<Edge>();
        }
    }

    public void addEdge(Edge e) {
        int v = e.either();
        int w = e.other(v);
        adj[v].add(e);
        adj[w].add(e);
    }

    public Iterable<Edge> adj(int v) {
        return adj[v];
    }
}
```

### Minimum spanning tree API

$$
\begin{aligned}
\text{public class } & \text{MST} \\
& \text{MST(EdgeWeightedGraph G)} & \text{constructor} \\
\text{Iterable\langle Edge \rangle } & \text{edges()} & \text{edges in MST} \\
\text{double } & \text{weight()} & \text{weight of MST} \\
\end{aligned}
$$

## Kruskal's algorithm

Consider edges in ascending order (升序) of weight.

- Add next edge to tree $T$ **unless doing so would create a cycle**.

(Kruskal's algorithm is a special case of the greedy MST algorithm.)

### Kruskal's algorithm: implementation challenge

**Challenge.** Would adding edge $v-w$ to tree $T$ create a cycle? If not, add it.

**Difficulty.** Union-find (log\* V), DFS (V)

**Efficient solution.** Use the **union-find** data structure.

- Maintain a set for each connected component in $T$.
- If $v$ and $w$ are in same set, then adding $v-w$ would create a cycle.
- To add $v-w$ to $T$, merge sets containing $v$ and $w$.

### Kruskal's algorithm: Java implementation

```java
public class KruskalMST {
    private Queue<Edge> mst = new Queue<Edge>();

    public KruskalMST(EdgeWeightedGraph G) {
        MinPQ<Edge> pq = new MinPQ<Edge>();
        for (Edge e : G.edges()) {
            pq.insert(e);
        }

        UF uf = new UF(G.V());
        while (!pq.isEmpty() && mst.size() < G.V() - 1) {
            Edge e = pq.delMin();
            int v = e.either();
            int w = e.other(v);
            if (!uf.connected(v, w)) {
                uf.union(v, w);
                mst.enqueue(e);
            }
        }
    }

    public Iterable<Edge> edges() {
        return mst;
    }
}
```

### Kruskal's algorithm: running time

Kruskal's algorithm computes MST in time proportional to $E \log E$ (in the worst case).

| operation  | frequency | time per op  |
| ---------- | --------- | ------------ |
| build pq   | 1         | E log E      |
| delete-min | E         | log E        |
| union      | V         | log\* V (\*) |
| connected  | E         | log\* V (\*) |

\* amortized (摊销的) bound using weighted quick union with path compression

## Prim's algorithm

- Start with vertex $0$ and greedily grow tree $T$.
- Add to $T$ the min weight edge with exactly one endpoint in $T$.
- Repeat until $V-1$ edges.

(Prim's algorithm is a special case of the greedy MST algorithm.)

### Prim's algorithm: implementation challenge

**Challenge.** Find the min weight edge with exactly one endpoint in $T$.
**Difficulty.** try all edges (E), priority queue (log E)

### Prim's algorithm: lazy implementation

**Lazy solution.** Maintain a PQ of edges with (at least) one endpoint in $T$.

- Key = edge; priority = weight of edge.
- Delete-min to determine next edge $e=v-w$ to add to $T$.
- Disregard (忽略) if both endpoints $v$ and $w$ are marked (both in $T$).
- Otherwise, let $w$ be the unmarked vertex (not in $T$):
  - add to PQ any edge incident to $w$ (assuming other endpoint not in $T$)
  - add $e$ to $T$ and mark $w$

```java
public class LazyPrimMST {
    private boolean[] marked;  // MST vertices
    private Queue<Edge> mst;   // MST edges
    private MinPQ<Edge> pq;    // PQ of edges

    public LazyPrimMST(WeightedGraph G) {
        pq = new MinPQ<Edge>();
        mst = new Queue<Edge>();
        marked = new boolean[G.V()];
        visit(G, 0);

        while (!pq.isEmpty() && mst.size() < G.V() - 1) {
            Edge e = pq.delMin();
            int v = e.either(), w = e.other(v);
            if (marked[v] && marked[w]) continue;
            mst.enqueue(e);
            if (!marked[v]) visit(G, v);
            if (!marked[w]) visit(G, w);
        }
    }

    private void visit(WeightedGraph G, int v) {
        marked[v] = true;
        for (Edge e : G.adj(v)) {
            if (!marked[e.other(v)]) {
                pq.insert(e);
            }
        }
    }

    public Iterable<Edge> mst() {
        return mst;
    }
}
```

### Lazy Prim's algorithm: running time

Lazy Prim's algorithm computes the MST in time proportional to $E\log E$ and extra space proportional to $E$ (in the worst case).

| operation  | frequency | binary heap |
| ---------- | --------- | ----------- |
| delete min | E         | log E       |
| insert     | E         | log E       |

### Prim's algorithm: eager implementation

**Eager solution.** Maintain a PQ of vertices (pq has at most one entry per vertex) connected by an edge to $T$, where priority of vertex $v=$ weight of shortest edge connecting $v$ to $T$.

- Delete min vertex $v$ and add its associated edge $e=v-w$ to $T$.
- Update PQ by considering all edges $e=v-w$ incident to $v$
  - ignore if $x$ is already in $T$
  - add $x$ to PQ if not already on it
  - decrease priority of $x$ if $v-w$ becomes shortest edge connecting $x$ to $T$

### Indexed priority queue

Associate an index between $0$ and $N-1$ with each key in a priority queue.

- Client can insert and delete-the-minimum.
- Client can change the key by specifying the index.

$$
\begin{aligned}
\text{public class } & \text{IndexMinPQ\langle Key \text{ extends } Comparable\langle Key \rangle \rangle} \\
& \text{IndexMinPQ(int N)} & \text{create indexed priority queue with indices 0, 1, \ldots, N-1} \\
\text{void } & \text{insert(int i, Key key)} & \text{associate key with index i} \\
\text{void } & \text{decreaseKey(int i, Key key)} & \text{decrease the key associated with index i} \\
\text{boolean } & \text{contains(int i)} & \text{is i an index on the priority queue} \\
\text{int } & \text{delMin()} & \text{remove a minimal key and return its associated index} \\
\text{boolean } & \text{isEmpty()} & \text{is the priority queue empty?} \\
\text{int } & \text{size()} & \text{number of entries in the priority queue} \\
\end{aligned}
$$

**Implementation.**

- Start with same code as `MinPQ`.
- Maintain parallel arrays `keys[]`, `pq[]`, and `qp[]` so that:
  - `keys[i]` is the priority of `i`
  - `pq[i]` is the index of the key in heap position `i`
  - `qp[i]` is the heap position of the key with index `i`
- Use `swim(qp[i])` implement `decreaseKey(i, key)`.

## Personal Summery

### Kruskal 算法

实现步骤：

- 按照边的权重升序排序
- 在确保不会产生环的情况下，逐个将边加入到生成树中

前置算法 / 数据结构：

- 优先队列
  - C++ [std::priority_queue - cppreference](https://zh.cppreference.com/w/cpp/container/priority_queue)
  - Java [java.util.PriorityQueue - 菜鸟教程](https://www.runoob.com/manual/jdk11api/java.base/java/util/PriorityQueue.html)
  - Python [queue.PriorityQueue](https://docs.python.org/zh-cn/3/library/queue.html?highlight=priority%20queue#queue.PriorityQueue)
- 并查集

### Prim 算法

实现步骤：

- 选定一个起始顶点（比如 $0$）
- 从起始顶点开始，贪心地扩展生成树。具体方法是：找到与已经生成的树相连的权重最小的边，并把它加入到生成树中
- 重复该过程直到生成树的边数达到 $V-1$

Lazy 实现使用优先队列存储至少一个端点在生成树中的边，通过删除最小值操作来选择要加入生成树的边。如果边的两个端点都已标记，则忽略该边；否则，将未标记的顶点加入到生成树中并将与之相连的边添加到优先队列中。

Eager 实现使用优先队列存储与生成树相连的顶点，每个顶点的优先级表示连接该顶点与生成树的最短边的权重。通过删除最小顶点并更新优先队列来选择要加入生成树的边。

> [!Note]
> **Prim 算法的两种实现的区别体现在哪里？**
>
> ChatGPT:
>
> Prim 算法的两种实现方式（懒惰实现和积极实现）主要区别在于它们选择和处理边的方式以及对优先队列的使用。下面是它们的区别和原因：
>
> 1. **懒惰实现（Lazy Implementation）**：
>    在懒惰实现中，使用优先队列存储至少一个端点在生成树中的边。具体实现步骤包括：
>    - 每次从优先队列中删除最小边（权重最小）。
>    - 检查该边的两个端点是否已经都在生成树中（标记过）。
>    - 如果两个端点都已标记，则忽略该边，继续下一轮删除操作。
>    - 如果其中一个端点未标记，则将它加入生成树，并将与该端点相连的边添加到优先队列中。
>
>    这种实现方式被称为懒惰实现，因为它只在需要时才处理边，避免了提前处理所有边的开销。它延迟了对边的处理，只在需要时才进行计算，因此被称为懒惰实现。
>
> 2. **积极实现（Eager Implementation）**：
>    在积极实现中，使用优先队列存储与生成树相连的顶点，每个顶点的优先级表示连接该顶点与生成树的最短边的权重。具体实现步骤包括：
>    - 每次从优先队列中删除最小顶点（优先级最小）。
>    - 将与该顶点相连的所有边考虑在内。
>    - 如果边的另一个端点已经在生成树中，则忽略该边。
>    - 如果边的另一个端点不在生成树中，则更新优先队列中该端点的优先级（权重）。
>
>    这种实现方式被称为积极实现，因为它在每次操作中都积极地处理边和顶点，及时更新优先队列。它在每次操作后立即更新数据结构，因此被称为积极实现。
>
> 选择懒惰实现还是积极实现取决于具体情况和需求。懒惰实现通过延迟处理边来减少计算量，适用于稀疏图（边数相对较少）的情况，可以节省时间和空间。而积极实现通过及时更新优先队列来保持数据结构的准确性，适用于稠密图（边数较多）的情况，可能需要更多的计算和空间。
>
> 总之，懒惰实现和积极实现是 Prim 算法在处理边和优先队列上的不同策略，根据具体情况选择合适的实现方式可以提高算法的效率。
