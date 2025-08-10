---
abbrlink: e87455d1
categories:
  - CS
  - Tools
date: 2024-03-09 14:16:24
tags:
  - c
  - cpp
  - tool
  - gdb
  - debugging
  - cheat-sheet
title: My GDB Cheat Sheet
---

The GNU debugger is a powerful tool for the debugging of (mainly) C/C++ programs. In this post I document the common operations of gdb and some useful learning resources.

<!--more-->

## Before Debugging

### Tips of Compiling

- The `-g` flag tells `gcc` to generate source-level debugging information.
- The `-ggdb` flag tells `gcc` to generate more debugging information for `gdb`.
- The `-Og` flag tells `gcc` to optimize your code without affecting debugging.

```bash
gcc hello.c -g -ggdb -Og
```

### Tips of Starting GDB

- The `--tui` flag tells `gdb` to start in the TUI (Text User Interface) mode.
- The `-q` flag tells `gdb` not to print version info on startup.
- The `-x` option tells `gdb` to execute some commands (`.gdb` files only in the past, now even `.py` files are supported) on startup.

```bash
gdb ./a.out --tui -x debug.py -q
```

The example `debug.py`:

```python
import gdb

def on_quit():
  gdb.execute('kill')

gdb.events.exited.connect(on_quit)

gdb.execute('...')
gdb.Breakpoint('...')
```

## GDB Commands

### Basic Commands

- `set args arg1 arg2 arg3`: set command line arguments of the program to be executed
- `set args`: remove all command line arguments set before
- `show args`: show the current command line arguments

---

- `run` or `r`: start to run the program (run to complete unless met a breakpoint)
  - You can also put args after `run` if you don't use `set args` to set them before, e.g. `run arg1 arg2 arg3`
- `kill`: stop running the program

---

- `file program`: load `program` and start to debug it
- `quit`: exit the debugger
- `set print pretty on`: make the outputs prettier

### Stopping and Rerunning Commands

- `break` or `b`: set a breakpoint
  - `break 10`: set a breakpoint to stop at line 10 of the current file
  - `break hello.c:10`: set a breakpoint to stop at line 10 of `hello.c`
  - `break main`: set a breakpoint to stop at the beginning of the `main` function
  - `break`: stop at the current line
  - `break *0x400522`: stop at a specific address (`0x400522` here)
- `tbreak` or `tb`: set a temporary breakpoint
- `break ... if ...`: set a conditional breakpoint

---

- `watch a`: stop when the value of variable `a` changed

---

- `clear`: clear a breakpoint
  - `clear main`: remove the breakpoint for the `main` function
  - `clear hello.c:10`: remove the breakpoint at line 10 of `hello.c`

---

- `info breakpoint` or `i break`: show all breakpoints

---

- `disable 2`: don't stopPrints n memory values of length unit u starting from addr in f format: at breakpoint #2 but keep it there
- `enable 2`: stop at breakpoint #2 again
- `delete 2`: remove breakpoint #2

---

- `save breakpoints file`: save breakpoints to `file`
- `source file`: load breakpoints from `file`

---

- `step` or `s`: step forward one line of code (goes into functions)
- `step 2`: step forward two line of code (goes into functions)
- `stepi` or `si`: step a single assembly instruction forward (goes into functions)

---

- `next` or `n`: step forward one line of code (does not go into functions)
- `next 2`: step forward two line of code (does not go into functions)
- `nexti` or `ni`: step a single assembly instruction forward (does not go into functions)

---

- `finish` or `fin`: continue running until the current function finished
- `return`: stop running the current function and return immediately
  - `return expression`: stop running and return the value of `expression` as the function's return value
- `continue` or `c`: continue running until the next breakpoint

### Inspecting Variable Values

- `print a` or `p a`: print value of variable `a` (which must be in the current function)
  - `print/x a`: print value of a as a hexadecimal number
  - `print/o a`: print value of a as a octal number
  - `print/t a`: print value of a as a binary number (show all bits)
  - `print/s a`: print value of a as a string even if it is not one
  - `print *arr@10`: print the first ten elements of array `arr`

---

- `x/nfu addr`: prints `n` memory values of length unit `u` starting from `addr` in `f` format, where
  - `f`: `x` for hex output and `o` for oct output, etc. In particular, `i` is for instruction output and `s` asks gdb to print a string.
  - `u`: `b` for byte, `h` for half word (two bytes), `w` for word (four bytes), and `g` for giant word (eight bytes)

### Tracing

- `backtrace` or `bt`: show the backtrace

### Assembly and Registers

- `layout src`: switch to standard layout (of TUI mode) -- source on top, and command window on the bottom
- `layout asm`: assembly on top, and command on the bottom
- `layout split`: source on top, assembly in the middle, and command at the bottom
- `layout reg`: open the register window on top of either source or assembly

- `tui reg general`: show the general registers
- `tui reg float`: show the floating point registers
- `tui reg system`: show the "system" registers
- `tui reg next`: show the next page of registers

- `set disassembly-flavor [intel / att]`: set the look-and-feel of the disassembly

## Resources

### Modern UI

- [Pwndbg](https://pwndbg.re/)
- [cyrus-and/gdb-dashboard](https://github.com/cyrus-and/gdb-dashboard)

### Tutorial and Tips

- _[Beej's Quick Guide to GDB](https://beej.us/guide/bggdb/)_
- _[CSCI 2021 Quick Guide to gdb: The GNU Debugger](https://www-users.cse.umn.edu/~kauffman/tutorials/gdb)_
- _[hellogcc/100-gdb-tips](https://github.com/hellogcc/100-gdb-tips)_
