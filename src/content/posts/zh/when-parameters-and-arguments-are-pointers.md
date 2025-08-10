---
abbrlink: 1ef1e20b
categories:
  - CS
  - Languages
  - C & Cpp
date: 2022-11-16 14:46:44
tags:
  - c
  - cpp
  - pointer-passing
  - function-parameters
title: 当形参、实参是指针变量...
---

接[《一个有关指针传参的问题》](/posts/50c16b14)，再理一理这里边的一些问题...

<!--more-->

在单向值传递的过程中，我们知道，形参是对实参的值的拷贝。在实参的值传递给形参后，对形参的一切操作，都不会对实参产生什么影响。比如下边这串代码：

```c++
#include <iostream>

using namespace std;

void func(int n);

int main()
{
    int n = 5;
    cout << "Before func(), main(): n = " << n << endl;
    func(n);
    cout << "After func(), main(): n = " << n << endl;
    return 0;
}

void func(int n)
{
    cout << "Before n++, func(): n = " << n << endl;
    n++;
    cout << "After n++, func(): n = " << n << endl;
}
```

下边是输出结果：

```text
Before func(), main(): n = 5
Before n++, func(): n = 5
After n++, func(): n = 6
After func(), main(): n = 5
```

通过打印它们的地址，我们也可以认识到这一点：

```c++
#include <iostream>

using namespace std;

void func(int n);

int main()
{
    int n = 5;
    cout << "In main(): " << endl;
    cout << "n = " << n << endl;
    cout << "&n = " << &n << endl;
    cout << endl;
    func(n);
    return 0;
}

void func(int n)
{
    cout << "In func(): " << endl;
    cout << "n = " << n << endl;
    cout << "&n = " << &n << endl;
}

/*
输出结果：

In main():
n = 5
&n = 0x61fe1c

In func():
n = 5
&n = 0x61fdf0
*/
```

如果把变量类型从普通类型变成指针类型，那么类似的，发生的其实也是一次值传递，也即，**指针变量的值发生了一次拷贝**，请看下边的例子：

```c++
#include <iostream>

using namespace std;

void func(int *p);

int main()
{
    int *p = new int;
    cout << "In main(): " << endl;
    cout << "p = " << (int *)p << endl;
    cout << "&p = " << &p << endl;
    cout << endl;
    func(p);
    return 0;
}

void func(int *p)
{
    cout << "In func(): " << endl;
    cout << "p = " << (int *)p << endl;
    cout << "&p = " << &p << endl;
}
```

在我电脑上的输出结果是：

```text
In main():
p = 0xee61c0
&p = 0x61fe18

In func():
p = 0xee61c0
&p = 0x61fdf0
```

可以看到，`int *` 类型的指针变量 `p` 的值是相同的，但地址不同，这是两个变量。

把上边代码 `main()` 中的 `p` 记为 `p1`，`func()` 中的记为 `p2`，那么就可以这样理解为，当调用 `func()` 时，`p2` 与 `p1` **指向了相同的位置**，但它们确实**不是同一个指针**。

对于[《一个有关指针传参的问题》](/posts/50c16b14)中的那段错误代码，其实错误就是，在函数中 `new` 出来内存后，只是让形参指向了那片内存，而原来的实参并没有同步地指过去。

但是只要确定形参的指针和实参的指针指向的地址是相同的，那么对这同一片内存进行的操作，就是同步的，比如：

```c++
#include <iostream>

using namespace std;

void func(int *p);

int main()
{
    int *p = new int;
    *p = 5;
    cout << "Before func(), main(): (*p) = " << *p << endl;
    func(p);
    cout << "After func(), main(): (*p) = " << *p << endl;
    return 0;
}

void func(int *p)
{
    cout << "Before (*p)++, func(): (*p) = " << *p << endl;
    (*p)++;
    cout << "After (*p)++, func(): (*p) = " << *p << endl;
}
```

输出结果：

```text
Before func(), main(): (*p) = 5
Before (*p)++, func(): (*p) = 5
After (*p)++, func(): (*p) = 6
After func(), main(): (*p) = 6
```

由于数组名其实就是数组第一个元素（下标为 0 的那个元素）的地址，所以类似的，在函数中对数组形参的操作会等效到数组实参上去：

```c++
#include <iostream>

using namespace std;

void func(int[], int);

int main()
{
    int a[3] = {0, 1, 2};
    for (int x : a)
        cout << x << " ";
    cout << endl;
    func(a, 3);
    for (int x : a)
        cout << x << " ";
    return 0;
}

void func(int arr[], int n)
{
    for (int i = 0; i < n; i++)
        arr[i]++;
}
```

输出结果：

```text
0 1 2
1 2 3
```
