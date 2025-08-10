---
title: Makefile 简单笔记
abbrlink: b5f1b38d
categories:
  - CS
  - Tools
tags:
  - c
  - cpp
  - makefile
  - software-engineering
  - build-tool
date: 2023-01-08 10:52:48
updated: 2024-12-06 14:50:00
---

这是一篇笔记，原视频是 [@于仕琪](https://space.bilibili.com/519963684) 老师的 [《Makefile 20 分钟入门，简简单单，展示如何使用 Makefile 管理和编译 C++ 代码》](https://www.bilibili.com/video/BV188411L7d2)。

<!--more-->

在开始之前，先来复习一下 `g++` 的使用方法，下面的例子中使用到了：

- `-c` 参数表示生成 obj 文件（`*.o`）；
- `-o` 用于指定生成的可执行文件的名称，比如 `-o hello` 就表示生成名为 `hello` 的可执行文件；
- `-Wall` 表示 Warning all，也就是打开全部的警告。

下面是示例的目录结构。其中的 `Makefile` 就是今天的主角。

```text
.
├── Makefile
├── factorial.cpp
├── main.cpp
└── printhello.cpp
```

我们的任务如下：

我们希望构建名为 `hello` 的可执行文件，该程序需要基于 `main.cpp`、`printhello.cpp` 和 `factorial.cpp` 三个文件来构建。

## 版本一

这个版本的 Makefile 如下：

```makefile
hello: main.cpp printhello.cpp factorial.cpp
    g++ -o hello main.cpp printhello.cpp factorial.cpp
```

上面提到，我们希望基于三个文件构建一个可执行文件 `hello`。

Makefile 的第一行就表达了这样的 “基于” 关系：开头的 `hello` 表示任务目标，后面跟着一个冒号，紧跟使用空格分隔的三个依赖项。冒号前的任务目标基于冒号后的依赖项进行构建。

第二行描述了构建的具体方法：以 `Tab` 开头，后跟使用 `g++` 基于 `main.cpp` 等三个文件构建 `hello` 的具体命令。

`make` 做的事情很简单：它检查任务目标和依赖项，如果发现依赖项的更改时间晚于任务目标的更改时间，说明在上次构建之后，依赖项更新了，它就知道需要重新执行构建命令，构建新的任务目标。

在当前目录下运行 `make hello` 即可运行名为 `hello` 的这个任务，构建 `hello` 这个可执行文件。

## 版本二

```makefile
CXX = g++
TARGET = hello
OBJ = main.o printhello.o factorial.o

$(TARGET): $(OBJ)
    $(CXX) -o $(TARGET) $(OBJ)

main.o: main.cpp
    $(CXX) -c main.cpp

printhello.o: printhello.cpp
    $(CXX) -c printhello.cpp

factorial.o: factorial.cpp
    $(CXX) -c factorial.cpp
```

在这一版本中，我们引入了变量。使用形如 `XXX = YYY` 的语法来赋值，并使用形如 `$(XXX)` 的语法来取值。

## 版本三

```makefile
CXX = g++
TARGET = hello
OBJ = main.o printhello.o factorial.o

CXXFLAGS = -c -Wall

$(TARGET): $(OBJ)
    $(CXX) -o $@ $^

%.o: %.cpp
    $(CXX) $(CXXFLAGS) $< -o $@

.PHONY: clean
clean:
    rm -f *.o $(TARGET)
```

在这个版本的例子中，出现了 `$@`、`$^`、`$<` 等符号，他们分别表示冒号前面的内容、冒号后边的全部内容和冒号后边第一个内容。

在上面的版本中，我们的 `hello` 既是任务的构建产物的名字，也是任务本身的名字。但是，如果我们的任务并不产生构建产物，或者说，我们只是需要一个辅助任务呢？

我们可以使用 `.PHONY` 来标记这些没有构建产物的任务。

这个例子中，我们使用了以下内容来创建一个 `clean` 任务：

```makefile
.PHONY: clean
clean:
    rm -rf *.o $(TARGET)
```

一个常见的模式是定义一个 `all` 任务，将所有构建任务作为其依赖项，并将其作为第一个任务。因为不带任务名的 `make` 会执行 Makefile 中第一个任务，所以对于这样的 Makefile，直接运行 `make` 就可以构建所有任务：

```makefile
.PHONY: all clean

all: hello

hello: main.cpp printhello.cpp factorial.cpp
    g++ -o hello main.cpp printhello.cpp factorial.cpp

clean:
    rm -f hello
```

## 版本四

```makefile
CXX = g++
TARGET = hello
SRC = $(wildcard *.cpp)
OBJ = $(patsubst %.cpp, %.o, $(SRC))

CXXFLAGS = -c -Wall

$(TARGET): $(OBJ)
    $(CXX) -o $@ $^

%.o: %.cpp
    $(CXX) $(CXXFLAGS) $< -o $@

.PHONY: clean
clean:
    rm -f *.o $(TARGET)
```

在这个例子中，使用了两个函数：

- `SRC = $(wildcard *.cpp)` 使用了函数 `wildcard`，这个函数会扩展为当前目录下所有 `.cpp` 文件的列表。
- `OBJ = $(patsubst %.cpp, %.o,$(SRC))` 使用了函数`patsubst`（pattern substitute），这个函数会将变量 `SRC` 中的每个 `.cpp` 文件名替换为相应的 `.o` 文件名。
