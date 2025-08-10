---
title: 简明 Git 教程
tags:
  - git
  - version-control
  - software-engineering
  - tool
  - collaboration
date: 2024-11-12 08:20:00
updated: 2024-11-27 11:13:00
---

本文是一篇面向初学者的 Git 的教程，也可以当作一篇 Git 基础命令的备忘录。此文也包括了一些关于 GitHub 的信息，但如果您想更深入了解，请阅读[《简明 GitHub 教程》](/posts/simple-github-tutorial)。

<!--more-->

## 简介

您可能早就听过 Git 和 GitHub，也可能因为它们相似的名字而感到困惑。这两个东西到底是什么？

![Git (图片来源于互联网)](https://webp.blocklune.cc/blog-imgs/cs/tools/vcs/simple-git-tutorial/1.png)

![GitHub (图片来源于互联网)](https://webp.blocklune.cc/blog-imgs/cs/tools/vcs/simple-git-tutorial/2.png)

简而言之，[Git](https://git-scm.com/) 是一个 **版本控制系统（Version Control System, VCS）**，它允许您创建一个代码仓库，跟踪项目中的变化，并高效地管理文件。[GitHub](https://github.com/) 是一个用于托管远程 Git 仓库的平台，用于协作和共享项目。

在这篇文章中，您将学习 Git 的基本用法。

## 安装 Git

从官方网站下载 Git：

- _[Git - 下载 (git-scm.com)](https://git-scm.com/downloads)_

或者使用您喜欢的包管理器自行安装。例如，使用 `apt`：

```bash
sudo apt update
sudo apt install git
```

## 基本配置

在开始使用 Git 之前，您应该告诉 Git 您的名字和电子邮件地址。运行以下命令以全局设置您的名字和电子邮件地址：

```bash
git config --global user.name "<your_name>"
git config --global user.email "<your_email@example.com>"
```

> [!Tip]
> 强烈建议您将 `<your_name>` 设置为您的 GitHub 用户名，并将 `<your_email>` 设置为您的 GitHub **无回复** 电子邮件地址，格式为 `ID+USERNAME@users.noreply.github.com`。您可以在 [这里](https://github.com/settings/emails) 找到无回复电子邮件地址（在 `主要电子邮件地址` 部分下）。

更多信息：

- _[在 Git 中设置用户名 - GitHub 文档](https://docs.github.com/zh/get-started/getting-started-with-git/setting-your-username-in-git)_
- _[设置提交电子邮件地址 - GitHub 文档](https://docs.github.com/zh/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address)_

您还可以设置默认编辑器和默认差异（diff）工具。这里我设置为 VS Code。

```bash
# 默认编辑器
git config --global core.editor 'code --wait'

# 默认差异工具
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'

# 默认合并工具
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

更多信息：

- _[How to use VS Code as your Git editor, difftool, and mergetool](https://www.roboleary.net/vscode/2020/09/15/vscode-git.html)_

## 获取帮助

要在使用 Git 时获取帮助，请运行：

```bash
git help <动词>
# 或
git <动词> --help
# 或
man git-<动词>
```

例如，如果您想要获取 `git add` 的帮助，就输入：

```bash
git help add
```

## 获取 Git 仓库

是时候准备一个 Git 仓库了，有两种选择：

### 在现有目录中创建一个

要在当前目录中创建一个新的 Git 仓库，请运行：

```bash
git init
```

此命令将创建一个名为 `.git` 的目录。

### 从现有的仓库克隆一个

请参阅[《简明 GitHub 教程》](/zh/posts/simple-github-tutorial)。

## Git 项目中的文件状态

Git 中有三个主要状态：**已修改**、**已暂存**和**已提交**。这将 Git 项目分为三个主要部分：`工作目录`、`暂存区`和 `Git 目录`。

您在 `工作目录` 中修改文件，将它们暂存（使用 `git add`）到 `暂存区`，并将它们提交（使用 `git commit`）到 `Git 目录`。

当提交后，就会产生一条 Commit 记录，您可以把它理解为对您代码仓库的一个 “快照”。

> [!Tip]
> 请不要误解这里所说的 “提交”！这里的所有操作均发生在您的本地 Git 仓库。

更多信息请参阅 _[《Git - Git 是什么？》](https://git-scm.com/book/zh/v2/%e8%b5%b7%e6%ad%a5-Git-%e6%98%af%e4%bb%80%e4%b9%88%ef%bc%9f)_。

## 跟踪文件

要将文件添加到您的跟踪列表（或更准确地说，将文件放入 `暂存区`），请运行：

```bash
git add <目录>/<文件>
```

要撤消 `git add`（取消暂存文件）：

- 使用 `git reset`：

```bash
git reset        # 取消暂存所有文件
git reset <文件>  # 取消暂存特定文件
```

- 使用 `git restore`：

```bash
git restore --staged <文件>   # 取消暂存特定文件
git restore --staged :/      # 取消暂存所有文件
```

- 使用 `git rm`：

```bash
git rm --cached <文件>
```

> [!Note]
> `git reset` 等同于 `git restore --staged :/`。`git reset <文件>` 等同于 `git restore --staged <文件>`。但是 `git rm --cached <文件>` 是独一无二的。实际上，它意味着从 `暂存区` 中删除 `<文件>`，而其他两个命令将 `<文件>` 从 `暂存区` 移回 `工作目录`。

## 检查状态

要检查仓库中文件的状态，请运行：

```bash
git status

# 简短版本
git status -s
# 或
git status --short
```

在简短版本中，每行前面有两列。左列显示 `暂存区` 的状态。右列显示 `工作目录` 的状态。例如：

- `??`：未跟踪的文件
- `A`：新添加到暂存区的文件
- `M`：修改过的文件

## 检查差异（diff）

```bash
# 显示未暂存、未提交的更改
git diff

# 显示所有未提交的更改（包括暂存的更改）：
git diff HEAD

# 只显示暂存的更改
git diff --staged
git diff --cached
```

## 提交

要提交文件，请运行：

```bash
git commit
```

此命令将打开一个编辑器。您需要在这里编辑您的提交消息。使用以下命令设置默认编辑器：

```bash
git config --global core.editor <编辑器路径或命令>
```

或者，您可以使用 `-m` 选项简化此过程：

```bash
git commit -m <提交消息>
```

“哦！我漏掉了一个文件！”如果您遇到这个问题，您可以这样修改：

```bash
git commit -m "错误的提交消息"
git add <漏掉的文件>
git commit --amend
```

第二次提交将 **替换** 第一次提交，就像第一次提交从未发生过一样。

如果您厌倦了使用暂存区（先 `git add`，然后 `git commit`），您可以使用 `-a` 选项：

```bash
git commit -a
```

此命令等同于以下两个命令：

```bash
git add <所有已跟踪的修改过的文件>
git commit
```

> [!Note]
> 如果您想编写更好的提交消息，以下链接可能会有所帮助：
>
> - _[How to Write Better Git Commit Messages – A Step-By-Step Guide](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)_
> - _[ohmyzsh/plugins/git-commit at master · ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git-commit)_

要查看提交历史，请运行：

```bash
git log
```

- `-p` 或 `--patch` 标志使日志以补丁方式输出。
- `-<n>` 标志限制日志的数量（例如 `-2` 只显示最近两条日志）。
- `--stat` 标志显示简单的统计信息。
- `--pretty` 选项提供了多种显示历史的方式。
  - `--pretty=oneline` 选项使每个提交都显示在一行中
  - `--pretty=short`
  - `--pretty=full`
  - `--pretty=fuller`
- `--graph` 标志添加了一些 ASCII 字符，以花哨的方式输出日志。

我为下面的命令添加了 `glog` 这样一个别名，还挺有用的：

```bash
git log --oneline --decorate --graph
```

## 暂存更改

有时，您可能希望暂时保存您工作区的更改，但并不希望将其作为 Commit 提交。例如，您已经开始了您的工作，编辑了几个文件，此时您才想起来您忘记使用 `git pull` 拉取最新的更改。在这些情形下，您可以使用 `git stash` 命令：

```bash
git stash # 保存当前未提交的改动
git stash pop # 恢复最近一次 stash 的改动，并从 stash 列表中移除
git stash clear # 清空 stash 列表
```

默认情况下，它不会保存未跟踪（未使用 `git add`）的文件。为了包括这些文件，您可以使用选项 `-u`。

了解更多：

- _[How to Use Git Stash to Efficiently Manage Your Code](https://www.freecodecamp.org/news/how-to-use-git-stash-to-manage-code/)_

## 丢弃工作目录中的更改

> [!Caution]
> 在 Git 中，恢复已提交的文件通常很容易，但恢复未提交的文件通常 **非常困难**。

要丢弃工作目录中的更改，请运行：

```bash
git checkout -- <文件>
```

此命令将放弃自上次提交以来对文件所做的修改，其中 `--` 表示以下内容应被视为文件参数，即使它们类似于选项。

如果希望丢弃所有新增（即未跟踪的文件）和更改，请运行：

```bash
git reset HEAD --hard
```

## 清理未跟踪的文件和/或目录

```bash
git clean # 删除 Git 未跟踪的文件
git clean -d # 删除目录
git clean -x # 删除未跟踪的文件，包括 `.gitignore` 和 `.git/info/exclude` 中的忽略文件
```

## 优化本地 Git 存储

使用 `git gc` 命令可以优化本地 Git 仓库的存储：

```bash
git gc --aggressive --prune=now
```

- `--aggressive` 选项告诉 Git 尽可能多地优化存储，但可能会花费更多时间。
- `--prune=now` 选项告诉 Git 立即删除不再需要的对象。

## 资源

- [简明 Git 教程：分支与合并 | BlockLune's Blog](/zh/posts/simple-git-tutorial-branching-and-merging)
- [简明 GitHub 教程 | BlockLune's Blog](/zh/posts/simple-github-tutorial)
- _[Git - Reference](https://git-scm.com/docs)_
- _[GitHub Docs](https://docs.github.com/)_
- _[GitHub Training Kit](https://training.GitHub.com/)_
- _[MIT - Missing Semester - Version Control (Git)](https://missing.csail.mit.edu/2020/version-control/)_
- _[Oh Shit, Git!?!](https://ohshitgit.com/)_
- _[Pro Git](https://git-scm.com/book/en/v2)_
- _[git - the simple guide - no deep shit!](http://rogerdudler.GitHub.io/git-guide/index.html)_
