---
abbrlink: 914118ff
categories:
  - CS
  - Languages
  - C & Cpp
date: 2023-01-12 14:53:51
tags:
  - c
  - programming-language
  - file-io
  - stdio
title: C 语言文件操作
---

简单记录一下 C 语言的文件操作的相关内容。

<!--more-->

## 前期准备

```c
// stdio.h 提供了 C 语言中的许多 IO，当然包括文件 IO
#include <stdio.h>
// 定义文件指针
FILE *fp;
```

## 打开文件 fopen()

> [!Note]
> 函数名称：fopen
>
> 参数：待打开文件的名称（包含该文件名的字符串地址），打开文件的模式；
>
> 返回值：成功打开文件则返回一个文件指针，否则返回空指针（NULL）

例如：

```c
FILE *fp;
if (fp = fopen("example.file", "r") == NULL)
{
    fprintf(stderr, "Fail to open the file.\n");
    exit(EXIT_FAILURE);
}
```

需要注意，该函数第二个参数是一个字符串，可能的值如下（表来自《C Primer Plus（第 6 版）中文版》P357 表 13.1）：

| 模式字符串                                                 | 含义                                                                                                                   |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| "r"                                                        | 以读模式打开文件                                                                                                       |
| "w"                                                        | 以写模式打开文件，把现有文件长度截为 0，如果文件不存在，则创建一个新文件                                               |
| "a"                                                        | 以写模式打开文件，在现有文件末尾添加内容，如果文件不存在，则创建一个新文件                                             |
| "r+"                                                       | 以更新模式打开文件（即可以读写文件）                                                                                   |
| "w+"                                                       | 以更新模式打开文件，如果文件存在，则将其长度截为 0，如果文件不存在则创建一个新文件                                     |
| "a+"                                                       | 以更新模式打开文件，在现有文件的末尾添加内容，如果文件不存在则创建一个新文件，**可以读整个文件，但只能从末尾添加内容** |
| "rb"、"wb"、"ab"、"rb+"、"r+b"、"wb+"、"w+b"、"ab+"、"a+b" | 与上边的对应类似，但以二进制模式打开文件                                                                               |
| "wx"、"wbx"、"w+x"、"wb+x"或"w+bx"                         | （C11）与上边对应类似，但如果文件已存在或以独占模式打开文件，则打开文件失败                                            |

带字母 x 的写模式比以前的具有更多特性：

1. 如果以传统的一种写模式打开一个现有文件，fopen() 会把该文件的长度截为 0，这样就丢失了该文件的内容。但是使用带 x 字母的写模式，即使 fopen() 操作失败，原文件的内容也不会被删除；
2. 如果环境允许，x 模式的独占特性使得其他程序或线程无法访问正在被打开的文件。

## 关闭文件 fclose()

> [!Note]
> 函数名称：fclose
>
> 参数：待关闭文件的名称（包含该文件名的字符串地址）；
>
> 返回值：成功关闭返回 0，否则返回 EOF。

注意区分 fopen() 和 fclose() 的返回值！前者失败时返回 NULL（通常情况下就是 0），后者成功时返回 0。

## 读写文件

### fprintf() 和 fscanf()

这两个函数分别和 printf() 和 scanf() 类似，只不过 printf() 和 scanf() 分别默认了写和读的标准文件是 stdout 和 stdin，而 fprintf() 和 fscanf() 的第一个参数都需要指定文件指针。

### getc() 和 putc()

这两个函数分别和 getchar() 和 putchar() 类似，只是需要提供文件指针。

### ungetc()

> [!Note]
> 函数名称：ungetc
>
> 函数原型：`int ungetc(int c, FILE *fp);`
>
> 函数作用：把 c 指定的字符放回输入流中
>
> 返回值：如果成功，则返回被推入的字符，否则返回 EOF

### fgets() 和 fputs()

虽然这两个函数也分别类似于 gets() 和 puts()，但比起上边几个函数的"类似"，这个要低一点，所以详细说明一下。

> [!Note]
> 函数名称：fgets
>
> 函数原型：`char *fgets (char * restrict str, int n, FILE * restrict fp);`
>
> 返回值：如果成功，该函数返回相同的 str 参数。如果到达文件末尾或者没有读取到任何字符，str 的内容保持不变，并返回一个空指针。如果发生错误，返回一个空指针。

需要注意 fgets() 的第二个参数，因为 fgets() 读取输入知道第一个换行符的后边（**意味着它会读入换行符**），或读到文件结尾，或读取 n-1 个字符，并在结尾加上一个 `\0` 使之成为一个字符串。

> [!Note]
> 函数名称：fputs
>
> 函数原型：`int fputs (char * restrict str, FILE * restrict fp);`
>
> 返回值：该函数返回一个非负值，如果发生错误则返回 EOF。

fputs() 与 puts() 类似，但**不会在结尾自动添加换行**。

> [!Caution]
> 注意区分 fgets() 与 gets()， fputs() 与 puts()！gets() 不保留换行符所以 puts() 自动添加换行符；fgets() 保留换行符所以 fputs() 不会添加换行符。

### fread() 和 fwrite()

上述的函数都是以文本形式读写文件，这两个函数用于以二进制形式读写文件。

读：

> [!Note]
> 函数名称：fread
>
> 函数原型：`size_t fread(void * restrict ptr, size_t size, size_t nmemb, FILE * restrict fp);`
>
> 返回值：返回成功读取项的数量。正常情况下返回值等于 nmemb，发生错误则返回值小于 nmemb。

写：

> [!Note]
> 函数名称：fwrite
>
> 函数原型：`size_t fwrite(const void * restrict ptr, size_t size, size_t nmemb, FILE * restrict fp);`
>
> 返回值：返回成功写入项的数量。正常情况下返回值等于 nmemb，发生错误则返回值小于 nmemb。

参数 size 表示待写入数据块的大小（以字节为单位），nmemb 表示待写入数据块的数量。

下边是两个使用这两个函数的例子。

```c
// 保存一个大小为 256 字节的 buffer 数组
char buffer[256];
fwrite(buffer, 256, 1, fp);

// 保存一个内含 10 个 double 类型值的数组
// 或者说理解成保存 10 个 double 类型的值
double earnings[10];
fwrite(earnings, sizeof(double), 10, fp);

// 读取 10 个 double 类型的值到一个数组中
double earnings[10];
fread(earnings, sizeof(double), 10, fp);
```

## 随机访问 fseek() 和 ftell()

> [!Note]
> 函数名称：fseek
>
> 函数原型：`int fseek(FILE *_File,long _Offset,int _Origin);`
>
> 参数：文件指针，偏移量(long 类型)，模式
>
> 返回值：正常则返回 0，错误则返回 -1。

第二个参数偏移量必须是一个 long 类型的值，代表偏移的**字节数**。这个值为正，则表示像文件末尾方向移动；为负则表示向文件开头处。
第三个参数可以理解成起点位置，可以使用 `SEEK_SET`、`SEEK_CUR` 或 `SEEK_END` 分别定位到文件开始、当前位置或文件末尾（老版本应分别使用 `0`、`1`、`2`）。

下边是一些例子（来自《C Primer Plus（第 6 版）中文版》P364）：

```c
fseek(fp, 0L, SEEK_SET);   // 定位至文件开始处
fseek(fp, 10L, SEEK_SET);  // 定位至文件中第 10 个字节
fseek(fp, 2L, SEEK_CUR);   // 从文件当前位置向结尾方向移动 2 个字节
fseek(fp, 0L, SEEK_END);   // 定位至文件末尾
fseek(fp, -10L, SEEK_END); // 从文件结尾处回退 10 个字节
```

> [!Note]
> 函数名称：ftell
>
> 函数原型：`long ftell(FILE *_File);`
>
> 返回值：返回当前位置距文件开始的字节数，如文件的第一个字节到文件开始处的距离为 0。

下边是书中给出的一个例子：

```c
fseek(fp, 0L, SEEK_END); // 首先定位到文件结尾
last = ftell(fp);        // 统计字节数，并存储到 last 中
// 逆序打印每一个字节的字符
for (count = 1L; count <= last; count++)
{
    fseek(fp, -count, SEEK_END);
    ch = getc(fp);
}
```

## 其他函数

### 刷新缓冲区 fflush()

> [!Note]
> 函数名称：fflush
>
> 函数原型：`int fflush(FILE *fp);`
>
> 函数作用：调用该函数将刷新缓冲区，即将输出缓冲区中所有的未写入数据被发送到 fp 指定的输出文件。如果 fp 为空指针，所有输出缓冲区都被刷新。
>
> 返回值：成功返回 0，错误返回 EOF。

### 创建替换使用缓冲区 setvbuf()

> [!Note]
> 函数名称：setvbuf
>
> 函数原型：`int setvbuf(FILE * restrict fp, char * restrict buf, int mode, size_t size);`
>
> 返回值：成功返回 0，否则返回非零值。

第二个参数指向待使用的缓冲区。如果是 NULL，则自动分配。
第三个参数为模式，有下边几种：

| 模式    | 描述                                                                                                                                               |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| \_IOFBF | **全缓冲**：对于输出，数据在缓冲填满时被一次性写入。对于输入，缓冲会在请求输入且缓冲为空时被填充。                                                 |
| \_IOLBF | **行缓冲**：对于输出，数据在遇到换行符或者在缓冲填满时被写入，具体视情况而定。对于输入，缓冲会在请求输入且缓冲为空时被填充，直到遇到下一个换行符。 |
| \_IONBF | **无缓冲**：不使用缓冲。每个 I/O 操作都被即时写入。buffer 和 size 参数被忽略。                                                                     |

### feof() 和 ferror()

当上一次输入调用检测到文件结尾时，feof() 函数返回一个非零值，否则返回 0。
当读写出现错误，ferror() 函数返回一个非零值，否则返回 0。
