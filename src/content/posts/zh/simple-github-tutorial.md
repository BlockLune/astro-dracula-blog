---
title: 简明 GitHub 教程
tags:
  - git
  - software-engineering
  - ssh
  - github
  - version-control
date: 2024-11-12 08:58:00
updated: 2024-11-25 15:49:00
---

我之前写了一篇[关于 Git 的教程](/posts/simple-git-tutorial)。在这篇文章中，我将介绍 GitHub 这个与 Git 密不可分的平台。

<!--more-->

正如在介绍 Git 的文章中提到的，GitHub 是一个用于托管远程 Git 仓库的平台。您可以将其简单理解为一个云盘，用于同步（上传、下载）您的代码文件，并且您还可以借助该平台与其他开发者进行沟通交流。

> [!Note]
> 如果您遇到了任何问题，建议您查询 [GitHub Docs](https://docs.github.com/)，使用搜索引擎搜索，或者询问一个 AI 助手。您也可以通过[邮箱](mailto:i@blocklune.cc)联系我。

## 创建一个 GitHub 账户

请参考：

- _[开始使用 GitHub 帐户 - GitHub 文档](https://docs.github.com/zh/get-started/onboarding/getting-started-with-your-github-account)_

## 检查您的本地 Git 配置

请确保您已经设置了 Git 用户名和邮箱，这意味着您运行过类似下面的命令：

```bash
git config --global user.name YOUR_NAME
git config --global user.email YOUR_EMAIL
```

了解更多:

- _[Basic Configuration - Simple Git Tutorial](posts/simple-git-tutorial/#basic-configuration)_
- _[在 Git 中设置用户名 - GitHub 文档](https://docs.github.com/zh/get-started/getting-started-with-git/setting-your-username-in-git)_
- _[设置提交电子邮件地址 - GitHub 文档](https://docs.github.com/zh/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address)_

## 使用 SSH 连接到 GitHub

建议您使用 SSH 连接到 GitHub，为此：

首先，创建一对 SSH 密钥。下面的命令使用本地的 `ssh-keygen` 程序生成一对 ED25519 算法生成的密钥对，并使用 `YOUR_EMAIL` 作为注释：

```bash
ssh-keygen -t ed25519 -C YOUR_EMAIL
```

一直按回车，直到回到您的命令提示符。

然后前往 GitHub 添加公钥：

1. 转到 _[SSH and GPG keys - GitHub](https://github.com/settings/keys)_。
2. 点击页面右上方绿色的 `New SSH key`（新建 SSH 密钥）按钮。
3. 填写表格，其中 `key` 是 `~/.ssh/id_ed25519.pub` 的内容（该文件由上述 `ssh-keygen` 命令生成。您可以在 Linux 或 Mac 上运行 `cat ~/.ssh/id_ed25519.pub` 或在 Windows 上运行 `notepad ~/.ssh/id_ed25519.pub` 查看其内容）。
4. 点击绿色的 `Add SSH key`（添加 SSH 密钥）按钮，提交表格。

> [!Tip]
> 后缀“.pub ”表示 “id_ed25519.pub” 文件是公钥。上面的 `ssh-keygen` 命令也会生成私钥文件 `id_ed25519` （没有后缀 `.pub`）。

了解更多：

- _[通过 SSH 连接到 GitHub - GitHub 文档](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)_

## 通过 HTTPS 端口使用 SSH（可选但建议使用）

由于国内特殊的网络环境，您可能经常需要使用代理服务来获得更好的浏览体验。一般来说，启用 “系统代理” 选项后，只有 80/443 端口（对应 HTTP/HTTPS）上的流量会通过代理服务器，而 SSH 默认的 22 端口上的流量不会通过代理服务器。通过以下设置，可以强制 SSH 流量通过 443 端口。

要测试 SSH 是否可以通过 HTTPS 端口，请运行

```bash
ssh -T -p 443 git@ssh.github.com
```

如果看到类似信息，请键入 `yes` ：

```text
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

如果收到类似下面的回复，说明没问题，可以进行下一步了：

```text
Hi USERNAME! You've successfully authenticated, but GitHub does not
provide shell access.
```

现在您可以覆盖 SSH 设置，强制通过该服务器和端口连接 GitHub.com。编辑 `~/.ssh/config` 并添加以下部分：

```text
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
```

现在，您可以像往常一样执行命令了：

```bash
git clone git@github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

等同于

```bash
git clone ssh://git@ssh.github.com:443/YOUR-USERNAME/YOUR-REPOSITORY.git
```

另请参见：

- _[在 HTTPS 端口使用 SSH - GitHub 文档](https://docs.github.com/zh/authentication/troubleshooting-ssh/using-ssh-over-the-https-port)_

## 基本概念与用法

### 克隆仓库

**仓库（Repository, Repo）** 是 Git 中的概念，指的是存放您代码的地方。仓库可以分为本地仓库和远程仓库。您可以使用 `git clone` 命令从 GitHub 上克隆一个仓库，即基于一个远程仓库克隆一个本地仓库。命令格式如下：

```bash
git clone URL [LOCAL_DIRECTORY_NAME]
```

方括号中的 `LOCAL_DIRECTORY_NAME` 为可选项。

在任一 GitHub 仓库的首页，您都可以找到一个绿色的 `Code` 按钮，点击它，会弹出一个选项卡，包括 HTTPS 和 SSH 标签页（您必须登录才能看到 SSH 标签页）。对于您没有编辑、修改权限的公共仓库，您可以使用它的 HTTPS 链接来克隆；如果您希望编辑某个仓库，您必须使用对应的 SSH 链接。

![Code 按钮](https://webp.blocklune.cc/sip/2024/11/18/my9nh-7r.webp)

> [!Tip]
> 如果您一不小心已经使用了 HTTPS 链接克隆了您希望编辑的仓库，您可以在本地仓库执行下面的命令以更新您的仓库远程地址为 SSH 版本的链接（命令中的 `origin` 其实是一个 “别名”，用于指示这是哪一个远程 Git 仓库）：
>
> ```bash
> git remote set-url origin SSH_URL
> ```
>
> 使用下面的命令来检查更改是否生效：
>
> ```bash
> git remote -v
> ```
>
> 输出应该类似于：
>
> ```text
> origin    git@github.com:YOUR_NAME/YOUR_REPOSITORY.git (fetch)
> origin    git@github.com:YOUR_NAME/YOUR_REPOSITORY.git (push)
> ```

如果想在克隆时指定分支，可以使用 `-b` 选项：

```bash
git clone -b BRANCH URL
```

如果不想包含所有 Commits，可以使用 `--depth` 选项。这对克隆大型仓库很有帮助：

```bash
git clone URL --depth=1
```

### 问题，拉取请求

**问题（Issue）** 和 **拉取请求（Pull Request, PR）** 是 GitHub 上两种最重要的协作功能。通过 “问题”，您可以指出某个代码库中的问题、提出改进意见、请求添加新功能等；通过 “拉取请求”，您可以请求某个代码库的管理者合并您提交的代码，以实现对该代码库的贡献。

### GitHub 工作流

没有什么比通过例子学习更能让你快速掌握如何使用 GitHub 了。下面给出两个 GitHub 工作流，以帮助您更好地理解 GitHub 的基本概念与用法。

#### 小组作业

下面这个示例工作流假设您正希望与小组成员共同完成一个项目，并假设您是组长，承担着创建和管理仓库的职责：

1. 首先，前往 GitHub 首页，点击上方工具栏右侧的加号按钮，在下拉栏中点击 `New repository`。
2. 填写仓库的基本信息，包括仓库名（Repository name）等，并确定仓库类型（默认是 Public 公开仓库，但在小组作业这样一个情境下，可能您更希望它是 Private 私有的）。完成后，点击页面右下角的 `Create repository` 按钮。

![创建仓库](https://webp.blocklune.cc/sip/2024/11/18/nzhss-ac.webp)

3. 创建完成后，会自动跳转到仓库页面：

![仓库页面](https://webp.blocklune.cc/sip/2024/11/18/o8e82-pl.webp)

4. 按照页面的提示在本地执行相应的命令（首先记得改成 `SSH`）：

- 如果您还没有在本地建立仓库，那就新建一个目录（例如名为 `teamwork-example`），然后 `cd` 进去，有选择地执行下面的命令：

```bash
echo "# teamwork-example" >> README.md # 创建一个 README.md 文件
git init # 初始化 Git 仓库
git add README.md # 将这个新建的 README.md 添加到暂存区
git commit -m "first commit" # Commit，其中 commit message 为 first commit
git branch -M main # 将当前分支名更改为 main
git remote add origin git@github.com:YOUR-NAME/teamwork-example.git # 添加一个名为 origin 的远程仓库
git push -u origin main # 推送到名为 origin 的远程仓库的 main 分支
```

- 如果您已经在本地建立了仓库，那就直接 `cd` 进去，执行下面的命令：

```bash
git remote add origin git@github.com:YOUR-NAME/teamwork-example.git # 添加一个名为 origin 的远程仓库
git branch -M main # 将当前分支名更改为 main
git push -u origin main # 推送到名为 origin 的远程仓库的 main 分支
```

5. 回到 GitHub 仓库页，现在您应该可以在这里看到您的代码了。

6. 到目前为止，仅有您拥有对此仓库的编辑权限。如果您希望邀请您的小组成员，可以点击上方工具栏的 `Settings`，在左侧的 `Access` 板块选择 `Collaborators`，并点击右侧的 `Add people` 按钮：

![添加协作者](https://webp.blocklune.cc/sip/2024/11/18/q50fd-hs.webp)

被邀请的协作者会收到一封邮件通知，按照邮件中的提示操作，最终协作者就能获得该仓库的编辑权限了。然后，协助者可以使用 SSH 链接克隆该仓库，并按照常规的 Git 工作流在本地进行修改，最后使用 `git push` 将更改推送到远程仓库。待该协作者推送后，其他协作者可以使用 `git pull` 来拉取最新的更改。

> [!Important]
> 在多编辑者的情况下，分支管理变得更为复杂。一个良好的习惯是，每个编辑者都在开始工作前执行 `git pull` 以拉取最新的更改，并在各自的功能分支上进行开发，而不是直接在主分支上工作。这样可以避免直接冲突，并使代码审查和合并变得更容易管理。此外，还可以使用在下面一个示例工作流中介绍的 PR 功能，以实现更高效的协作。

#### 为一个开源项目贡献代码

下面这个示例工作流假设您正希望为一个开源项目贡献代码：

1. 首先，进入开源项目的首页，点击右上角的 Fork 按钮。

![Fork 按钮](https://webp.blocklune.cc/sip/2024/11/18/mya7c-u8.webp)

2. 在自动跳转到的新建 Fork 页面，按您的需要自定义相关信息，或者保持默认，然后点击 `Create fork` 按钮。

![创建 Fork 页面](https://webp.blocklune.cc/sip/2024/11/18/mya6f-uo.webp)

3. 现在您应该跳转到了一个同名仓库（如果您在上一步中没有修改默认设置的话）。在这个仓库的仓库名下，还标注了此仓库的 Fork 来源。例如在下图中，公共仓库为 `withastro/astro`，我的 GitHub 用户名为 BlockLune，我 Fork 得来的这个仓库就叫作 `BlockLune/astro`。

![Fork 得来的仓库](https://webp.blocklune.cc/sip/2024/11/18/nojpa-0f.webp)

4. 使用 SSH 链接克隆该仓库到本地，形式为：

```bash
git clone SSH_URL
```

5. 在终端中进入项目的根目录，输入下面的命令新建一个分支并切换到它。其中的 `BRANCH_NAME` 分支名一定是具有描述性的，并应该符合该项目的相关约定（例如如果您正希望为该项目添加一个打招呼的新功能，您的分支名可能是 `feature/greeting`）：

```bash
git checkout -b BRANCH_NAME
```

6. 执行您的 Git 工作流。例如：编辑文件，并适时地使用 `git add` 和 `git commit` 保存更改（其中的 commit message 也需要注意描述性和符合项目约定），然后使用 `git push` 将更改推送到您 Fork 得来的仓库。

7. 在您认为您的更改已经完成后，回到 GitHub，并前往这个项目的公共仓库地址。点击上方的 `Pull requests` 进入拉取请求标签页，然后点击右侧的绿色 `New pull request` 按钮。

![新建 PR 页面](https://webp.blocklune.cc/sip/2024/11/18/my9o5-cg.webp)

8. 在新建拉取请求页面，分别选择 `base` 和 `compare` 分支。`base` 表示您希望推送（Push）到的分支；`compare` 表示您刚刚写的新功能所在的分支（例如 `feature/greeting`），即您希望对方拉取（Pull）的分支。选择完成后，点击绿色的 `Create pull request` 按钮。

9. 页面将自动跳转至一个新的拉取请求页面。您可以在此页与仓库的维护者或其他人员一起沟通交流，并针对发现的问题、可能的改进等继续提交新的 commits 到此分支。观察该页面的 URL，它形如 `https://github.com/REPO_OWNER/REPO/pull/ID`。其中 ID 是自增得来的，Issue 和 PR 共同自增，仓库的第一个 Issue 或 PR 的 ID 就是 `#1`，第二个就是 `#2` 等等。

10. 如果您的这个分支的工作室是修复某个问题（例如 `#2`），您还可以在描述文本中添加 `Close #2` 等关键词来将您的这个 PR 关联到那个 Issue，并在该 PR 被合并时自动关闭关联的 Issue。关于将 PR 与 Issue 相关联的更多信息，请参考 _[将拉取请求链接到议题 - GitHub 文档](https://docs.github.com/zh/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword%23linking-a-pull-request-to-an-issue-using-a-keyword)_。

11. 接下来的步骤将会是仓库所有者的工作：他将审查您的代码，并在确认无误后合并您的分支（即完成拉取操作）。合并完成后，贡献分支中的 Commits 都会以某种形式合并进上面的 `base` 分支，此时就可以安全地将贡献分支（即上面的 `compare` 分支）删除了。

> [!Tip]
> 通过这个工作流，现在您应该能够理解 “拉取请求（PR）” 的含义：您 Fork 了原始仓库，并将您的贡献推送（Push）到了这个仓库，所以您希望请求（Request）原始仓库拉取（Pull）您贡献的这些内容，这就是 “拉取请求（PR）”。

了解更多：

- _[Hello World - GitHub 文档](https://docs.github.com/zh/get-started/start-your-journey/hello-world#step-1-create-a-repository)_
- _[GitHub 流 - GitHub 文档](https://docs.github.com/zh/get-started/using-github/github-flow)_

### 相关 Git 命令一览

```bash
# 添加一个新的远程服务器
git remote add NAME URL

# 删除一个远程服务器
git remote remove NAME

# 显示所有远程服务
git remote -v

# 重命名一个远程服务器
git remote rename OLD_NAME NEW_NAME

# 显示特定名称远程服务器的一些信息
git remote show NAME

# push
git push -u NAME BRANCH # 或者 `git push --set-upstream NAME BRANCH`

# fetch
git fetch  # 从默认服务器（一般为 origin）拉取
git fetch NAME # 从特定名字的服务器拉取

# fetch & merge
git pull
```

## 仓库统计信息

您可以在 GitHub 仓库页面的右侧看到 `Languages` 板块，显示了这个仓库所使用的语言信息。这个信息是由 [github-linguist/linguist](https://github.com/github-linguist/linguist) 生成的。

有时您可能希望对此处信息进行一些控制（例如您可能希望将 Jupyter Notebook 归类到 Python），所以了解它们是从何而来的会有点用。为了进行上述控制，一个可能的方法是使用 `.gitattributes`，例如：

```text
*.ipynb linguist-language=Python
```

了解更多：

- [linguist/docs/overrides.md at main · github-linguist/linguist](https://github.com/github-linguist/linguist/blob/main/docs/overrides.md#using-gitattributes)

## GitHub 个人资料

您可以创建一个与您的 GitHub 用户名同名的仓库，并往其中添加一个 `README.md` 文件，以创建一个个人简介页面。这个页面会显示在您的 GitHub 个人页面。例如，我的仓库是 [BlockLune/BlockLune](https://github.com/BlockLune/BlockLune)，显示在 [我的 GitHub 个人页面](https://github.com/BlockLune)。

很多人会选择在这里添加一些统计信息。GitHub 上实际上有很多专门的项目用于生成这些统计信息，例如：

- [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
- [ryo-ma/github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy)
- [DenverCoder1/github-readme-streak-stats](https://github.com/DenverCoder1/github-readme-streak-stats)

了解更多：

- [自定义个人资料 - GitHub 文档](https://docs.github.com/zh/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile)

## 资源

- [简明 Git 教程 | BlockLune's Blog](/zh/posts/simple-git-tutorial)
- [简明 Git 教程：分支与合并 | BlockLune's Blog](/zh/posts/simple-git-tutorial-branching-and-merging)
- _[GitHub Docs](https://docs.github.com/)_
