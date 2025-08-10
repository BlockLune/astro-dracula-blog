---
abbrlink: ca05bed5
categories:
  - CS
  - Tools
date: 2022-10-13 19:33:49
tags:
  - windows
  - terminal
  - encoding
  - vscode
  - cmd
title: VS Code 中文乱码问题
toc: true
updated: 2023-01-12
---

**2023 年 1 月 12 日更新：** 找到了方便地改变 Windows 中终端默认编码的方法，所以原来的改变 C/C++ 文件默认编码的方法可以淘汰了。

<!--more-->

现在的新办法是：

打开 "控制面板 - 时钟和区域 - 区域 - 管理 - 更改系统区域设置(C)..."

勾选 "Beta 版: 使用 Unicode UTF-8 提供全球语言支持(U)"

确定，重启电脑。

打开 CMD 测试一下，输入 `chcp` 可以发现已经变成了 `65001`，说明成功了。

方法来源：[《Git Bash 中文显示乱码，options 修改为 zh_CN 和 utf-8 还是不行怎么办？》](https://blog.csdn.net/weixin_44285445/article/details/112325994)

> [!Caution]
> 该方法全局更改 Windows 系统的默认编码，可能引起某些软件运行异常。

**以下是原来的文章:**

开门见山，我最后采用的解决方案是对 C/C++ 文件单独设置默认编码。大致的操作方法是，打开 VS Code 的 `settings.json` 文件，添加如下配置：

```json
"[cpp]": {
    "files.encoding": "gbk"
},
"[c]": {
    "files.encoding": "gbk"
}
```

具体的操作请参见原文：[《VSCODE C 语言终端输出中文乱码编码设置》](https://blog.csdn.net/qq_45538473/article/details/107258234)

## 解决过程

复盘一下解决这个问题的过程。

首先了解到的是 VS Code 中文乱码的根本原因——VS Code 默认的编码格式是 UTF-8 （这一点可在 VS Code 右下角看到），而 VS Code 调用的终端是 CMD，默认的编码格式是 gbk。所以解决方案就是两个方向：要么是更改终端的默认编码，从默认的 gbk 转为 utf8；要么就是更改 VS Code 中的 C/C++ 文件的编码。

**2022/10/26 更新：**

看到一个有意思的科普视频，贴在这里，可以看看乱码到底是如何产生的。

[锟斤拷 �⊠ 是怎样炼成的 —— 中文显示 “⼊” 门指南【柴知道】](https://www.bilibili.com/video/BV1cB4y177QR/)

### 第一个方向：更改终端默认编码

了解到更改 CMD 编码为 utf8 的命令如下：

```bash
chcp 65001
```

顺便一提，查看当前编码的命令为：

```bash
chcp
```

`chcp 65001` 这串命令的意思就是更改代码页为 65001，也就是用 utf8 编码。

这串命令不是永久生效的，所以每次都要输入，比较麻烦。网上也有一些解决方案，比如通过修改注册表每次都自动运行一下上边的命令（[《修改 Windows10 命令终端 cmd 的编码为 UTF-8》](https://www.jianshu.com/p/f40e494dc01d)），或者是配置 VS Code 让其自动输入的（[《永久解决 VS Code 终端中文乱码问题》](https://blog.csdn.net/lzyws739307453/article/details/89823900)），可以去看看。

### 第二个方向：更改 VS Code 中的 C/C++ 文件的编码

最初这个方法我只是想临时解决一下，就比较简单。点一下右下角的 UTF-8，选择 `通过编码重新打开`，选择 gbk 就行了。但这样只有一次，然后就想看看有没有永久的方法，便看到了上边的文章。

顺便一提，这里可能还要把 VS Code 设置中的自动猜测编码功能打开，具体操作如下：

1. 使用 `Ctrl + ,` 快捷键打开设置；
2. 在搜索框输入 `encoding` ，找到 `Files:Auto Guess Encoding`，勾上它。

## 参考资料

- [《VSCODE C 语言终端输出中文乱码编码设置》](https://blog.csdn.net/qq_45538473/article/details/107258234)
- [《修改 Windows10 命令终端 cmd 的编码为 UTF-8》](https://www.jianshu.com/p/f40e494dc01d)
- [《永久解决 VS Code 终端中文乱码问题》](https://blog.csdn.net/lzyws739307453/article/details/89823900)
