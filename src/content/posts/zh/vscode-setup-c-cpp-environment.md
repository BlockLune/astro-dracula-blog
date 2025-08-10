---
abbrlink: a7a0ce82
categories:
  - CS
  - Tools
date: 2022-09-17 13:13:18
tags:
  - vscode
  - cpp
  - windows
  - tool
  - configuration
title: VS Code 的安装与配置基础 C/C++ 开发环境
toc: true
updated: 2022-10-13
---

我以前学习 C++ 的时候，使用的是 DevCpp 。这个软件让我这个初学者比较舒服的点是，我不用太过详细地考虑编译的过程——新建一个 cpp 文件，写一点小程序，按下 F11，程序运行。我不需要管选择编译器啊、配置编译命令啊啥啥的。但是到 VS Code 这边，这都要我自己做了，对于新手并不是那么友好。这里记录一下我配置 VS Code 的 C/C++ 环境的完整过程，希望对你有所帮助。需要注意的是：学习一下基本的编译链接指令还是很有必要的！

<!--more-->

## 安装 Visual Studio Code

打开 [VS Code 官网](https://code.visualstudio.com/)，点击 `Download for Windows` 按钮（其他平台请选择对应平台的安装包，此处以 Windows 平台为例），等待下载完成。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/1.png)

> [!TIP]
> **国内 VS Code 下载速度慢的解决方案**
>
> 此方法来自：[https://zhuanlan.zhihu.com/p/112215618](https://zhuanlan.zhihu.com/p/112215618)
>
> 在你的下载软件处（我这里是 IDM，你如果是浏览器下载的就去浏览器的下载管理器里找），找到下载地址。将下载地址中的 `az764295.vo.msecnd.net` 替换为 `vscode.cdn.azure.cn`，然后取消原任务，用修改过的下载链接新建一个下载。
>
> ![修改前](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/2.png)

打开安装包，一路下一步，直到下面这个界面，按照下边的进行选择，直到安装完毕。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/3.png)

## VS Code 设置中文

打开 VS Code，点击图示左侧第五个图标或使用快捷键 `Ctrl+Shift+X` 打开 `拓展` 页面，搜索：`Chinese`，找到 `Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code` 这个插件，点击 `Install` 安装，等待安装完成后按照提示点击右下角 `Restart` 按钮重启 VS Code。
![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/4.png)
![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/5.png)
![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/6.png)

## 安装并检查编译器

DevCpp 安装的时候也帮我们安装好了编译器，但 VS Code 并没有。所以我们还得自己装一个编译器。这里以 Mingw-w64 为例（参考[官方教程](https://code.visualstudio.com/docs/languages/cpp#_example-install-mingwx64)）。

参考 [MSYS2 官网](https://www.msys2.org/#installation)下载安装和安装。

> [!TIP]
> **国内 MSYS2 下载速度慢的解决方案**
>
> 在这个按钮上右键，选择`复制链接`。
>
> ![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/7.png)
>
> 然后前往[https://ghproxy.com/](https://ghproxy.com/)这个网站，粘贴上面复制的下载链接，点击下载。
>
> ![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/8.png)

打开安装包，一路默认下一步。耐心等待（国内网络可以！只要耐心等！）直到出现下面的界面：

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/9.png)

输入下面的命令安装 gcc：

```bash
pacman -S mingw-w64-x86_64-gcc
```

![画横线的是需要自己输入的](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/10.png)

接下来需要添加环境变量。直接搜索 `高级系统设置`：

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/11.png)

打开后点击环境变量。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/12.png)

添加系统变量。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/13.png)

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/14.png)

打开 CMD 检查一下是否成功：
输入 `gcc -v`，如果有结果，就安装成功了。

## C/C++ 扩展的安装

按照上面的方法打开扩展，首先是几个 C/C++ 基础扩展，直接搜索 `C++`。

第一个：`C/C++`

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/15.png)

直接点击安装（我这里截图的时候还没重启，如果按照上述步骤已经安装了中文语言包并重启了 Code，这里的 `Install` 按钮就会变成 `安装`）。

第二个：`C/C++ Extension Pack`

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/16.png)

第三个：`C/C++ Compile Run`

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/17.png)

这个扩展提供了极其简单的`F6`一键编译运行功能。

## 正常运行测试

新建一个文件夹，就叫 `HelloWorld` 吧。打开文件夹，右键，选择 `通过 Code 打开`。新建一个 `HelloWorld.cpp`，粘贴下面的代码：

```cpp
#include <iostream>
int main() {
  std::cout << "Hello world!" << std::endl;
  return 0;
}
```

`Ctrl+S` 保存，`F6` 运行，成功输出结果。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/18.png)

## Debug

**2022 年 10 月 6 日更新：**

完成上边的步骤之后，你应该可以正常运行程序了。下面的教程是安装调试器以及通过 `C/C++ Runner` 让调试等工作变得简单。

首先再次打开 msys2.exe (默认位置是：C:\\msys64\\msys2.exe)，类似上边安装 gcc ，输入下边的命令安装 gdb。
类似的，还需要输入下面的命令安装 gdb:

```bash
pacman -S mingw-w64-x86_64-gdb
```

然后在 VS Code 中搜索并安装 `C/C++ Runner` 插件。

> [!TIP]
> **安装 C/C++ Runner 插件时其依赖项 CodeLLDB 无法安装的解决方案**
>
> 按照右下角的提示手动下载 `codelldb-x86_64-windows.vsix`文件。
>
> 在 VS Code 中按下 `Ctrl + Shift + P`，输入 `install`，选择`从VSIX安装...`，选择上边下好的文件，等待安装完成。
>
> ![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/19.png)

安装完成后，左下角点击 `Select folder.`，选择当前文件夹。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/20.png)

然后按下小齿轮进行编译，按下三角形运行，设置好断点按下小虫子进行 Debug。

![](https://webp.blocklune.cc/blog-imgs/cs/tools/vs-code-的安装与配置基础-c-c-开发环境/21.png)

## 解决中文乱码问题

**2022 年 10 月 13 日更新：**

参见我的另一篇文章：[《VS Code 中文乱码问题》](/posts/ca05bed5)

## 参考资料

- [国内下载 vscode 速度慢问题解决](https://zhuanlan.zhihu.com/p/112215618)
- 官方教程：[C++ programming with Visual Studio Code](https://code.visualstudio.com/docs/languages/cpp)
- [windows 10 环境下 使用 msys2 + vs code 配置 c++ 的编译环境](https://www.cnblogs.com/zychengzhiit1/p/5776962.html)
