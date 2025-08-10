---
title: Linux 中的权限管理
abbrlink: a9dc5c1e
categories:
  - CS
  - Tools
tags:
  - terminal
  - linux
  - chmod
  - permission-management
date: 2023-03-23 22:27:08
updated: 2024-12-21 14:14:00
---

我在 Linux 中不小心运行了一个错误的 `chmod` 命令，然后我的 Git 突然就产生了一系列更改，我突然打不开我的文件、查看不了我的目录了！怎么办？在本文中，我将向您介绍 Linux 的权限系统，以及如何使用 `chmod` 命令来管理文件和目录的权限，让您在遇到类似的情况时不像我那么手忙脚乱。

<!--more-->

## Linux 中的权限表示

当您在终端运行 `ls -l` 时，当前目录下的文件和目录会以一种名为 “长列表” 的格式（long listing format）一行一行地列出。您会注意到，每一行均由类似 `-rw-r-r-`、`drwxr-xr-x` 这样的字符串开头。为了理解这些字符串，我们可以把它们分成四部分：

- 第一个字符是第一部分，它标识了 “文件”（是的，目录也是一种特殊的文件！）的类型，例如：
  - `-` 表示普通文件
  - `d` 表示目录
  - ...
- 剩下的 9 个字符可以平均分成三部分，分别代表**文件的所有者**、**文件所在组的所有成员**和**其他用户**的权限。每个部分包含三个字符，分别代表是否具有 `r`（读）、`w`（写）和 `x`（执行）权限。

![运行 `ls -l` 时](https://webp.blocklune.cc/blog-imgs/cs/tools/the-chmod-command-in-linux/1.png)
![来自 www.runoob.com 的一张解释上述字符串的示例图](https://www.runoob.com/wp-content/uploads/2014/08/file-permissions-rwx.jpg)

对于文件的 `rwx` 很好理解；而对于目录，`r` 表示可以读取目录的内容，`w` 表示可以在目录中创建、删除和重命名文件，`x` 表示可以访问目录的内容。

除了像上面这样使用 `rwx` 模式表示权限，我们还可以使用二进制位来表示这些权限，例如使用二进制的 100 表示 `r--`、010 表示 `-w-`、001 表示 `--x`，也可以使用 101 表示 `r-x`、110 表示 `rw-` 等。

为了方便，又可以把这些使用二进制位表示的权限转换为八进制数，使用 4（二进制 100） 表示 `r`、2（二进制 010） 表示 `w`、1（二进制 001） 表示 `x`。然后将这些八进制数的和替换掉 `rwx` 模式。例如，使用 6（二进制 110） 表示 `rw`。

![来自 www.runoob.com 的一张解释八进制表示法的图片](https://www.runoob.com/wp-content/uploads/2014/08/rwx-standard-unix-permission-bits.png)

现在，您可以读懂这些了：

```bash
-rw------- # (600) 所有者：RW
-rw-r--r-- # (644) 所有者：RW 组：R 其他：R
-rw-rw-rw- # (666) 所有者：RW 组：RW 其他：RW
-rwx------ # (700) 所有者：RWX
-rwx--x--x # (711) 所有者：RWX 组：X 其他：X
-rwxr-xr-x # (755) 所有者：RWX 组：RX 其他：RX
-rwxrwxrwx # (777) 所有者：RWX 组：RWX 其他：RWX
```

## 扩展权限

除了上面提到的 `rwx` 三种权限外，还存在三种特殊权限：`SUID`、`SGID` 和 `Sticky Bit`。

### SUID

`SUID` 即 Set User ID，当一个文件被设置了 SUID 位时，它会在执行时以文件所有者的身份执行。

当目录被设置了 SUID 位时，新创建的文件会继承该目录的所有者权限。这是因为：

- 正常情况下，新创建的文件的所有者会是创建者的所有者
- 当目录设置了 SUID 位时，新创建的文件的所有者会是该目录的所有者

在表示上，`SUID` 位会显示为 `s` 或 `S`，并显示在原有的所有者 `x` 位的位置。大小写的区别在于：

- 如果一个文件没有 `x` 权限仅有 `SUID` 位，那么它会显示为 `S`（大写）
- 如果一个文件同时具有 `x` 和 `SUID` 位，那么它会显示为 `s`（小写）

在八进制表示法中，`SUID` 位的值是 4000。

例如，`passwd` 文件的权限是 `-rwsr-xr-x`（八进制表示为 `4755`），这意味着任何用户在执行 `passwd` 时都会以 `root` 用户的身份执行。

### SGID

`SGID` 即 Set Group ID，当一个文件被设置了 SGID 位时，它会在执行时以文件所在组的身份执行。

当目录被设置了 SGID 位时，新创建的文件会继承该目录的组权限。这是因为：

- 正常情况下，新创建的文件的组会是创建者的组
- 当目录设置了 SGID 位时，新创建的文件的组会是该目录的组

类似于 `SUID`，`SGID` 位也会使用 `s` 或 `S` 来表示，但占用的是组的 `x` 位的位置。

在八进制表示法中，`SGID` 位的值是 2000。

> [!Tip]
> 如果一个文件同时具有 `SUID` 和 `SGID` 位，那么前者的优先级将高于后者，即它将被以文件所有者的身份执行。

### Sticky Bit

`Sticky Bit` 仅用于目录。当一个目录被设置了 Sticky 位时，只有下面三者可以删除这个目录中的文件：

- 这个设置了 Sticky 位的目录中的文件或目录的所有者
- 这个设置了 Sticky 位的目录的所有者
- root 用户

类似于 `SUID` 和 `SGID`，`Sticky Bit` 也会占用原有的 `x`（执行）位，但是是其他用户（即第三组）中的执行位，使用 `t` 或 `T` 表示。大小学取决于：

- 如果一个目录没有 `x` 权限、仅有 `Sticky Bit` 位，那么它会显示为 `T`（大写）
- 如果一个目录同时具有 `x` 和 `Sticky Bit` 位，那么它会显示为 `t`（小写）

在八进制表示法中，`Sticky Bit` 位的值是 1000。

例如，`/tmp` 目录的权限是 `drwxrwxrwt`，A 在其中创建了 `foo.txt`，B 在其中创建了 `bar.txt`，那么 A 可以删除 `foo.txt`，但不能删除 `bar.txt`；B 可以删除 `bar.txt`，但不能删除 `foo.txt`；root 用户可以删除任何文件。

## 默认权限

文件的默认权限是 666，即 `-rw-rw-rw-`，表示所有者、组和其他用户可以读写文件。目录的默认权限是 777，即 `drwxrwxrwx`，表示所有者、组和其他用户可以读写和访问该目录。

不过，这些默认权限受用户的 **umask** 设置影响。`umask` 是一个值，用于控制创建新文件或目录时删除哪些权限。例如，如果用户的 `umask` 为 022，那么在创建新文件时，组和其他用户的写入权限将被移除，在创建新目录时，组和其他用户的写入和执行权限将被移除。因此：

- 文件的实际默认权限为 666 - 022 = 644，即 `-rw-r-r-`
- 目录的实际默认权限是 777 - 022 = 755，即 `drwxr-xr-x`

您可以运行 `umask` 命令查看您自己的设置。

![我的 umask 设置](https://webp.blocklune.cc/blog-imgs/cs/tools/the-chmod-command-in-linux/4.png)

## 修改权限

我们可以使用 `chmod` 命令来修改文件和目录的权限。其一般格式如下：

```bash
chmod [-cfvR] [--help] [--version] <mode> <file> ...
```

大写的 `R` 表示递归。如果您需要批量操作，您会用到它的。

最重要的部分显然是 `<mode>`。它的模式如下：

```bash
[ugoa...][[+-=][rwxX]...][,...]
```

1. [ugoa...]： `u` 表示用户，`g` 表示组，`o` 表示其他，`a` 表示所有。
2. [+-=]：`+` 表示添加权限，`-` 表示删除权限，`=` 表示设置特定用户类型的权限，**不考虑之前的权限**。
3. [rwxX]：您已经知道了 `rwx`，而 `X` 表示仅在文件是目录或某个用户已经有执行权限的情况下设置执行权限。

例如：

```bash
chmod u+x <file> # 为文件所有者添加执行权限，组和其他权限保持不变
chmod o-rwx <file> # 删除其他人的所有权限，文件所有者和组的权限保持不变
chmod a=r <file> # 将所有用户类型的权限设置为只读，覆盖之前的所有权限
chmod a+X <file> # 仅当文件是一个目录或已被某个用户执行时，为所有用户类型添加执行权限
```

也可以使用八进制模式表示 `<mode>`。例如：

```bash
chmod 777 <file> # 现在每个人都可以读、写和执行 <file> 了
```

对于 `SUID`、`SGID` 和 `Sticky Bit`，也可以使用类似的命令：

```bash
chmod +s <file> # 设置 SUID 位
chmod 4755 <file> # 使用八进制法设置 SUID 位
chmod +t <directory> # 设置 Sticky Bit
chmod 1755 <directory> # 使用八进制法设置 Sticky Bit
```

### 示例

下面以一个具体的例子来说明如何应用 Linux 的权限管理。

一个项目团队由 user1, user2,user3 三个成员构成，他们分别需要各自专属的目录（家目录），一个共享目录和一个临时目录，他们可在共享目录中操作其他人创建的文件，但在临时目录中仅能删除自己创建的文件。

首先，创建用户组和用户：

```bash
sudo groupadd project_team
sudo useradd -m -G project_team user{1..3}
```

创建目录：

```bash
sudo mkdir /project
sudo mkdir /project/shared
sudo mkdir /project/temp
```

设置目录所有者：

```bash
sudo chown :project_team /project
sudo chown :project_team /project/shared
sudo chown :project_team /project/temp
```

> [!Tip]
> 使用 `chown` 可以设置文件的所有者和所在组。`:` 前后分别是所有者和所在组。如果只想设置所在组，可以省略 `:` 前面的部分。

设置权限：

```bash
sudo chmod 755 /project
sudo chmod 2775 /project/shared # 共享目录设置 SGID 位，确保新创建的文件继承组权限
sudo chmod 1775 /project/temp # 临时目录设置 Sticky Bit，确保只有文件所有者可以删除文件
```

## 参考资料

- 《GNU/Linux 编程》
- [《Linux chmod 命令 | 菜鸟教程》](https://www.runoob.com/linux/linux-comm-chmod.html)
- [《Linux 权限详解（chmod、600、644、700、711、755、777、4755、6755、7755）》](https://blog.csdn.net/u013197629/article/details/73608613)

除此之外，在编写此文初版时，New Bing 帮助我搜集了一些资料并帮我进行了一些润色；在更新时，GitHub Copilot 帮我补充了一些内容。感谢他们的帮助！
