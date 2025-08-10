---
abbrlink: c8a20144
categories:
  - CS
  - Languages
  - C & Cpp
date: 2022-11-05 14:48:31
tags:
  - c
  - cpp
  - programming-language
  - parameter-passing
  - function-arguments
title: 值传递、指针传递、引用传递
---

接上文[《一个有关指针传参的问题》](/posts/50c16b14)，打算结合一些简单的例子系统地梳理一下 C/C++ 中的值传递、指针传递和 C++ 中特有的 引用传递。

<!--more-->

## 值传递

**值传递**传递实际上只是在执行函数的时候将实参的值赋给了形参，在此之后函数体内对形参的任何操作都与原来的实参无关了。

例如下边这个代码 1:

```c++
// 值传递 (C++代码)

#include <iostream>

using namespace std;

void func(int n)
{
    cout << "The value of n in func(): " << n << endl;
    cout << "The address of n in func(): " << &n << endl;
    n++;
    cout << "Then the value of n in func(): " << n << endl;
}

int main()
{
    int n = 0;
    cout << "The value of n in main(): " << n << endl;
    cout << "The address of n in main(): " << &n << endl;
    func(n);
    cout << "Then the value of n in main(): " << n << endl;
    return 0;
}
```

```c
// 值传递 (C代码)

#include <stdio.h>

void func(int n)
{
    printf("The value of n in func(): %d\n", n);
    printf("The address of n in func(): 0x%x\n", &n);
    n++;
    printf("Then the value of n in func(): %d\n", n);
}

int main()
{
    int n = 0;
    printf("The value of n in main(): %d\n", n);
    printf("The address of n in main(): 0x%x\n", &n);
    func(n);
    printf("Then the value of n in main(): %d\n", n);
    return 0;
}
```

下边是可能的输出：

```text
The value of n in main(): 0
The address of n in main(): 0x61fe1c
The value of n in func(): 0
The address of n in func(): 0x61fdf0
Then the value of n in func(): 1
Then the value of n in main(): 0
```

第二行第四行说明，`main()` 中的实参 n 与 `func()` 中的形参 n 存储在内存的不同位置，不是同一个变量。第五第六行说明，对形参 n 的操作，不会影响实参 n。

## 指针传递

**指针传递**也就是传参时不直接传某个参数的值，而是传它的地址。把这个地址作为实参，而形参又是复制实参而来的，所以形参也是原来参数的地址，这样再对形参解除引用，实际上就是对同一内存的值进行操作，所以当然在自定函数中的操作会在主函数中反映出来，请看下边的代码 2：

```c++
// 指针传递 (C++代码)

#include <iostream>

using namespace std;

void func(int *p)
{
    cout << "The value of n(*p) in func(): " << *p << endl;
    cout << "The address of n(p) in func(): " << p << endl;
    (*p)++;
    cout << "Then the value of n(*p) in func(): " << *p << endl;
}

int main()
{
    int n = 0;
    cout << "The value of n in main(): " << n << endl;
    cout << "The address of n in main(): " << &n << endl;
    func(&n); // 把想要传递的参数的地址作为实参传入
    cout << "Then the value of n in main(): " << n << endl;
    return 0;
}
```

```c
// 指针传递 (C代码)

#include <stdio.h>

void func(int *p)
{
    printf("The value of n(*p) in func(): %d\n", *p);
    printf("The address of n(p) in func(): 0x%x\n", p);
    (*p)++;
    printf("Then the value of n(*p) in func(): %d\n", *p);
}

int main()
{
    int n = 0;
    printf("The value of n in main(): %d\n", n);
    printf("The address of n in main(): 0x%x\n", &n);
    func(&n);
    printf("Then the value of n in main(): %d\n", n);
    return 0;
}
```

下边是可能的输出：

```text
The value of n in main(): 0
The address of n in main(): 0x61fe1c
The value of n(*p) in func(): 0
The address of n(p) in func(): 0x61fe1c
Then the value of n(*p) in func(): 1
Then the value of n in main(): 1
```

这实际上就是 [《一个有关指针传参的问题》- 分析及解决分案](/posts/50c16b14.html#%E5%88%86%E6%9E%90%E5%8F%8A%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88) 中的代码 2 的思路。只不过这里我们是对 `int` 类型的普通变量操作，所以函数接受的参数类型是 `int*`，而在那篇文章中是要对 `int*`类型的变量操作，所以自定函数接受的参数类型变成了`int**`。

## 引用传递

> [!Tip]
> 注意引用传递是 C++ 的特性，C 没有这个特性。

**引用传递**相当于给实参取了个别名，对形参的操作会同步到实参那边去，还是来看下边的代码 3 吧：

```c++
// 引用传递 (C++代码)

#include <iostream>

using namespace std;

void func(int &n2)
{
    cout << "The value of n2 in func(): " << n2 << endl;
    cout << "The address of n2 in func(): " << &n2 << endl;
    n2++;
    cout << "Then the value of n2 in func(): " << n2 << endl;
}

int main()
{
    int n1 = 0;
    cout << "The value of n1 in main(): " << n1 << endl;
    cout << "The address of n1 in main(): " << &n1 << endl;
    func(n1);
    cout << "Then the value of n1 in main(): " << n1 << endl;
    return 0;
}
```

下边是可能的输出：

```text
The value of n1 in main(): 0
The address of n1 in main(): 0x61fe1c
The value of n2 in func(): 0
The address of n2 in func(): 0x61fe1c
Then the value of n2 in func(): 1
Then the value of n1 in main(): 1
```

类似地，`int` 类型的引用类型是 `int&`，`int*` 的引用类型是 `int*&`。

## 参考文章

- [C++ 值传递、指针传递、引用传递 - 简书 (jianshu.com)](https://www.jianshu.com/p/2b5594b876ef)
- [C++ 值传递、指针传递、引用传递详解 - zqlucky - 博客园 (cnblogs.com)](https://www.cnblogs.com/dingxiaoqiang/p/8012578.html)
