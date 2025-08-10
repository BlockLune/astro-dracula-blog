---
abbrlink: 53957db4
categories:
  - CS
  - Tools
date: 2023-08-05 11:47:53
tags:
  - tmux
  - terminal
  - unix
  - productivity
  - shell
  - note
title: Notes for 《tmux Productive Mouse-Free Development》
---

Notes for _tmux Productive Mouse-Free Development_ written by Brian P. Hogan.

<!--more-->

## Learning The Basics

### Starting tmux

To start tmux:

```bash
tmux
```

To close the tmux session:

```bash
exit
```

To create named session:

```bash
tmux new-session -s basic  # creates a named session called "basic"
# or
tmux new -s basic
```

### Detaching and Attaching Sessions

To detach from the current tmux session, press:

`Ctrl`-`b` then `d`

where `d` stands for "detach".

If you have changed your `Prefix`, change `Ctrl`-`b` to your own `Prefix`.

#### Reattaching to Existing Sessions

We can list existing tmux sessions using the command:

```bash
tmux list-sessions
# or
tmux ls
```

To attach to a specific session, we use the `attach` keyword.

If we only have one session running, we can simply attach to it with

```bash
tmux attach
```

If we create a new tmux instance **in the background** using the command:

```bash
tmux new -s second_session -d
```

We can attach to this session by using the `-t` flag:

```bash
tmux attach -t second_session
```

#### Killing Sessions

We can type `exit` within a session to destroy that session, but we can also kill off sessions with the `kill-session` command:

```bash
tmux kill-session -t basic
tmux kill-session -t second_session
```

### Working with Windows

Windows are similar to tabs in web browsers.

By using the `-n` flag, we can name the first window in a session:

```bash
tmux new -s windows -n shell  # creates a session called "windows"
```

#### Creating and Naming Windows

To create a window in the current session, press:

`Prefix` `c`

Creating a window like this automatically brings the new window into focus.

To rename a windows, press:

`Prefix` `,`

#### Moving Between Windows

We can cycle throw the windows with `Prefix` `n` (next window) or `Prefix` `p` (previous window).

By default, windows in tmux each have a number, starting at 0. We can quickly jump to the first window with `Prefix` `0`, and the second window with `Prefix` `1`.

Press `Prefix` `f` to find a window by name (if we named our windows).

Press `Prefix` `w` to display a visual menu of our windows so we can select the one we'd like.

Press `Prefix` `&` or type `exit` to close the current window.

### Working with Panes

> [!Note]
> **What's the difference between panes and windows?**
>
> ChatGPT:
>
> In tmux, panes and windows are two different concepts that refer to distinct components of the terminal multiplexer.
>
> 1. Windows: In tmux, a window is a single "view" or "tab" within the session. Each window occupies the entire terminal screen and can hold one or more panes. Windows are independent entities that can be created, closed, and switched between. They are typically used to organize and manage different tasks or applications within a tmux session. You can think of windows as similar to tabs in a web browser or a terminal emulator.
> 2. Panes: A pane, on the other hand, is a subdivision of a window. It allows you to split a window into multiple resizable and scrollable regions. Each pane within a window can run its own command or application, effectively allowing you to work on multiple tasks simultaneously within a single window. Panes can be split both horizontally and vertically, and you can resize, rearrange, and interact with them independently.
>
> To summarize, **windows are the main containers that hold one or more panes, while panes are the subdivisions within a window where you can run different commands or applications.** Windows provide a way to switch between different contexts or tasks, while panes enable multitasking within a single window.

`Prefix` `%` splits the current pane with horizontal layout.

`Prefix` `"` splits the current pane with vertical layout.

To cycle through the panes, press `Prefix` `o`

Use `Prefix` `Up` / `Down` / `Left` / `Right` to move around the panes.

#### Closing Panes

Press `Prefix` `x` or type `exit`.

### Working with Command Mode

To enter Command mode, press `Prefix` `:`.

### What's Next?

Press `Prefix` `?` to get a list of all predefined tmux keybindings and the associated commands.

## Configuring tmux

### Introducing the .tmux.conf File

By default, tmux looks for configuration settings in two places. It first looks in `/etc/tmux.conf` for a system-wide configuration. It then looks for a file called `.tmux.conf` in the current user's home directory (`~`).

#### Defining an Easier Prefix

Many tmux users started out using GNU-Screen, which uses `Ctrl`-`a` for its command prefix.

To redefine our tmux prefix to `Ctrl`-`a`, add this code to our `.tmux.conf` file:

```text
set-option -g prefix C-a
# or
set -g prefix C-a
```

where the `-g` switch, for "global", sets the option for al tmux sessions we create.

We can use the `unbind-key` or `unbind` command to remove a keybinding:

```text
unbind C-b
```

Enter tmux's Command mode with `Prefix` `:` and type this to apply the changes:

```text
source-file ~/.tmux.conf
```

#### Changing the Default Delay

tmux adds a very small delay when sending commands, and this delay can interfere with other programs such as the Vim text editor. We can set this delay so it's much more responsive:

```text
set -sg escape-time 1
```

#### Setting the Windows and Panes Index

The default index starts at zero. We can set it to one:

```text
set -g base-index 1         # for windows
setw -g pane-base-index 1   # for panes
```

where `setw` is the shortened version of `set-window-option`.

#### Creating a Shortcut to Reload the Configuration

We can use the `bind` command to define a new keybinding. Here we set `Prefix` `r` so it reloads our main `.tmux.conf` file in the current session:

```text
bind r source-file ~/.tmux.conf
```

Don't forget to type `source-file ~/.tmux.conf` to apply the configuration.

We can use the `display` command to put a message in the status line when we the reloading finished:

```text
bind r source-file ~/.tmux.conf \; display "Reloaded!"
```

You can see that we can bind a series of commands by separating the commands with the `\;` character combination.

**(Not suggested)** We can define keybindings that don't require a prefix. For example, this makes `Ctrl`-`r` reload the configuration file:

```text
bind-key -n C-r source-file ~/.tmux.conf
```

#### Sending the Prefix to Other Applications

We've remapped `Ctrl`-`a` as our `Prefix`, but programs such as Vim, Emacs and even the regular Bash shell also use that combination. **We need to configure tmux to let us send that command through when we need it.** We can also do that by binding the `send-prefix` command to a keystroke, like this:

```text
bind C-a send-prefix
```

#### Splitting Panes

The default keys for splitting panes can be difficult to remember, so let's set our own keys that we won't be able to forget. We'll set the horizontal split to `Prefix` `|` and the vertical split to `Prefix` `-`.

```text
bind | split-window -h
bind - split-window -v
```

> At first glance, this may look backwards. The `-v` and `-h` flags on `split-window` stand for `vertical` and `horizontal` splits, but to tmux, **a vertical split means creating a new pane below the existing pane so the panes are stacked vertically on top of each other. A horizontal split means creating a new pane next to the existing one so the panes are stacked horizontally across the screen.** So, in order to divide the window vertically, we use a "horizontal" split, and to divide it horizontally, we use a "vertical" split.

#### Remapping Movement Keys

To use `h`, `j`, `k`, `l` as movement keys:

```text
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R
```

To use `Prefix` `Ctrl`-`h` and `Prefix` `Ctrl`-`l` to cycle through the windows:

```text
bind -r C-h select-window -t :-
bind -r C-l select-window -t :+
```

#### Resizing Panes

To define `Prefix` `H`, `Prefix` `J`, `Prefix` `K` and `Prefix` `L` to change the size of the panes:

```text
bind -r H resize-pane -L 5
bind -r J resize-pane -D 5
bind -r K resize-pane -U 5
bind -r L resize-pane -R 5
```

`-r` specify that we want the key to be repeatable, meaning we can press the prefix key only once and the continuously press the defined key within the repeat limit.

The default repeat limit is 500 milliseconds, and we can change that by setting the `repeat-time` option to a higher value.

#### Handling the Mouse

To enable mouse mode:

```text
setw -g mode-mouse on
set -g mouse-select-pane on
set -g mouse-resize-pane on
set -g mouse-select-window on
```
