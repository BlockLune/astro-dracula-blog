---
title: 我的 Vim 配置
abbrlink: 96f7ff9f
categories:
  - CS
  - Tools
tags:
  - vim
  - neovim
  - ide
  - text-editor
  - terminal
  - configuration
date: 2023-04-22 10:27:09
updated: 2025-06-29 10:58:00
---

本文记录了我的 Vim 配置。

<!--more-->

## Vim

### TL;DR

遵循这些步骤以快速应用我的 Vim 配置。请注意配置好代理，因为这些配置需要访问 GitHub。

首先，如果您已经配置过 Vim，请使用以下命令备份您的配置文件：

```bash
mv .vimrc .vimrc.bak
```

安装 [vim-plug](https://github.com/junegunn/vim-plug)，它是一个 Vim 插件管理器：

```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

下载我的配置文件：

```bash
curl -o ~/.vimrc https://raw.githubusercontent.com/BlockLune/dotfiles/refs/heads/main/vim/.vimrc
```

在命令行中键入 `vim` 以启动 Vim。此时会因为缺失插件报错，但我们很快就会安装它们。按下回车以继续。

在 Vim 中运行 `:PlugInstall` 来安装我配置中的插件。

### 详细说明

Vim 的配置文件是 `~/.vimrc`。为了自定义 Vim，您需要编辑这个文件。

#### 起步

作为一个历史悠久的软件，Vim 的一些默认配置并不符合现代软件的惯例。我建议您启用一些基础设置使其更现代化和符合现代人的直觉。作为起步，您可以参考 [`essential.vim`](https://github.com/toshimichimiki/practical-vim-2nd/blob/master/essential.vim) 、来自 [Missing Semester](https://missing.csail.mit.edu/2020/editors/) 的 [Basic Vimrc](https://missing.csail.mit.edu/2020/files/vimrc) 以及 [`tpope/vim-sensible`](https://github.com/tpope/vim-sensible/blob/master/plugin/sensible.vim)。我的配置就是基于 `tpope/vim-sensible` 的。

#### 插件

除了设置 Vim 本身，您还需要一些插件来使其更强大。而为了管理这些插件，您需要一个插件管理器。我使用的是 [vim-plug](https://github.com/junegunn/vim-plug)。运行下面的命令来安装它：

```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

在安装完成后，您就可以在 `~/.vimrc` 中添加插件了。例如，为了安装 `tpope/vim-sensible`，您可以在 `~/.vimrc` 中添加：

```vim
call plug#begin()
Plug 'tpope/vim-sensible'
call plug#end()
```

然后在 Vim 中运行 `:PlugInstall` 来安装插件。

下面介绍一些我使用的插件及其基本用法：

- [`mg979/vim-visual-multi`](https://github.com/mg979/vim-visual-multi)：使用 `<C-n>` 来快速创建多光标。
- [`takac/vim-hardtime`](https://github.com/takac/vim-hardtime)：阻止您在短时间内连续使用 `hijk` 进行移动以敦促形成更好的习惯。阅读下面两篇文章以了解更多（需要注意的是，您可能需要在中文编辑环境下使用 `:HardTimeOff` 关闭这个插件，毕竟您没法用 `w`、`b`、`e`、`f`、`t` 等键位在中文中移动）：
  - _[Habit breaking, habit making | vimcasts.org](http://vimcasts.org/blog/2013/02/habit-breaking-habit-making/)_（[中文翻译](/zh/posts/habit-breaking-habit-making)）
  - _[Moving around | Vim Tips Wiki](https://vim.fandom.com/wiki/Moving_around)_
- [`tpope/vim-eunuch`](https://github.com/tpope/vim-eunuch)：提供了一些与 Unix 常用命令相关的 Vim 语法糖，其中我最常使用的是 `:SudoWrite`（更多用法请在 Vim 中键入 `:help eunuch` 查看）：
  - 举例而言：您希望使用 `vim /etc/hosts` 来编辑您的 hosts 文件，但在要保存时才意识到您忘记添加 `sudo` 所以您无权保存！尽管您可以使用 `:w !sudo tee % > /dev/null` 这样一条命令来实现不退出 Vim 而以超级用户权限来保存，但显然 `:SudoWrite` 更便于输入。
- [`tpope/vim-unimpaired`](https://github.com/tpope/vim-unimpaired)：提供了一系列使用 `[` 和 `]` 开始的快捷键，包括（更多用法请在 Vim 中键入 `:help unimpaired` 查看）：
  - `[q` 是 `:cprevious`，`]q` 是 `:cnext`，分别用于显示前一个和后一个错误或 **Q**uickfix 列表项。
  - `[t` 是 `:tprev`，`]t` 是 `:tnext`，分别前往上一个和下一个标签。

如果您想知道我使用的插件的完整列表，可以查看我的 [`.vimrc`](https://raw.githubusercontent.com/BlockLune/dotfiles/refs/heads/main/vim/.vimrc)。

#### 键位设置

Vim 的强大之处在于它的键位设置。您可以通过键位设置来自定义 Vim 的行为。我的设置包括：

- 在插入模式下使用 `jk` 映射为 `<Esc>`，以便更快地退出插入模式
- 使用 `Ctrl` + `hjkl` 来在窗口之间移动
- 使用 `H` 和 `L` 来在标签页（实际上是基于 vim-buftabline 的缓冲区）之间切换
- 使用 `<leader>bd` 来关闭当前缓冲区
- 使用 `<leader>bo` 来关闭其他缓冲区
- 使用 `<leader>e` 来切换文件管理器 NERDTree
- ...

在 Vim 中键入 `:map` 来查看所有按键映射。

## NeoVim

NeoVim 是 Vim 的一个分支，旨在提供更好的可扩展性和现代化的功能。它的配置文件使用 lua 脚本语言编写。

推荐一个不错的视频教程：

- [《Neovim从入门到出门》](https://www.bilibili.com/video/BV171LfzDEXU/)

或者，您也可以尝试一些现成的 NeoVim 配置，例如：

- [LazyVim](https://www.lazyvim.org/)：一组 NeoVim 的配置和插件，旨在提供一个开箱即用的开发环境。
- [NvChad](https://nvchad.com/)：另一组 NeoVim 配置，但更注重性能。。

## 其他软件中的 Vim 模式

许多其他软件都支持 Vim 模式。

在 VS Code 中，可以通过安装 [VSCodeVim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) 这个扩展来启用 Vim 模式。在我的 [dotfiles](https://github.com/BlockLune/dotfiles) 仓库中也包含了相关配置，它们大多是与我的 Vim 以及 NeoVim 适应的（例如我将 VSCode 中打开终端的快捷键改为了 `Ctrl + /` 以与 LazyVim 的配置匹配），但也存在一些不同（例如 LazyVim 中的 `K` 与 VSCode 中的 `gh` 是类似的，启用了 `vim-visual-multi` 的 LazyVim 中的 `<C-n>` 与 VSCode 中的 `Cmd + d` (macOS) 或 `Ctrl + d` 实现类似的功能）。

## 参考和更多阅读资料

- _[A Good Vimrc (dougblack.io)](https://dougblack.io/words/a-good-vimrc.html)_
- _[Editors (Vim) · Missing Semester (mit.edu)](https://missing.csail.mit.edu/2020/editors/)_
- _[Habit breaking, habit making | vimcasts.org](http://vimcasts.org/blog/2013/02/habit-breaking-habit-making/)_
- _[Moving around | Vim Tips Wiki](https://vim.fandom.com/wiki/Moving_around)_
- _[Practical Vim by Drew Neil](https://pragprog.com/titles/dnvim2/practical-vim-second-edition/)_
- _[VIMCASTS.org](http://vimcasts.org/)_
- _[Vim 配置入门 - 阮一峰的网络日志](https://ruanyifeng.com/blog/2018/09/vimrc.html)_
- _[ivim](https://github.com/kepbod/ivim)_
