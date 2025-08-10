---
abbrlink: 798c36fc
categories:
  - CS
  - Tools
date: 2023-06-22 22:11:51
tags:
  - windows
  - tool
  - right-click-menu
  - context-menu
  - customization
title: Windows 11 中更好的右键菜单
---

当 Windows 系统迭代到 11 这个大版本后，右键菜单被完全重新设计了。"巨硬" 似乎是想让它更简单、更现代化，但是它选择如何做到这点的方法确实是相当暴力 —— 把那些有用的全藏到二级菜单！对我而言，这真的很痛苦！幸运的是，我们有办法让原来的经典菜单回来，甚至是有限地自定义它，让它更好用！

<!--more-->

## 回到经典的风格

### 方法一

为了让右键菜单回到经典风格，最简单的方法是使用下边这个小工具。

官方网页：[https://www.sordum.org/14479/windows-11-classic-context-menu-v1-1/](https://www.sordum.org/14479/windows-11-classic-context-menu-v1-1/)

将页面拉到最下边，按下这个 **Download** 来下载这个小工具。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/1.png)

你应该会得到一个 zip 压缩包。**先将它解压**，并双击运行 **W11ClassicMenu.exe** 这个文件。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/2.png)

然后就是 "傻瓜式" 操作了。看不懂英文的话可以照着把语言改成中文：

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/3.png)

### 方法二

第二种方法是手动修改注册表。实际上，这就是上面软件的实现原理，只不过上边的软件把这些操作变成 "傻瓜式" 的了。

> 什么是注册表？简单而言，这是一个数据库，存储了很多 Windows 系统本身及用户安装的软件的配置信息。所以，你可以通过修改它来修改右键菜单这个系统配置。但也由于其中存储了很多系统关键信息，所以手动修改这样一个操作是挺危险的一个操作，尤其对于那些粗心的人而言！

**改为 win10 风格**：按下 `WIN + x`，选择 `终端管理员`，在打开的窗口中输入下面的命令：

```bash
reg.exe add “HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32” /f
```

然后按下回车，重启你的文件资源管理器，应该就能看到效果生效了。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/4.png)

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/5.png)

> 如何重启文件资源管理器？按下 `Ctrl + Shift + Esc` 来启动任务管理器，找到 Windows 资源管理器，右键，选择 "重新启动"。
>
> ![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/6.png)

**改为 win11 风格**：如果你反悔了，想把右键菜单改回 win11 风格，只要把上边的步骤再来一遍，不过换成这条命令：

```bash
reg.exe delete “HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}” /f
```

## 让你的右键菜单更好用

现在你的右键菜单回归到了原汁原味的体验：经典而复杂。各种奇奇怪怪的东西都在这儿，溢出屏幕。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/7.png)

有没有什么办法来整理这些东西呢？我推荐另一个小工具：

Context Menu Manager: [https://github.com/BluePointLilac/ContextMenuManager](https://github.com/BluePointLilac/ContextMenuManager)

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/8.png)

### 软件下载

这个项目在 GitHub 上。访问上边的网址，点击右侧的 Releases 页面进入下载。

（觉得这个项目不错的话请点击右上角的 star 以支持这位 BluePointLilac 大佬哦）

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/9.png)

点击 exe 文件就可以下载了。如果嫌速度慢的话，可以右键，"复制链接"，然后访问 [https://ghproxy.com/](https://ghproxy.com/)，粘贴刚刚复制的地址到输入框，点击下载。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/10.png)

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/11.png)

### 软件使用

打开软件，可以看到大部分右键菜单项都被分类列出来了。你要做的就是——点击右边大大的开关键来控制是否启用某个项，或者右键某个项进行更多设置。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/12.png)

更强大的是，你可以在 "其他规则" 选项卡中，启用一些非常牛逼的功能到你的右键菜单。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/13.png)

![](https://webp.blocklune.cc/blog-imgs/cs/tools/better-right-click-menu-in-win11/14.png)

## TLDR

使用这款由 Sordum Team 研发的 Windows 11 Classic Context Menu 来让你的右键菜单变回经典样式：

[https://www.sordum.org/14479/windows-11-classic-context-menu-v1-1/](https://www.sordum.org/14479/windows-11-classic-context-menu-v1-1/)

使用这款由 BluePointLilac 研发的 ContextMenuManager 来自定义你的右键菜单：

[https://github.com/BluePointLilac/ContextMenuManager](https://github.com/BluePointLilac/ContextMenuManager)

现在，enjoy!
