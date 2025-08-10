---
abbrlink: 10d14c30
categories:
  - CS
  - Languages
  - C & Cpp
date: 2022-10-06 12:07:45
tags:
  - cpp
  - game
  - algorithm
  - data-structure
  - programming-language
title: 补记一个用 C++ 实现的 2048 小游戏
toc: true
---

校科协的加入有条件，面试前一步是笔试。免去笔试的方法也不是没有，可以做免试题。看了各个组的免试题，发现都好难好难，只有前端组的 2048 敢去尝试尝试。但我有没怎么学过 JS，便想着先用 C++ 实现一下逻辑，再把代码改过去。

<!--more-->

## 游戏规则

引用免试题中的原话：

> 在一个 4 \* 4 大小共计 16 个的方格中，初始时会有随机两个方格出现 2 / 4 ，每次通过 方向键 控制所有方块向同一个方向运动，两个相同数字的方块撞在一起之后合并成为他们的和，每次操作之后会在空白的方格处随机生成一个 2 或者 4 ，当最终得到一个 2048 的方块时即获得游戏胜利。如果16个格子全部填满并且相邻的格子都不相同也就是无法移动的话，那么 Game Over 。

~~写这篇博客的时候才发现原来还有"当最终得到一个 2048 的方块时即获得游戏胜利"这句话，我并没有实现这个就是说。~~

## C++ 源代码

```C++
#include <iostream>
#include <cstdlib>
#include <ctime>
#include <conio.h>

using namespace std;

short box_c[4][4]; // 运算用 box_content
// short box_s[4][4]; // 显示用 box_show
bool map[4][4]; // 用于表示是否发生过合并

/*

([0][0])  ([0][1])  ([0][2])  ([0][3])

([1][0])  ([1][1])  ([1][2])  ([1][3])

([2][0])  ([2][1])  ([2][2])  ([2][3])

([3][0])  ([3][1])  ([3][2])  ([3][3])

*/

int getRandomNum(int min, int max)
{
    // 这里不能srand，不然就会生成出来都是同一个随机数
    return (rand() % (max - min + 1)) + min;
}

int getTwoOrFour()
{
    if (getRandomNum(1, 2) == 1)
    {
        return 2;
    }
    return 4;
}

void generateNewNum()
{
    for (int i = 0; i < 1;)
    {
        int possibleI = getRandomNum(0, 3);
        int possibleJ = getRandomNum(0, 3);
        if (box_c[possibleI][possibleJ] == 0)
        {
            i++;
            box_c[possibleI][possibleJ] = getTwoOrFour();
        }
    }
}

// 清空map
void map_refresh()
{
    for (int i = 0; i < 4; i++)
    {
        for (int j = 0; j < 4; j++)
        {
            map[i][j] = 0;
        }
    }
}

void init() // 初始化
{
    // 初始化随机数种子
    srand(time(0));
    // 初始全部赋值为0
    for (int i = 0; i < 4; i++)
    {
        for (int j = 0; j < 4; j++)
        {
            box_c[i][j] = 0;
            map[i][j] = 0;
        }
    }
    // 随机找两个位置填充2或者4
    /* for (int i = 0; i < 2;)
    {
        int possibleI = getRandomNum(0, 3);
        int possibleJ = getRandomNum(0, 3);
        if (box_c[possibleI][possibleJ] == 0)
        {
            i++;
            box_c[possibleI][possibleJ] = getTwoOrFour();
        }
    } */
    // 直接用这个函数生成两个得了
    generateNewNum();
    generateNewNum();
}

// 本来想显示运算分离的，后来感觉好像没啥必要
/* void refreshShow()
{
    for (int i = 0; i < 4; i++)
    {
        for (int j = 0; j < 4; j++)
        {
            box_s[i][j] = box_c[i][j];
        }
    }
} */

void show()
{
    for (int i = 0; i < 4; i++)
    {
        for (int j = 0; j < 4; j++)
        {
            cout << box_c[i][j] << " ";
            // cout << box_s[i][j] << " ";
        }
        cout << endl;
    }
    cout << endl;
}

void moveUp()
{
    for (int j = 0; j < 4; j++)
    {
        for (int i = 3; i > 0; i--)
        {
            if (box_c[i - 1][j] == 0)
            {
                box_c[i - 1][j] = box_c[i][j];
                box_c[i][j] = 0;
                // 将下边的全部平移过来
                for (int k = i; k < 3; k++)
                {
                    box_c[k][j] = box_c[k + 1][j];
                    box_c[k + 1][j] = 0;
                }
            }
            if (box_c[i - 1][j] == box_c[i][j] && map[i - 1][j] == 0 && map[i][j] == 0)
            {
                box_c[i - 1][j] *= 2;
                map[i - 1][j] = 1; //标识此次合并
                box_c[i][j] = 0;
                // 将下边的全部平移过来
                for (int k = i; k < 3; k++)
                {
                    box_c[k][j] = box_c[k + 1][j];
                    box_c[k + 1][j] = 0;
                }
            }
        }
    }
    generateNewNum();
    map_refresh();
}

void moveDown()
{
    for (int j = 0; j < 4; j++)
    {
        for (int i = 0; i < 3; i++)
        {
            if (box_c[i + 1][j] == 0)
            {
                box_c[i + 1][j] = box_c[i][j];
                box_c[i][j] = 0;
                // 将上边的全部平移过来
                for (int k = i; k > 0; k--)
                {
                    box_c[k][j] = box_c[k - 1][j];
                    box_c[k - 1][j] = 0;
                }
            }
            if (box_c[i + 1][j] == box_c[i][j] && map[i + 1][j] == 0 && map[i][j] == 0)
            {
                box_c[i + 1][j] *= 2;
                map[i + 1][j] = 1; //标识此次合并
                box_c[i][j] = 0;
                // 将上边的全部平移过来
                for (int k = i; k > 0; k--)
                {
                    box_c[k][j] = box_c[k - 1][j];
                    box_c[k - 1][j] = 0;
                }
            }
        }
    }
    generateNewNum();
    map_refresh();
}

void moveLeft()
{
    for (int i = 0; i < 4; i++)
    {
        for (int j = 3; j > 0; j--)
        {
            if (box_c[i][j - 1] == 0)
            {
                box_c[i][j - 1] = box_c[i][j];
                box_c[i][j] = 0;
                // 将右边的全部平移过来
                for (int k = j; k < 3; k++)
                {
                    box_c[i][k] = box_c[i][k + 1];
                    box_c[i][k + 1] = 0;
                }
            }
            if (box_c[i][j - 1] == box_c[i][j] && map[i][j - 1] == 0 && map[i][j] == 0)
            {
                box_c[i][j - 1] *= 2;
                map[i][j - 1] = 1; //标识此次合并
                box_c[i][j] = 0;
                // 将右边的全部平移过来
                for (int k = j; k < 3; k++)
                {
                    box_c[i][k] = box_c[i][k + 1];
                    box_c[i][k + 1] = 0;
                }
            }
        }
    }
    generateNewNum();
    map_refresh();
}

void moveRight()
{
    for (int i = 0; i < 4; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            if (box_c[i][j + 1] == 0)
            {
                box_c[i][j + 1] = box_c[i][j];
                box_c[i][j] = 0;
                // 将左边的全部平移过来
                for (int k = j; k > 0; k--)
                {
                    box_c[i][k] = box_c[i][k - 1];
                    box_c[i][k - 1] = 0;
                }
            }
            if (box_c[i][j + 1] == box_c[i][j] && map[i][j + 1] == 0 && map[i][j] == 0)
            {
                box_c[i][j + 1] *= 2;
                map[i][j + 1] = 1; //标识此次合并
                box_c[i][j] = 0;
                // 将右边的全部平移过来
                for (int k = j; k > 0; k--)
                {
                    box_c[i][k] = box_c[i][k - 1];
                    box_c[i][k - 1] = 0;
                }
            }
        }
    }
    generateNewNum();
    map_refresh();
}

int main()
{
    init();
    show();
    // https://www.runoob.com/w3cnote/c-get-keycode.html
    while (true)
    {
        if (_kbhit())
        {                      //如果有按键按下，则_kbhit()函数返回真
            int ch = _getch(); //使用_getch()函数获取按下的键值
            switch (ch)
            {
            case 119: // w
                moveUp();
                show();
                break;
            case 97: // a
                moveLeft();
                show();
                break;
            case 115: // s
                moveDown();
                show();
                break;
            case 100: // d
                moveRight();
                show();
                break;
            default:
                break;
            }
            if (ch == 27)
            {
                break;
            } //当按下ESC时结束
        }
    }
    return 0;
}
```

## 代码阅读与分析

### 4\*4 方格的构建

我创建了 `box_c` 这个二维数组来构建了下面这样一个棋盘来存放数据。数据值为 0 表示这个格子空着，非零则是对应数字。

```C++
/*

([0][0])  ([0][1])  ([0][2])  ([0][3])

([1][0])  ([1][1])  ([1][2])  ([1][3])

([2][0])  ([2][1])  ([2][2])  ([2][3])

([3][0])  ([3][1])  ([3][2])  ([3][3])

*/
```

另外还有 `map` 这个二维数组，我放到后边说。

### 生成新的数字

因为要在 4\*4 的方格内随机生成 2 或者 4，所以首先就先做一个随机数生成器。

首先引入两个库：

```C++
#include <cstdlib>
#include <ctime>
```

`<cstdlib>` 提供了 `srand()` 和 `rand()` 函数。

`srand()` 接受一个用于初始化的随机数"种子"。 一般我们就用当前时间`time(0)`作为种子。（这就是为什么我们需要引入 `<ctime>` 这个库。 ）

`rand()` 函数会产生一个 [0,RAND_MAX]范围内的整数。通过一些算式，我们可以人为构造一些式子来实现生成需求范围内的随机数。下表展示了一些式子。

| 目标类型及范围   | 表达式                    |
| ---------------- | ------------------------- |
| [0,n) 内的整数   | rand() % n                |
| [a,b) 内的整数   | (rand() % (b-a)) + a      |
| [a,b] 内的整数   | (rand() % (b-a+1)) + a    |
| (a,b] 内的整数   | (rand() % (b-a)) + a + 1  |
| 0～1之间的浮点数 | rand() / double(RAND_MAX) |

还有一个通用公式：a + rand() % n。

其中的 a 是起始值，n 是整数的范围。

> [!Tip]
> 注意！`srand()`用于初始化，**只需要初始化一次**。所以，你的获取随机数函数应该长得像这样：
>
> ```C++
> int getRandomNum(int min, int max)
> {
>     return (rand() % (max - min + 1)) + min;
> }
> int main()
> {
>     srand(time(0));
>     cout << getRandomNum(1,100) << endl;
>     return 0;
> }
> ```
>
> 而不是这样：
>
> ```C++
> int getRandomNum(int min, int max)
> {
>     srand(time(0));
>     return (rand() % (max - min + 1)) + min;
> }
> int main()
> {
>     cout << getRandomNum(1,100) << endl;
>     return 0;
> }
> ```
>
> **错误的写法会导致快速生成随机数时每次返回的都是随机数序列的第一个...** （可能是程序运行速度很快种子都是一样的结果）。

接着我定义了 `getTwoOrFour()` 和 `generateNewNum()` 函数。前者用于随机生成 2/4，不必多说。后者用于在 4\*4 方格内随机放上一个数字，首先生成行列坐标，如果检查到这个格子空的，可以生成在这，那就生成，结束该函数的运行，否则进行下一次尝试。

```C++
int getTwoOrFour()
{
    if (getRandomNum(1, 2) == 1)
    {
        return 2;
    }
    return 4;
}

void generateNewNum()
{
    for (int i = 0; i < 1;)
    {
        int possibleI = getRandomNum(0, 3);
        int possibleJ = getRandomNum(0, 3);
        if (box_c[possibleI][possibleJ] == 0)
        {
            i++;
            box_c[possibleI][possibleJ] = getTwoOrFour();
        }
    }
}
```

### 初始化

初始化主要就是两方面：一方面是初始化随机数种子；另一方面是清空棋盘（其实还有清空 map 标记），然后随机找两个位置放上 2 或者 4。

```C++
void init() // 初始化
{
    // 初始化随机数种子
    srand(time(0));
    // 初始全部赋值为0
    for (int i = 0; i < 4; i++)
    {
        for (int j = 0; j < 4; j++)
        {
            box_c[i][j] = 0;
            map[i][j] = 0;
        }
    }
    // 随机找两个位置填充2或者4
    generateNewNum();
    generateNewNum();
}
```

### 移动与合并

> [!Caution]
> 注意这里的移动与合并算法可能不是最优解，可能比较低效，甚至可能有错误。仅供参考。

移动无非就是上下左右，彼此之间比较类似。这里以向上移动为例：

```C++
void moveUp()
{
    for (int j = 0; j < 4; j++)
    {
        for (int i = 3; i > 0; i--)
        {
            if (box_c[i - 1][j] == 0)
            {
                box_c[i - 1][j] = box_c[i][j];
                box_c[i][j] = 0;
                // 将下边的全部平移过来
                for (int k = i; k < 3; k++)
                {
                    box_c[k][j] = box_c[k + 1][j];
                    box_c[k + 1][j] = 0;
                }
            }
            if (box_c[i - 1][j] == box_c[i][j] && map[i - 1][j] == 0 && map[i][j] == 0)
            {
                box_c[i - 1][j] *= 2;
                map[i - 1][j] = 1; //标识此次合并
                box_c[i][j] = 0;
                // 将下边的全部平移过来
                for (int k = i; k < 3; k++)
                {
                    box_c[k][j] = box_c[k + 1][j];
                    box_c[k + 1][j] = 0;
                }
            }
        }
    }
    generateNewNum();
    map_refresh();
}
```

首先因为是向上移动，所以先拆分一下上边的二维数组，拆成四列。第一层 `j` 的循环就是列的循环。

在某一列中，我想从下往上考虑：如果上面一个格子是 0 ，那我就把现在这个格子里的数字上移；如果这个位置和上边位置的数一样，我就让上边位置的数乘二，然后下边位置赋0。不断从下往上扫描直到能移动的全部移动，能合并的全部合并。

但是有个问题是，每次移动各个数字只能发生一次合并！如果这个数字合并过了，那它就不应该再合并了。比如四个2,移动一次应该产生两个4而非1个8。

所以我创建了一个 `map` ，用于标识已经发生的合并。并且取消掉了之前的不断的从上到下的扫描，改为了如果发生了一次移动或者合并，即给当前格子进行了赋0操作的话，我就把下边的所有格子往上移动一次。

总结一下思路：如果以 0,1,2,3 从上往下标识这一列格子。我从 3 往上扫描到 1 ，如果发现当前格子是 0，也即上边格子空着，我就把这个格子开始下边的所有格子往上移动一位；类似的，如果发现上边格子和当前格子可以合并，并且查询 `map` 发现这两个格子里边的数字在这轮移动中都没有发生过合并，那就合并，并也将下边格子的内容全部往上移动。

当四列都结束后，便用 `generateNewNum()` 填充一个新数字，并且清空 `map` 的状态。

### 结束检测

这个 C++ 代码中这块并没有实现，不过最后的 Web 版本是实现了的。借一下那边的代码讲一下思路吧。

```js
ifEnd: function () {
            console.log("正在检测游戏是否结束！");
            var flag = 0;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    // 如果有空位，说明必定可以继续
                    if (box_c[i][j] == 0) {
                        flag = 1;
                        console.log("检测到游戏仍然有空位，游戏继续！");
                        break;
                    }
                }
                if (flag == 1) {
                    break;
                }
            }
            // 为0则说明没有空位了
            if (flag == 0) {
                console.log("检测到游戏没有空位了，下面检测是否有可合并方块！");
                var flag2 = 0;
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        if ((box_c[i][j] == box_c[i][j + 1]) || (box_c[i][j] == box_c[i + 1][j])) {
                            flag2 = 1;
                            console.log("检测到可合并方块，游戏继续！");
                            break;
                        }
                    }
                    if (flag2 == 1) {
                        break;
                    }
                }
                // 最后一列单独检测
                for (var i = 0; i < 3; i++) {
                    if (box_c[i][3] == box_c[i + 1][3]) {
                        flag2 = 1;
                        console.log("检测到可合并方块，游戏继续！");
                        break;
                    }
                }
                // 最后一行单独检测
                for (var j = 0; j < 3; j++) {
                    if (box_c[3][j] == box_c[3][j + 1]) {
                        flag2 = 1;
                        console.log("检测到可合并方块，游戏继续！");
                        break;
                    }
                }
                if (flag2 == 0) {
                    console.log("检测到游戏无空位且无法继续移动，游戏结束！");
                    alert('游戏结束，即将重新开始！');
                    location.reload();
                }
            }
        }
```

游戏结束的标志是两个：一是没有空格子了，二是任意相邻格子没有相同数字不可能发生合并了。

所以首先就是扫描所有格子看看有没有空格子。如果没有格子，就开始扫描相邻格子是否有相同数字。我的扫描方法是从(0,0)到(2,2)都只检测它的右方和下方是否与它相同，然后再单独检测一下最右边一列前三个元素的下一个和最下边一行前三个元素的右边一个是否与它们自己相同。如果也没有相同的了，那就 Game Over 。

### 获取键盘输入

直接看参考资料《C/C++ 获取键盘事件》吧...

## 参考资料

[《C++产生随机数》](https://www.cnblogs.com/xiaokang01/p/9786751)
[《C/C++ 获取键盘事件》](https://www.runoob.com/w3cnote/c-get-keycode.html)
... ...
