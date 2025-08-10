---
abbrlink: 266471d7
categories:
  - CS
  - AI
date: 2023-08-09 10:56:35
mathjax: true
tags:
  - ai
  - machine-learning
  - python
  - vectorization
  - linear-algebra
  - note
title: "Notes for Machine Learning Specialization: Vectorization"
---

This is a note for the [Machine Learning Specialization](https://www.coursera.org/specializations/machine-learning-introduction).

<!--more-->

From:

- _[P22 5.2 向量化 part 1](https://www.bilibili.com/video/BV19B4y1W76i?p=22)_
- _[P23 5.3 向量化 part 2](https://www.bilibili.com/video/BV19B4y1W76i?p=23)_
- _[P24 5.4 多元线性回归的梯度下降法](https://www.bilibili.com/video/BV19B4y1W76i?p=24)_
- _[P55 6.1 神经网络如何高效实现](https://www.bilibili.com/video/BV19B4y1W76i?p=55)_

## P22 and P23

Here are our parameters and features:

$$
\vec{w} =
\left[
\begin{matrix}
w_1 & w_2 & w_3
\end{matrix}
\right]
$$

$$
b \text{ is a number}
$$

$$
\vec{x} =
\left[
\begin{matrix}
x_1 & x_2 & x_3
\end{matrix}
\right]
$$

So here $n=3$.

In linear algebra, the index or the counting starts from 1.

In Python code, the index starts from 0.

```python
w = np.array([1.0, 2.5, -3.3])
b = 4
x = np.array([10, 20, 30])
```

Without vectorization $f_{\vec{w}, b}=w_1x_1+w_2x_2+w_3x_3+b$

```python
f = w[0] * x[0] +
    w[1] * x[1] +
    w[2] * x[2] + b
```

Without vectorization $f_{\vec{w}, b}=\sum_{j=1}^nw_jx_j$ + b

```python
f = 0
for j in range(0, n):
    f = f + w[j] * x[j]
f = f + b
```

Vectorization $f_{\vec{w}, b}=\vec{w}\cdot\vec{x} + b$

```python
f = np.dot(w, x) + b
```

Vectorization's benefits:

- Shorter code
- Faster running (parallel hardware)

## P24

**Ex.**

![Vectorization for Gradient descent](https://webp.blocklune.cc/blog-imgs/cs/ai/notes-for-machine-learning-specialization-vectorization/1.png)

## P55

For loops vs. vectorization

```python
# For loops
x = np.array([200, 17])
W = np.array([[1, -3, 5],
              [-2, 4, -6]])
b = np.array([-1, 1, 2])

def dense(a_in, W, b):
    a_out = np.zeros(units)
    for j in range(units):
        w = W[:,j]
        z = np.dot(w, x) + b[j]
        a_out[j] = g(z)
    return a_out
```

```python
# Vectorization
X = np.array([[200, 17]])  # 2d-array
W = np.array([[1, -3, 5],
              [-2, 4, -6]])
B = np.array([[-1, 1, 2]])  # 1*3 2d-array

def dense(A_in, W, B):
    Z = np.matmul(A_in, W) + B  # matrix multiplication
    A_out = g(Z)
    return A_out
```
