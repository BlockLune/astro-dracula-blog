---
abbrlink: aa010e90
categories:
  - CS
  - Tools
  - vcs
date: 2024-01-29 13:37:07
tags:
  - git
  - software-engineering
  - version-control
  - branching
  - merging
title: "Simple Git Tutorial: Branching and Merging"
updated: 2024-11-25 15:49:00
---

Git's powerful branching and merging capabilities can help you deal with parallel collaborative development processes. Let's take a look.

<!--more-->

So far, we've been working on a single default branch created by Git. The name of this branch is `main`. (It used to be `master`. See _[github/renaming: Guidance for changing the default branch name for GitHub repositories](https://github.com/github/renaming)_) Our every commit becomes a new node on this branch.

When we want to add a new feature, but aren't sure if the new feature is good enough to use, the natural thought is that we want to **branch** out based on our current location and do our new feature development and experimentation on the new branch. If it's good, **merge** it into the main branch. Otherwise discard it.

## Branching

The basic commands for working on local branches are listed below:

```bash
# lists all the local branches
git branch

# creates a new local branch named <branch_name>
git branch <branch_name>

# checks out branch <branch_name>
git checkout <branch_name>

# combines the create and check-out commands into one:
git checkout -b <branch_name>

# shows the latest commits of every branch
git branch -v

# renames a local branch
git branch -m <new_branch_name>
git branch -m <old_branch_name> <new_branch_name>

# deletes a local branch
git branch -d <branch_name>
git branch -D <branch_name>  # force
```

All of the above commands work on the **local** branch(es). Then let's take a look at the remote branch(es).

To list all the local and remote branches, run:

```bash
git branch --all
# or
git branch -a
```

When you clone a repo from the Internet, you may find that there is a `main` branch and an `origin/main` branch. Here, `main` is a local branch, and `origin/main` is a remote branch (where `origin` means a remote server called `origin` and `main` means a branch of the same name on that remote server).

In this case, the local branch `main` and the remote branch `origin/main` are related in some way, called **tracking**. The local branch is called the **tracking branch**. The corresponding branch on the remote server is called the **upstream branch**. Usually, the tracking branch shares a name with its upstream branch (e.g., the upstream branch of a local branch `feature` is `origin/feature`), but that's not a requirement.

For example, the commands below create a new local branch `feature` and its upstream branch `origin/feature`:

```bash
git checkout -b feature
git push -u origin feature  # or `git push --set-upstream origin feature`
```

Run the command below to show the connection:

```bash
git branch -vv
```

More commands may be helpful:

```bash
# sets up a new tracking
git checkout --track <server_name>/<branch>
# or
git checkout -b <branch>
git branch -u <server_name>/<branch>

# stops tracking
git brach --unset-upstream <branch>

# deletes a remote branch
git push origin --delete <branch_name>
```

> [!Note]
> There is no direct command to rename a remote branch. But you can do it like this:
>
> ```bash
> git pull origin <old_branch_name>
> git push origin --delete <old_branch_name>
> git branch -m <old_branch_name> <new_branch_name>
> git push -u origin <new_branch_name>
> ```

## Merging

To merge the other branch to this one, run:

```bash
git merge <branch_name>
```

If your current branch is `master`, this command merge `<branch_name>` to `master`.

To show all the branches that have/haven't been merged to this branch, run:

```bash
git branch --merged
git branch --no-merged
```

## Resources

- [Simple Git Tutorial | BlockLune's Blog](/en/posts/simple-git-tutorial)
- [Simple GitHub Tutorial | BlockLune's Blog](/en/posts/simple-github-tutorial)
- _[Git - Reference](https://git-scm.com/docs)_
- _[git - What is a tracking branch? - Stack Overflow](https://stackoverflow.com/questions/4693588/what-is-a-tracking-branch)_
- _[onlywei/explain-git-with-d3: Use D3 to visualize simple git branching operations.](https://github.com/onlywei/explain-git-with-d3)_
