---
title: OSTEP 笔记
tags:
  - operating-system
  - ostep
  - note
date: 2024-09-13 21:15:51
updated: 2024-12-25 18:44:00
---

[Operating Systems: Three Easy Pieces](https://ostep.org)（简称 OSTEP）是一本免费的在线操作系统书籍。我从南大[蒋炎炎](https://jyywiki.cn)教授的操作系统课上听说了这本书，又找到了中文翻译出版的 [《操作系统导论》](https://book.douban.com/subject/33463930/)，读起来的感觉非常不错。在此记录下读这本书时的一些笔记。

<!--more-->

标题中提到，本书围绕三个部分展开，它们分别是 **虚拟化（Virtualization）**、**并发（Concurrency）** 和 **持久性（Persistence）**。

## 虚拟化 Virtualization

简单而言，虚拟化指的是，操作系统将一些物理资源（例如 CPU、内存和磁盘）转化为更通用的虚拟形式。操作系统提供一种 **假象（illusion）** —— 通过虚拟化 CPU，让用户程序觉得自己正独占一块 CPU 在运行；通过虚拟化内存，让用户程序觉得自己可以独占使用一大块完整的空内存...

这些虚拟化操作是 **透明** 的 —— 用户程序看不见这些虚拟化的操作。

### 进程 Process

- [进程的基本概念 - OSTEP 笔记 | BlockLune's Blog](/zh/posts/ostep-notes-process)
- [进程调度 - OSTEP 笔记 | BlockLune's Blog](/zh/posts/ostep-notes-process-scheduling)
