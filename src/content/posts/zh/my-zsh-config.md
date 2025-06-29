---
abbrlink: 3e5630f
categories:
    - CS
    - Tools
date: 2024-01-26 12:14:40
tags:
    - terminal
    - zsh
    - oh-my-zsh
    - configuration
title: Zsh 简明配置指南
updated: 2024-11-28 16:42:00
---

作为计算机爱好者，我们每天会花大量时间和 Shell 打交道，一个配置得足够好的 Shell 会让您觉得更加得心应手。这篇博文记录了我的 Zsh 配置。本来，这篇文章只是作为我自己的笔记，所以写得比较随意；同时出于练习英语写作的目的，写成了英文。但后来发现我的朋友们也会参考，所以我将其重置为中文的，并修改完善了一些内容。

<!--more-->

## 在开始之前

在正式开始之前，让我们先明确几个概念：

- **终端（Terminal） / 终端模拟器（Terminal Emulator）/ 控制台（Console）**：这些名词来自计算机庞大而昂贵的时代，那时候整栋大楼可能只有一台计算机，名为 “终端” 的设备被放置在大楼的不同房间里，人们通过它与这台计算机进行交互。终端模拟器是模拟终端的软件，基本上是一个看起来像终端的图形用户界面应用程序。如今，这些术语可以互换使用，指的都是 “终端模拟器” 这样一个概念，即一个可以输入输出的文本界面。
- **Shell**：您可能听说过 Linux 内核，内核是操作系统的核心，而在这个 “核” 之外，存在一种名为 “壳” 的软件 —— Shell。简单而言 Shell 是用户与内核沟通的桥梁。它作为一个命令解释器，接受用户输入的命令，然后调用操作系统的功能来执行这些命令。最著名的 Shell 应该是 `bash`，它是几乎所有 Linux 的默认 Shell，类似地，Windows 平台的默认 Shell 是 `cmd` 和 Power Shell。我们这里要使用的 `zsh` 可以简单理解为 `bash` 的一个超集。它几乎兼容 `bash`，但提供了更高的配置自由度和更多的功能。
- **命令提示符（Prompt）**：命令提示符指的是在终端输入命令前，光标跳动位置之前的输出的内容，它的具体内容由环境变量 `$PS1`（意为 Prompt String 1）控制。您可以在 `zsh` 中输入 `echo $PS1` 命令来查看您的当前 Prompt String。注意这里的 “命令提示符” 并不是指 Windows 的 `cmd`（尽管打开这个软件它的名字显示为命令提示符），那个更像是上面说的终端和 Shell 的结合体。

本文将着眼于 Zsh 的配置，但也会涉及到配置最基本的终端。如果您想了解更多关于环境配置方面的内容，也许也可以看看我的 [另一篇文章](/zh/posts/setting-up-your-new-machine-a-simple-dev-environment-configuration-guide)。

## 选择终端模拟器

在 macOS 平台，我选择的终端是 [iTerm2](https://iterm2.com/)。如果您使用 Homebrew，可以运行下面的命令来安装：

```bash
brew install --cask iterm2
```

> **记得配置镜像或代理！** 如果您选择配置代理，要记得仅仅开启系统代理是不够的。您得在您的代理软件中找到类似下面的命令（例如一键复制终端代理命令之类的按钮），并把它粘贴到您当前的终端窗口中执行：
>
> ```bash
> export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
> ```

或者您也可以选择 [Alacritty](https://alacritty.org/)，它是一个跨平台的高性能终端模拟器。我在 Windows 平台上使用它。

可选地，您可以为您的终端配置一套配色主题以提升其美观度。我喜欢的 Dracula 主题为大量软件做了适配，它对于 iTerm2 和 Alacritty 的适配分别可以在 [这儿](https://draculatheme.com/iterm) 和 [这儿](https://draculatheme.com/alacritty) 找到。

## 选择 Nerd Font

Nerd Fonts 是一类带有图标的特殊字体，它和很多终端应用程序配合地很好，所以建议您在配置终端时将终端的默认字体更改为一款您喜欢的 Nerd Font。我使用的是 Fira Code Nerd Font，如果您是 macOS 平台并且使用 Homebrew，可以运行下面的命令来安装：

```bash
brew install --cask font-fira-code-nerd-font
```

## 安装 Zsh

在 macOS 平台上，Zsh 是默认 Shell，直接打开终端就可以开始使用了。

在 Linux 平台，您可以使用相应平台的包管理器来安装它，并使用 `chsh` 命令来将其设置为您的默认 Shell。假设您使用的包管理器是 `apt` ，您可以输入下面的命令来安装并设置 zsh 为您的默认 Shell：

```bash
sudo apt update
sudo apt install zsh -y
chsh -s $(which zsh)
```

安装和设置完成后，关闭并重启您的终端来使配置生效。

在 Windows 平台上会麻烦一些，主要是原生的 GNU Bash 并不支持 Windows 平台，更别提 Zsh 了。但也不完全没有办法，您可以参考下面两篇文章来在 Windows 平台使用 Zsh：

- [Installing Zsh (and oh-my-zsh) in Windows Git Bash](https://dominikrys.com/posts/zsh-in-git-bash-on-windows/)
- [Windows 安装 Zsh 终端 - 知乎](https://zhuanlan.zhihu.com/p/625583037)

## 配置框架与主题

Zsh 最知名的配置框架是 [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh)，通过下面的命令来安装它：

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

安装成功的话，您就会发现您的 Prompt 已经变了。

接着，可以安装一个主题。我使用的是 [powerlevel10k](https://github.com/romkatv/powerlevel10k)，它提供了一个一步一步的操作流程让您自定义一个您喜欢的命令提示符（其中第一步操作流程就是安装一个它推荐的 Nerd Font，如果您上面配置终端时已经配过了，这里就不需要安装了）：

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

然后打开 `~/.zshrc` 这个文件，找到 `ZSH_THEME` 开头的这一行并修改为：

```zshrc
ZSH_THEME="powerlevel10k/powerlevel10k"
```

> 顺便一说，`~/.zshrc` 中的 `~` 指的其实是您的家目录。举例而言，如果您的用户名是 `asuna`，那么它在各平台所代表的完整路径如下：
>
> - macOS: `/Users/asuna`
> - Linux: `/home/asuna`
> - Windows: `C:\Users\asuna`
>
> 所以实际上 `~/.zshrc` 是在说您的家目录下的 `.zshrc` 这样一个文件。它是 Zsh 的（其中一个）配置文件。

### 插件

Oh-my-zsh 提供了海量的插件以支持丰富的扩展功能 (查看 [插件列表](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins))。有的是默认安装的，有的则需要您手动下载并配置。必装的我认为有下面这几个：

- [fast-syntax-highlighting](https://github.com/zdharma-continuum/fast-syntax-highlighting.git)：语法高亮插件（比之前推荐的 [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) 更快）

```bash
git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting --depth=1
```

> [!Tip]
> 这个插件（以及 zsh-syntax-highlighting）在 Wsl2 中可能会有一些性能问题，您可以参考下面的两个 Issues 来解决：
>
> - [Very low speed on WSL2 · Issue #13 · zdharma-continuum/fast-syntax-highlighting](https://github.com/zdharma-continuum/fast-syntax-highlighting/issues/13)
> - [syntax highlighting is super slow in WSL2 · Issue #790 · zsh-users/zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/issues/790)

- [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions.git)：自动补全插件

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions --depth=1
```

- [zsh-history-substring-search](https://github.com/zsh-users/zsh-history-substring-search)：历史命令搜索插件

```bash
git clone https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search --depth=1
```

- [zsh-you-should-use](https://github.com/MichaelAquilina/zsh-you-should-use)：当您输入一个命令时，它会提示您使用现有的别名

```bash
git clone https://github.com/MichaelAquilina/zsh-you-should-use.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/you-should-use --depth=1
```

如果您是 macOS 平台，您还可以试试下面这个插件，它可以自动检测您的系统代理设置并自动配置相关环境变量：

```bash
git clone https://github.com/sukkaw/zsh-osx-autoproxy ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-osx-autoproxy --depth=1
```

为了启用这些插件，您需要再次打开并编辑 `~/.zshrc` 文件（如果您安装了 zsh-osx-autoproxy 插件，记得把对应的那一行取消注释）：

```zshrc
plugins=(
    fast-syntax-highlighting
    history-substring-search
    you-should-use
    z
    zsh-autosuggestions
    # zsh-osx-autoproxy
)
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=white'
```

如果您细心的话，您会发现我这里还启用了一个名为 `z` 的插件，它是默认安装的，您可以在 [这里](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/z) 找到关于它的说明。

## 别名

一些常用命令可能很长，您可以创建别名来加快输入速度，配合上面介绍的 you-should-use 插件使用更佳。

创建别名的命令是 `alias` 。例如对于 `ls`，我有下面这些别名：

```bash
alias ls="ls -FG --color=auto"
alias ll="ls -lh"
alias la="ls -a"
alias l="ll -a"
```

您可以将这些内容写入您的 `~/.zshrc` 配置文件中，这样每次您打开终端它们都会被自动配置好。而我的习惯是创建一个 `~/.aliases` 文件专门存储这些别名，并在 `~/.zshrc` 中添加下面这一行来包含它：

```zshrc
[[ -f ~/.aliases ]] && source ~/.aliases
```

您可以在 [这里](https://github.com/BlockLune/dotfiles/blob/main/common/.aliases) 找到我的 `.aliases` 文件。

## 自定义函数

还记得上面提到的配置终端代理吗？在那儿我们遇到了类似这样一条命令：

```bash
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```

我在 `~/.zshrc` 中创建了如下函数来让我快速配置终端代理（不带参数为设置代理，使用 `-d`, `--disable`, `-c` 或 `--clear` 来清除代理，使用 `--check` 来检查代理是否生效）：

```zshrc
proxy() {
  if [[ "$1" == "-d" || "$1" == "--disable" || "$1" == "-c" || "$1" == "--clear" ]]; then
    unset https_proxy http_proxy all_proxy
    echo "Proxy disabled"
  elif [[ "$1" == "--check" ]]; then
    if command -v wget &> /dev/null; then
      wget --spider --proxy=on http://google.com -q -T 10
      if [ $? -eq 0 ]; then
        echo "Proxy is working."
      else
        echo "Proxy is not working."
      fi
    elif command -v curl &> /dev/null; then
      curl --proxy http://127.0.0.1:7890 http://google.com -s -m 10 --connect-timeout 10
      if [ $? -eq 0 ]; then
        echo "Proxy is working."
      else
        echo "Proxy is not working."
      fi
    else
      echo "Neither wget nor curl is installed, cannot check proxy."
    fi
  else
    export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
    echo "Proxy enabled"
  fi
}
```

## 懒加载

随着您配置的插件等内容的增多，您的 zsh 可能会花费越来越多的时间才能启动。在这种情况下，配置一些懒加载可能会有所帮助。下面的文章细致地介绍了相关技术：

- [我就感觉到快 —— zsh 和 oh my zsh 冷启动速度优化 | Sukka's Blog](https://blog.skk.moe/post/make-oh-my-zsh-fly/)

## 更多资源

- [abhigenie92/zsh_to_fish: How to make zsh like fish?](https://github.com/abhigenie92/zsh_to_fish)
- [终极 Shell——ZSH - 知乎](https://zhuanlan.zhihu.com/p/19556676)
