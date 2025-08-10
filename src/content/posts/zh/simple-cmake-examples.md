---
abbrlink: badca0d4
categories:
  - CS
  - Tools
date: 2023-12-03 12:30:07
tags:
  - c
  - data-structure
  - cmake
  - software-engineering
  - build-system
title: 简单 CMake 例子
---

一些简单的 CMake 例子，记录以供复习查阅。

<!--more-->

## Single File

这个例子来自 `数据结构` 实验三。使用到的命令：

- `cmake_minimum_required`: 指定所需最小 CMake 版本。
- `set`: 设置变量；多次使用后者覆盖前者；使用 `${VARIABLE_NAME}` 的语法取值。
- `project`: 设置项目名称等。
- `add_executable`: 添加一个可执行文件生成目标；多次使用以生成多个可执行目标。

```txt
.
├── CMakeLists.txt
├── src
│   ├── adj_list_graph.c
│   ├── adj_list_graph.h
│   ├── best_path.c
│   ├── mat_graph.c
│   ├── queue.c
│   ├── queue.h
│   └── searching.c
└── test
    ├── best_path
    │   ├── test.in
    │   └── test_output.txt
    └── searching
        ├── test.in
        └── test_output.txt
```

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.12)

# c11 standard
set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED True)

# Project 1: mat_graph_basic
project(mat_graph_basic)
set(PROJ_SOURCE_FILES
        src/queue.c
        src/mat_graph.c
        )
add_executable(${PROJECT_NAME} ${PROJ_SOURCE_FILES})

# Project 2: searching
project(searching)
set(PROJ_SOURCE_FILES
        src/searching.c
        src/adj_list_graph.c
        src/queue.c
        )
add_executable(${PROJECT_NAME} ${PROJ_SOURCE_FILES})

# Project 3: best_path
project(best_path)
set(PROJ_SOURCE_FILES
        src/best_path.c
        src/adj_list_graph.c
        src/queue.c
        )
add_executable(${PROJECT_NAME} ${PROJ_SOURCE_FILES})
```

## Multiple Files

这个例子来自 `数据结构` 实验四。使用到的新的命令：

- `add_subdirectory`: 添加子目录，**每个子目录**都应该有一个单独的 `CMakeLists.txt`。
- `add_library`: 添加一个库生成目标，语法类似 `add_executable`，但第二个参数是**库类型**，第三个参数才是生成该目标所需的文件。库类型有：
  - `STATIC`: 创建一个静态库。静态库是在编译时链接到程序中的库，它们在程序启动时被加载到内存中。当你构建一个使用静态库的可执行文件时，库的代码会被复制到可执行文件中。
  - `SHARED`：创建一个共享库（也称为动态库）。共享库在运行时动态加载到内存中，多个程序可以共享同一个库的实例。这种库的代码不会被复制到可执行文件中，而是作为一个单独的文件存在，并在需要时被加载。
  - `MODULE`：创建一个模块库。模块库是一种特殊的共享库，它通常用于插件系统。模块库在运行时动态加载并链接到程序中，类似于共享库，但它们的功能更加有限。
- `target_include_directories`: 跟在某个生成目标的命令后边（例如：`add_library` 命令后边），指定生成某个目标需要包含的路径。第二个参数用于表达**可见性**：
  - `PUBLIC`：指定包含目录对目标本身以及使用该目标的其他目标都可见。
  - `PRIVATE`：指定包含目录仅对目标本身可见，不会传递给使用该目标的其他目标。
  - `INTERFACE`：指定包含目录不对目标本身可见，而是传递给使用该目标的其他目标。
- `target_link_libraries`：类似于 `target_include_directories` 的语法，用于指定生成某个目标需要链接的库文件。

除了 `target_include_directories` 命令，还有 `include_directories` 命令用于指出需要包含的路径。但是后者是全局的，而前者可以针对某个生成任务进行更细节的控制。

这个例子中的所有头文件都放在了 `./include/` 下。使用上边的用于指定包含路径的命令，最终编译时编译器可以找到这些文件。但是，在编写代码中的一些工具（例如 `ale`），可能需要你提供更多的信息。`set(CMAKE_EXPORT_COMPILE_COMMANDS True)` 命令指定 CMake 生成 `compile_commands.json` 文件，帮助这些工具找到这些头文件。

```txt
.
├── CMakeLists.txt
├── include
│   ├── elementary_lib
│   │   └── elementary.h
│   ├── heap_lib
│   │   └── min_heap.h
│   └── sorting_lib
│       ├── bubble_sort.h
│       ├── heap_sort.h
│       ├── insertion_sort.h
│       ├── merge_sort.h
│       ├── quick_sort.h
│       └── selection_sort.h
├── src
│   ├── CMakeLists.txt
│   ├── elementary_lib
│   │   └── elementary.c
│   ├── heap_lib
│   │   └── min_heap.c
│   └── sorting_lib
│       ├── bubble_sort.c
│       ├── heap_sort.c
│       ├── insertion_sort.c
│       ├── merge_sort.c
│       ├── quick_sort.c
│       └── selection_sort.c
└── test
    ├── CMakeLists.txt
    ├── test_client.c
    └── test_output.txt
```

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.21)

set(CMAKE_EXPORT_COMPILE_COMMANDS True)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED True)

project(sorting_algs_analyser LANGUAGES C)

add_subdirectory(src)
add_subdirectory(test)
```

```cmake
# src/CMakeLists.txt

# Lib 1: elementary_lib
set(ELEMENTARY_LIB_SRCS
  elementary_lib/elementary.c
)
set(ELEMENTARY_LIB_INCLUDE
  ../include/elementary_lib/
)
add_library(elementary_lib STATIC ${ELEMENTARY_LIB_SRCS})
target_include_directories(elementary_lib PUBLIC ${ELEMENTARY_LIB_INCLUDE})


# Lib 2: heap_lib
set(HEAP_LIB_SRCS
  heap_lib/min_heap.c
)
set(HEAP_LIB_INCLUDE
  ../include/heap_lib
)
add_library(heap_lib STATIC ${HEAP_LIB_SRCS})
target_include_directories(heap_lib PUBLIC ${HEAP_LIB_INCLUDE})
target_link_libraries(heap_lib PUBLIC elementary_lib)


# Lib 3: sorting_lib
set(SORTING_LIB_SRCS
  sorting_lib/bubble_sort.c
  sorting_lib/heap_sort.c
  sorting_lib/insertion_sort.c
  sorting_lib/merge_sort.c
  sorting_lib/quick_sort.c
  sorting_lib/selection_sort.c
)
set(SORTING_LIB_INCLUDE
  ../include/sorting_lib
)
add_library(sorting_lib STATIC ${SORTING_LIB_SRCS})
target_include_directories(sorting_lib PUBLIC ${SORTING_LIB_INCLUDE})
target_link_libraries(sorting_lib PUBLIC elementary_lib heap_lib)
```

```cmake
# test/CMakeLists.txt
add_executable(${PROJECT_NAME} test_client.c)
target_link_libraries(${PROJECT_NAME} PRIVATE sorting_lib)
```
