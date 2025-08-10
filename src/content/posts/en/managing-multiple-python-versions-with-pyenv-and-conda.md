---
abbrlink: c7d1762
categories:
  - CS
  - Tools
date: 2024-02-20 15:32:11
tags:
  - python
  - tool
  - environment-management
  - pyenv
  - conda
title: Managing Multiple Python Versions with pyenv and conda
updated: 2024-11-15 12:06:00
---

As a CS student, I often find myself working on projects that require different Python versions, each with its own set of dependencies and libraries. In such scenarios, having a reliable and efficient method for managing these versions becomes crucial. Inspired by _[pyenv 与 conda 双轨制：管理 Python 版本和环境](https://blog.yfi.moe/post/pyenv-conda-together/)_, this blog post aims to document my experience with managing multiple versions of Python using pyenv and conda.

<!--more-->

In this workflow, we use pythons managed by [pyenv](https://github.com/pyenv/pyenv) by default. We'll use `conda activate` to use pythons managed by [conda](https://www.anaconda.com/) when needed.

> [!Note]
> The installation process provided here is only for macOS (and zsh), on other platforms such as Windows you may need to make some changes. The ["Version Control of the Environment" section of this post](/posts/setting-up-your-new-machine-a-simple-dev-environment-configuration-guide/#version-control-of-the-environment) may be helpful.

## Install pyenv

Use Homebrew to install `pyenv`:

```bash
brew install pyenv

echo '# >>> pyenv initialize >>>' >> ~/.zshrc
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
echo '# <<< pyenv initialize <<<' >> ~/.zshrc
```

Restart your zsh for the changes to take effect.

## Use pyenv

```bash
pyenv install --list # shows all versions available
pyenv install 3.12.2 # installs version 3.12.2
pyenv global 3.12.2 # set version 3.12.2 to be used globally in the current machine
pyenv local 3.12.2 # set version 3.12.2 to be used in the current directory and all directories below it
```

## Install conda

Use Homebrew to install `anaconda`:

```bash
brew install anaconda
/opt/homebrew/anaconda3/bin/conda init zsh
```

Restart your zsh for the changes to take effect.

Run the following command to disable conda's ability to automatically activate the base environment，if you need:

```bash
conda config --set auto_activate_base false
```
