---
title: 《tmux Productive Mouse-Free Development》阅读笔记
tags:
  - tmux
  - terminal
  - unix
  - productivity
  - shell
  - note
date: 2023-08-05 11:47:53
---

_tmux Productive Mouse-Free Development_ 的阅读笔记。这本书的作者是 Brian P. Hogan。

<!--more-->

## 基础

### 启动 tmux

要启动 tmux：

```bash
tmux
```

退出：

```bash
exit
```

创建带名会话：

```bash
tmux new-session -s basic  # 创建一个名为 "basic" 的会话
# or
tmux new -s basic
```

### 从会话分离和附加到会话

为了从当前 tmux 会话中分离，按：

`Ctrl`-`b` 然后 `d`

其中的 `d` 表示 "detach"，即分离。

如果您已经修改了您的 `Prefix`，请将 `Ctrl`-`b` 更改为您自己的 `Prefix`。

#### 重新附加到现有会话

我们可以使用以下命令列出现有的 tmux 会话：

```bash
tmux list-sessions
# or
tmux ls
```

要附加到特定会话，可以使用 `attach` 关键字。

如果我们只有一个正在运行的会话，我们可以使用以下命令附加到它：

```bash
tmux attach
```

如果我们使用下面的命令在后台创建了一个新的 tmux 会话：

```bash
tmux new -s second_session -d
```

我们可以使用 `-t` 选项附加到这个会话：

```bash
tmux attach -t second_session
```

#### 销毁会话

我们可以在会话中键入 `exit` 来销毁该会话，也可以使用 `kill-session` 命令：

```bash
tmux kill-session -t basic
tmux kill-session -t second_session
```

### 使用窗口

窗口类似于 Web 浏览器中的标签。

通过使用 `-n` 选项，我们可以为会话中的第一个窗口命名：

```bash
tmux new -s windows -n shell
```

#### 创建和命名窗口

为了在当前会话中创建一个窗口，按：

`Prefix` `c`

创建这样一个窗口后，您会自动进入这个窗口。即 Focus 在这个窗口上。

为了重命名它，按：

`Prefix` `,`

#### 在窗口中移动

我们可以使用 `Prefix` `n`（下一个窗口）或 `Prefix` `p`（上一个窗口）在窗口之间循环。

默认情况下，tmux 中的窗口都有一个数字，从 0 开始。我们可以使用 `Prefix` `0` 快速跳转到第一个窗口，使用 `Prefix` `1` 跳转到第二个窗口。

按下 `Prefix` `f` 按名称查找窗口（如果我们命名了窗口）。

按下 `Prefix` `w` 显示窗口的可视菜单，以便我们可以选择我们想要的窗口。

按下 `Prefix` `&` 或键入 `exit` 关闭当前窗口。

### 使用面板

`Prefix` `%` 将当前面板分割为水平布局。

`Prefix` `"` 将当前面板分割为垂直布局。

为了循环切换面板，按 `Prefix` `o`。

使用 `Prefix` `Up` / `Down` / `Left` / `Right` 来移动焦点。

#### 关闭面板

按下 `Prefix` `x` 或键入 `exit`。

### 使用命令模式

要进入命令模式，按 `Prefix` `:`。

### 下一步

按 `Prefix` `?` 获取所有预定义 tmux 绑定的列表以及相关的命令。

## 配置 tmux

### .tmux.conf 文件简介

默认情况下，tmux 在两个地方查找配置设置。首先在 `/etc/tmux.conf` 中查找系统范围的配置。然后在当前用户的主目录（`~`）中查找名为 `.tmux.conf` 的文件。

#### 定义新的 Prefix

许多 tmux 用户最初使用 GNU-Screen，它使用 `Ctrl`-`a` 作为其命令前缀。

为了重新定义我们的 tmux 前缀为 `Ctrl`-`a`，将以下代码添加到我们的 `.tmux.conf` 文件中：

```text
set-option -g prefix C-a
# or
set -g prefix C-a
```

其中 `-g` 开关，表示 "global"，为我们创建的所有 tmux 会话设置选项。

我们可以使用 `unbind-key` 或 `unbind` 命令来删除一个键绑定：

```text
unbind C-b
```

进入 tmux 的命令模式，按 `Prefix` `:` 并键入以下内容以应用更改：

```text
source-file ~/.tmux.conf
```

#### 修改默认延迟

tmux 在发送命令时会添加一个非常小的延迟，这个延迟可能会影响其他程序，比如 Vim 文本编辑器。我们可以设置这个延迟，使其更加响应式：

```text
set -sg escape-time 1
```

#### 设置窗口和面板的基索引

默认索引从零开始。我们可以将其设置为一：

```text
set -g base-index 1         # for windows
setw -g pane-base-index 1   # for panes
```

其中 `setw` 是 `set-window-option` 的缩写。

#### 创建重新加载配置的快捷方式

我们可以使用 `bind` 命令定义一个新的键绑定。这里我们设置 `Prefix` `r`，以便在当前会话中重新加载我们的主 `.tmux.conf` 文件：

```text
bind r source-file ~/.tmux.conf
```

别忘了键入 `source-file ~/.tmux.conf` 来应用配置。

我们可以使用 `display` 命令在重新加载完成时在状态行中放置一条消息：

```text
bind r source-file ~/.tmux.conf \; display "Reloaded!"
```

您可以看到，我们可以通过使用 `\;` 字符组合来绑定一系列命令。

**（不建议）** 我们可以定义不需要前缀的键绑定。例如，这使得 `Ctrl`-`r` 重新加载配置文件：

```text
bind-key -n C-r source-file ~/.tmux.conf
```

#### 向其他应用程序发送前缀

我们已经将 `Ctrl`-`a` 重新映射为我们的 `Prefix`，但诸如 Vim、Emacs 甚至常规的 Bash shell 等程序也使用该组合。**我们需要配置 tmux，以便在需要时将该命令发送出去。**我们也可以通过将 `send-prefix` 命令绑定到一个按键来实现这一点，如下所示：

```text
bind C-a send-prefix
```

#### 分割面板

默认的分割面板的键可能很难记住，所以让我们设置自己的键，这样我们就不会忘记。我们将水平分割设置为 `Prefix` `|`，将垂直分割设置为 `Prefix` `-`。

```text
bind | split-window -h
bind - split-window -v
```

> 乍一看，这可能看起来有点反过来。`split-window` 上的 `-v` 和 `-h` 标志分别代表 `vertical` 和 `horizontal` 分割，但对于 tmux 来说，**垂直分割意味着在现有面板下创建一个新面板，因此面板在垂直堆叠在一起。水平分割意味着在现有面板旁边创建一个新面板，因此面板在水平堆叠在屏幕上。** 因此，为了垂直分割窗口，我们使用 "水平" 分割，为了水平分割窗口，我们使用 "垂直" 分割。

#### 重映射移动键

为了使用 `h`、`j`、`k`、`l` 作为移动键：

```text
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R
```

为了使用 `Prefix` `Ctrl`-`h` 和 `Prefix` `Ctrl`-`l` 来循环窗口：

```text
bind -r C-h select-window -t :-
bind -r C-l select-window -t :+
```

#### 重设面板大小

为了定义 `Prefix` `H`、`Prefix` `J`、`Prefix` `K` 和 `Prefix` `L` 来改变面板的大小：

```text
bind -r H resize-pane -L 5
bind -r J resize-pane -D 5
bind -r K resize-pane -U 5
bind -r L resize-pane -R 5
```

`-r` 指明了我们希望键是可重复的，这意味着我们只需按一次前缀键，然后在重复限制内连续按下定义的键。

默认的重复限制是 500 毫秒，我们可以通过将 `repeat-time` 选项设置为更高的值来更改它。

#### 处理鼠标操作

为了启用鼠标模式：

```text
setw -g mode-mouse on
set -g mouse-select-pane on
set -g mouse-resize-pane on
set -g mouse-select-window on
```
