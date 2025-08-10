---
abbrlink: ca281680
categories:
  - CS
  - Tools
date: 2023-04-27 23:41:50
tags:
  - installation
  - linux
  - linux-setup
  - ubuntu
  - unix
title: Ubuntu Installation Notes
---

This is NOT a tutorial on how to install Ubuntu. I am just documenting some problems I encountered during my installation.

<!--more-->

## Editor and sudo

```bash
apt install vim sudo
```

## User

Add a new user and make it a sudoer:

```bash
useradd -m <username>
visudo
```

## Locale

Add this to your `~/.bashrc` (or `~/.zshrc`) if you use Z shell.

```bash
export LANG=en_US.UTF-8
```

## Software

### Package Manager

The first thing you need to do is configuring `apt`'s mirror.

If you also want to use the mirror from Tsinghua:

See _[ubuntu | 镜像使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)_

To update your `apt` repository, press `Ctrl + Alt + T` to run a terminal, and run:

```bash
sudo apt update
sudo apt upgrade
```

### Shell

Install [fish shell](https://fishshell.com/) and set it as your login shell:

```bash
sudo apt install fish
chsh --shell $(which fish)
```

Or if you want to use `zsh` and config further, refer to: _[My Zsh Config](posts/3e5630f)_

### AppStore

You may try _[Spark-Store](https://gitee.com/deepin-community-store/spark-store)_.

### Browser

I use Microsoft Edge. It's pretty easy to download the `.deb` on its _[official website](https://www.microsoft.com/en-us/edge/download)_. But if you want to install it from command line:

See _[How to Install Microsoft Edge on Ubuntu 22.04 | 20.04 - LinuxCapable](https://www.linuxcapable.com/how-to-install-microsoft-edge-on-ubuntu-linux/)_

### Proxy

Maybe _[zzzgydi/clash-verge: A Clash GUI based on tauri. Supports Windows, macOS and Linux](https://github.com/zzzgydi/clash-verge)_ or _[Fndroid/clash_for_windows_pkg](https://github.com/Fndroid/clash_for_windows_pkg)_

### CLI-APPs

See [Awesome CLI Apps](/posts/d64ccd8c).

## Q & A

Q: The operating system always freezes on the welcome page.
A: Install / Update NVIDIA driver.

See _[Ubuntu 下安装 NVIDIA 驱动的三种方法](https://www.cnblogs.com/Leozi/p/13281224)_

and _[ubuntu - nouveau 0000:01:00.0: DRM: failed to idle channel 0 [DRM] - Super User](https://superuser.com/questions/1750975/nouveau-00000100-0-drm-failed-to-idle-channel-0-drm)_

Q: Why the Microsoft Edge always show _This page is having a problem_?

A: See _[This page is having a problem Error Code: SIGILL - Microsoft Community](https://answers.microsoft.com/en-us/microsoftedge/forum/all/this-page-is-having-a-problem-error-code-sigill/e2a09ac0-f243-40cb-a235-41abb2148f07)_

and [here](https://www.linuxcapable.com/how-to-install-microsoft-edge-on-ubuntu-linux/)

Q: Why does the settings disappear?
A: Run `sudo apt install gnome-control-center` to (re)install gnome-control-center.
