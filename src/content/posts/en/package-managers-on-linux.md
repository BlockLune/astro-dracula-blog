---
title: "Package Managers on Linux: A Simple Cheat Sheet"
abbrlink: 4ee6ac78
categories:
  - CS
  - Tools
tags:
  - apt
  - linux
  - package-manager
  - pacman
  - tool
  - unix
date: 2023-03-11 14:23:18
updated: 2025-02-09 23:15:00
---

What are package managers? For beginners, you can think of them as "app stores for nerds". More specifically, they are tools for automating software installation, updates, and dependency resolution. Here's a simple cheat sheet for `apt` (used in Debian/Ubuntu) and `pacman` (used in Arch Linux), which noting the most used commands.

<!--more-->

## Understanding Package Managers

[APT (Advanced Package Tool)](<https://en.wikipedia.org/wiki/APT_(software)>) and [Pacman](https://wiki.archlinux.org/title/Pacman) are two of the most widely used package managers in the Linux ecosystem:

- **APT**: The default package manager for Debian-based distributions (Ubuntu, Linux Mint, etc.). Known for its stability and extensive package repository.
- **Pacman**: Arch Linux's package manager, celebrated for its speed, simplicity, and rolling-release model.

Both package managers handle:

- Software installation and removal
- System updates
- Dependency resolution
- Package searching and information retrieval

## Optimizing Package Sources with Mirrors

Before diving into package management commands, it may be a great idea to configure your package sources to use mirrors. Mirrors are servers that host copies of package repositories, and using a geographically closer mirror can significantly improve download speeds and reliability.

### Automated Mirror Configuration

For Chinese users, the simplest way to optimize your package sources is using [chsrc](https://chsrc.run), a utility that automatically selects and configures optimal mirrors for a variety of software sources, including APT and Pacman. Visit their website for straightforward instructions on mirror configuration.

### Manual Mirror Configuration

For those who prefer manual configuration or need specific mirrors:

#### APT Mirror Configuration

1. Edit the sources file: `sudo vim /etc/apt/sources.list`
2. Replace the content with your preferred mirror. For example, using the [Tsinghua mirror](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/):

```text
## Tsinghua
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
```

Save the file and run `sudo apt update` to update the source information.

#### Pacman Mirror Configuration

1. Find suitable mirrors on the [Arch Linux Mirror Status](https://archlinux.org/mirrors/) page
2. Edit the mirror list: `sudo vim /etc/pacman.d/mirrorlist`
3. Add your preferred mirrors, ordering them by priority. For example:

```text
### China
## Aliyun
Server = https://mirrors.aliyun.com/archlinux/$repo/os/$arch
## Tsinghua
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
## NJU
Server = https://mirrors.nju.edu.cn/archlinux/$repo/os/$arch
## NJUPT
Server = https://mirrors.njupt.edu.cn/archlinux/$repo/os/$arch
```

Save the file and run `sudo pacman -Syu` to synchronize and update all the packages.

## Updating Package Repositories

After configuring your package sources, the next step is to update the package repositories to fetch the latest package information. After a repository update, you may also process package upgrades.

```bash
# APT Update Commands
sudo apt update     # Refresh package information
sudo apt upgrade    # Upgrade installed packages
sudo apt full-upgrade # Upgrade packages with dependency changes

# Pacman Update Commands
sudo pacman -Sy    # Sync package databases
sudo pacman -Syu   # Sync databases and update system
sudo pacman -Syyu  # Force sync and update (useful when changing mirrors)
```

## Package Management Operations

### Searching and Querying Packages

Finding and getting information about packages:

```bash
# APT Search Commands
apt search PACKAGE_NAME     # Search for packages
apt show PACKAGE_NAME      # Show package details
apt list --installed      # List installed packages
apt list --upgradeable   # List packages that can be upgraded

# Pacman Search Commands
pacman -Ss PACKAGE_NAME   # Search for packages in repositories
pacman -Si PACKAGE_NAME   # Show package information
pacman -Qq               # List all installed packages
pacman -Qqe              # List explicitly installed packages
pacman -Qqd              # List packages installed as dependencies
pacman -Qqdt             # List orphaned dependencies
```

> [!note]
> For Pacman, uppercase S is for sync operations with repositories, while lowercase s is for search operations.

### Installing and Removing Packages

Managing software on your system:

```bash
# APT Installation Commands
sudo apt install PACKAGE_NAME          # Install a package
sudo apt install -y PACKAGE_NAME       # Install without confirmation
sudo apt install -f                    # Fix broken dependencies
sudo apt install PACKAGE1 PACKAGE2     # Install multiple packages

# Pacman Installation Commands
sudo pacman -S PACKAGE_NAME            # Install a package
sudo pacman -S --needed PACKAGE_NAME   # Install only if not already installed
sudo pacman -S PACKAGE1 PACKAGE2       # Install multiple packages
```

### Package Removal and System Cleanup

Safely removing packages and cleaning up the system:

```bash
# APT Removal Commands
sudo apt remove PACKAGE_NAME           # Remove a package
sudo apt purge PACKAGE_NAME           # Remove package and configuration
sudo apt autoremove                   # Remove unused dependencies
sudo apt clean                        # Clear package cache

# Pacman Removal Commands
sudo pacman -R PACKAGE_NAME           # Remove a package
sudo pacman -Rs PACKAGE_NAME          # Remove package with dependencies
sudo pacman -Rns PACKAGE_NAME         # Remove package, dependencies, and configs
sudo pacman -Sc                       # Clear package cache
```

> [!warning]
> Always review the list of packages to be removed before confirming, especially when using commands that remove dependencies.

## Advanced Pacman Configuration

Enhance your Pacman experience with these optimizations:

1. **Enable Colored Output**
   Edit `/etc/pacman.conf` and uncomment or add:

   ```conf
   Color
   ILoveCandy  # (Optional) This adds a fun progress bar
   ```

2. **Enable Parallel Downloads**
   In `/etc/pacman.conf`, uncomment or add:

   ```conf
   ParallelDownloads = 5
   ```

## The Arch User Repository (AUR)

The [Arch User Repository (AUR)](https://aur.archlinux.org/) is a community-driven repository that significantly extends Arch Linux's software availability. It contains package descriptions (PKGBUILDs) that allow you to compile packages from source and install them using Pacman.

### AUR Helpers

AUR helpers are tools that automate the process of building and installing packages from the AUR. Popular options include:

- [**Paru**](https://github.com/Morganamilo/paru): A feature-rich AUR helper written in Rust
- [**Yay**](https://github.com/Jguer/yay): User-friendly AUR helper with advanced features

### Installing AUR Packages

You can install AUR packages manually or use an AUR helper for a more streamlined experience. Let's take a look at both methods.

Actually, `yay` and `paru` are also packages in the AUR. So, why not just take the installation of `paru` as an example of a manual installation?

```bash
# Install prerequisites
sudo pacman -S --needed base-devel git

# Clone and build Paru
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

After installing `paru`, you can use this helper to install AUR packages more conveniently. Here are some basic commands:

```bash
# Basic Paru usage
paru -S PACKAGE_NAME     # Install a package
paru -Sua               # Update AUR packages
paru -Syu               # Update both repository and AUR packages
```

## Additional Resources

For more detailed information about package management:

- [Official APT Documentation](https://www.debian.org/doc/manuals/apt-guide/)
- [Pacman Wiki Page](https://wiki.archlinux.org/title/Pacman)
- [Arch User Repository Guide](https://wiki.archlinux.org/title/Arch_User_Repository)
- [Pacman Tips and Tricks](https://wiki.archlinux.org/title/Pacman/Tips_and_tricks)
