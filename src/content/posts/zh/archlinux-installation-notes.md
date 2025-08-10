---
title: Arch Linux 安装笔记
tags:
  - archlinux
  - hyprland
  - installation
  - linux
  - linux-setup
  - unix
date: 2024-12-22 19:01:16
updated: 2025-02-01 00:40:00
---

之前我在 VMWare 中安装了 Arch Linux，最近又在实体机上尝试安装了 Windows 11 和 Arch Linux 双系统。Arch Linux 的 [Wiki](https://wiki.archlinuxcn.org/) 写得非常好，而且中文资料很丰富，加之 AI Chatbot 的帮助，安装过程总体上还是很顺利的。这里记录一下在[安装指南](https://wiki.archlinuxcn.org/wiki/%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97)中需要重点关注的内容、没有直接提到的一些细节、以及后续的一些配置。

<!--more-->

## VMWare 的配置

我使用的虚拟机软件是 VMWare WorkStation Pro，这款软件[目前对个人用户是免费的](https://blogs.vmware.com/workstation/2024/05/vmware-workstation-pro-now-available-free-for-personal-use.html)，您可以直接去官网下载安装。

安装完成后，创建一个新的虚拟机。然后按需求配置虚拟机硬件。两个特殊的配置是：我希望使用 UEFI 引导，所以需要在 `虚拟机设置 -> 选项 -> 高级 -> 固件类型` 中选择 UEFI；后续我希望安装 [Hyprland](https://hyprland.org/)，所以我还在 `虚拟机设置 -> 硬件 -> 显示屏 -> 3D 图形` 中勾选了 `加速 3D 图形`。

确保您在 `虚拟机设置 -> 硬件 -> CD/DVD (SATA) -> 连接` 中选择了 `使用 ISO 映像文件`，并选择了您[下载](https://archlinux.org/download/)的 Arch Linux 镜像，就可以启动虚拟机，开始安装了。

## 安装过程

从[安装指南](https://wiki.archlinuxcn.org/wiki/%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97)的 `1.5` 开始一步一步做到 `1.8`，然后进行 `1.9 创建硬盘分区`。

### 磁盘分区

各种硬盘设备会被系统识别并分配为一个[块设备](https://zh.wikipedia.org/wiki/%E8%AE%BE%E5%A4%87%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F#.E5.91.BD.E5.90.8D.E7.BA.A6.E5.AE.9A)，如 `/dev/sda`（此处 `sd` 表示 SCSI 硬盘，`a` 表示第一个）。

我们可以使用 `lsblk` 或 `fdisk` 来查看这些块设备，此处我使用 `fdisk`：

```bash
fdisk -l
```

按照指南中所说的：

> 结果中以 rom、loop 或者airootfs结尾的设备可以被忽略。结果中以 rpbm、boot0 或者 boot1 结尾的 mmcblk\* 设备也可以被忽略。

下图展示了虚拟机安装时运行上述命令的结果，有效设备是 `/dev/sda`。

![lsblk 和 fdisk -l 的运行结果](https://webp.blocklune.cc/blog-imgs/archlinux-installation-notes/block-devices.png)

而在实体机双系统安装时，我有两块固态硬盘，分别是 `/dev/nvme0n1` 和 `/dev/nvme1n1`。

接下来，我们就可以开始分区了。

对于虚拟机安装，我采用的是指南中的分区方案示例，具体如下：

- `/dev/sda1` 为 EFI 系统分区，大小为 1GB，文件系统为 `FAT32`；
- `/dev/sda2` 为 Swap 分区，大小为 4GB；
- `/dev/sda3` 为根分区，大小即剩余硬盘大小，文件系统为 `ext4`。

这个分区方案是为 UEFI 引导准备的，所以有一个 EFI 系统分区。

`FAT32` 和 `ext4` 是文件系统。前者较老但兼容性较好，EFI 分区必须使用 `FAT32` 以确保 UEFI 固件可读；后者是 Linux 默认的文件系统，功能更多性能更好。

对于实体机双系统，安装 Windows 时已经有了一块 EFI 分区（在我这里是一块大小为 260MB 的空间，使用 `lsblk` 看到的结果为 `nvme0n1p1`）。所以只需要准备 Swap 分区和根分区即可。我的物理内存大小为 8G，所以我准备了 8G 的 Swap 分区，以及 120G 的根分区。

在虚拟机安装时，我使用了 `fdisk` 来进行分区。您也可以尝试使用 [`cfdisk`](https://wiki.archlinuxcn.org/wiki/Cfdisk)，它是 `fdisk` 的 TUI 版本。

首先运行下面的命令来指定硬盘：

```bash
fdisk /dev/sda
```

进入 `fdisk` 后，我们可以使用以下命令来查看帮助、进行操作和保存：

- `m`：查看帮助；
- `g`：新建 GPT 分区表；
- `n`：新建分区；
- `t`：更改分区类型；
- `p`：查看分区表；
- `w`：保存并退出。

我们需要首先按下 `g` 创建一个 GPT 分区表。

下面，按下 `n` 创建一个分区。第一个分区是 EFI 系统分区。分区号回车默认为 `1`，起始扇区回车默认为 `2048`，结束扇区输入 `+1G` 后回车，这样就创建了一个大小为 1GB 的分区。然后按下 `t` 更改分区类型，输入分区号并更改类型为 `EFI System`。

接着进行类似地操作，创建一个 Swap 分区，分区类型是 `Linux swap`。

最后再创建根分区，按下 `n` 开始创建，结束扇区直接回车，这样就会占据剩余的硬盘空间。类型不需要手动修改，默认就是 `Linux filesystem`。

分区完成后，按下 `p` 查看分区表，确认无误后按下 `w` 保存并退出。

![分区完成后按下 `p` 的输出](https://webp.blocklune.cc/blog-imgs/archlinux-installation-notes/partitions.png)

可以用 `lsblk` 来查看分区情况。

### 格式化分区

分区完成后，就可以进行格式化操作，创建文件系统了。

在 EFI 系统分区上创建 `FAT32` 文件系统：

```bash
mkfs.fat -F 32 /dev/sda1
```

创建 Swap 分区：

```bash
mkswap /dev/sda2
```

在根分区上创建 `ext4` 文件系统：

```bash
mkfs.ext4 /dev/sda3
```

### 挂载分区

然后，我们需要挂载这些分区。首先挂载根分区：

```bash
mount /dev/sda3 /mnt
```

挂载 EFI 系统分区（指南中挂载到的位置是 `/mnt/boot`，但我查询了其他资料，似乎更建议挂载到 `/mnt/boot/efi`）。安装双系统时，把原来的引导 Windows 的 EFI 分区挂载到相应位置即可：

```bash
mount --mkdir /dev/sda1 /mnt/boot/efi
```

还需要激活 Swap 分区：

```bash
swapon /dev/sda2
```

可以用下面的命令来查看激活情况：

```bash
swapon --show
```

### 生成 fstab 文件

继续跟随指南完成 `2 开始安装系统`，然后进行 `3 配置系统`，在 `3.1 生成 fstab 文件` 时，我们需要生成一个 `fstab` 文件。[fstab](https://wiki.archlinuxcn.org/wiki/Fstab) (File System Table) 文件的作用是告诉系统如何挂载和使用文件系统。

我们可以使用下面的命令来生成 `fstab` 文件：

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

含义如下：

- `genfstab` 是生成 fstab 文件的工具
- `-U` 表示使用 UUID 来标识设备（比设备路径更可靠，设备路径可能会变，比如在进行双系统安装时，我的两块实体固态硬盘的设备路径就在重启后出现了互换）
- `/mnt` 是当前挂载的目标系统
- `>>` 表示将输出追加到文件
- `/mnt/etc/fstab` 是生成的 fstab 文件的位置

### chroot 到新安装的系统

到目前位置，我们实际上都是在 Live CD 环境中操作的，此时的 `/` 是 Live CD 的根目录。为了进入新安装的系统，我们需要 `chroot` 到新安装的系统。

在前面的操作中，我们已经挂载了根分区到 `/mnt`，所以我们只需要 `chroot` 到 `/mnt` 即可。运行下面的命令：

```bash
arch-chroot /mnt
```

此处并没有直接使用 `chroot` 命令，而是使用了 [`arch-chroot`](https://wiki.archlinuxcn.org/wiki/Chroot#%E4%BD%BF%E7%94%A8_arch-chroot) 命令。这是 Arch Linux 提供的一个脚本，它会自动地进行包括挂载 `/proc`、`/sys`、`/dev` 和 `/run` 到新系统在内的一系列操作，使用起来更方便。

进入新系统后，可以安装一些基础的网络工具，方便之后重启后进行联网操作：

```bash
pacman -S iw iwctl networkmanager
```

### 安装引导程序

接着跟随指南到 `3.8 安装引导程序`，我们来安装 [GRUB](https://wiki.archlinuxcn.org/wiki/GRUB)。

首先安装必要的包：

```bash
pacman -S grub efibootmgr
```

如果是单系统安装，直接运行下面的命令安装 GRUB 即可：

```bash
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
```

但在进行双系统安装时，我们需要安装 `os-prober`，以检测硬盘上的其他操作系统。

```bash
pacman -S os-prober
```

新版本的 GRUB 默认禁用 `os-prober`，需要编辑 `/etc/default/grub` 文件，取消注释下面这一行：

```text
GRUB_DISABLE_OS_PROBER=false
```

然后再运行与单系统安装相同的安装命令：

```bash
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
```

安装完成后，运行下面的命令来生成主配置文件：

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

如果 `os-prober` 无法成功检测到已有的 Windows 11，就需要手动修改配置文件。

首先，确定 EFI 分区的 UUID。例如，在实体机安装双系统时我的 EFI 分区是 `/dev/nvme0n1p1`，运行下面的命令：

```bash
blkid /dev/nvme0n1p1
```

得到输出如下：

```text
/dev/nvme0n1p1: LABEL_FATBOOT="SYSTEM" LABEL="SYSTEM" UUID="5A53-7DF3" ...
```

记住此处的 UUID，然后编辑刚刚生成的 `/boot/grub/grub.cfg` 文件，在 `### BEGIN /etc/grub.d/30_os-prober ###` 与 `### END /etc/grub.d/30_os-prober ###` 之间添加以下内容（记得使用上面得到的 UUID）：

```text
menuentry 'Microsoft Windows 11' {
    insmod part_gpt
    insmod fat
    insmod chain
    search --fs-uuid --no-floppy --set=root 5A53-7DF3
    chainloader (${root})/EFI/Microsoft/Boot/bootmgfw.efi
}
```

## 后续配置

### 添加新用户

让我们来添加一个 sudo 用户。运行下面的命令创建一个名为 `username` 的用户并将其添加进 [`wheel`](<https://en.wikipedia.org/wiki/Wheel_(computing)>) 组：

```bash
useradd -m -G wheel username
```

另一些有用的命令：

```bash
# 查看某用户所属的组
groups username

# 将现有用户加入 wheel 组
usermod -aG wheel username
```

然后编辑 `/etc/sudoers` 文件，可以这样做：

```bash
EDITOR=vim visudo

# 然后在打开的文件中找到并取消下面这一行的注释
# %wheel ALL=(ALL:ALL) ALL
```

### 虚拟机工具

我在 VMWare 中安装了 Arch Linux，配合虚拟机工具可以更方便地使用虚拟机。但我没有选择 VMWare 官方提供的版本，而是使用了 `open-vm-tools`。

```bash
# 安装 open-vm-tools
pacman -S open-vm-tools

# 如果你使用图形界面，还需要安装
pacman -S gtkmm3 xf86-video-vmware xf86-input-vmmouse

# 启用服务
systemctl enable vmtoolsd
systemctl start vmtoolsd

# 如果需要共享文件夹功能，还要启用这个服务
systemctl enable vmware-vmblock-fuse
systemctl start vmware-vmblock-fuse
```

### AUR 助手

[AUR](<https://wiki.archlinuxcn.org/wiki/Arch_%E7%94%A8%E6%88%B7%E8%BD%AF%E4%BB%B6%E4%BB%93%E5%BA%93_(AUR)>) 是 Arch Linux 的软件仓库。我在后续的步骤中大量使用它来下载和安装软件。

为了更好地使用 AUR，可以安装一个 [AUR 助手](https://wiki.archlinuxcn.org/wiki/AUR_%E5%8A%A9%E6%89%8B) 程序。最经典的是 [`yay`](https://wiki.archlinuxcn.org/wiki/Yay)，而一个新的选择是 [`paru`](https://github.com/Morganamilo/paru)。

如果您希望使用 `yay`，可以运行以下命令：

```bash
pacman -S git base-devel
git clone https://aur.archlinux.org/yay-bin.git
cd yay-bin
makepkg -si
```

之后，我们就可以使用 `yay` 来下载、安装和自动管理软件包了。

### 代理服务器

我使用的软件包是 [clash-nyanpasu-bin](https://aur.archlinux.org/packages/clash-nyanpasu-bin)。一般而言，可以直接运行下面的命令来安装此代理服务器软件：

```bash
yay -S clash-nyanpasu-bin
```

但由于网络原因，最后我只能尝试手动安装：

```bash
git clone https://aur.archlinux.org/clash-nyanpasu-bin.git
cd clash-nyanpasu-bin
makepkg -si
```

### Hyprland

后续我还尝试安装了 [Hyprland](https://hyprland.org/)。不同于我们日常使用的浮动式窗口管理器，它是一个[平铺式窗口管理器](https://wiki.archlinuxcn.org/wiki/%E7%AA%97%E5%8F%A3%E7%AE%A1%E7%90%86%E5%99%A8#%E5%B9%B3%E9%93%BA%E7%AA%97%E5%8F%A3%E7%AE%A1%E7%90%86%E5%99%A8)，这意味着，窗口会以方格的形式排列在屏幕上，永远不会重叠。

第一次使用虚拟机安装时，我直接使用了预设配置 [illogical-impulse](https://end-4.github.io/dots-hyprland-wiki/zh-cn/)。

进行双系统安装时，我尝试了手动配置。下面介绍手动配置的一些步骤和注意点。

由于我的环境是 Nvidia 显卡，所以需要首先参考 [Hyprland 文档中有关 Nvidia 的说明](https://wiki.hyprland.org/Nvidia/) 安装好 Nvidia 驱动，并修改 Hyprland 的相关配置文件。具体请参考官方的 Wiki。

在配置完成后，我的鼠标光标存在卡顿和延迟的问题。在 Hyprland 配置文件最后添加下面的内容可以解决这个问题：

```text
cursor {
  no_hardware_cursors = true
}
```

安装好 Hyprland 生成的默认配置中使用的终端模拟器是 [kitty](https://github.com/kovidgoyal/kitty)，使用的应用启动器是 [wofi](https://hg.sr.ht/~scoopta/wofi)。如果您没有修改默认配置，那么在启动 Hyprland 之前，记得安装它们。

为了在系统启动时自动启动 Hyprland，您需要一个显示管理器。我使用的是 [SDDM](https://github.com/sddm/sddm)。

由于我实际上有两张显卡（Intel 核显和 Nvidia 独显），所以我安装了 [optimus-manager](https://github.com/Askannz/optimus-manager) 来进行管理。

我的任务栏应用是 [Waybar](https://github.com/Alexays/Waybar)，并且使用了 [mechabar](https://github.com/sejjy/mechabar) 这套自动配置。

## 参考资料

- [Arch Linux Wiki](https://wiki.archlinuxcn.org/)
- [Arch Linux 下 Hyprland 配置指北](https://www.bilibili.com/opus/778159722494689457)
- [Hyprland Official Site](https://hyprland.org/)
- [You NEED to try Hyprland on Linux RIGHT NOW | Hyprland for Newbs EP 1](https://youtu.be/2CP_9-jCV6A)
