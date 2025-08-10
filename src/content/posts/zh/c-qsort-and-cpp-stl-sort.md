---
abbrlink: eab95d6e
categories:
  - CS
  - Languages
  - C & Cpp
date: 2022-12-08 21:41:18
tags:
  - c
  - cpp
  - algorithm
  - programming-language
  - sorting
title: C 标准库中 qsort 和 C++ STL 中 sort 的用法
toc: true
---

虽然到现在还是不能完全理解 `qsort` 和 `sort` 这两个函数的底层原理，但至少，先学会如何使用吧。

<!--more-->

## qsort

**需要包含的库:**

stdlib.h (C++ 中 是 cstdlib)

**函数原型：**

```c
void qsort(void *base, size_t nitems, size_t size, int (*compar)(const void *, const void *))
```

**参数解释：**

- base: 必选，数组名（数组首元素的地址）；
- nitems: 必选，数组中元素的个数；
- size: 必选，数组中单个元素的大小；
- compar: 必选，一个函数指针，具体这个函数要干嘛下边细说。

最后一个参数是函数指针，这个指针指向的函数的原型应该类似于下边这样：

```c
int cmp(const void *a, const void *b);
```

这是一个返回值为 `-1`、`0` 或 `1` 的函数。

如果要实现升序，那么应该是：

> a>b：返回 1（或其他正数）;
> a==b：返回 0;
> a<b: 返回 -1（或其他负数）;

如果是降序，那么就应该反过来，像下边这样：

> a>b：返回 -1（或其他负数）;
> a==b：返回 0;
> a<b: 返回 1（或其他正数）;

比如我要对 int 类型的数组升序排序，那么我的 cmp 函数应该像下边这样：

```c
int cmp(const void *a, const void *b)
{
    const int *x = (const int *)a;
    const int *y = (const int *)b;
    if (*x > *y)
        return 1;
    else if (*x == *y)
        return 0;
    else
        return -1;
}
```

或者也可以简化成下边这样：

```c
int cmp(const void *a, const void *b)
{
    return (*(const int *)a - *(const int *)b);
}
```

这里的 a>b 等比较方式只是形式上我这么写，实际上有可能这两个元素我并不能直接这么比（比如如果这里的 a、b 都是 struct），那么就应该类似下边这样：

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct
{
    unsigned int ID;
    unsigned int score;
} STUDENT;

int cmp(const void *, const void *);

int main()
{
    STUDENT stu[5] = {{1, 5}, {2, 3}, {3, 1}, {4, 2}, {5, 4}};
    qsort(stu, 5, sizeof(STUDENT), cmp);
    for (int i = 0; i < 5; i++)
    {
        printf("ID: %u, Score: %u\n", stu[i].ID, stu[i].score);
    }
    return 0;
}

int cmp(const void *a, const void *b)
{
    const STUDENT *x = (const STUDENT *)a;
    const STUDENT *y = (const STUDENT *)b;
    // 降序排序
    if (x->score > y->score)
        return -1;
    else if (x->score == y->score)
        return 0;
    else
        return 1;
}
```

输出是：

```text
ID: 1, Score: 5
ID: 5, Score: 4
ID: 2, Score: 3
ID: 4, Score: 2
ID: 3, Score: 1
```

## sort

**需要包含的库:**

algorithm（C++ STL 中的算法库）

**函数原型：**

```c++
template <class RandomAccessIterator, class Compare>
void sort (RandomAccessIterator first, RandomAccessIterator last, Compare comp);
```

**参数解释：**

first: 必选，排序开始处（参与排序的第一个元素）；
last: 必选，排序结束处的**后一个紧挨着的位置**（参与排序的最后一个元素的**后一个位置**）；
comp: 可选，用来指定怎么排序的函数，没有的话如果可以默认升序。

下边给出一些例子：

给一个数组升序排序：

```c++
int arr[5] = {5, 1, 3, 2, 4};
sort(arr, arr + 5);
```

给一个 vector 降序排序：

```c++
vector<int> nums = {5, 1, 3, 2, 4};
sort(nums.begin(), nums.end(), greater<int>());
```

这里用了 `greater<typename>()` 这个东东直接表达我这个排序需要降序排序，类似的还有 `less<typename>()` 用来指定升序。

然后是自定义这第三个参数，我们就用上边 qsort 那个例子吧：

```c++
#include <iostream>
#include <cstdio>
#include <algorithm>

using namespace std;

struct STUDENT
{
    unsigned int ID;
    unsigned int score;
};

bool cmp(STUDENT, STUDENT);

int main()
{
    STUDENT stu[5] = {{1, 5}, {2, 3}, {3, 1}, {4, 2}, {5, 4}};
    sort(stu, stu + 5, cmp);
    for (int i = 0; i < 5; i++)
    {
        printf("ID: %u, Score: %u\n", stu[i].ID, stu[i].score);
    }
    return 0;
}

bool cmp(STUDENT a, STUDENT b)
{
    if (a.score > b.score)
        return true;
    else
        return false;
}
```

或者也可以把 cmp 写成下边这种更容易记住的方式：

```c++
bool cmp(STUDENT a, STUDENT b)
{
    return a.score > b.score;
    // 表示排序完成后前一个元素比后一个元素大，即降序排序
}
```

输出和上边是一样的。

> [!IMPORTANT]
> 在 qsort 中，最后一个参数的函数的返回值应是一个有符号整型。在期望 **升序** 排序时，这个返回值应该指定为：**第一个元素大于第二个元素，返回正数；** 第一个元素等于第二个元素，返回 0；第一个元素小于第二个元素，返回负数。
>
> 在 C++ STL 的 sort 中，最后一个参数的返回值应是一个布尔值。在期望 **升序** 排序时，这个返回值应该是 (第一个元素 < 第二个元素) 的运算结果。
