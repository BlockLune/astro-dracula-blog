---
abbrlink: 45e2d42
categories:
  - CS
  - Languages
  - C & Cpp
date: 2022-11-05 16:15:25
tags:
  - c
  - programming-language
  - printf-formatting
  - dynamic-array
title: C 语言中使用变量输出小数点位数
---

这事儿要从一周前讲起，有人在群里问了下面这么一道题，要求用 C 实现...

<!--more-->

> 习题 2-5 分数化小数（decimal）
> 输入正整数 a,b,c，输出 a/b 的小数形式，精确到小数点后 c 位。a,b<=10^6，c<=100。输入包含多组数据，结束标记为 a=b=c=0。
> 样例输入：
> 1 6 4
> 0 0 0
> 样例输出：
> 0.1667

当时我做了个简化的版本 —— 最多处理 1000 组输入，并且 c 比较小（即不需要高精度）的情况的代码，主要是做一个字符串处理，来构造一个传给 `printf()` 的格式控制字符串，代码如下：

```c
#include <stdio.h>
#include <stdlib.h> // 需要用到它的 itoa() 函数
#include <string.h> // 用到strcat拼接字符数组，memset清空字符数组

int main()
{
    // 仅实现了最多有 1000 个输入的情况
    unsigned int a[1000], b[1000], c[1000], cnt = 0;
    double ans[1000];
    for (int i = 0;; i++)
    {
        if (cnt == 1000)
        {
            break;
        }
        scanf("%u%u%u", &a[i], &b[i], &c[i]);
        cnt++;
        if (!(a[i] == 0 && b[i] == 0 && c[i] == 0))
        {
            if (b[i] != 0)
            {
                ans[i] = a[i] * 1.0 / b[i];
            }
        }
        else
        {
            break;
        }
    }
    for (int i = 0; i < cnt - 1; i++)
    {
        char formatMsgP1[] = "%.";
        char *formatMsgP2;
        // 根据位数动态确定 char 数组的大小
        if (c[i] > 99)
        {
            formatMsgP2 = malloc(sizeof(char) * 3);
        }
        else if (c[i] > 9)
        {
            formatMsgP2 = malloc(sizeof(char) * 2);
        }
        else
        {
            formatMsgP2 = malloc(sizeof(char));
        }
        itoa(c[i], formatMsgP2, 10);
        char formatMsgP3[] = "lf\n";
        char formatMsg[20];
        strcat(formatMsg, formatMsgP1);
        strcat(formatMsg, formatMsgP2);
        strcat(formatMsg, formatMsgP3);
        printf(formatMsg, ans[i]);
        memset(formatMsg, 0, sizeof(formatMsg)); // 清空数组
        free(formatMsgP2);                       // 释放指针
    }
    return 0;
}
```

这样的代码就比较麻烦，大量的代码都用在字符串拼接了。但今天看到一篇文章（[《使用变量设定小数点位数》](https://mxte.cc/90.html)），才知道原来根本不需要那么麻烦。

本来我的目标是构造这么一个格式控制字符串 `%.<c>lf`，其中 `<c>` 需要由用户输入。上边的思路就是输入数字之后用 `itoa()` 函数把输入的数字转成字符串，然后拼一拼。

但实际上可以这样：

```c
printf("%.*lf", c[i], ans[i]);
```

使用 `*`，`printf()` 就知道了，需要去后边找这么一个参数。

所以上边 `return 0;` 前面那个 `for` 里那么多东西都只要换成这一句就行了。

下边贴出一个用动态数组实现的任意组数数据输入的代码（依然没有高精度，我不会啊）：

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct NUMS
{
    unsigned int c;
    double ans;
};

struct NUMS *p = 0;
unsigned long long size = 0;

void append(unsigned int, double);

int main()
{
    int a = 0, b = 0, c = 0;

    do
    {
        scanf("%u%u%u", &a, &b, &c);
        if (a == 0 && b == 0 && c == 0)
            break;
        else
        {
            double tmp_ans = a * 1.0 / b;
            append(c, tmp_ans);
        }
    } while (1);
    for (int i = 0; i < size; i++)
    {
        printf("%.*lf\n", (p + i)->c, (p + i)->ans);
    }
    return 0;
}

void append(unsigned int _c, double _ans)
{
    if (p == 0)
    {
        p = calloc(1, sizeof(struct NUMS));
        p->c = _c;
        p->ans = _ans;
        size++;
    }
    else
    {
        struct NUMS *tmp = calloc(size, sizeof(struct NUMS));
        memcpy(tmp, p, sizeof(struct NUMS) * size);
        free(p);
        p = calloc(size + 1, sizeof(struct NUMS));
        memcpy(p, tmp, sizeof(struct NUMS) * (size + 1));
        (p + size)->c = _c;
        (p + size)->ans = _ans;
        size++;
        free(tmp);
    }
}
```
