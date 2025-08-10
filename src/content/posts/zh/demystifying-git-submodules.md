---
title: 揭秘 Git 子模块（翻译）
tags:
  - git
  - translation
  - version-control
license: none
date: 2025-01-12 11:20:58
---

对 _[Demystifying git submodules](https://www.cyberdemon.org/2024/03/20/submodules.html)_ 一文的中文翻译，原作者是 Dmitry Mazin。

<!--more-->

在我的职业生涯中，我发现 Git 子模块（Git Submodules）对我而言一直是个痛点。因为我不了解它，它常常使我感到沮丧。

所以，我终于决定坐下来，学一学 Git 到底是如何跟踪子模块的。原来，它一点也不复杂。它只是与 Git 常规的跟踪文件的方法略有不同。您只需要向前迈出的一小步就可以学会。

在此文中，我将准确解释我需要哪些知识，来避免在使用 Git 子模块时感到痛苦。

（本文不讨论子模块的好坏，也不讨论是否应该使用子模块 —— 这样的讨论是有意义的，但不在本文讨论范围之内。）

## 现状概述

为了让本文更易理解，我将使用具体的例子。

请允许我介绍一下下面这个我们正在构建的示例 Web 应用，称其为 `webapp`。下面是其 Git 仓库的内容：

```text
$ [/webapp] ls

.git/
README.md
tests/
```

假如您想导入某个库。它位于它自己的 Git 仓库 `library` 中。

```text
$ [/library] ls

.git/
README.md
my_cool_functions.py
```

稍后，我将解释子模块是如何工作的。但首先，让我来戏剧性地重演一下在我身上发生过许多次的情况，即在不了解子模块的情况下使用它。

## 不懂子模块的人的一天

啊，2012。一个多么适合做 “全栈工程师” 的年代啊！不知道主分支上有什么贡献正等着我！

（为了便于阅读，在本文中，我将不使用真实的提交 SHA，而是使用虚构的描述性的 SHA。）

让我们拉取（pull）一下，确保我们本地的代码是最新的：

```text
$ [/webapp] git pull

remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (1/1), done.
remote: Total 2 (delta 1), reused 2 (delta 1), pack-reused 0
Unpacking objects: 100% (2/2), 237 bytes | 118.00 KiB/s, done.
From https://github.com/dmazin/webapp
   webapp_old_commit_sha..webapp_new_commit_sha  main -> origin/main
Updating webapp_old_commit_sha..webapp_new_commit_sha
Fast-forward
 library | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

拉取之后，我想确认一下我的工作树是否干净。

```text
$ [/webapp] git st

## main...origin/main
 M library
```

这是什么？我修改了 `library`？我碰都没碰那个目录。

我修改了一个 _目录_，这很奇怪。通常 git 只说我修改了某个特定的 _文件_。

好吧，那 `git diff` 会说什么呢？

```text
$ [/webapp] git diff

diff --git a/library b/library
index library_old_commit_sha..library_new_commit_sha 160000
--- a/library
+++ b/library
@@ -1 +1 @@
-Subproject commit library_new_commit_sha
+Subproject commit library_old_commit_sha
```

显然，我删除了 `Subproject commit library_new_commit_sha`，并添加了 `Subproject commit library_old_commit_sha`。

这肯定不是我干的。真奇怪，让我做一次硬重置（hard reset）。

```text
$ [/webapp] git reset --hard origin/main

HEAD is now at webapp_new_commit_sha point submodule to newest commit
```

这让 `git diff` 消失了吗？

```text
$ [/webapp] git st

## main...origin/main
 M library
```

没有！我现在真的晕了！

让本地修改消失的通常方法是 `git reset --hard`，但这不起作用。另一种方法是提交（commit）修改。

（有时，人们甚至没有注意到上述 diff，然后一不小心做 commit。）

**未来的自己**：_不要这样做！如果您 `git add` 了那个修改，您将回滚别人做的一个修改！_

此处到底发生了什么？当然，是因为 `library` 是一个子模块。您必须以特殊的方式处理它。

让我们深入了解子模块吧。

## 什么是子模块？

git 子模块是嵌套在另一个仓库中的完整仓库。任何仓库都可以是另一个仓库的子模块。

所以，`library` 是一个作为子模块嵌套在 `webapp` 中的完整仓库。

这似乎并不让人困惑，不是吗？然而，关于子模块有两个重要并且微妙的要点。这些要点也是很多人在使用子模块时遇到问题的原因。

### 1. 子模块始终和一个特定的提交相关联

您知道软件管理器是如何让您在指定软件包版本是既可以模糊（给我任何一个 2.x.x 版本的 `requests`）又可以精确关联到一个特定版本（使用 `requests` 2.31.0 版本）的吗？

子模块 _只能_ 关联到一个特定的提交（Commit）。这是因为子模块不是一个软件包；它是嵌入另一个仓库的代码，Git 希望您准确地指明。

我们很快就会看到，这样的关联是如何工作的。

### 2. git 不会自动下载或更新子模块

如果您重新克隆 `webapp`，git _不会_ 自动为您下载 `library`（除非您使用 `git clone --recursive`）。

类似地，如果一个协作者将 `webapp` 与一个新的 `library` 提交相关联，然后您 `git pull` `webapp`，git 也 _不会_ 为您自动更新 `library`。

这就是在上面的重现中所发生的事。让我倒带一下，展示一下发生了什么。

## 当有人更新子模块时会发生什么？

一开始，`webapp` 指向 `webapp_old_commit_sha`，关联 `library` 的 `library_old_commit_sha`。

![Hand-drawn diagram of two git repositories, webapp and library. It shows that the old_sha commit of the webapp repo points to the old_sha commit of the library repo. The old_sha commit of the webapp repo has a purple border around it, saying 'HEAD'. The old_sha commit of the library repo also has a purple border around it, saying 'HEAD'.](https://www.cyberdemon.org/assets/submodules1.png)

（将 `HEAD` 视为 “当前提交”。）

然后，我的协作者对 `library` 做出了修改。记住，`library` 是一个完整的仓库，所以在他们做完他们的工作后，他们做了您在修改后经常做的事情：提交（commit）并推送（push）新的提交 `library_new_commit_sha`。

还没结束。`webapp` 必须指向一个 `library` 的特定提交，所以为了使用 `library_new_commit_sha`，我的协作者接着向 `webapp` 推送了一个新的提交 `webapp_new_commit_sha`，它指向 `library_new_commit_sha`。

但问题是！_git 不会自动更新子模块_，所以 `library` 仍然指向 `library_old_commit_sha`。

![Hand-drawn diagram of two git repositories, webapp and library. It shows that the old_sha commit of the webapp repo points to the old_sha commit of the library repo. The new_sha commit of the webapp repo points to the new_sha of the library repo. The new_sha commit of the webapp repo has a purple border around it, saying 'HEAD'. The old_sha commit of the library repo has a purple border around it, saying 'HEAD'. A red arrow points to the purple border around old_sha in the library repo. The red arrow is linked to a speech bubble which says, 'library still points at old_sha!'](https://www.cyberdemon.org/assets/submodules2.png)

我想如果我们确切地了解一下 git 是如何跟踪子模块的，就不会那么困惑了。

## Git 是如何跟踪子模块的

### Git 如何将子模块关联到一个特定的提交

`webapp` 的最新提交是 `webapp_new_commit_sha`。让我们来分析一下它。

一个提交只是一个磁盘上的文件。然而，它是优化过/压缩过的，我们可以使用一个内置的小工具来查看它。下面是一个提交存储的内容。

```text
$ [/webapp] git cat-file -p `webapp_new_commit_sha`

tree 92018fc6ac6e71ea3dfb57e2fab9d3fe23b6fdf4
parent webapp_old_commit_sha
author Dmitry Mazin <dm@cyberdemon.org> 1708717288 +0000
committer Dmitry Mazin <dm@cyberdemon.org> 1708717288 +0000

point submodule to newest commit
```

我们关心的内容是 `tree 92018fc6ac6e71ea3dfb57e2fab9d3fe23b6fdf4`。_tree_ 对象表示仓库的目录列表。将树视作目录。

让我们分析一下这个树对象。

```text
$ [/webapp] git cat-file -p 92018fc6ac6e71ea3dfb57e2fab9d3fe23b6fdf4

100644 blob     6feaf03c7a9c805ff734a90a245a417e6a6c099b    .gitmodules
100644 blob     a72832b303c4d4f1833da79fc8a566e8a0eb37af    README.md
040000 tree     a425c23ded8892f901dee7fbc8d4c5714bdcc40d    tests
160000 commit   library_new_commit_sha                      library
```

请注意 `tests` 是一棵 `tree`（就像目录可以包含目录，树也可以指向树）。

但是 `library` 是一个 ... 提交？！

```text
160000 commit   library_new_commit_sha                      library
```

这种奇怪的现象正是 git 知道 `library` 指向 `library_new_commit_sha` 的原因。

换句话说，git 实现子模块的方式是通过一个奇怪的技巧，即一棵树指向一个 _提交_。

![Hand-drawn diagram showing the text 'webapp_new_commit_sha' connected, via arrow, to 'tree a425' which is itself connected, via arrow, to 'library_new_commit_sha'](https://www.cyberdemon.org/assets/submodules3.png)

有了这些知识后，让我们来理解先前的 `git diff` 的输出。

## 理解 git diff

这是上面提到的 diff 的输出。

```text
$ [/webapp] git diff

diff --git a/library b/library
index library_old_commit_sha..library_new_commit_sha 160000
--- a/library
+++ b/library
@@ -1 +1 @@
-Subproject commit library_new_commit_sha
+Subproject commit library_old_commit_sha
```

迷惑的点在于它说 **我** 修改了 `library`。但这不是我修改的，是别人修改的！

通常，我认为 `git diff` 的意思是 “这里是我做的改动”。但这并不完全正确。

当您调用 `git diff` 时，git 会告诉您工作树（即未暂存的（unstaged）、未提交的（uncommitted）的本地修改）和分支最新提交（`webapp_new_commit_sha`）之间的差异。

这样来看，上面的 `git diff` 就有意义了。在 `webapp_new_commit_sha` 中，`library` 指向 `library_new_commit_sha`。但在我的工作树中，`library` 仍然指向 `library_old_commit_sha`。

git 不知道哪个变更先发生。它只知道您的工作树和提交的不一样。因此它告诉您：`library_new_commit_sha` 说 `library` 应该指向 `library_new_commit_sha`，但它并没有。

理解了上述内容，我就不再为子模块而苦恼了。不过，我还没告诉您如何更新子模块。

## 如何更新子模块

现在我们明白了，我们需要将 `library` 指向 `library_new_commit_sha`。我们应该怎么做？

由于 `library` 是一个完整的仓库，我可以直接 `cd` 进去然后切换到那个提交：

```text
$ [/webapp] cd library

$ [/library] git checkout library_new_commit_sha

Previous HEAD position was library_old_commit_sha README
HEAD is now at library_new_commit_sha add some cool functions
```

如果我们回到 `webapp`，就会发现 `git st` / `git diff` 终于干净了。

```text
$ [/webapp] git st

## main...origin/main
# (no output)

$ [/webapp] git diff

# (no output)
```

然而，您不必真的像上面这样做。

## 如何真正更新子模块

在 `webapp` 中，我们可以调用 `git submodule update`。这回更新仓库中的 _所有_ 子模块。

人们通常配合特定的选项来使用 `git submodule update`，让我们来了解一下。

### 初始化一个子模块：`git submodule update --init`

还记得我说过如果您 `git clone webapp`，git 其实并不会下载 `library` 中的内容吗？

您应该做的是，在克隆完 `webapp` 之后：

1. 运行 `git submodule init` 来初始化子模块。尽管这不会实际下载他们🙃️。
2. 运行 `git submodule update` 来实际拉取子模块。

这样做有点傻，所以 git 让您只需执行 `git submodule update --init` 即可。这将初始化所有子模块，并一步完成更新。我 _总是_ 传递 `--init`，因为这样做没有坏处。

您可以通过在克隆时使用 `--recursive` 来跳过 `--init`：也就是说，您可以使用 `git clone webapp --recursive` 来克隆。不过我从来记不得这样做。另外，无论如何，您最终都得 `git submodule update`。

### 更新子模块的子模块：`git submodule update --recursive`

子模块可以嵌套其他子模块。是的。

因此，要想 _一层一层深入地_ 更新子模块，只需向 `git submodule update` 传递 `--recursive` 即可。

**因此，我最终总是使用 `git submodule update --init --recursive` 命令。**

### 让 Git 自动更新子模块：`git config submodule.recurse true`

`submodule.recurse true` 可以让子模块在您进行 `git pull`、`git checkout` 等操作时自动更新。换句话说，它会让子模块自动指向它们应该指向的地方。它只在 git 2.14 及更新版本中可用。

这个选项让您不需要运行 `git submodule update` 了。

我没有使用这个设置，因为我不确定是否有缺点。另外，我在子模块上做了很多工作，我认为这可能会导致冲突。如果您发现了缺点，或者您一直在使用这个设置而没有问题，请告诉我！

这一设置肯定不适用于 `git clone`。因此，您仍然需要使用 `git clone --recursive` 或使用上面提到的命令来初始化 / 更新子模块。

## 复习

我想我可以很简单地总结一下子模块。

可以将一个仓库嵌入到另一个仓库中，这就是所谓的子模块。

外层仓库的每次提交都会指定子模块的一个 _确切_ 提交。这是通过 `外层提交 -> 树对象 -> 子模块提交` 的链来实现的。

当您切换提交时，git 不会自动帮您更新子模块。您必须使用 `git submodule update` 来更新它们。

就是这样！

## 有关子模块的其他主题

以上所述足以消除您对子模块的困惑。不过，我还想解释一些更常用的命令和配置。

### 如何添加一个子模块：`git submodule add`

比方说我重新开始了 `webapp` 项目，我还没有添加 `library`。

为了添加 `library`，我将会运行 `git submodule add https://github.com/dmazin/library.git library`。

这将添加（或更新）`webapp` 中的 `.gitmodules` 文件，下载 `library`，并将 `webapp` 指向 `library` 的最新提交。

记住，这实际上修改了 `webapp`，所以您需要提交这个修改。但值得庆幸的是，在进行 `git submodule add` 或其他操作后，您不需要进行 `git submodule update`。

### 修改子模块后，我该怎么办？

记住 `library` 是一个完整仓库，所以如果您希望修改它，是可以做到的。只要作出修改并将其提交到主分支即可。

但是如何让 `webapp` 指向新的提交呢？有几种办法。

#### 不使用命令

您可以进入 `webapp`，然后 `cd library`，然后在那儿 `git pull`。在您 `cd` 回到 `webapp` 后，如果您运行 `git diff`，您就能看到 `webapp` 指向了 `library` 的最新提交。您可以提交这个修改。

#### 使用 `git submodule update --remote -- library`

这会告诉 git “让子模块指向最新的远程提交”。由于您已将 `library` 的最新提交推送到了 `library` 的远程，这将使 `webapp` 指向该提交。

但注意 `git submodule update --remote` 会对您的 _所有_ 子模块生效。您可能并不希望这样。

出于这个原因，您可以使用 `git submodule update --remote -- library` 来限制只更新 `library`。（如果您对 `-- library` 感到困惑 —— 是的，它有点奇怪。）

由于 `--remote` 可能会不小心更新所有子模块，所以老实说，我通常采用 “不使用命令” 的方法。

### .gitmodules 文件

Git 是如何知道从哪下载 `library` 的呢？它使用 `.gitmodules` 文件来跟踪子模块的基础信息，例如仓库 URL。

```text
$ [/webapp] cat .gitmodules

[submodule "library"]
        path = library
        url = https://github.com/dmazin/library.git
```

好消息是 `.gitmodules` 是一个普通文件，在 Git 中被通过常规方式跟踪。所以它并不让人感到困惑。

（我不明白的是，为什么 git 不直接把子模块的提交放在 .gitmodules 中？ `webapp` 的提交 _仍然_ 可以指定 `library` 的确切提交。我漏掉了什么？）

### 让子模块使用非主分支

如果您想的话，您可以让 `library` 跟踪任意分支。否则，它会默认使用主分支。

```text
[submodule "library"]
        path = library
        url = https://github.com/dmazin/library.git
        branch = staging
```

感谢阅读！
