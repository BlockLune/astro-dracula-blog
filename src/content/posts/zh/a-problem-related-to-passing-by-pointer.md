---
abbrlink: 50c16b14
categories:
  - CS
  - Languages
  - C & Cpp
date: 2022-11-03 20:52:38
tags:
  - c
  - cpp
  - pointer-manipulation
  - memory-management
  - programming-language
title: 一个有关指针传参的问题
toc: true
---

这是我学习指针过程中遇到的一个问题，问过大佬才似乎懂了点，在此记录。顺便记下一句大佬说的话：

> 注意到一点就行，指针其实也就是个存了内存地址的变量，**它本身同时也具有内存地址**。

<!--more-->

## 问题的产生

事情是这样，学习了一点指针，就想自己实现一个会自动变长的数组。我也不期望把它做成一个类什么的，只有一个小目标，就是实现一个函数，能往这个动态数组后边加元素。我本来的 **错误** 代码如下：

```c++
#include <iostream>
#include <cstdlib>

using namespace std;

void append(int *nums, int size, int n)
{
    if (nums) // 如果数组指针不为空
    {
        // 暂存原来的数据
        int *tmp_nums = new int[size];
        memcpy(tmp_nums, nums, sizeof(int) * size);
        // 释放掉原指针
        delete[] nums;
        // 元素数量 + 1
        nums = new int[size + 1];
        memcpy(nums, tmp_nums, sizeof(int) * size);
        nums[size] = n;
        delete[] tmp_nums;
    }
    else
    {
        nums = new int[1];
        nums[0] = n;
    }
}

int main()
{
    int tmp_n;
    int size = 0;
    int *nums = nullptr;
    for (int i = 51; i <= 55; i++)
    {
        tmp_n = i;
        append(nums, size, tmp_n);
        size++;
    }
    for (int i = 0; i < size; i++)
    {
        cout <<nums[i] << " ";
    }
    return 0;
}
```

在调试过程中发现一直会报 `Segmentation fault`，但是如果改成下边这样，却是可以的：

```c++
#include <iostream>
#include <cstdlib>

using namespace std;

int *nums = nullptr;

void append(int size, int n)
{
    if (nums) // 如果数组指针不为空
    {
        // 暂存原来的数据
        int *tmp_nums = new int[size];
        memcpy(tmp_nums, nums, sizeof(int) * size);
        // 释放掉原指针
        delete[] nums;
        // 元素数量 + 1
        nums = new int[size + 1];
        memcpy(nums, tmp_nums, sizeof(int) * size);
        nums[size] = n;
        delete[] tmp_nums;
    }
    else
    {
        nums = new int[1];
        nums[0] = n;
    }
}

int main()
{
    int tmp_n;
    int size = 0;

    for (int i = 51; i <= 55; i++)
    {
        tmp_n = i;
        append(size, tmp_n);
        size++;
    }
    for (int i = 0; i < size; i++)
    {
        cout <<nums[i] << " ";
    }
    return 0;
}
```

改动的内容就是把原来的数组变成了全局的。局部的不正常，全局就对了，所以猜测，类似是形参和实参的区别。大佬们帮我分析了分析，提出了下边的解决方案：

```c++
#include <iostream>
#include <cstdlib>

using namespace std;

void append(int **, int, int);

int main()
{
    int tmp_n;
    int size = 0;
    int *nums = nullptr;
    for (int i = 51; i <= 55; i++)
    {
        tmp_n = i;
        /*
        nums 是一个指针，这个指针是我们动态数组的第一个元素的地址
        对 nums 取地址传参，传的是 nums 这个指针的地址
        */
        append(&nums, size, tmp_n);
        size++;
    }
    for (int i = 0; i < size; i++)
    {
        cout <<nums[i] << " ";
    }
    return 0;
}

/*
接上文的注释
ptr 是一个指针，这个指针是上边的 nums 的地址
*ptr 得到了这个地址的值，这个值是指向动态数组第一个元素的指针
**ptr 是第一个元素的值
*/

void append(int **ptr, int size, int n)
{
    if (*ptr) // 如果数组指针不为空
    {
        // 暂存原来的数据
        int *tmp_nums = new int[size];
        memcpy(tmp_nums, *ptr, sizeof(int) * size);
        // 释放掉原指针
        delete[] * ptr;
        // 元素数量 + 1
        *ptr = new int[size + 1];
        memcpy(*ptr, tmp_nums, sizeof(int) * size);
        (*ptr)[size] = n;
        delete[] tmp_nums;
    }
    else
    {
        (*ptr) = new int[1];
        (*ptr)[0] = n;
    }
}
```

这样运行结果就正常了。

## 分析及解决方案

**2022 年 11 月 16 日更新：**这边写的错误原因有点乱，我重新写了一篇：[《当形参、实参是指针变量...》](/posts/1ef1e20b)

下边给出两个简化的代码来解释这个问题。

首先来看代码 1，是对上边错误代码的简化:

```c++
#include <iostream>

using namespace std;

void getMemory(int *p)
{
    p = new int;
    cout <<"The pointer in getMemory() points at:" << p << endl;
    cout <<"The address of the pointer in getMemory():" << &p << endl;
}

int main()
{
    int *p;
    getMemory(p);
    cout <<"The pointer in main() points at:" << p << endl;
    cout <<"The address of the pointer in main():" << &p << endl;
    delete p;
    return 0;
}
```

下边是代码 1 对应的程序的一个可能的输出 (具体内存地址可能不同):

```text
The pointer in getMemory() points at: 0x10161c0
The address of the pointer in getMemory(): 0x61fdf0
The pointer in main() points at: 0x10
The address of the pointer in main(): 0x61fe18
```

可以看到，在 `getMemory()` 中的 `int*` 类型的指针 p 与 `main()` 中的 `int*` 类型的指针 p **并不是同一个指针**（存储这两个指针的内存地址不一样，在 `getMemory()` 中的指针 p 存储在 0x61fdf0，而 `main()` 中的存储在 0x61fe18），所以虽然我们在 `getMemory()` 中 new 得了存储空间（`getMemory()` 中的指针 p 指向了 0x10161c0），但这实际上只是为 `getMemory()` 中的指针 p 申请了存储空间，`main()` 中的指针 p 并没有申请到空间（`main()` 中的指针 p 指向了 0x10）。

也即，我们自己的函数中的指针是一个副本，给这个指针申请空间的操作并没有实现给 `main()` 中的同名指针也申请到空间！

接着是代码 2，类似于上边的正确解法：

```c++
#include <iostream>

using namespace std;

void getMemory2(int **p2)
{
    *p2 = new int;
    cout << "The pointer in getMemory() points at:" << *p2 << endl;
    cout << "The address of the pointer in getMemory():" << p2 << endl;
}

int main()
{
    int *p1;
    getMemory2(&p1);
    cout << "The pointer in main() points at:" << p1 << endl;
    cout << "The address of the pointer in main():" << &p1 << endl;
    delete p1;
    return 0;
}
```

下边是代码 2 对应的程序的一个可能的输出 (具体内存地址可能不同):

```text
The pointer in getMemory() points at: 0x7461c0
The address of the pointer in getMemory(): 0x61fe18
The pointer in main() points at: 0x7461c0
The address of the pointer in main(): 0x61fe18
```

从 `main()` 开始看，p1 是一个 `int*` 类型的指针。与上边代码 1 不同，现在 `getMemory2()` 这个函数接受的参数是指针的指针，也就是指针的地址，所以我们传入的是 **&p1**，也就是指针 p1 的地址。

再看 `getMemory2()` 函数，传入参数后，相当于现在 p2 = &p1，那么 \*p2 = p1。这里的 “=” 表示 “就是” 而非赋值，所以我们对于 \*p2 进行的任何操作，与对 p1 进行的操作都是等效的。

还有一种解决方案 —— 使用引用传递，对于上边的问题也就是使用 `int* &` 类型，代码 3 如下：

```c++
#include <iostream>

using namespace std;

void getMemory(int *&p)
{
    p = new int;
    cout << "The pointer in getMemory() points at: " << p << endl;
    cout << "The address of the pointer in getMemory(): " << &p << endl;
}

int main()
{
    int *p;
    getMemory(p);
    cout << "The pointer in main() points at: " << p << endl;
    cout << "The address of the pointer in main(): " << &p << endl;
    delete p;
    return 0;
}
```

只要将上边的代码 1 中 `void getMemory(int *p)` 改为 `void getMemory(int *&p)` 就行了，下边是可能的输出：

```text
The pointer in getMemory() points at: 0x10261c0
The address of the pointer in getMemory(): 0x61fe18
The pointer in main() points at: 0x10261c0
The address of the pointer in main(): 0x61fe18
```

可以看到已经实现了我们想要的效果。

也可以参考参考这篇文章：[《C++ 函数的传入参数是指针的指针（\*\*）的详解》](https://developer.aliyun.com/article/297093)
