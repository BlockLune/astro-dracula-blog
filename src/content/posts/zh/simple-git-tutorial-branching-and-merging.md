---
title: 简明 Git 教程：分支与合并
tags:
  - git
  - software-engineering
  - version-control
  - branching
  - merging
date: 2024-11-25 14:58:00
updated: 2024-11-25 15:49:00
---

Git 强大的分支与合并功能可以应对并行协作的开发情形。一起来看看吧！

<!--more-->

目前，我们的所有工作都发生在一个由 Git 创建的默认分支上，它的名字是 `main`（过去是 `master`，参考 _[github/renaming: Guidance for changing the default branch name for GitHub repositories](https://github.com/github/renaming)_）。我们的每一个 Commit 都成为了这个默认分支上的一个节点。

当我们想添加新功能，但又不确定新功能是否有效或有必要时，我们自然会想到从现在我们所处的位置 **分支（Branch）** 出去，在新分支上进行新功能开发和实验。如果效果不错，就将其 **合并（Merge）** 到主分支，否则就丢弃。

## 分支

下面是一些用于操作本地分支的命令：

```bash
# 列出所有本地分支
git branch

# 创建一个名为 <branch_name> 的分支
git branch <branch_name>

# 切换到 <branch_name> 分支
git checkout <branch_name>

# 下面这个命令将创建并切换到 <branch_name> 分支
git checkout -b <branch_name>

# 查看每个分支的最新 Commit
git branch -v

# 重命名某个分支
git branch -m <new_branch_name> # 重命名当前分支
git branch -m <old_branch_name> <new_branch_name>

# 删除本地分支
git branch -d <branch_name>
git branch -D <branch_name>  # 强制删除
```

上面所有的命令均用于操作 **本地分支**。为了显示本地和 **远程** 分支：

```bash
git branch --all
# 或者
git branch -a
```

在您将一个仓库克隆到本地后，你会看到名为 `main` 和 `origin/main` 的两个分支。此处的 `main` 是一个本地分支，而 `origin/main` 是一个远程分支（其中的 `origin` 指代了一个别名为 `origin` 的远程仓库地址，`main` 表示远程仓库中的同名分支）。

在这种情形下，本地分支 `main` 和远程分支 `origin/main` 是以某种形式联系在一起的，这叫做 **跟踪（Tracking）**。本地分支叫作 **跟踪分支（Tracking Branch）**，相关联的远程分支叫作 **上游分支（Upstream Branch）**。通常，跟踪分支与上游分支会采用相同的名字（例如，上游分支叫 `origin/feature`，相应的跟踪分支叫 `feature`），但那不是强制性的。

下面的命令创建一个名为 `feature` 的跟踪分支，其上游分支是 `origin/feature`：

```bash
git checkout -b feature
git push -u origin feature  # 或者 `git push --set-upstream origin feature`
```

运行下面的命令来查看分支的关联关系：

```bash
git branch -vv
```

一些其他命令：

```bash
# 创建一个新的跟踪
git checkout --track <server_name>/<branch>
# 或者
git checkout -b <branch>
git branch -u <server_name>/<branch>

# 取消跟踪
git brach --unset-upstream <branch>

# 删除远程分支
git push origin --delete <branch_name>
```

> [!Note]
> 没有直接重命名远程分支的命令，但您可以组合下面的命令来做到这一点：
>
> ```bash
> git pull origin <old_branch_name>
> git push origin --delete <old_branch_name>
> git branch -m <old_branch_name> <new_branch_name>
> git push -u origin <new_branch_name>
> ```

## 合并

下面的命令将名为 `<branch_name>` 的分支合并到当前分支：

```bash
git merge <branch_name>
```

To show all the branches that have/haven't been merged to this branch, run:

下面的命令分别列出 已经 / 尚未 合并到当前分支的分支：

```bash
git branch --merged
git branch --no-merged
```

## 资源

- [简明 Git 教程 | BlockLune's Blog](/zh/posts/simple-git-tutorial)
- [简明 GitHub 教程 | BlockLune's Blog](/zh/posts/simple-github-tutorial)
- _[Git - Reference](https://git-scm.com/docs)_
- _[git - What is a tracking branch? - Stack Overflow](https://stackoverflow.com/questions/4693588/what-is-a-tracking-branch)_
- _[onlywei/explain-git-with-d3: Use D3 to visualize simple git branching operations.](https://github.com/onlywei/explain-git-with-d3)_
