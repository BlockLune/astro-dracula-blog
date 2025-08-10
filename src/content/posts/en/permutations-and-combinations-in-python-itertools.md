---
abbrlink: cf2f01b2
categories:
  - CS
  - Languages
  - Python
date: 2023-05-28 16:42:00
tags:
  - python
  - algorithm
  - data-structure
  - itertools
  - permutations-combinations
  - programming-language
title: Permutations and Combinations in Python (itertools)
---

Extracted from _[itertools — Functions creating iterators for efficient looping — Python 3.11.3 documentation](https://docs.python.org/3/library/itertools.html)_

<!--more-->

## PERMUTATIONS

`itertools.permutations(iterable, r=None)` returns successive `r` length permutations of elements in the iterable.

If `r` is not specified or is `None`, then `r` defaults to the length of the iterable and all possible full-length permutations are generated.

**Ex.1.**

```python
from itertools import permutations

a = [1, 2, 3]

for p in permutations(a):
  print(p)

```

Output:

```text
(1, 2, 3)
(1, 3, 2)
(2, 1, 3)
(2, 3, 1)
(3, 1, 2)
(3, 2, 1)
```

**Ex.2.**

```python
from itertools import permutations

a = ['A', 'B', 'C', 'D']

for p in permutations(a, 2):
  print(p)
```

Output:

```text
('A', 'B')
('A', 'C')
('A', 'D')
('B', 'A')
('B', 'C')
('B', 'D')
('C', 'A')
('C', 'B')
('C', 'D')
('D', 'A')
('D', 'B')
('D', 'C')
```

Learn more [here](https://docs.python.org/3/library/itertools.html#itertools.permutations)

## COMBINATIONS

Notice: `r` is NOT optional. (Not like `permutations`)

### WITH NO REPLACEMENTS

`itertools.combinations(iterable, r)` returns `r` length subsequences of elements from the input iterable.

**Ex.**

```python
from itertools import combinations

a = [1, 2, 3]

for c in combinations(a, 2):
  print(c)
```

Output:

```text
(1, 2)
(1, 3)
(2, 3)
```

Learn more [here](https://docs.python.org/3/library/itertools.html#itertools.combinations)

### WITH REPLACEMENTS

`itertools.combinations_with_replacement(iterable, r)` returns `r` length subsequences of elements from the input iterable **allowing individual elements to be repeated more than once**.

**Ex.**

```python
from itertools import combinations_with_replacement

a = [1, 2, 3]

for c_with_replacement in combinations_with_replacement(a, 2):
  print(c_with_replacement)
```

Output:

```text
(1, 1)
(1, 2)
(1, 3)
(2, 2)
(2, 3)
(3, 3)
```

Learn more [here](https://docs.python.org/3/library/itertools.html#itertools.combinations_with_replacement)
