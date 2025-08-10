---
abbrlink: 78dc947f
categories:
  - CS
  - Languages
  - C & Cpp
date: 2023-01-11 12:34:16
tags:
  - c
  - cpp
  - clang
  - lldb
  - debugging
title: "error: summary string parsing error 错误解决方法"
toc: true
---

直接先说解决方法：在使用 clang 工具链进行编译的时候，添加编译选项 `-fstandalone-debug`。

<!--more-->

下边是完整的发现及解决问题的过程。

## 发现问题

在按照 [《使用 VS Code + Clangd + CMake 搭建 C/C++ 开发环境》](https://www.bilibili.com/video/BV1sW411v7VZ) 搭建我在 ArchWSL 内的 C/C++ 开发环境时，我创建了一个用于测试的 HelloWorld 工程。这个工程的文件结构长这样：

```text
.
├── build
├── .clang-format
├── CMakeLists.txt
└── main.cpp
```

```cmake
# @file CMakeLists.txt
# old

cmake_minimum_required(VERSION 3.10)

project(HelloWorld)

add_executable(HelloWorld main.cpp)
```

```cpp
// @file main.cpp

#include <iostream>
#include <string>

int main()
{
    int a = 10;
    std::string str = "你好";
    std::cout << str << std::endl;
    return 0;
}
```

调试的时候发现，int 型变量 a 是可以查看的，但 std::string 型的变量 str 却显示 `error: summary string parsing error` 错误。

## 问题解决

在测试中我发现，这个问题只在我使用 clang 工具链编译时产生，使用 g++ 就没有这个问题，所以猜测不是 lldb 调试器的问题，而是 clang 编译器的问题。

在网上搜索到了类似的问题：

- [无法在 lldb 中检查 std::string 变量 - 问答 - 腾讯云开发者社区](https://cloud.tencent.com/developer/ask/sof/1542916)
- [Cannot inspect any strings · Issue #415 · vadimcn/vscode-lldb](https://github.com/vadimcn/vscode-lldb/issues/415)

都说要使用 `-fstandalone-debug` 重新编译。

于是修改 CMakeLists.txt 为：

```cmake
# @file CMakeLists.txt
# new

cmake_minimum_required(VERSION 3.10)

project(HelloWorld)

# 如果使用的是 clang 工具链，那么需要添加上 -fstandalone-debug，否则 lldb 无法查看 std::string 的东东
# 见 https://cloud.tencent.com/developer/ask/sof/1542916
# 又见 https://github.com/vadimcn/vscode-lldb/issues/415
add_compile_options(-fstandalone-debug)
message(STATUS "optional: -fstandalone-debug")

add_executable(HelloWorld main.cpp)
```

至此成功解决。
