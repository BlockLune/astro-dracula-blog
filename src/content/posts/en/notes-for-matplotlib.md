---
abbrlink: 113e4ae1
categories:
  - CS
  - Languages
  - Python
date: 2023-06-29 20:00:50
tags:
  - python
  - matplotlib
  - data-visualization
  - note
  - tool
title: Notes for Matplotlib
---

Here are some notes for Matplotlib.

<!--more-->

## USEFUL WEBSITES

- _[matplotlib.org](https://matplotlib.org/)_
- _[matplotlib.org.cn](https://www.matplotlib.org.cn/)_

## TUTORIAL

- _[Tutorials — Matplotlib 3.7.1 documentation](https://matplotlib.org/stable/tutorials/index.html)_

## MISC

The `import` part:

```python
import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
```

A useful figure:

![Parts of a Figure](https://webp.blocklune.cc/blog-imgs/cs/languages/python/notes-for-matplotlib/1.png)

Two coding styles:

- OO-style (Object-oriented style)

```python
x = np.linspace(0, 2, 100)  # Sample data.

# Note that even in the OO-style, we use `.pyplot.figure` to create the Figure.
fig, ax = plt.subplots(figsize=(5, 2.7), layout='constrained')
ax.plot(x, x, label='linear')  # Plot some data on the axes.
ax.plot(x, x**2, label='quadratic')  # Plot more data on the axes...
ax.plot(x, x**3, label='cubic')  # ... and some more.
ax.set_xlabel('x label')  # Add an x-label to the axes.
ax.set_ylabel('y label')  # Add a y-label to the axes.
ax.set_title("Simple Plot")  # Add a title to the axes.
ax.legend()  # Add a legend.
```

- pyplot-style

```python
x = np.linspace(0, 2, 100)  # Sample data.

plt.figure(figsize=(5, 2.7), layout='constrained')
plt.plot(x, x, label='linear')  # Plot some data on the (implicit) axes.
plt.plot(x, x**2, label='quadratic')  # etc.
plt.plot(x, x**3, label='cubic')
plt.xlabel('x label')
plt.ylabel('y label')
plt.title("Simple Plot")
plt.legend()
```

To be continued...
