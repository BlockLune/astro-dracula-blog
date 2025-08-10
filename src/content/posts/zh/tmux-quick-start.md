---
abbrlink: c99a1d40
categories:
  - CS
  - Tools
date: 2023-08-04 23:05:19
tags:
  - terminal
  - tool
  - unix
  - productivity
  - translation
title: Tmux 快速入门（翻译）
license: none
---

对 _[How to Install and Use Tmux](https://tmuxcheatsheet.com/how-to-install-tmux/)_ 一文的中文翻译，原作者是 [@l9c](https://github.com/l9c)。

<!--more-->

**注意**：我翻译这篇文章的时间是 2023 年 8 月 4 日，一切请以源网站最新版本文章为准。

## 什么是 tmux

Tmux 是一个终端复用器，它允许你远程管理多个命令行会话 (sessions)。有了 Tmux，你可以在远程服务器上启动会话，在会话中启动应用程序，然后再从该会话中分离 (detach) 或重新连接 (reattach)。

使用 Tmux 的主要优势包括:

- **无缝恢复远程会话** —— 即使断开连接，也可根据需要分离和重新连接会话。
- **提高远程交互性** —— 保持应用程序和进程的远程运行。
- **高级会话控制** —— Tmux 支持多窗口 (windows) 和窗格 (panes)。
- **提高工作效率** —— 在单个终端高效管理原来多个终端的内容。

在使用 SSH 进行交互式工作时，强烈推荐您使用 Tmux。"从远程会话中分离和重新连接"的功能意味着，即使暂时断开连接，也能无缝恢复工作。Tmux 还能在本地和远程机器上复用终端、应用程序和进程，从而改进工作流程。Tmux 优化的其他使用场景包括远程开发、DevOps、基础设施管理以及任何涉及远程终端或命令行访问的任务。

## 为什么使用 tmux

Tmux 可让你在远程设备上持续运行任务，因此你可以安全地断开和重新连接，而不会中断那些正在运行的任务。它功能强大、可扩展，与[快捷指令](https://tmuxcheatsheet.com/)结合使用可节省更多工作时间。

## 安装

大多数平台都提供 tmux 的二进制软件包。使用下面的命令从二进制包中安装：

```bash
# Debian, Ubuntu
sudo apt-get install tmux

# RHEL/CentOS/Fedora
sudo yum install tmux

# MacOS
brew install tmux
```

如果需要最新版本，请使用下面的命令从源代码中安装：

```bash
git clone https://github.com/tmux/tmux.git
cd tmux
sh autogen.sh
./configure && make
```

或者直接下载 tmux 并安装（不进行 git 克隆）：

```bash
wget https://github.com/tmux/tmux/releases/download/3.3a/tmux-3.3a.tar.gz
tar xzvf tmux-3.3a.tar.gz
cd tmux-3.3a
./configure
make && sudo make install
```

验证下载的版本：

```bash
tmux -V
```

## 第一个 Tmux 会话

现在你已经完成了安装。输入 `tmux` 来启动你的第一个会话：

```bash
tmux
```

想要水平分割你的窗格 (pane)，按下：

`Ctrl + b` 然后 `%`

想要交换窗格，按下：

`Ctrl + b` 然后 `<-`

`Ctrl + b` 然后 `->`

分离 (detach) / 退出会话：

`Ctrl + b` 然后 `d`

连接 (attach) 到最后一个会话：

```bash
tmux a
```

现在，请随意使用[主页](https://tmuxcheatsheet.com/)上的小抄进行试验。如果发现缺少任何快捷指令，请[告诉作者](https://github.com/l9c/tmux_cheat_sheet_data) :D
