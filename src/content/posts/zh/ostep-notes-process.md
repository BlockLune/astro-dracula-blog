---
title: 进程的基本概念 - OSTEP 笔记
tags:
  - note
  - operating-system
  - ostep
  - process
date: 2024-09-13 21:15:51
updated: 2024-12-25 18:55:00
---

这是我的 [OSTEP 系列笔记](/zh/posts/ostep-notes)的一部分，此篇主要包含了进程基本概念的理解，以及 Unix 进程 API。

<!--more-->

进程可以简单理解为一个正在运行的程序。不在运行的程序只是一段静态的代码，而当这些代码在 CPU 上跑起来，并与寄存器、内存等产生交互，它就成为了进程。

## 进程的内存

进程需要以下几部分内存：

- 用于存放代码和静态数据的内存。
- 堆内存。堆是程序员手动申请和释放的内存的来源，在 C 语音中这意味着 `malloc()` 和 `free()` 相关的内存。
- 栈内存。当使用 `int x = 0;` 声明并定义一个变量后，就可能需要一片内存来存放相关数据。栈内存基本上是由编译器使用的。

可以将这几部分内存的排布理解成下面这样：从小地址到大地址，首先是用于存放代码和静态数据的内存空间，接着是堆内存，最后是栈内存。其中，堆内存向大地址方向增长，而栈的头本身就位于最大地址处，栈内存向小地址方向增长。

## 进程的状态

进程有以下几种最主要的状态：

- **运行**：进程正在 CPU 上运行，即正在执行指令。
- **就绪**：进程已经准备好要到 CPU 上运行了，但是因为某些原因（例如 CPU 上其他程序正在执行）不能切换到运行状态。
- **阻塞**：进程遇到了需要完成的额外操作（例如 IO 操作），于是他进入阻塞状态，等待那件事情完成，然后会进入就绪状态。

从就绪到运行意味着该进程已经被 **调度（Scheduled）** 了；相反，从运行转移到就绪意味着它被**取消调度（Descheduled）** 了。

## 上下文切换与进程控制块

在计算机中，不同的进程被操作系统安排着在 CPU 上运行。出于多种原因（例如公平、例如一个进程正在等待额外操作无法继续运行），操作系统需要切换位于 CPU 上正在运行的进程。这意味着，操作系统需要跟踪进程的相关信息，包括该进程所用的寄存器中的值等，以便后面再将进程还原。

这样切换正在 CPU 上正在运行的程序的技术称为 **上下文切换（Context Switch）**，而存储关于进程信息的结构称为 **进程控制块（Process Control Block, PCB）**。

## Unix 进程 API

在 Unix 系统中，主要有三种与进程相关的系统调用 `fork()`，`wait()` 和 `exec()`。课后作业还提到了`open()`, `close()`, `read()`, `write()`, `pipe()` 等。

使用 `fork()` 来创建子进程。它创建的是当前进程的副本，意思是本质上两个进程的程序代码是一样的（这意味着父进程中的变量也会分裂为多份同名变量，各自进程操作的是各自的同名变量）。

可以根据 `fork()` 的不同返回值来让父进程和子进程执行不同的逻辑 —— 父进程中的对应 `fork()` 语句返回了子进程的 PID，而子进程中的对应 `fork()` 语句返回 0。一般的代码结构如下：

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    int pid = fork();
    if (pid < 0) {
        perror("Fork failed!\n");
        exit(1);
    } else if (pid == 0) {
        // child process
    } else {
    // parent process
    }
}
```

需要仔细理解 `fork()` 创建子进程的逻辑。思考下面的这个例子：

```c
int pid_1 = fork();
int pid_2 = fork();
```

上面的代码创建了几个子进程？答案是三个子进程，所以算上父进程一共有四个进程。为什么？一步一步来看，第一行运行后，父进程创建了子进程 1，这没问题；但紧接着，第二行会在父进程和子进程 1 中同时被运行，分别创建出子进程 2 和子进程 3。

为了创建不多不少两个子进程，应该这样做：

```c
int pid_1 = fork();
if (pid_1 < 0) {
    // ...
} else if (pid_1 == 0) {
    // child process 1
} else {
    int pid_2 = fork();
    if (pid_2 < 0) { /* ... */ }
    else if (pid_2 == 0) { /* child process 2 */ }
    else { /* parent process */ }
}
```

`exec()` 不同于 `fork()` ，它创建子进程，但可以运行其他程序。实际上该系统调用有多种使用不同后缀标识的不同版本，实现了功能上的细分，具体见 `man exec`。

`wait()` 用于等待子进程结束，使用 `wait(NULL)` 来等待任一子进程结束。它返回等待的那个进程的 PID，如果不存在需要等待的进程（例如在一个没有子进程的子进程中调用 `wait`），返回 -1。

类似的是 `waitpid()`，它提供了更高级的控制。可以将普通的 `wait(NULL)` 写作 `waitpid(-1, NULL, 0)`，指定等待特定 PID 的子进程结束，可以使用 `waitpid(PID, NULL, 0)`。更多信息见 `man wait`。

`open()` 和 `close()` 用于打开和关闭 **文件描述符（File Descriptor）**。下面是一个以读写方式、如果不存在就创建、如果存在就截断的方式打开文件的例子：

```c
int fd = open("example.file", O_RDWR | O_CREAT | O_TRUNC);
```

为了关闭该文件描述符，使用：

```c
close(fd);
```

存在特殊的文件描述符，例如标准输出是 `STDOUT_FILENO`。

使用 `close` 关闭文件描述符后，就不能向该文件进行读写操作了。例如如果关闭了 `STDOUT_FILENO`，`printf` 就无法向屏幕打印文本了。

使用 `read()` 和 `write()` 向或从指定的文件描述符中读或写。它们的参数列表很类似，第一个参数是文件描述符，第二个参数是缓冲，第三个是读或写的字节数。具体见 `man read` 和 `man write`。

使用 `pipe()` 可以创建一对管道文件描述符。管道本身提供了同步，它提供了以下的阻塞的数据读写方式：

- 写入时，如果读取端没有读取，写操作会阻塞，直到有数据被读取或缓冲区被填满；
- 读取时，如果写入端没有写入，读操作会阻塞，直到有数据被写入。

下面的例子创建了两个子进程，并将其中一个子进程的标准输出连接到了另一个子进程的标准输入：

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

int main(int argc, char *argv[]) {
  const char* output = "Hello world!";

  int pipefd[2];

  if (pipe(pipefd) == -1) {
    perror("Pipe failed!\n");
    exit(1);
  }

  int cpid_1 = fork();

  if (cpid_1 < 0) {
    perror("Fork failed!\n");
    exit(1);
  } else if (cpid_1 == 0) {
    // child process 1 continues
    close(pipefd[0]); // close the read end
    write(pipefd[1], output, strlen(output) + 1);
    close(pipefd[1]); // close the write end after writing
    exit(0);
  } else {
    // parent process continues
    int cpid_2 = fork();
    if (cpid_2 < 0) {
      perror("Fork failed!\n");
      exit(1);
    } else if (cpid_2 == 0) {
      // child process 2 continues
      close(pipefd[1]); // close the write end
      char buf;
      while (read(pipefd[0], &buf, 1) > 0) {
        write(STDOUT_FILENO, &buf, 1);
      }
      close(pipefd[0]); // close the read end after reading
      exit(0);
    } else {
      close(pipefd[0]);
      close(pipefd[1]);
      waitpid(cpid_1, NULL, 0);
      waitpid(cpid_2, NULL, 0);
    }
  }
  return 0;
}
```

## 受限直接运行

为了虚拟化 CPU，使许多任务（即许多程序）共享一个物理上的 CPU，但却让它们自己以为正独占运行在一个 CPU 上，我们采取的办法是**时分共享（Time Sharing）** —— 运行一个进程一段时间，然后再运行另一个进程，如此轮换。

所谓的受限直接运行（Limited Direct Execution），指出了两个关键：

- 用户程序 **直接** 运行在 CPU 上。操作系统也是软件，但它没有独占 CPU，而是适时地将其让出来，供用户程序使用。
- 用户程序 **受限** 地运行在 CPU上。用户程序不能无限制地利用所有系统资源，操作系统是管理者，由他来决定用户程序能使用多少资源。

### “受限”

先看 **受限** 的部分。操作系统如何实现受限呢？硬件提供了帮助：通过提供 **用户模式（User Mode）** 和 **内核模式（Kernel Mode）** 来提供不同级别的硬件资源访问能力。用户程序在用户模式下运行，而操作系统（或内核）在内核模式下运行。

如果用户程序需要执行某个特权操作（即内核才拥有的硬件资源访问操作，例如从磁盘读取），它可以执行特殊的 **陷阱（Trap）指令**，以**陷入**操作系统，操作系统进而可以完成这样一个特权操作，并通过 **从陷阱返回（Return-From-Trap）指令）**，返回用户程序。

此外，操作系统还必须明确如果发生异常需要怎么做，例如硬盘无法读取了怎么办。操作系统通过在启动时设置**陷阱表（Trap Table）** 来实现这样的需求。这是机器启动时操作系统做的第一件事情。

### “直接”

再来看 **直接** 的部分。CPU 是一个 “无情的指令执行机器“，它所做的就是一个 ”取指令、解析指令含义、执行该指令、取下一条指令“ 的循环。无论是用户程序还是操作系统，本质都是软件，都是一系列指令的集合。所以，当用户程序在 CPU 上运行时，操作系统就不在 CPU 上运行！如果操作系统不在运行，那它怎么做到停止一个进程、启用另一个进程呢？

**协作（cooperative）** 的方法是，用户程序通过特殊的系统调用（`yield`）来将控制权交给操作系统。显然这里可能会有很多问题。

**非协作** 的方法是借助于额外的硬件：时钟。它可以每隔一段时间产生一次 **时钟中断（Timer Interrupt）**。产生中断时，当前正在运行的进程会被强制停止，操作系统预先配置的**中断处理程序（Interrupt Handler）** 会运行，帮助操作系统重新拿到 CPU 的控制权。
