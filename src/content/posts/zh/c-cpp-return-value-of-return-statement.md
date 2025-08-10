---
abbrlink: 9693ba6
categories:
  - CS
  - Languages
  - C & Cpp
date: 2022-10-27 19:52:56
tags:
  - c
  - cpp
  - programming-language
  - assignment-operator
  - loop-control
title: C/C++ 中赋值语句的返回值问题
---

我曾经一直以为 C/C++ 中赋值语句的返回值不是 0 就是 1 —— 成功执行赋值操作返回 1，没有成功执行就返回 0。直到今天课上的一个例子，才让我知道，原来**赋值语句的返回值就是赋的值的大小**！

<!--more-->

起因是下边的这道题目：

```c
int i;
// 下边各个循环的执行次数是多少：
// 1: 死循环
for (i = 0;; i++)
{
    printf("%d", i);
}
// 2：0 次循环
for (; i = 0; i++)
{
    printf("%d", i);
}
// 3：0 次循环
for (i = 0; i < 0; i++)
{
    printf("%d", i);
}
// 4：死循环
while (i = 1)
{
    i++;
}
```

第一个因为 for 语句的第二个参数缺失，所以该循环不会停止；第三个初值`i=0;`即不满足`i<0;`，故不执行。

第四个，按照我错误的理解，赋值成功返回 1，所以说得通是`while(true)`永远执行，但四二个却无法这么解释了。去试了试写个下边两个东西输出赋值语句的返回值，才发现原来**赋值语句的返回值就是赋的值**。

C 代码：

```C
#include <stdio.h>

int main()
{
    int a = 0, b = 5, c = -5, d;
    printf("%d\n", (int)(d = a));
    printf("%d\n", (int)(d = b));
    printf("%d\n", (int)(d = c));
    return 0;
}
```

C++ 代码：

```c++
#include <iostream>

using namespace std;

int main()
{
    int a = 0, b = 5, c = -5, d;
    cout << int(d = a) << endl;
    cout << int(d = b) << endl;
    cout << int(d = c) << endl;
    return 0;
}
```

输出结果均如下：

```text
0
5
-5
```
