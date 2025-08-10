---
title: 使用 pyenv 和 conda 管理多个 Python 版本
tags:
  - python
  - tool
  - environment-management
  - pyenv
  - conda
date: 2024-11-15 11:46:00
---

作为一名计科专业的学生，我经常发现自己的项目需要不同的 Python 版本，每个版本都有自己的依赖关系和库。在这种情况下，拥有一种可靠而高效的方法来管理这些版本就变得至关重要。受 _[pyenv 与 conda 双轨制：管理 Python 版本和环境](https://blog.yfi.moe/post/pyenv-conda-together/)_ 的启发，这篇博文旨在记录我使用 pyenv 和 conda 管理 Python 多个版本的经验。

<!--more-->

在本工作流中，我们默认使用由 [pyenv](https://github.com/pyenv/pyenv) 管理的 `python`。需要时，我们将使用 `conda activate` 来使用由 [conda](https://www.anaconda.com/) 管理的 `python`。

> [!Note]
> 这里提供的安装过程仅适用于 macOS（和 zsh），在 Windows 等其他平台上可能需要做一些更改。[此文的 “环境的版本控制” 部分](/zh/posts/setting-up-your-new-machine-a-simple-dev-environment-configuration-guide/#环境的版本控制)可能会对您有所帮助。

## 安装 pyenv

使用 Homebrew 安装 `pyenv`：

```bash
brew install pyenv

echo '# >>> pyenv initialize >>>' >> ~/.zshrc
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
echo '# <<< pyenv initialize <<<' >> ~/.zshrc
```

重启 zsh 使更改生效。

## 使用 pyenv

```bash
pyenv install --list # 显示所有可用版本
pyenv install 3.12.2 # 安装 3.12.2 版本
pyenv global 3.12.2 # 设置当前机器全局使用的版本 3.12.2
pyenv local 3.12.2 # 设置当前目录及其下所有目录使用 3.12.2 版本
```

## 安装 conda

使用 Homebrew 安装 `anaconda`：

```bash
brew install anaconda
/opt/homebrew/anaconda3/bin/conda init zsh
```

重新启动 zsh 使更改生效。

如果需要，运行以下命令禁用 conda 自动激活基础环境的功能：

```bash
conda config --set auto_activate_base false
```
