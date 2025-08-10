---
abbrlink: 6023bfa0
categories:
  - CS
  - Tools
date: 2024-01-28 12:32:52
tags:
  - vim
  - tool
  - quicksort
  - vimgolf
title: A very interesting VimGolf
---

[VimGolf.com](https://www.vimgolf.com/) is a good place for vimers to practice and improve their vim skills. This post records my experience of solving a very interesting VimGolf game -- [Quicksort](https://www.vimgolf.com/challenges/9v00651eb20100000000025b).

<!--more-->

## The Game

- _[Quicksort - VimGolf](https://www.vimgolf.com/challenges/9v00651eb20100000000025b)_

## Straight Way

Vim has a command `:[range]sort` which sorts the lines in `[range]` (see `:h :sort`). In this case, the numbers to sort are in the first line. So the easiest way is to transform the first line into rows, sort them with `:sort`, and transform them back again. You can specify a range for `:sort` so that the **"garbled text"** below the divider can remain unchanged.

After some tweaking, my fewest keystrokes to this game is:

```text
:s/ /\r/g<CR>vH:sor n<CR>gvJZZ
```

- `:s/ /\r/g<CR>`: Transforms the first line into rows (by substituting white space to `\r`).
- `vH`: Selects the rows to sort.
- `:sor n<CR>`: Runs the `:sort` command, where `:sor` is the short version of `:sort`, and option `n` caused numbers to be sorted by their value (e.g. 1, 2, 10, 20) instead of their dictionary order (e.g. 1, 10, 2, 20).
- `gvJ`: Selects the last selected text and joins them together (transform them back to one row).
- `ZZ`: Saves and quits.

## Shortcut

If you're thinking similarly and are also using `:sort`, then the above sequence of keystrokes is basically the optimal solution. However, check the leader board for this game and you'll see that there are many single-digit keystroke solutions. How that possible?

This is the most interesting part! If you refer to the wisdom of those who came before you, you'll see that the **"garbled text"** actually makes sense! The last line actually hides a macro whose job is -- to sort the first line!

So the optimal solution in single-digit keystroke is:

```text
GY@0ZZ
```

- `GY`: Jumps to the last line and copies it.
- `@0`: Runs the last line (treats it as a macro).
- `ZZ`: Saves and quits.
