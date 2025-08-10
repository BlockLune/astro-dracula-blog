---
abbrlink: d8b14680
categories:
  - CS
  - Computing System
  - Nand2Tetris
date: 2023-07-19 11:25:49
katex: true
mathjax: true
tags:
  - nand2tetris
  - programming-language
  - software-engineering
  - vm-abstraction
  - stack-machine
  - note
title: "Notes for Nand2Tetris: Virtual Machine I: Stack Arithmetic"
---

This is a note for Nand2Tetris unit 7 (Part II, Unit 1).

<!--more-->

## Unit 7.0

Jack program:

```jack
class Main {
    function void main() {
        do Output.printString("Hello World!");
        do Output.println(); // New line.
        return;
    }
}
```

What makes the abstraction work?

- Assembler
- Virtual machine
- Compiler
- Operating system

![From high-level to low-level](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-virtual-machine-i-stack-arithmetic/1.png)

Nand2Tetris Part II is **more demanding** than Nand2Tetris Part I.

## Unit 7.1

Module 1: Virtual Machine

- Understanding the abstraction
- Building the implementation

Module 1: Take Home Lessons

- Compilation (big picture)
- Virtualization
- VM abstraction
- Stack processing
- VM implementation
- Pointers
- Programming

## Unit 7.2

VM Abstraction: the Stack

Stack operations:

- push: add a plate to the stack's top
- pop: remove the top plate

Applying a function $f$ on the stack:

- pops the argument(s) from the stack
- computes $f$ on the arguments
- pushes the result onto the stack

Stack arithmetic:

high-level:

```text
x = 17 + 19
```

After compilation:

low-level:

```text
push 17
push 19
add
pop x
```

Stack machine, manipulated by:

- Arithmetic / logical commands
- Memory segment commands
- Branching commands
- Function commands

## Unit 7.3

VM Abstraction: Memory Segments

Memory segments:

- local
- argument
- this
- that
- constant
- static
- pointer
- temp

Syntax:

- push $segment$ $i$:
  Where $segment$ is: argument, local, static, constant, this, that, pointer, or temp
  and $i$ is a non-negative integer
- pop $segment$ $i$:
  Where $segment$ is: argument, local, static, this, that, pointer, or temp
  and $i$ is a non-negative integer

## Unit 7.4

### Pointer manipulation

asterisk: \*

### Stack machine

...

### VM translator perspective

VM Translator:

- A program that translates VM code into machine language
- Each VM command generates several assembly commands

## Unit 7.5

Implementing **local**
