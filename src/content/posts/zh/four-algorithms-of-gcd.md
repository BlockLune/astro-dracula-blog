---
abbrlink: 504f038d
categories:
  - CS
  - Algorithms & Data structures
date: 2022-12-04 19:37:17
katex: true
mathjax: true
tags:
  - algorithm
  - data-structure
  - cpp
  - gcd-algorithm
  - euclidean-algorithm
title: 求解最大公约数的四种算法
toc: true
---

这是一次计算机导论课的作业。本来对于最大公约数的求解算法，我就只知道一个**辗转相除法**。原来，其实还有别的一些 ...

<!--more-->

## 法一：试除法（穷举法）

也许这应该才是最先能想到的算法——两个数中取小的那个，由大到小穷举这个数的所有因数，并且看看这个数是不是另一个数的因数，如果是，那这个数就是这两个数的最大公约数了。

### 1. 时间复杂度

$O(min(a,b))$

### 1. 自然语言描述

1. 定义变量 $a,b$，用于存放两个待求取最大公约数的值，确保 $a\leq b$；
2. 定义变量 $i=a$；
3. 如果 $i\geq1$，执行步骤 4；
4. 判断 $i$ 是否是 $a$ 的因数，如果是，执行步骤 5，否则，执行步骤 7；
5. 判断 $i$ 是否是 $b$ 的因数，如果是，执行步骤 6，否则，执行步骤 7；
6. 跳出循环，$i$ 就是 $a$ 和 $b$ 的最大公约数；
7. $i$ 自减 $1$，执行步骤 3；

### 1. 伪代码描述

```text
var a,b,i:integer;
input(a);
input(b);
Begin
For i<-a to 1 do
Begin
    If a%i==0 Then
        If b%i==0 Then
        Begin
            print(i);
            break;
        End;
End;
End;
```

### 1. 流程图

![Powered by draw.io](https://webp.blocklune.cc/blog-imgs/cs/algorithms%20&%20data%20structures/求解最大公约数的四种算法/1.png)

### 1. C++ 代码

```c++
#include <iostream>
using namespace std;

int main()
{
    uint64_t a, b;
    cin >> a >> b;
    if (a > b)
        swap(a, b);
    for (int i = a; i >= 1; i--)
    {
        if (a % i == 0)
            if (b % i == 0)
            {
                cout << i << endl;
                break;
            }
    }
    return 0;
}
```

## 法二：辗转相除法（欧几里得算法）

这大概是最常见的计算最大公约数的算法了吧...

### 2. 时间复杂度

可近似看作 $O(log(max(a,b)))$，但取模运算性能较差。

### 2. 自然语言描述

1. 定义变量 a，b 并读入；
2. 如果 b == 0，返回 a；
3. 否则，更新 a 的值为原来 b 的值，更新 b 的值为原来 a%b 的值，回到步骤 2。

### 2. 伪代码描述

```text
var a,b:integer;
def gcd(a,b):
Begin
    If b==0 Then
        return a;
    Else return(gcd(b, a%b));
End;
```

### 2. 流程图

![Powered by draw.io](https://webp.blocklune.cc/blog-imgs/cs/algorithms%20&%20data%20structures/求解最大公约数的四种算法/2.png)

### 2. C++ 代码

主函数及 gcd 函数的函数声明：

```c++
#include <iostream>
using namespace std;

uint64_t gcd(uint64_t, uint64_t);

int main()
{
    uint64_t a, b;
    cin >> a >> b;
    cout << gcd(a, b) << endl;
    return 0;
}
```

gcd 函数（递归实现）：

```c++
uint64_t gcd(uint64_t a, uint64_t b)
{
    if (b == 0)
        return a;
    else
        return gcd(b, a % b);
}
```

gcd 函数（递归函数，写成一行的版本）：

```c++
uint64_t gcd(uint64_t a, uint64_t b) { return b ? gcd(b, a % b) : a; }
```

gcd 函数（迭代实现）：

```c++
uint64_t gcd(uint64_t a, uint64_t b)
{
    while (b != 0)
    {
        uint64_t tmp = a % b;
        a = b;
        b = tmp;
    }
    return a;
}
```

## 法三：更相减损法

更相减损法又叫**更相减损术**，出自《九章算术》，是咱老祖宗的智慧。这个东西本来是为了约分而设计的，但是，既然都约分了，那自然也可以用来求取最大公约数。

这个算法的原文描述是这样：

> 可半者半之，不可半者，副置分母、子之数，以少减多，更相减损，求其等也。以等数约之。

翻译成白话就是：

> （如果需要对分数进行约分，那么）可以折半的话，就折半（也就是用 2 来约分）。如果不可以折半的话，那么就比较分母和分子的大小，用大数减去小数，互相减来减去，一直到减数与差相等为止，用这个相等的数字来约分。

_这两段引用的来源是：[更相减损术\_百度百科 (baidu.com)](https://baike.baidu.com/item/更相减损术)_

### 3. 时间复杂度

$O(max(a,b))$

### 3. 自然语言描述

1. 定义变量 a、b 并读入；
2. 如果 变量 a、b 能被 2 整除，那就都除以 2。不断重复执行这一步直到 a、b 任意一个不能被 2 整除，记录下进行这一步的次数，存入变量 cnt 中；
3. 定义三个变量 x1、x2、x3，用于表示被减数、减数和差；
4. x1 赋初值为 a、b 中较大的那一个，x2 赋初值为 a、b 中较小的那一个，x3 赋初值为 x1-x2；
5. 在 x2!=x3 的情况下，不断更新 x1 = max(x2, x3)，x2 = min(x2, x3)，x3 = x1 - x2；
6. 返回 x2 + pow(2, cnt)。

### 3. 流程图

### 3. C++ 代码

下边给出的是基于原文描述实现的更相减损法：

```c++
uint64_t gcd(uint64_t a, uint64_t b)
{
    uint64_t cnt = 0; // 统计除以二的次数
    while (a % 2 == 0 && b % 2 == 0)
    {
        cnt++;
        a /= 2;
        b /= 2;
    }
    uint64_t x1, x2, x3; // 分别表示被减数、减数、差
    x1 = max(a, b);
    x2 = min(a, b);
    x3 = x1 - x2;
    while (x2 != x3)
    {
        x1 = max(x2, x3);
        x2 = min(x2, x3);
        x3 = x1 - x2;
    }
    return x2 * pow(2, cnt);
}
```

如果去掉那些“可半者半之”，直接进行后面的“**辗转相减**”部分，也是可以的：

```c++
uint64_t gcd(uint64_t a, uint64_t b)
{
    uint64_t x1, x2, x3; // 分别表示被减数、减数、差
    x1 = max(a, b);
    x2 = min(a, b);
    x3 = x1 - x2;
    while (x2 != x3)
    {
        x1 = max(x2, x3);
        x2 = min(x2, x3);
        x3 = x1 - x2;
    }
    return x2;  // 或者 return x3;
}
```

于是也可以写出递归形式：

```c++
uint64_t gcd(uint64_t a, uint64_t b)
{
    if (a < b)
        a ^= b, b ^= a, a ^= b; // 确保 a>=b
    if (2 * b == a)
        return b;
    else
        return gcd(b, a - b);
}
```

## 法四：Stein 算法

这个算法是辗转相除法的改进版本，避免了取模运算，且算法性能稳定。

### 4. 时间复杂度

$O(log(max(a,b)))$

### 版本一

学习自[这篇](https://cnblogs.com/COLIN-LIGHTNING/p/8425484.html)文章，正好学习一下位运算的一些“骚操作”（见下文引用处）。

#### 4.1. 自然语言描述

1. 定义变量 a、b 并读入，确保 a>=b（如果 a<b 则交换）；
2. 如果两个数都是偶数，那就不断除以 2 直至至少一个不是偶数；
3. 如果一奇一偶，那就把那个偶数不断除以 2 直至它也为一个奇数；
4. 对两个奇数进行辗转相减（或者辗转相除？上边那篇文章里这么说，但是除的话不是无法避免取模运算效率低下的问题了嘛 emm），直至求出它们的最大公约数；

#### 4.1. 流程图

![Powered by draw.io](https://webp.blocklune.cc/blog-imgs/cs/algorithms%20&%20data%20structures/求解最大公约数的四种算法/3.png)

#### 4.1. C++ 代码

> (1) 按位与 (&):
>
> a&x 为对数 a 的二进制形式的取位操作，即去 a 二进制形式的第 x 位。这里有一个重要应用就是 a&1 可以用于判断数 a 的奇偶性，即 a 末位为 0 即为偶数，末位为 1 即为奇数。
>
> (2) 异或运算 (^):
>
> 具体介绍参考之前的随笔：[浅谈异或运算符的应用及相关题目题解 - COLINGAO - 博客园](http://www.cnblogs.com/COLIN-LIGHTNING/p/8298554.html)；
> 应用为交换两数：a\^=b,b\^=a,a^=b 即完成了两数交换。
>
> (3) 按位左移 (<<):
>
> a<<=x 即为使 a 乘以 2 的 x 次幂，原理是让 a 的二进制形式左移 x 位；应用为对与 2 的幂次方相乘使运算更快更方便；
>
> (4) 按位右移 (>>):
>
> a>>=x 即为使 a 除以 2 的 x 次幂，原理是让 a 的二进制形式右移 x 位；应用为对与 2 的幂次方相除使运算更快更方便；

大佬的代码大致是这样的：

```c++
uint64_t gcd(uint64_t a, uint64_t b)
{
    if (a < b)
        a ^= b, b ^= a, a ^= b; // 确保 a>=b，也可以 swap(a,b);
    if (b == 0)
        return a;
    if ((!(a & 1)) && (!(b & 1)))        // a&1 若为 0 表示 a%2==0，也就是 a 能被 2 整除；
                                         // 若非 0 则表示 a%2!=0，也就是 a 不能被 2 整除。
                                         // b&1 类似。所以这里判断的是 “当 a、b 都是偶数的时候”
        return gcd(a >> 1, b >> 1) << 1; // 步骤 2：将 a、b 都除以 2。注意最后的左移，在递归返回过程中将2因子乘上。
    else if ((a & 1) && (!(b & 1)))      // “当 a 为奇数，b 为偶数时”
        return gcd(a, b >> 1);           // 步骤 3：将仍为偶数的那个数不断除以 2 直至其为奇数。
    else if ((!(a & 1)) && (b & 1))      // “当 a 为偶数，b 为奇数时”
        return gcd(a >> 1, b);           // 与上面类似
    else
        return gcd(a - b, b); // 步骤 4：用辗转相减法处理，求取这两个奇数的最大公约数;
}
```

### 版本二

来自[这里](https://blog.csdn.net/Brilliance_panpan/article/details/88372432)，对均为奇数的情况做了不同的处理，其他都是一样的。

#### 4.2. 自然语言描述

1. 定义变量 a、b 并读入；
2. 如果 a==b，则直接返回 a 或 b，否则下一步；
3. 如果 a<b，交换 a、b 的值，确保 a>b；
4. 判断属于下边哪种情况，按对应的情况更新 a、b 的值，回到步骤 2。

四种情况分别是：

1. 均为偶数: gcd(a,b) = 2 \* gcd(a/2,b/2);
2. 均为奇数: gcd(a,b) = gcd((a+b)/2,(a-b)/2);
3. a 为奇数，b 为偶数: gcd(a,b) = gcd(a,b/2);
4. a 为偶数，b 为奇数: gcd(a,b) = gcd(a/2,b);

#### 4.2. 流程图

![Powered by draw.io](https://webp.blocklune.cc/blog-imgs/cs/algorithms%20&%20data%20structures/求解最大公约数的四种算法/4.png)

#### 4.2. C++ 代码

最后代码和上边也没有太大差别。

```c++
uint64_t gcd(uint64_t a, uint64_t b)
{
    if (a == b)
        return a;
    if (a < b)
        a ^= b, b ^= a, a ^= b;
    if (!(a & 1) && !(b & 1))            // 均为偶数
        return gcd(a >> 1, b >> 1) << 1; // 别忘了要乘回来
    else if ((a & 1) && (b & 1))         // 均为奇数
        return gcd((a + b) >> 1, (a - b) >> 1);
    else if ((a & 1) && !(b & 1)) // a 奇 b 偶
        return gcd(a, b >> 1);
    else if (!(a & 1) && (b & 1)) // a 偶 b 奇
        return gcd(a >> 1, b);
}
```

## 参考资料

- [《求最大公约数的 4 种常用算法\*AmethystFOB 的博客 - CSDN 博客\*求最大公约数的四种算法》](https://blog.csdn.net/Brilliance_panpan/article/details/88372432)
- [《更相减损术\_百度百科 (baidu.com)》](https://baike.baidu.com/item/更相减损术)
- [《教你写一手漂亮的伪代码（详细规则 & 简单实例）\_陈同学的博客 - CSDN 博客\_伪代码的简单例子》](https://blog.csdn.net/Dan1374219106/article/details/106676043)
- [《伪代码是什么？如何写一个伪代码？-C#.Net 教程 - PHP 中文网》](https://www.php.cn/csharp-article-415083.html)
- [《流程图\_百度百科 (baidu.com)》](https://baike.baidu.com/item/流程图/206961)
- [《for、while、do while 三种循环的流程图画法总结（附案例） - 知乎 (zhihu.com)》](https://zhuanlan.zhihu.com/p/359722998)
- [《switch 语句流程图怎么画？简单的 switch 语句流程图模板分享 (liuchengtu.com)》](https://www.liuchengtu.com/tutorial/switchlct.html)
- [《浅谈 Stein 算法求最大公约数 (GCD) 的原理及简单应用 - COLINGAO - 博客园 (cnblogs.com)》](https://www.cnblogs.com/COLIN-LIGHTNING/p/8425484.html)
