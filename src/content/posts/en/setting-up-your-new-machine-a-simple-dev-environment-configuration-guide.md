---
title: Setting up your new machine - A simple dev environment configuration guide
abbrlink: 183d7426
categories:
  - CS
  - Tools
tags:
  - unix
  - windows
  - terminal
  - productivity
  - software-engineering
  - configuration
  - tool
date: 2024-09-02 15:53:08
updated: 2024-12-20 10:23:00
---

As developers, we interact with all kinds of machines every day. A well-configured development environment can significantly boost productivity and make coding more enjoyable. This comprehensive guide will help you set up a comfortable and efficient workspace. It's mainly for beginners, but experienced developers may also find some useful tips.

<!--more-->

## Why Development Environment Configuration Matters

When I started coding, my terminal was a stark black and white window that failed to inspire creativity. Now, my terminal is colorful, feature-rich, and a joy to use. This transformation is just one example of how proper configuration can enhance your coding experience.

![My Terminal](https://img.blocklune.cc/sip/2024/09/02/18mgdt-o7.webp)

Terminal configuration is just one part of the larger concept of development environment configuration. These configurations can be complex, but this guide tries to provide a road map for beginners. This guide will not be a step-by-step tutorial, meaning I will not show you how to download and install the individual applications. You can refer to the official websites to learn how to install and use these applications in detail.

This post is inspired by:

- [macOS Setup Guide](https://sourabhbajaj.com/mac-setup/)
- [一个仅供参考的 CS 学习规划 (#环境配置)](https://csdiy.wiki/CS%E5%AD%A6%E4%B9%A0%E8%A7%84%E5%88%92/#_3)
- [新机器上手指南 (新手向)](https://taylover2016.github.io/%E6%96%B0%E6%9C%BA%E5%99%A8%E4%B8%8A%E6%89%8B%E6%8C%87%E5%8D%97%EF%BC%88%E6%96%B0%E6%89%8B%E5%90%91%EF%BC%89/index.html)

## Network Configuration: The First Step

Before diving into development environment setup, ensure your network is functioning correctly. You'll need a stable Internet connection to download various tools and packages.

You may need a [proxy](https://en.wikipedia.org/wiki/Proxy_server) for a better Internet connection.

When you open your proxy software and turn on the "System Proxy" option, your browser reads this configuration and automatically applies it so that your web traffic is routed through the proxy server. However, this is not the case for our terminal tools - they generally don't read the system proxy settings automatically, instead they read some proxy-related environment variables. So to use the proxy in your terminal environment, you need to set these environment variables.

Usually you can find a "Copy Environment Variables" button in your proxy software to copy the above commands to set the environment variables. If your proxy is running on `127.0.0.1:7890`, the command to set the environment variables might look like this:

```bash
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```

> [!Tip]
> If you are using a [WSL](https://learn.microsoft.com/zh-cn/windows/wsl/), you will need to do some configuration to make it accessible to your proxy on Windows. Please edit the `.wslconfig` file in your user directory and add the following lines:
>
> ```ini
> [wsl2]
> networkingMode=mirrored
> autoProxy=true
> ```
>
> For details, please refer to:
>
> - [Mirrored mode networking | Accessing network applications with WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/networking#mirrored-mode-networking)
> - [Auto Proxy | Accessing network applications with WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/networking#auto-proxy)

Also see:

- [Proxy server - ArchWiki](https://wiki.archlinux.org/title/Proxy_server)

## Client-Side Configuration: Windows, macOS, and Linux

When I say "client side", I mean the local machine you are using, i.e. your PC or Mac.

On a Mac, you must use macOS, while on a PC, you can use Windows or Linux. Most configurations on a Unix-like operating system (like macOS or Linux) are similar, while they may vary on Windows. As developers, we use Unix-like systems (most of which are Linux) much more than Windows. However, as a beginner in the IT field (e.g. a Chinese CS student), you may only have a PC running Windows.

In this guide, I will respect that by trying to make your Windows a little more "Unix-like". Here I am referring to a pure Windows environment and not a virtual machine (such as VMWare or [WSL](https://learn.microsoft.com/zh-cn/windows/wsl/)).

> [!Tip]
> Although this article mentions some ways to make Windows more “Unix-like”, I still recommend that, if you can, **you should use WSL** and configure it according to the general approach mentioned in this article applicable to Linux or Unix. The benefits of doing so are at least twofold:
>
> - avoidance of some Windows-specific problems
> - better performance (for some reason, the same configuration on Windows is not nearly as good as on other platforms)

### Adding a User Account

This section is for Linux users only. When you install a new Linux system, you may only have a `root` account. It is not recommended to use the `root` account for daily work, as it is too powerful and can cause serious problems if you make a mistake. It's recommended that you create a new user account and use it instead.

> [!Tip]
> If you are using WSL, you will be asked for a username and password when you first start up. In that case, you can **skip** this step.
>
> See:
>
> - [Set up your Linux username and password | Set up a WSL development environment | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/setup/environment#set-up-your-linux-username-and-password)

You can create a new account with the following command (replace `username` with your desired username)

```bash
useradd -m username
```

The `useradd` command is a POSIX-compliant command that creates a new user account. The `-m` flag creates a home directory for the new user. After running this command, you can use the `passwd` command to set a password for the new user. You may also want to make the new user a sudoer, which can be done by adding the user to the `sudo` group:

```bash
usermod -a -G sudo username
```

> [!Tip]
> Depending on your distribution, the name of the default sudo user group is not the same. The `sudo` group mentioned above is Debian-based, while in Arch Linux the name of this user group is [`wheel`](<https://en.wikipedia.org/wiki/Wheel_(computing)>).

Or you can edit the sudoers file manually by running `visudo`.

If you are using Ubuntu, you can use the `adduser` command instead. Follow the instructions it gives and enjoy a more user friendly experience:

```bash
adduser username # add a new user with name "username"
adduser username sudo # make the new user a sudoer
```

### Choosing the Right Font

A good programming font can make a world of difference. Look for fonts with features like:

- Mono spacing
- Easily distinguishable characters (so that you can easily tell the difference between `1`, `l` and `I`, `O` and `0`, etc.)
- Ligature support (Optional)

Moreover, a font collection called "[Nerd Fonts](https://www.nerdfonts.com/)" provides many patched fonts with icons, which are very useful in the terminal.

![The Nerd Fonts](https://www.nerdfonts.com/assets/img/sankey-glyphs-combined-diagram.png)

The `FiraCode Nerd Font` is my favorite. Give it a try!

### Terminal, Console & Terminal Emulator: Beyond the Basics

You may have heard the term "terminal" or "console" before. These pronouns are from the old days when computers were huge and expensive. There might be one computer in an entire building. Terminals would be placed in different rooms in the building so that people could interact with that computer. The terminal is a text-based interface, and the console is a physical device.

Another concept is the **TTY**, which originally referred to a teletypewriter, a device that allowed a user to enter commands through a keyboard and view the computer's output from a printer or monitor. In modern computing, TTY refers not only to traditional physical terminal devices, but also to software-emulated terminal interfaces. Each terminal device has a corresponding TTY device file on Unix/Linux systems, e.g., `/dev/tty1`, `/dev/pts/0`, and so on.

Related to this is the **Pseudo Terminal (PTY)**, which is a pair of character devices, including a pseudo terminal master and a pseudo terminal slave. Pseudo TTYs are used to emulate terminal functions, enabling multiple users or processes to share the input and output of the same physical terminal. It is widely used in modern operating systems for terminal emulators, remote connections (e.g., SSH), and multiplexers (e.g., tmux), allowing users the flexibility to perform command-line operations.

While **Terminal Emulator** is software that emulates a terminal, it is basically a GUI application that looks like a terminal. Terminal windows in modern operating systems (such as GNOME Terminal, Konsole, etc.) fall into this category. When you use these terminal emulators, you are actually interacting with TTY and pseudo TTY interfaces.

Today, you can use these terms interchangeably in many contexts because their meanings have become blurred. I will use the term "terminal" here.

No matter what operating system you are using, you have a built-in terminal, e.g. `Terminal.app` on Mac and `Windows Terminal` on Windows. However, third-party options offer more features and customization. Consider:

- [`iTerm2`](https://iterm2.com/) for Mac
- [`Alacritty`](https://alacritty.org/) for Windows and Linux

`Alacritty` is a cross-platform, high-performance and highly customizable terminal emulator. You can also use `Alacritty` on Mac, but I prefer `iTerm2` on Mac.

Here is my `Alacritty` configuration file on Windows:

```toml
working_directory = "D:\\Documents"

[shell]
program = "C:\\Program Files\\Git\\bin\\bash.exe"
args = ["--login", "-i"]

[font]
bold = { family = "FiraCode Nerd Font Mono", style = "Bold" }
normal = { family = "FiraCode Nerd Font Mono", style = "Light" }
size = 12
offset = { x = 0, y = 4 }

[window]
dimensions = { columns = 80, lines = 30 }
padding = { x = 12, y = 12 }
```

A theme is a set of configurations that change the appearance of an application. You can use themes to make your terminal tools look better and be easier to use. For example, set `colorscheme` in Vim. However, I prefer to set themes in the terminal emulator so that all terminal tools share a similar look. I use the [`Dracula`](https://draculatheme.com/) theme in both `Alacritty` and `iTerm2`. The `Dracula` theme is also available in many other applications, such as VS Code and JetBrains IDEs. Shared themes make your development environment more consistent and aesthetically pleasing. In addition to `Dracula`, [`catppuccin`](https://catppuccin.com/) is another theme I really like.

### Shell: The Bridge Between You and the System Kernel

The program running in the terminal is called a shell. It is a bridge between the user and the system kernel. On most Linux, the default shell is `bash`, while on macOS, it is `zsh`. There are two shells on Windows, `cmd` and `PowerShell`.

I recommend using `zsh` on all systems. You can view it as a super set of bash with more features. Here is [my configuration](/en/posts/my-zsh-config/), in which I:

- Use the [`oh-my-zsh`](https://github.com/ohmyzsh/ohmyzsh) framework to make `zsh` configuration easier
- Use the theme [`powerlevel10k`](https://github.com/romkatv/powerlevel10k) to customize the command prompt
- Use a lot of other plugins and configurations

For example, here is a simple function I use to enable or disable the proxy in `zsh`:

```bash
proxy() {
  if [[ "$1" == "--disable" ]]; then
    unset https_proxy http_proxy all_proxy
    echo "Proxy disabled"
  elif [[ "$1" == "--check" ]]; then
    if command -v wget &> /dev/null; then
      wget --spider --proxy=on http://google.com -q -T 10
      if [ $? -eq 0 ]; then
        echo "Proxy is working"
      else
        echo "Proxy is not working"
      fi
    elif command -v curl &> /dev/null; then
      curl --proxy http://127.0.0.1:7890 http://google.com -s -m 10 --connect-timeout 10
      if [ $? -eq 0 ]; then
        echo "Proxy is working"
      else
        echo "Proxy is not working"
      fi
    else
      echo "Neither wget nor curl is installed, cannot check proxy"
    fi
  else
    export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
    echo "Proxy enabled"
  fi
}
```

In addition to the `powerlevel10k` mentioned above for customizing your command prompt, you might also want to take a look at [starship](https://starship.rs/), a cross-platform cross-shell command prompt configuration tool written in Rust that performs very well.

> [!Tip]
> The command prompt is actually defined via the environment variable named `PS1`, see:
>
> - [What is the $PS1 Variable in Linux — Unix | by Linux School Tech | Medium](https://medium.com/@linuxadminhacks/what-is-the-ps1-variable-in-linux-unix-9932e981c276)

If you don't want to use `zsh` since it needs some configurations, a good alternative is [`fish`](https://fishshell.com/). However, `fish` is not POSIX-compliant, which means you may have some compatibility issues with some shell scripts. This is the reason why I prefer `zsh`. But it's fine for beginners.

You have `bash` installed on most unix-like systems and it's easy to install `zsh` or `fish` on those platform. But on Windows, it is a little bit tricky.

If you want to install `bash` on Windows, you may use [`git bash`](https://git-scm.com/). It will be installed when you install `git`, a popular version control system, on Windows. Furthermore, you can also use `zsh` on Windows. The articles below may be helpful:

- [Installing Zsh (and oh-my-zsh) in Windows Git Bash](https://dominikrys.com/posts/zsh-in-git-bash-on-windows/)
- [Windows 安装 Zsh 终端 - 知乎](https://zhuanlan.zhihu.com/p/625583037)

I haven't yet found a good way to install `fish` on Windows. If you know how to do that, please let me know by leaving a comment or sending me an [email](mailto:i@blocklune.cc).

> [!Caution]
> Another thing you may need to attention is the character set used on your Windows platform. If you are a Chinese CS student using Chinese Windows, the default character set of your system is usually not UTF-8. So you may encounter a [mojibake](https://en.wikipedia.org/wiki/Mojibake) issue. You can add the lines to the very head of your `~/.zshrc` which enables UTF-8 in your terminal to fix this issue:
>
> ```text
> # Set Windows code page to 65001 (UTF-8).
> if [[ "$OSTYPE" == "msys" ]]; then
>     chcp.com 65001 &> /dev/null
> fi
> ```

After installing the shell you like, you can make it the default shell by running the following command (Unix-like systems only):

```bash
chsh -s $(which zsh)
```

As a side note on PowerShell, `PowerShell` on Windows is a powerful shell, but its syntax is very different from `bash`. If you want to use `PowerShell`, I recommend you to use `PowerShell Core`, which is a newer, cross-platform version. You will need to install this version yourself, see the official documentation below:

- [Installing PowerShell on Windows - Microsoft Learn](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows)

Then, go through some configurations (e.g. refer to [My Configurations](https://github.com/BlockLune/dotfiles/blob/main/Microsoft.PowerShell_profile.ps1)) to make it more suitable for your needs.

### Package Managers: The App Store for Developers

A package manager basically plays the role of an app store. The term "package" means a bunch of files. An executable application is basically a bunch of files, so you can think of an application as a package.

With the help of package managers, you no longer have to go to the official website of a particular application, click on download and then install it, but with one line of simple commands.

On different versions of Linux there are different package managers, for example, the most popular package manager on Ubuntu is `apt`, and on Arch it is `pacman`. They are installed when the Linux systems are ready.

On the Mac, however, you need to download and install a package manager. The most popular one is [Homebrew](https://brew.sh/). Windows does not have a package manager either. You can download and install [`scoop`](https://scoop.sh/) or [`choco`](https://chocolatey.org/) yourself.

The concept of "package manager" explained above is really dirty and loose. To be more precise, the above package managers are system-wide. There are many more package managers in various tech stacks. For example, `npm` in node.js projects and `cargo` in rust projects, etc.

> [!Tip]
> For Chinese users, a common headache is the physical distance from the server, which leads to problems such as poor network signal and consequently slow download speeds, or even timeouts, and ultimately the inability to download packages properly using a package manager. In this case, in addition to using a proxy as mentioned above, you can also use a mirror site. In the past, we had to manually modify a bunch of configuration files for different package managers. But now you can use a tool called [`chsrc`](https://github.com/RubyMetric/chsrc).

### Gsudo: A Third Party `sudo` for Windows

This section is for Windows users only. `sudo` is a command in Unix-like systems that allows you to run a command as the superuser. Windows does not have a `sudo` command, but you can use [`gsudo`](https://github.com/gerardog/gsudo) as an alternative.

A common use case is when you want to use `choco` to install a package, you run a command like `choco install xxx`, but you may get an error because you don't have permission to install the package. In this case, you can use `gsudo !!` to run the command as an administrator. (The `!!` is a shortcut in `zsh` that means the last command.)

### TLDR: A Quick & Dirty Manual

On Unix-like systems, you can use the `man` command to see the manual for a command. However, the manual is usually too long and hard to understand. I just want to know the basic usage of the command, but `man` gives much more information than I need.

The [`tldr-pages`](https://tldr.sh/) project fills this need. Running `tldr xxx` will give you examples of how to use the `xxx` command, covering the most common use cases.

I recommend using the [`tealdeer`](https://github.com/dbrgn/tealdeer) client, which is based on the tldr pages projects, but written in Rust. It is much faster than the original `tldr` client.

![The intro image of tealdeer on its own GitHub page](https://raw.githubusercontent.com/dbrgn/tealdeer/main/docs/src/screenshot-default.png)

### Vim & VS Code: The Two Editors

I use Vim & VS Code every day. I use Vim for quick and small edits and VS Code for large projects. Even in VS Code, I'm using the Vim extension to enable the Vim key bindings.

My Vim configuration is [here](/en/posts/my-vim-config/).

To make Vim the default editor on Ubuntu, you can run the following command as root:

```bash
update-alternatives --config editor # and select vim in the menu
```

### Version Control of the Environment

Here I'm not talking about version control systems like `git`, but the version of the software you are using. For example, you may have `Node 20` installed on your machine, but your project requires `Node 14`. How to switch among different versions of the same software quickly and efficiently? These tools can help:

- Java: [`sdkman`](https://sdkman.io/), etc.
- Node.js: [`fnm`](https://github.com/Schniz/fnm), [`n`](https://github.com/tj/n), [`nvm`](https://github.com/nvm-sh/nvm), etc.
- Python: [`uv`](https://docs.astral.sh/uv/), [`pyenv`](https://github.com/pyenv/pyenv), [`conda`](https://www.anaconda.com/), etc. (I also wrote a [blog post](/en/posts/managing-multiple-python-versions-with-pyenv-and-conda) about this).

In addition to the software-specific version control tools mentioned above, you can also use tools like [`asdf`](https://asdf-vm.com/zh-hans/) or [`mise`](https://mise.jdx.dev/) to manage multiple software versions. Here is an example of using `mise` to manage multiple Node.js versions:

```bash
mise install node@22
mise install node@20

mise ls # list all installed versions

mise use -g node@20 # switch to Node 20 globally
node --version # -> v20.18.1

mise use -g node@22 # switch to Node 22 globally
node --version # -> v22.11.0
```

If you're using `scoop` as your package manager on Windows, you can also use the `scoop reset` command to quickly switch versions, and here's an example of using it to manage Python versions (from the [official wiki](https://github.com/ScoopInstaller/Scoop/wiki/Switching-Ruby,-Python-and-PHP-Versions)):

```bash
scoop bucket add versions # add the 'versions' bucket if you haven't already

scoop install python27 python
python --version # -> Python 3.6.2

# switch to python 2.7.x
scoop reset python27
python --version # -> Python 2.7.13

# switch back (to 3.x)
scoop reset python
python --version # -> Python 3.6.2
```

### Dotfiles: Persisting your App Configurations

Many programs on Unix-like systems use files with names beginning with `.` as their configuration files. For example, `.bashrc` for `bash` and `.vimrc` for `vim`. So you can save these files somewhere (like a GitHub repo) and sync them to your new machine. If you search for `dotfile` on GitHub, you will find many repositories with a similar name. See [dotfiles.github.io](https://dotfiles.github.io) for more information.

My dotfiles are [here](https://github.com/blocklune/dotfiles).

## Server Side Configuration: Linux Is Your Best Friend

On servers, Linux is the most popular operating system. So, in general, all you need to do is copy your Linux-based client-side configurations to the server side.

### SSH: Connecting to the Server with Ease

SSH (Secure SHell) is a network protocol that allows you to connect to a remote server securely. It is widely used in the IT industry. You can use the `ssh` command on your local machine to connect to a server. For example:

```bash
ssh username@hostname
```

By default, you must enter the password each time you connect to the server. You can omit this annoying step by using SSH keys. To do this:

1. Use the `ssh-keygen` command to generate a pair of keys on your local machine. Run the following command and press Enter:

```bash
ssh-keygen -t ed25519
```

2. Use the `ssh-copy-id` command to copy the public key to the server.

```bash
ssh-copy-id username@hostname
```

You will be prompted to enter the password for the last time. You can then connect to the server without entering the password.

> [!Note]
> Note: I put the section about SSH in the server-side configuration, but the commands we use here are supposed to be run on the client side.

## Summary

Configuring an efficient development environment is an ongoing process. Over time, you will discover new tools and methods to further optimize your workflow. I hope this guide has provided you with a good starting point and helped make your development process more efficient and enjoyable. If you have any questions or suggestions, feel free to contact me via [email](mailto:i@blocklune.cc). Have fun coding!
