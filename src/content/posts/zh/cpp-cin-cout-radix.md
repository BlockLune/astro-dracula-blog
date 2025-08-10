---
abbrlink: "9e863176"
categories:
  - CS
  - Languages
  - C & Cpp
date: 2022-09-29 17:30:25
tags:
  - cpp
  - programming-language
  - octal
  - decimal
title: C++ 中 cin 与 cout 的转进制输入输出
---

笔者的朋友有道输入八进制输出十进制的题目，他是使用数学方法实现的。笔者隐隐约约记得好像cin和cout有控制输入输出数字进制的方法，查找了一些资料，做一下笔记。

<!--more-->

| 进制     | 对应缩写 |
| -------- | -------- |
| 二进制   | bin      |
| 八进制   | oct      |
| 十进制   | dec      |
| 十六进制 | hex      |

接下来只要在输入/输出的时候加上这些缩写就行了。

比如输入一个八进制数然后以十进制输出它：

```c++
#include <iostream>

using namespace std;

int main()
{
    unsigned long long num;
    cin >> oct >> num;
    cout << dec << num << endl;
    return 0;
}
```

程序运行结果：

```bash
1750
1000
```

（"1750"是输入，"1000"是输出）
